import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { recordEvent } from "@/db/queries/events";
import { EVENT_TYPES, PERSISTED_EVENTS } from "@/lib/analytics/events";
import { EVENTS_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { metaFromHeaders } from "@/lib/request-meta";

const eventSchema = z.object({
  type: z.enum(EVENT_TYPES),
  page: z.string().trim().max(500).optional(),
  visitorId: z.string().trim().max(64).optional(),
  sessionId: z.string().trim().max(64).optional(),
  leadId: z.uuid().optional(),
  metadata: z
    .record(z.string().max(60), z.union([z.string().max(300), z.number(), z.boolean()]))
    .optional(),
  consented: z.boolean().optional(),
});

function isSameOrigin(request: NextRequest): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // sendBeacon puede omitirlo
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

/**
 * POST /api/events — guarda eventos clave del funnel en Neon.
 * Acepta JSON (fetch) o Blob JSON (sendBeacon). Siempre responde 2xx salvo
 * payload inválido para no generar ruido en el cliente.
 */
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Evento inválido" }, { status: 400 });
  }
  const event = parsed.data;
  if (!PERSISTED_EVENTS.has(event.type)) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const meta = metaFromHeaders(request.headers);
  if (meta.device === "bot") return NextResponse.json({ ok: true, stored: false });

  const limit = await rateLimit(`events:${meta.ipHash ?? "anon"}`, EVENTS_RATE_LIMIT);
  if (!limit.ok) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  // Sin consentimiento de analítica no se persiste un identificador estable
  // del visitante: solo el identificador efímero que el cliente genera por carga.
  const stored = await recordEvent({
    eventType: event.type,
    page: event.page ?? null,
    visitorId: event.visitorId ?? null,
    sessionId: event.sessionId ?? null,
    leadId: event.leadId ?? null,
    metadata: {
      ...(event.metadata ?? {}),
      device: meta.device,
      ...(meta.country ? { country: meta.country } : {}),
      consented: event.consented ?? false,
    },
  });

  return NextResponse.json({ ok: true, stored });
}
