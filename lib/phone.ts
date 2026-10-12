/**
 * Utilidades de teléfono para España: normalización a E.164 para enlaces
 * `tel:` y `wa.me`, y formato legible para mostrar.
 */

/** Devuelve el número en E.164 (+34…) o null si no parece un teléfono válido. */
export function toE164(raw: string | null | undefined, defaultCountry = "34"): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("00")) digits = `+${digits.slice(2)}`;
  if (!digits.startsWith("+")) {
    const bare = digits.replace(/\D/g, "");
    if (bare.length === 9) digits = `+${defaultCountry}${bare}`;
    else if (bare.length > 9) digits = `+${bare}`;
    else return null;
  }
  const normalized = `+${digits.slice(1).replace(/\D/g, "")}`;
  return /^\+\d{9,15}$/.test(normalized) ? normalized : null;
}

export function telHref(raw: string | null | undefined): string | null {
  const e164 = toE164(raw);
  return e164 ? `tel:${e164}` : null;
}

export function whatsappHref(raw: string | null | undefined, message?: string): string | null {
  const e164 = toE164(raw);
  if (!e164) return null;
  const base = `https://wa.me/${e164.slice(1)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "+34600123456" → "600 123 456"; otros países se devuelven agrupados de tres en tres. */
export function formatPhone(raw: string | null | undefined): string {
  const e164 = toE164(raw);
  if (!e164) return raw ?? "";
  if (e164.startsWith("+34") && e164.length === 12) {
    const n = e164.slice(3);
    return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }
  return e164.replace(/(\d{3})(?=\d)/g, "$1 ");
}
