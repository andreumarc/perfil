import "server-only";

import { serverEnv } from "@/lib/env";

/**
 * Verifica un token de Cloudflare Turnstile.
 * - Devuelve `null` si Turnstile no está configurado (no se exige).
 * - Devuelve `true`/`false` según el resultado de la verificación.
 */
export async function verifyTurnstile(token: string | undefined, ip: string | null): Promise<boolean | null> {
  const secret = serverEnv().turnstileSecret;
  if (!secret) return null;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const json = (await res.json()) as { success?: boolean };
    return Boolean(json.success);
  } catch (error) {
    console.error("[turnstile] error verificando:", error instanceof Error ? error.message : error);
    return false;
  }
}
