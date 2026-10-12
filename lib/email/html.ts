/** Helpers de HTML para emails transaccionales (tablas, sin CSS externo). */

export function escapeHtml(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #17191d; line-height: 1.55; font-size: 15px;
`;

export function layout(input: { title: string; brand: string; tagline: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(input.title)}</title></head>
<body style="margin:0;padding:0;background:#f3f0eb;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f0eb;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e1da;border-radius:8px;overflow:hidden;">
        <tr><td style="background:#17191d;padding:20px 28px;">
          <div style="${baseStyles} color:#e8781e;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;">${escapeHtml(input.tagline)}</div>
          <div style="${baseStyles} color:#ffffff;font-size:18px;font-weight:700;margin-top:4px;text-transform:uppercase;">${escapeHtml(input.brand)}</div>
        </td></tr>
        <tr><td style="padding:28px;${baseStyles}">${input.body}</td></tr>
        <tr><td style="padding:16px 28px;border-top:1px solid #e6e1da;${baseStyles} font-size:12px;color:#6f6a63;">${input.footer}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function row(label: string, value: string | number | null | undefined) {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #f1efeb;color:#6f6a63;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;border-bottom:1px solid #f1efeb;font-weight:600;font-size:14px;">${escapeHtml(value === null || value === undefined || value === "" ? "—" : String(value))}</td>
  </tr>`;
}

export function button(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:#d3620f;color:#fff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:600;">${escapeHtml(label)}</a>`;
}
