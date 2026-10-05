import { getService } from "@/content/services";
import type { DiagnosticResult } from "@/lib/diagnostic/calculate";
import { DIMENSION_LABELS } from "@/lib/diagnostic/questions";
import { meetingCta, site } from "@/lib/site";
import {
  COMPANY_REVENUE,
  JOB_TITLES,
  LEAD_LEVEL_LABELS,
  MAIN_PROBLEMS,
  NUMBER_LOCATIONS,
  SECTORS,
  labelFor,
  type LeadLevel,
} from "@/types/lead";

function escapeHtml(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #0b1324; line-height: 1.55; font-size: 15px;
`;

function layout(title: string, body: string, footer?: string) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f6f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e3e8ef;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#0a1a33;padding:20px 28px;">
          <div style="${baseStyles} color:#ffffff;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;opacity:.85;">${escapeHtml(site.brand)}</div>
          <div style="${baseStyles} color:#ffffff;font-size:18px;font-weight:600;margin-top:4px;">${escapeHtml(site.name)}</div>
        </td></tr>
        <tr><td style="padding:28px;${baseStyles}">${body}</td></tr>
        <tr><td style="padding:16px 28px;border-top:1px solid #e3e8ef;${baseStyles} font-size:12px;color:#667085;">
          ${footer ?? `${escapeHtml(site.name)} · ${escapeHtml(site.role)} · ${escapeHtml(site.location)}`}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function row(label: string, value: string | number | null | undefined) {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #eef1f5;color:#667085;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #eef1f5;font-weight:600;font-size:14px;">${escapeHtml(value === null || value === undefined ? "—" : String(value))}</td>
  </tr>`;
}

export interface NewLeadEmailInput {
  leadId: string;
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone?: string | null;
  numberLocations?: string | null;
  companyRevenue?: string | null;
  sector?: string | null;
  mainProblem?: string | null;
  score: number;
  leadLevel: LeadLevel;
  isHot: boolean;
  source: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  message?: string | null;
  diagnostic?: DiagnosticResult | null;
}

export function newLeadSubject(input: NewLeadEmailInput): string {
  if (input.isHot) return `🔥 HOT LEAD — ${input.company} — Score ${input.score}`;
  return `NUEVO LEAD — ${input.company} — Score ${input.score}`;
}

export function newLeadEmail(input: NewLeadEmailInput): string {
  const adminUrl = `${site.url}/admin/leads/${input.leadId}`;
  const diag = input.diagnostic;
  const diagBlock = diag
    ? `<h3 style="margin:24px 0 8px;font-size:15px;">Diagnóstico Multisite</h3>
       <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
         ${row("Madurez operativa", `${diag.totalScore} / 100 — ${diag.levelLabel}`)}
         ${diag.dimensions.map((d) => row(DIMENSION_LABELS[d.dimension], `${d.score}%`)).join("")}
       </table>
       <p style="margin:12px 0 0;color:#344054;">${escapeHtml(diag.recommendations.headline)}</p>`
    : "";

  const body = `
    <div style="display:inline-block;padding:4px 10px;border-radius:999px;background:${input.isHot ? "#dc2626" : "#e3eaf4"};color:${input.isHot ? "#fff" : "#0a1a33"};font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
      ${input.isHot ? "HOT LEAD" : "NUEVO LEAD"} · ${escapeHtml(LEAD_LEVEL_LABELS[input.leadLevel])}
    </div>
    <h1 style="margin:14px 0 4px;font-size:22px;">${escapeHtml(input.company)}</h1>
    <div style="font-size:32px;font-weight:700;color:#0a1a33;">Score ${input.score}<span style="font-size:14px;color:#667085;font-weight:500;"> / 100</span></div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px;">
      ${row("Contacto", `${input.firstName} ${input.lastName}`)}
      ${row("Cargo", labelFor(JOB_TITLES, input.jobTitle))}
      ${row("Email", input.email)}
      ${row("Teléfono", input.phone || "—")}
      ${row("Número de centros", labelFor(NUMBER_LOCATIONS, input.numberLocations))}
      ${row("Facturación", labelFor(COMPANY_REVENUE, input.companyRevenue))}
      ${row("Sector", labelFor(SECTORS, input.sector))}
      ${row("Problema principal", labelFor(MAIN_PROBLEMS, input.mainProblem))}
      ${row("Origen", input.source)}
      ${row("UTM", [input.utmSource, input.utmMedium, input.utmCampaign].filter(Boolean).join(" / ") || "directo")}
    </table>
    ${input.message ? `<h3 style="margin:24px 0 8px;font-size:15px;">Mensaje</h3><p style="white-space:pre-wrap;background:#f4f6f9;padding:12px;border-radius:6px;">${escapeHtml(input.message)}</p>` : ""}
    ${diagBlock}
    <p style="margin:28px 0 0;">
      <a href="${adminUrl}" style="display:inline-block;background:#0a1a33;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;">Abrir lead en el CRM</a>
    </p>`;

  return layout(newLeadSubject(input), body);
}

export interface DiagnosticResultEmailInput {
  firstName: string;
  company: string;
  result: DiagnosticResult;
  resultUrl: string;
  bookingUrl: string;
  /** Servicio recomendado (slug) para mostrar el formato de intervención que encaja. */
  recommendedServiceSlug?: string;
}

export function diagnosticResultSubject(input: DiagnosticResultEmailInput): string {
  return `Tu diagnóstico Multisite: ${input.result.totalScore}/100 — ${input.result.levelLabel}`;
}

export function diagnosticResultEmail(input: DiagnosticResultEmailInput): string {
  const { result } = input;
  const bars = result.dimensions
    .map(
      (d) => `<tr>
        <td style="padding:6px 0;width:34%;color:#344054;font-size:13px;">${escapeHtml(DIMENSION_LABELS[d.dimension])}</td>
        <td style="padding:6px 0;">
          <div style="background:#e3eaf4;border-radius:4px;height:8px;overflow:hidden;">
            <div style="width:${d.score}%;background:#0a1a33;height:8px;"></div>
          </div>
        </td>
        <td style="padding:6px 0 6px 10px;width:48px;text-align:right;font-weight:600;font-size:13px;">${d.score}%</td>
      </tr>`,
    )
    .join("");

  const list = (items: string[]) =>
    `<ul style="margin:6px 0 0;padding-left:18px;color:#344054;">${items
      .map((i) => `<li style="margin-bottom:6px;">${escapeHtml(i)}</li>`)
      .join("")}</ul>`;

  const service = input.recommendedServiceSlug ? getService(input.recommendedServiceSlug) : undefined;
  const serviceBlock = service
    ? `<div style="margin:22px 0 0;border:1px solid #e3e8ef;border-radius:8px;padding:14px 16px;">
        <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#667085;">Formato que encajaría</div>
        <div style="font-weight:600;font-size:16px;margin-top:4px;">${escapeHtml(service.name)}</div>
        <div style="font-size:13px;color:#344054;margin-top:2px;">${escapeHtml(service.format)} · ${escapeHtml(service.priceLabel)}</div>
        <p style="margin:8px 0 0;font-size:14px;color:#344054;">${escapeHtml(result.recommendations.recommendedService.reason)}</p>
        <a href="${site.url}/servicios/${service.slug}" style="display:inline-block;margin-top:8px;font-size:14px;color:#0a1a33;">Ver el servicio →</a>
      </div>`
    : "";

  const body = `
    <p style="margin:0 0 14px;">Hola ${escapeHtml(input.firstName)},</p>
    <p style="margin:0 0 18px;">Gracias por completar el Diagnóstico Multisite para <strong>${escapeHtml(input.company)}</strong>. Este es el resumen de vuestra madurez operativa:</p>
    <div style="border:1px solid #e3e8ef;border-radius:8px;padding:18px 20px;margin-bottom:18px;">
      <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#667085;">Madurez operativa</div>
      <div style="font-size:40px;font-weight:700;color:#0a1a33;line-height:1.1;">${result.totalScore}<span style="font-size:16px;color:#667085;font-weight:500;"> / 100</span></div>
      <div style="font-weight:600;margin-top:4px;">${escapeHtml(result.levelLabel)}</div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">${bars}</table>
    </div>
    <p style="margin:0 0 16px;font-weight:600;color:#0a1a33;">${escapeHtml(result.recommendations.headline)}</p>
    <h3 style="margin:18px 0 4px;font-size:15px;">Tres problemas detectados</h3>${list(result.recommendations.problems)}
    <h3 style="margin:18px 0 4px;font-size:15px;">Tres oportunidades</h3>${list(result.recommendations.opportunities)}
    <h3 style="margin:18px 0 4px;font-size:15px;">Tres acciones prioritarias</h3>${list(result.recommendations.actions)}
    ${serviceBlock}
    <p style="margin:26px 0 10px;">Si quieres, en una sesión de 30 minutos revisamos juntos estos resultados y qué palancas tendrían más impacto en vuestro EBITDA. Si lo prefieres, responde a este email con dos franjas horarias y lo cerramos.</p>
    <p style="margin:0 0 10px;">
      <a href="${input.bookingUrl}" style="display:inline-block;background:#0a1a33;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;">${escapeHtml(meetingCta.longLabel)}</a>
    </p>
    <p style="margin:0;font-size:13px;color:#667085;">Puedes volver a consultar el resultado completo aquí: <a href="${input.resultUrl}" style="color:#0a1a33;">${input.resultUrl}</a></p>
    <p style="margin:24px 0 0;">Un saludo,<br><strong>${escapeHtml(site.name)}</strong><br><span style="color:#667085;font-size:13px;">${escapeHtml(site.role)}</span></p>`;

  return layout(
    diagnosticResultSubject(input),
    body,
    `Has recibido este email porque has completado el Diagnóstico Multisite en ${escapeHtml(site.url)}. Tus datos se tratan conforme a nuestra <a href="${site.url}/politica-privacidad" style="color:#667085;">política de privacidad</a>.`,
  );
}
