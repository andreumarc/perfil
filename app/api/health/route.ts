import { NextResponse, type NextRequest } from "next/server";
import { sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { getAdminSession, isAdminConfigured } from "@/lib/auth";
import { serverEnv } from "@/lib/env";
import { HEALTH_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { metaFromHeaders } from "@/lib/request-meta";

export const dynamic = "force-dynamic";

/**
 * GET /api/health — comprobación de conexión con Neon.
 * El estado de las integraciones solo se devuelve con sesión de administrador.
 */
export async function GET(request: NextRequest) {
  const meta = metaFromHeaders(request.headers);
  const limit = await rateLimit(`health:${meta.rateKey}`, HEALTH_RATE_LIMIT);
  if (!limit.ok) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Cache-Control": "no-store" } });
  }

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
      console.error("[health] error de conexión:", error);
      database = "error";
    }
  }

  const session = await getAdminSession();
  const integrations = session
    ? {
        resend: Boolean(env.resendApiKey),
        adminConfigured: isAdminConfigured(),
        ipHashSalt: Boolean(env.ipHashSalt),
        booking: Boolean(process.env.NEXT_PUBLIC_BOOKING_URL),
        ga4: Boolean(process.env.NEXT_PUBLIC_GA_ID),
        metaPixel: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
        linkedinInsight: Boolean(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
      }
    : undefined;

  return NextResponse.json(
    {
      status: database === "error" ? "degraded" : "ok",
      database,
      latencyMs,
      ...(integrations ? { integrations } : {}),
      timestamp: new Date().toISOString(),
    },
    { status: database === "error" ? 503 : 200, headers: { "Cache-Control": "no-store" } },
  );
}
