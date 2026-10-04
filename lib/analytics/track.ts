import { track as vercelTrack } from "@vercel/analytics";

import { publicEnv } from "@/lib/env";

import { hasAnalyticsConsent, hasMarketingConsent } from "./consent";
import { PERSISTED_EVENTS, type EventProps, type EventType } from "./events";
import { getSessionId, getVisitorId } from "./visitor";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    lintrk?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Mapeo de eventos propios a eventos estándar de Meta Pixel. */
const META_EVENTS: Partial<Record<EventType, string>> = {
  diagnostic_started: "InitiateCheckout",
  diagnostic_completed: "CompleteRegistration",
  lead_created: "Lead",
  meeting_clicked: "Schedule",
  contact_clicked: "Contact",
};

function cleanProps(props: EventProps = {}): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined) continue;
    out[k] = typeof v === "string" ? v.slice(0, 200) : v;
  }
  return out;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sendToServer(event: EventType, props: Record<string, string | number | boolean>) {
  if (!PERSISTED_EVENTS.has(event)) return;
  const leadId = typeof props.leadId === "string" && UUID_RE.test(props.leadId) ? props.leadId : undefined;
  const body = JSON.stringify({
    type: event,
    page: window.location.pathname,
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    ...(leadId ? { leadId } : {}),
    metadata: props,
    consented: hasAnalyticsConsent(),
  });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/events", blob)) return;
    }
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    // La analítica nunca debe romper la experiencia del usuario.
  }
}

export interface TrackOptions {
  /**
   * Si es `false`, el evento no se guarda en Neon (solo GA4/Meta/LinkedIn/Vercel).
   * Úsalo cuando el servidor ya persiste el evento (p. ej. `lead_created`,
   * `diagnostic_completed` tras el envío del diagnóstico) para no duplicarlo.
   */
  persist?: boolean;
}

/**
 * Registra un evento del funnel en todos los destinos configurados.
 * Respeta el consentimiento: GA4 solo con analítica; Meta/LinkedIn solo con marketing.
 */
export function track(event: EventType, props: EventProps = {}, options: TrackOptions = {}) {
  if (typeof window === "undefined") return;
  const clean = cleanProps(props);

  // Vercel Analytics (sin cookies, agregado) — siempre.
  try {
    vercelTrack(event, clean);
  } catch {
    /* noop */
  }

  // Almacenamiento propio en Neon de eventos clave del funnel.
  if (options.persist !== false) sendToServer(event, clean);

  if (hasAnalyticsConsent() && publicEnv.gaId && typeof window.gtag === "function") {
    window.gtag("event", event, clean);
  }

  if (hasMarketingConsent()) {
    if (publicEnv.metaPixelId && typeof window.fbq === "function") {
      const standard = META_EVENTS[event];
      if (standard) window.fbq("track", standard, clean);
      else window.fbq("trackCustom", event, clean);
    }
    if (publicEnv.linkedinPartnerId && typeof window.lintrk === "function") {
      // LinkedIn solo acepta conversiones por id configurado; se envía el evento genérico.
      window.lintrk("track", { conversion_id: clean.linkedin_conversion_id });
    }
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  sendToServer("page_view", { path });
  if (hasAnalyticsConsent() && publicEnv.gaId && typeof window.gtag === "function") {
    window.gtag("event", "page_view", { page_path: path, page_location: window.location.href });
  }
  if (hasMarketingConsent() && publicEnv.metaPixelId && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}
