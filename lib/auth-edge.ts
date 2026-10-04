import { jwtVerify } from "jose";

/**
 * Verificación de sesión compatible con el runtime Edge (sin node:crypto ni
 * next/headers). Usada por proxy.ts. La creación de sesiones vive en lib/auth.ts.
 */
export const ADMIN_SESSION_COOKIE = "mg_admin";

export interface EdgeSession {
  email: string;
}

export async function verifySessionToken(token: string | undefined): Promise<EdgeSession | null> {
  if (!token) return null;
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret || secret.length < 16) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    if (payload.sub !== "admin" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}
