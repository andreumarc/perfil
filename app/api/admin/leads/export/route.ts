import { NextResponse, type NextRequest } from "next/server";

import { listAllLeads } from "@/db/queries/leads";
import { getAdminSession } from "@/lib/auth";
import { leadsFilterSchema } from "@/lib/validation/admin";
import {
  COMPANY_REVENUE,
  JOB_TITLES,
  LEAD_LEVEL_LABELS,
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  MAIN_PROBLEMS,
  NUMBER_LOCATIONS,
  SECTORS,
  labelFor,
} from "@/types/lead";

export const dynamic = "force-dynamic";

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = String(value instanceof Date ? value.toISOString() : value);
  // Evita inyección de fórmulas en Excel/Sheets.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n;]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** GET /api/admin/leads/export — exporta los leads filtrados a CSV (UTF-8 con BOM). */
export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = leadsFilterSchema.safeParse(params);
  const filter = parsed.success ? parsed.data : leadsFilterSchema.parse({});

  const rows = await listAllLeads(filter);

  const header = [
    "Fecha",
    "Nombre",
    "Apellidos",
    "Empresa",
    "Cargo",
    "Email",
    "Teléfono",
    "Centros",
    "Facturación",
    "Sector",
    "Problema principal",
    "Score",
    "Nivel",
    "HOT",
    "Status",
    "Origen formulario",
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "UTM content",
    "UTM term",
    "Referrer",
    "Landing page",
    "País",
    "Dispositivo",
    "Notas",
  ];

  const lines = rows.map((l) =>
    [
      l.createdAt,
      l.firstName,
      l.lastName,
      l.company,
      labelFor(JOB_TITLES, l.jobTitle),
      l.email,
      l.phone,
      labelFor(NUMBER_LOCATIONS, l.numberLocations),
      labelFor(COMPANY_REVENUE, l.companyRevenue),
      labelFor(SECTORS, l.sector),
      labelFor(MAIN_PROBLEMS, l.mainProblem),
      l.score,
      LEAD_LEVEL_LABELS[l.leadLevel],
      l.isHot ? "Sí" : "No",
      LEAD_STATUS_LABELS[l.status],
      LEAD_SOURCE_LABELS[l.source],
      l.utmSource,
      l.utmMedium,
      l.utmCampaign,
      l.utmContent,
      l.utmTerm,
      l.referrer,
      l.landingPage,
      l.country,
      l.device,
      l.notes,
    ]
      .map(csvCell)
      .join(";"),
  );

  const csv = `﻿${[header.join(";"), ...lines].join("\r\n")}`;
  const date = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
