import { SignJWT, jwtVerify } from "jose";

import type { UserRole } from "@/types/lead";

/**
 * Firma y verificación de la sesión (JWT HS256). Solo depende de `jose`, así
 * que puede usarse desde `proxy.ts` y desde el servidor Node sin diferencias.
 * La creación/lectura de la cookie vive en `session.ts`.
 */
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-rf_session" : "rf_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días
const MIN_SECRET_LENGTH = 32;

export interface SessionClaims {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  /** Versión de sesión del usuario en el momento de iniciar sesión. */
  sv: number;
  iat: number;
  exp: number;
}

export function secretKey(secret: string | undefined): Uint8Array | null {
  const s = secret?.trim();
  if (!s || s.length < MIN_SECRET_LENGTH) return null;
  return new TextEncoder().encode(s);
}

export async function signSession(claims: Omit<SessionClaims, "iat" | "exp">, secret: string | undefined): Promise<string | null> {
  const key = secretKey(secret);
  if (!key) return null;
  return new SignJWT({ email: claims.email, name: claims.name, role: claims.role, sv: claims.sv })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

export async function verifySession(token: string | undefined, secret: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  const key = secretKey(secret);
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (typeof payload.sub !== "string" || typeof payload.email !== "string") return null;
    if (payload.role !== "admin" && payload.role !== "editor") return null;
    return {
      userId: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      role: payload.role,
      sv: Number(payload.sv ?? 0),
      iat: Number(payload.iat ?? 0),
      exp: Number(payload.exp ?? 0),
    };
  } catch {
    return null;
  }
}
