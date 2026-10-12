import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getDb } from "@/db/client";
import { consentRecords } from "@/db/schema";
import { EVENTS_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { isSameOrigin, metaFromHeaders } from "@/lib/request-meta";

const schema = z.object({
  visitorId: z.string().trim().max(64).optional(),
  analytics: z.boolean(),
  marketing: z.boolean(),
  version: z.coerce.number().int().min(1).max(100).default(1),
});

/** POST /api/consent — registra la decisión de cookies (prueba de consentimiento RGPD). */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2048) return NextResponse.json({ error: "Payload demasiado grande" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const meta = metaFromHeaders(request.headers);
  const limit = await rateLimit(`consent:${meta.rateKey}`, EVENTS_RATE_LIMIT);
  if (!limit.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const db = getDb();
  if (!db) return NextResponse.json({ ok: true, stored: false });
  try {
    await db.insert(consentRecords).values({
      visitorId: parsed.data.visitorId ?? null,
      necessary: true,
      analytics: parsed.data.analytics,
      marketing: parsed.data.marketing,
      version: parsed.data.version,
      source: "cookie_banner",
      ipHash: meta.ipHash,
      userAgent: meta.userAgent,
    });
    return NextResponse.json({ ok: true, stored: true });
  } catch (error) {
    console.error("[consent] error guardando:", error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: true, stored: false });
  }
}
