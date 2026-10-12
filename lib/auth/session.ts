import "server-only";

import { cookies } from "next/headers";

import { serverEnv } from "@/lib/env";

import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession, type SessionClaims } from "./token";

export async function createSessionCookie(claims: Omit<SessionClaims, "iat" | "exp">): Promise<boolean> {
  const token = await signSession(claims, serverEnv().authSecret);
  if (!token) return false;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return true;
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Claims de la cookie (sin comprobar en BD). Para comprobación completa usar `getSession()` de guard.ts. */
export async function readSessionClaims(): Promise<SessionClaims | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value, serverEnv().authSecret);
}

export function isAuthConfigured(): boolean {
  const secret = serverEnv().authSecret;
  return Boolean(secret && secret.length >= 32);
}
