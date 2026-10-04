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
  gaId: clean(process.env.NEXT_PUBLIC_GA_ID),
  metaPixelId: clean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  linkedinPartnerId: clean(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
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
    ipHashSalt: clean(process.env.IP_HASH_SALT) ?? "perfil-default-salt",
    nodeEnv: process.env.NODE_ENV ?? "development",
  };
}

export type ServerEnv = ReturnType<typeof serverEnv>;
