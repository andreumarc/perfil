import "server-only";

import { sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { rateLimits } from "@/db/schema";

export interface RateLimitOptions {
  /** Número máximo de peticiones permitidas en la ventana. */
  limit: number;
  /** Duración de la ventana en milisegundos. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/** Fallback en memoria (por instancia) cuando no hay base de datos. */
const memory = new Map<string, { count: number; windowStart: number }>();

function memoryLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = memory.get(key);
  if (!entry || now - entry.windowStart >= windowMs) {
    memory.set(key, { count: 1, windowStart: now });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }
  entry.count += 1;
  const ok = entry.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: ok ? 0 : Math.ceil((entry.windowStart + windowMs - now) / 1000),
  };
}

/**
 * Rate limiting de ventana fija persistido en Neon (compartido entre
 * instancias serverless). Si la DB no está disponible usa memoria local.
 */
export async function rateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const db = getDb();
  if (!db) return memoryLimit(key, options);

  const { limit, windowMs } = options;
  const windowInterval = `${Math.ceil(windowMs / 1000)} seconds`;

  try {
    // Un único upsert: reinicia la ventana si ha expirado; si no, incrementa.
    const rows = await db
      .insert(rateLimits)
      .values({ key, count: 1, windowStart: new Date() })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: {
          count: sql`CASE WHEN ${rateLimits.windowStart} < now() - ${windowInterval}::interval THEN 1 ELSE ${rateLimits.count} + 1 END`,
          windowStart: sql`CASE WHEN ${rateLimits.windowStart} < now() - ${windowInterval}::interval THEN now() ELSE ${rateLimits.windowStart} END`,
        },
      })
      .returning({ count: rateLimits.count, windowStart: rateLimits.windowStart });

    const row = rows[0];
    if (!row) return memoryLimit(key, options);
    const ok = row.count <= limit;
    const resetAt = new Date(row.windowStart).getTime() + windowMs;
    return {
      ok,
      remaining: Math.max(0, limit - row.count),
      retryAfterSeconds: ok ? 0 : Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[rate-limit] fallo en DB, usando memoria:", error);
    return memoryLimit(key, options);
  }
}

/** Límites por defecto para formularios públicos. */
export const FORM_RATE_LIMIT: RateLimitOptions = { limit: 5, windowMs: 60 * 60 * 1000 };
export const EVENTS_RATE_LIMIT: RateLimitOptions = { limit: 240, windowMs: 60 * 60 * 1000 };
export const LOGIN_RATE_LIMIT: RateLimitOptions = { limit: 8, windowMs: 15 * 60 * 1000 };
