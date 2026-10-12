import { NextResponse, type NextRequest } from "next/server";
import { sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { getSession } from "@/lib/auth/guard";
import { serverEnv } from "@/lib/env";
import { HEALTH_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { metaFromHeaders } from "@/lib/request-meta";

export const dynamic = "force-dynamic";

/** GET /api/health — comprobación de conexión con Neon. Estado de integraciones solo con sesión del panel. */
export async function GET(request: NextRequest) {
  const meta = metaFromHeaders(request.headers);
  const limit = await rateLimit(`health:${meta.rateKey}`, HEALTH_RATE_LIMIT);
  if (!limit.ok) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Cache-Control": "no-store" } });

  const env = serverEnv();
  const db = getDb();
  let database: "ok" | "error" | "not_configured" = "not_configured";
  let latencyMs: number | null = null;
  if (db) {
    const start = Date.now();
    try {
      await db.execute(sql`select 1`);
      database = "ok";
      latencyMs = Date.now() - start;
    } catch (error) {
      console.error("[health] error de conexión:", error instanceof Error ? error.message : error);
      database = "error";
    }
  }
  const session = await getSession();
  const integrations = session
    ? {
        resend: Boolean(env.resendApiKey),
        notifyEmail: Boolean(env.notifyEmail),
        authSecret: Boolean(env.authSecret && env.authSecret.length >= 32),
        setupTokenPresent: Boolean(env.adminSetupToken),
        ipHashSalt: Boolean(env.ipHashSalt),
        blobPublic: Boolean(env.blobToken),
        blobPrivate: Boolean(env.blobPrivateToken),
        turnstile: Boolean(env.turnstileSecret),
      }
    : undefined;
  return NextResponse.json(
    { status: database === "error" ? "degraded" : "ok", database, latencyMs, ...(integrations ? { integrations } : {}), timestamp: new Date().toISOString() },
    { status: database === "error" ? 503 : 200, headers: { "Cache-Control": "no-store" } },
  );
}
