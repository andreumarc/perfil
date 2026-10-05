import "server-only";

import { createHash } from "node:crypto";

import { headers } from "next/headers";

import { serverEnv } from "@/lib/env";

export type DeviceType = "mobile" | "tablet" | "desktop" | "bot" | "unknown";

export interface RequestMeta {
  ip: string | null;
  /** Hash con sal para almacenar junto al lead; null si no hay IP o no hay IP_HASH_SALT en producción. */
  ipHash: string | null;
  /** Clave estable (no almacenada) para rate limiting; siempre disponible si hay IP. */
  rateKey: string;
  userAgent: string | null;
  device: DeviceType;
  country: string | null;
}

export function detectDevice(ua: string | null | undefined): DeviceType {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/bot|crawler|spider|crawling|headless|lighthouse/.test(s)) return "bot";
  if (/ipad|tablet|(android(?!.*mobile))/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|android|windows phone/.test(s)) return "mobile";
  return "desktop";
}

/**
 * Hash SHA-256 truncado y con sal: no permite recuperar la IP original.
 * Devuelve null si no hay sal configurada en producción (ver lib/env.ts).
 */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const { ipHashSalt } = serverEnv();
  if (!ipHashSalt) return null;
  return createHash("sha256").update(`${ipHashSalt}:${ip}`).digest("hex").slice(0, 32);
}

/**
 * Clave de rate limiting derivada de la IP con un secreto del servidor. No se
 * persiste con el lead, así que puede usar AUTH_SECRET como sal de respaldo.
 */
export function rateLimitKey(ip: string | null | undefined, userAgent?: string | null): string {
  const { ipHashSalt, authSecret } = serverEnv();
  const salt = ipHashSalt ?? authSecret ?? "rate-limit";
  const material = ip ?? `ua:${userAgent ?? "unknown"}`;
  return createHash("sha256").update(`${salt}:${material}`).digest("hex").slice(0, 32);
}

export function extractIp(h: Headers): string | null {
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || null;
  return h.get("x-real-ip") ?? h.get("cf-connecting-ip") ?? null;
}

export function metaFromHeaders(h: Headers): RequestMeta {
  const ip = extractIp(h);
  const userAgent = h.get("user-agent");
  // Vercel añade el país a partir de la IP sin servicios externos.
  const countryHeader = h.get("x-vercel-ip-country");
  const country = countryHeader && /^[A-Z]{2}$/.test(countryHeader) ? countryHeader : null;
  return {
    ip,
    ipHash: hashIp(ip),
    rateKey: rateLimitKey(ip, userAgent),
    userAgent: userAgent ? userAgent.slice(0, 400) : null,
    device: detectDevice(userAgent),
    country,
  };
}

/** Para server actions (sin objeto Request). */
export async function getRequestMeta(): Promise<RequestMeta> {
  const h = await headers();
  return metaFromHeaders(h);
}
