import { NextResponse, type NextRequest } from "next/server";

import { SERVICES } from "@/content/services";
import { listAllLeads } from "@/db/queries/leads";
import { audit } from "@/lib/audit";
import { getSession } from "@/lib/auth/guard";
import { formatPhone } from "@/lib/phone";
import { leadsFilterSchema } from "@/lib/validation/admin";
import { BUDGET_RANGES, LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS, PROPERTY_TYPES, TIMELINES, labelFor } from "@/types/lead";

export const dynamic = "force-dynamic";

export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = String(value instanceof Date ? value.toISOString() : value);
  // Evita inyección de fórmulas en Excel/Sheets.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n;]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** GET /api/admin/leads/export — CSV (UTF-8 con BOM) de las solicitudes filtradas. Solo administradores. */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (session.role !== "admin") return NextResponse.json({ error: "Sin permisos" }, { status: 403 });

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = leadsFilterSchema.safeParse(params);
  const filter = parsed.success ? parsed.data : leadsFilterSchema.parse({});
  const rows = await listAllLeads(filter);
  await audit(session, "leads.export", "lead", null, { count: rows.length, filter });

  const serviceNames = Object.fromEntries(SERVICES.map((s) => [s.slug, s.name]));
  const header = ["Fecha", "Nombre", "Email", "Teléfono", "Localidad", "Código postal", "Tipo de inmueble", "Servicio", "Sector", "m²", "Presupuesto", "Fecha prevista", "Mensaje", "Contexto", "Estado", "Responsable", "Origen", "Página", "Artículo", "UTM source", "UTM medium", "UTM campaign", "Consent. marketing", "Próxima tarea", "Notas internas"];
  const lines = rows.map((l) =>
    [
      l.createdAt, l.name, l.email, formatPhone(l.phone), l.locality, l.postalCode, labelFor(PROPERTY_TYPES, l.propertyType),
      l.serviceSlug ? (serviceNames[l.serviceSlug] ?? l.serviceSlug) : "", l.sectorSlug, l.squareMeters, labelFor(BUDGET_RANGES, l.budgetRange), labelFor(TIMELINES, l.timeline),
      l.message, JSON.stringify(l.context ?? {}), LEAD_STATUS_LABELS[l.status], l.assigneeName, LEAD_SOURCE_LABELS[l.source], l.sourcePage, l.articleSlug,
      l.utmSource, l.utmMedium, l.utmCampaign, l.marketingConsent ? "Sí" : "No", l.nextFollowUpAt, l.internalNotes,
    ].map(csvCell).join(";"),
  );
  const csv = `﻿${[header.join(";"), ...lines].join("\r\n")}`;
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    status: 200,
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="solicitudes-${date}.csv"`, "Cache-Control": "no-store" },
  });
}
