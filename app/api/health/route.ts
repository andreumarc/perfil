import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { serverEnv } from "@/lib/env";
import { isAdminConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/health — comprobación de conexión con Neon y de configuración.
 * No expone secretos: solo indica si cada integración está configurada.
 */
export async function GET() {
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

  return NextResponse.json(
    {
      status: database === "error" ? "degraded" : "ok",
      database,
      latencyMs,
      integrations: {
        resend: Boolean(env.resendApiKey),
        adminConfigured: isAdminConfigured(),
        booking: Boolean(process.env.NEXT_PUBLIC_BOOKING_URL),
        ga4: Boolean(process.env.NEXT_PUBLIC_GA_ID),
        metaPixel: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
        linkedinInsight: Boolean(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
      },
      timestamp: new Date().toISOString(),
    },
    { status: database === "error" ? 503 : 200, headers: { "Cache-Control": "no-store" } },
  );
}
