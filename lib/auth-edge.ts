import { jwtVerify } from "jose";

/**
 * Verificación de sesión compatible con el runtime Edge (sin node:crypto ni
 * next/headers). Usada por proxy.ts. La creación de sesiones vive en lib/auth.ts.
 */
export const ADMIN_SESSION_COOKIE = "mg_admin";
const MIN_SECRET_LENGTH = 32;

export interface EdgeSession {
  email: string;
}

/** Misma huella que lib/auth.ts#passwordTag, calculada con Web Crypto. */
async function passwordTag(password: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`pwd:${password}`));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export async function verifySessionToken(token: string | undefined): Promise<EdgeSession | null> {
  if (!token) return null;
  const secret = process.env.AUTH_SECRET?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!secret || secret.length < MIN_SECRET_LENGTH || !password) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    if (payload.sub !== "admin" || typeof payload.email !== "string") return null;
    if (payload.pwd !== (await passwordTag(password))) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}
