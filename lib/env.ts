/**
 * Acceso centralizado a variables de entorno.
 *
 * - Las variables públicas (NEXT_PUBLIC_*) se leen de forma estática para que
 *   Next.js pueda inlinearlas en el cliente.
 * - Las privadas solo deben usarse en código de servidor.
 * - Ninguna variable es obligatoria en build: la app degrada con elegancia
 *   (sin DB → no persiste; sin Resend → no envía email; sin IDs → no carga
 *   scripts de analítica).
 */

function clean(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v && v.length > 0 ? v : undefined;
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}

/** Acepta el valor solo si cumple el formato esperado (los IDs se interpolan en scripts inline). */
function matching(value: string | undefined, pattern: RegExp): string | undefined {
  const v = clean(value);
  return v && pattern.test(v) ? v : undefined;
}

export const publicEnv = {
  siteUrl: stripTrailingSlash(
    clean(process.env.NEXT_PUBLIC_SITE_URL) ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  bookingUrl: clean(process.env.NEXT_PUBLIC_BOOKING_URL),
  linkedinUrl: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  contactEmail: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  gaId: matching(process.env.NEXT_PUBLIC_GA_ID, /^(G|GT|AW|UA)-[A-Z0-9-]{4,20}$/i),
  metaPixelId: matching(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{6,20}$/),
  linkedinPartnerId: matching(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID, /^\d{4,12}$/),
} as const;

/** Solo servidor. No importar desde componentes cliente. */
export function serverEnv() {
  return {
    databaseUrl: clean(process.env.DATABASE_URL),
    adminEmail: clean(process.env.ADMIN_EMAIL),
    adminPassword: clean(process.env.ADMIN_PASSWORD),
    authSecret: clean(process.env.AUTH_SECRET),
    resendApiKey: clean(process.env.RESEND_API_KEY),
    emailFrom: clean(process.env.EMAIL_FROM) ?? "Marc Andreu Guerao <onboarding@resend.dev>",
    /**
     * Sal para pseudonimizar IPs. En producción, sin sal NO se almacena ningún hash
     * (sería reversible recorriendo el espacio IPv4). En desarrollo se usa una sal fija.
     */
    ipHashSalt:
      clean(process.env.IP_HASH_SALT) ?? (process.env.NODE_ENV === "production" ? undefined : "dev-salt"),
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}

export type ServerEnv = ReturnType<typeof serverEnv>;
