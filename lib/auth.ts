import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

import { serverEnv } from "@/lib/env";

export const ADMIN_SESSION_COOKIE = "mg_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 días

export interface AdminSession {
  email: string;
  iat: number;
  exp: number;
}

function secretKey(): Uint8Array | null {
  const { authSecret } = serverEnv();
  if (!authSecret || authSecret.length < 16) return null;
  return new TextEncoder().encode(authSecret);
}

/** Indica si el admin está configurado (secreto + credenciales). */
export function isAdminConfigured(): boolean {
  const env = serverEnv();
  return Boolean(secretKey() && env.adminEmail && env.adminPassword && env.adminPassword.length >= 8);
}

/** Comparación en tiempo constante de dos cadenas (hash previo para igualar longitud). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function verifyCredentials(email: string, password: string): boolean {
  const env = serverEnv();
  if (!env.adminEmail || !env.adminPassword) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), env.adminEmail.toLowerCase());
  const passOk = safeEqual(password, env.adminPassword);
  return emailOk && passOk;
}

export async function createSessionToken(email: string): Promise<string | null> {
  const key = secretKey();
  if (!key) return null;
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(token: string | undefined): Promise<AdminSession | null> {
  if (!token) return null;
  const key = secretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (payload.sub !== "admin" || typeof payload.email !== "string") return null;
    return {
      email: payload.email,
      iat: Number(payload.iat ?? 0),
      exp: Number(payload.exp ?? 0),
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
}

/** Devuelve la sesión admin actual o null. Para layouts/páginas de servidor. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
}
