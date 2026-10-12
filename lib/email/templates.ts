import { BUDGET_RANGES, LEAD_SOURCE_LABELS, PROPERTY_TYPES, TIMELINES, labelFor, type LeadSource } from "@/types/lead";

import { button, escapeHtml, layout, row } from "./html";

export interface BrandInfo {
  name: string;
  tagline: string;
  siteUrl: string;
  phone?: string;
  email?: string;
}

export interface NewLeadEmailInput {
  leadId: string | null;
  name: string;
  email: string;
  phone: string;
  locality?: string | null;
  postalCode?: string | null;
  propertyType?: string | null;
  serviceName?: string | null;
  sectorName?: string | null;
  squareMeters?: number | null;
  budgetRange?: string | null;
  timeline?: string | null;
  message?: string | null;
  context?: Record<string, unknown>;
  source: LeadSource;
  sourcePage?: string | null;
  articleSlug?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  attachmentCount?: number;
  marketingConsent: boolean;
}

export function newLeadSubject(input: NewLeadEmailInput): string {
  const what = input.serviceName ?? input.sectorName ?? "Solicitud de presupuesto";
  return `Nueva solicitud — ${input.name} — ${what}`;
}

export function newLeadEmail(input: NewLeadEmailInput, brand: BrandInfo): string {
  const adminUrl = input.leadId ? `${brand.siteUrl}/admin/leads/${input.leadId}` : `${brand.siteUrl}/admin/leads`;
  const contextRows = Object.entries(input.context ?? {})
    .filter(([, v]) => v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => row(k, Array.isArray(v) ? v.join(", ") : String(v)))
    .join("");

  const body = `
    <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:#fbe9db;color:#8f3f0b;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
      Nueva solicitud · ${escapeHtml(LEAD_SOURCE_LABELS[input.source] ?? input.source)}
    </div>
    <h1 style="margin:14px 0 4px;font-size:22px;">${escapeHtml(input.name)}</h1>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
      ${row("Email", input.email)}
      ${row("Teléfono", input.phone)}
      ${row("Localidad", [input.locality, input.postalCode].filter(Boolean).join(" · "))}
      ${row("Tipo de inmueble", labelFor(PROPERTY_TYPES, input.propertyType))}
      ${row("Servicio", input.serviceName ?? "—")}
      ${row("Sector", input.sectorName ?? "—")}
      ${row("Superficie aprox.", input.squareMeters ? `${input.squareMeters} m²` : "—")}
      ${row("Presupuesto orientativo", labelFor(BUDGET_RANGES, input.budgetRange))}
      ${row("Fecha prevista", labelFor(TIMELINES, input.timeline))}
      ${contextRows}
      ${row("Página de origen", input.sourcePage ?? "—")}
      ${input.articleSlug ? row("Artículo", input.articleSlug) : ""}
      ${row("UTM", [input.utmSource, input.utmMedium, input.utmCampaign].filter(Boolean).join(" / ") || "directo")}
      ${row("Adjuntos", input.attachmentCount ? `${input.attachmentCount} archivo(s) en el CRM` : "Ninguno")}
      ${row("Consentimiento marketing", input.marketingConsent ? "Sí" : "No")}
    </table>
    ${input.message ? `<h3 style="margin:24px 0 8px;font-size:15px;">Descripción del proyecto</h3><p style="white-space:pre-wrap;background:#f3f0eb;padding:12px;border-radius:6px;">${escapeHtml(input.message)}</p>` : ""}
    <p style="margin:28px 0 0;">${button(adminUrl, "Abrir en el CRM")}</p>`;

  return layout({
    title: newLeadSubject(input),
    brand: brand.name,
    tagline: brand.tagline,
    body,
    footer: `Aviso interno generado por el formulario de ${escapeHtml(brand.siteUrl)}. Los datos personales se tratan conforme a la política de privacidad.`,
  });
}

export interface LeadConfirmationInput {
  name: string;
  serviceName?: string | null;
}

export function leadConfirmationSubject(brand: BrandInfo): string {
  return `Hemos recibido tu solicitud de presupuesto — ${brand.name}`;
}

export function leadConfirmationEmail(input: LeadConfirmationInput, brand: BrandInfo): string {
  const firstName = input.name.split(" ")[0] ?? input.name;
  const contact = [brand.phone ? `por teléfono en ${escapeHtml(brand.phone)}` : "", brand.email ? `por email en ${escapeHtml(brand.email)}` : ""]
    .filter(Boolean)
    .join(" o ");
  const body = `
    <p style="margin:0 0 14px;">Hola ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 14px;">Gracias por contactar con <strong>${escapeHtml(brand.name)}</strong>. Hemos recibido tu solicitud${input.serviceName ? ` sobre <strong>${escapeHtml(input.serviceName)}</strong>` : ""} y la revisaremos en breve.</p>
    <p style="margin:0 0 14px;">Qué pasa ahora:</p>
    <ol style="margin:0 0 18px;padding-left:20px;color:#3f3c37;">
      <li style="margin-bottom:6px;">Te llamamos o escribimos para concretar detalles y, si procede, concertar una visita.</li>
      <li style="margin-bottom:6px;">Tras la visita preparamos un presupuesto detallado por partidas.</li>
      <li>Lo revisamos contigo y resolvemos cualquier duda antes de decidir.</li>
    </ol>
    ${contact ? `<p style="margin:0 0 14px;">Si prefieres adelantarte, puedes contactarnos ${contact}.</p>` : ""}
    <p style="margin:24px 0 0;">Un saludo,<br><strong>${escapeHtml(brand.name)}</strong></p>`;
  return layout({
    title: leadConfirmationSubject(brand),
    brand: brand.name,
    tagline: brand.tagline,
    body,
    footer: `Has recibido este email porque has enviado una solicitud en ${escapeHtml(brand.siteUrl)}. Puedes ejercer tus derechos de acceso, rectificación o supresión en <a href="${escapeHtml(brand.siteUrl)}/privacidad/solicitud" style="color:#6f6a63;">${escapeHtml(brand.siteUrl)}/privacidad/solicitud</a>.`,
  });
}
