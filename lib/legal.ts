import { siteUrl } from "@/lib/seo";
import type { SiteSettings } from "@/lib/validation/settings";

export const LEGAL_PAGES = [
  { key: "avisoLegal", path: "/aviso-legal", fallbackTitle: "Aviso legal" },
  { key: "privacidad", path: "/politica-privacidad", fallbackTitle: "Política de privacidad" },
  { key: "cookies", path: "/politica-cookies", fallbackTitle: "Política de cookies" },
  { key: "terminos", path: "/terminos", fallbackTitle: "Términos y condiciones de uso" },
] as const;

export type LegalKey = (typeof LEGAL_PAGES)[number]["key"];

/** Sustituye los marcadores {{...}} del texto legal por los datos de los ajustes. */
export function renderLegalBody(settings: SiteSettings, body: string): string {
  const { legal, company } = settings;
  const values: Record<string, string> = {
    responsibleName: legal.responsibleName || company.legalName || company.name,
    companyName: company.name,
    nif: legal.nif || company.nif,
    address: legal.address || [company.address, company.postalCode, company.city, company.province].filter(Boolean).join(", "),
    email: legal.email || company.email,
    registry: legal.registry,
    siteUrl,
    lastUpdated: legal.lastUpdated,
    phone: company.phone,
  };
  return body.replace(/\{\{\s*([a-zA-Z]+)\s*\}\}/g, (match, key: string) => (key in values ? values[key] || "[POR CONFIRMAR]" : match));
}

/** True si el texto todavía contiene marcadores sin confirmar. */
export function hasPendingPlaceholders(text: string): boolean {
  return /\[POR CONFIRMAR/i.test(text);
}
