/**
 * Acceso centralizado a variables de entorno.
 *
 * - Las variables públicas (NEXT_PUBLIC_*) se leen de forma estática para que
 *   Next.js pueda inlinearlas en el cliente.
 * - Las privadas solo deben usarse en código de servidor.
 * - Ninguna variable es obligatoria en build: la app degrada con elegancia
 *   (sin DB → no persiste; sin Resend → no envía email; sin Blob → sin adjuntos).
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
  /** Clave pública de Cloudflare Turnstile (CAPTCHA opcional). */
  turnstileSiteKey: clean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
} as const;

/** Solo servidor. No importar desde componentes cliente. */
export function serverEnv() {
  return {
    databaseUrl: clean(process.env.DATABASE_URL),
    authSecret: clean(process.env.AUTH_SECRET),
    adminSetupToken: clean(process.env.ADMIN_SETUP_TOKEN),
    resendApiKey: clean(process.env.RESEND_API_KEY),
    emailFrom: clean(process.env.EMAIL_FROM) ?? "Reformas <onboarding@resend.dev>",
    /** Destinatario(s) de los avisos de nuevo lead si no hay configuración en el panel. */
    notifyEmail: clean(process.env.NOTIFY_EMAIL),
    blobToken: clean(process.env.BLOB_READ_WRITE_TOKEN),
    blobPrivateToken: clean(process.env.BLOB_PRIVATE_READ_WRITE_TOKEN),
    turnstileSecret: clean(process.env.TURNSTILE_SECRET_KEY),
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
