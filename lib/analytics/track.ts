import { track as vercelTrack } from "@vercel/analytics";

import { hasAnalyticsConsent, hasMarketingConsent } from "./consent";
import { PERSISTED_EVENTS, type EventProps, type EventType } from "./events";
import { getSessionId, getVisitorId } from "./visitor";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Mapeo de eventos propios a eventos estándar de Meta Pixel. */
const META_EVENTS: Partial<Record<EventType, string>> = {
  lead_created: "Lead",
  quote_form_started: "InitiateCheckout",
  contact_clicked: "Contact",
  phone_clicked: "Contact",
  whatsapp_clicked: "Contact",
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
   * Si es `false`, el evento no se guarda en Neon (solo GTM/GA4/Meta/Vercel).
   * Úsalo cuando el servidor ya persiste el evento (p. ej. `lead_created`).
   */
  persist?: boolean;
}

/**
 * Registra un evento del funnel en todos los destinos configurados.
 * Respeta el consentimiento: GA4/GTM solo con analítica; Meta solo con marketing.
 * Los scripts de terceros solo existen si AnalyticsProvider los ha cargado, así
 * que basta con detectar `window.gtag` / `window.dataLayer` / `window.fbq`.
 */
export function track(event: EventType, props: EventProps = {}, options: TrackOptions = {}) {
  if (typeof window === "undefined") return;
  const clean = cleanProps(props);

  try {
    vercelTrack(event, clean);
  } catch {
    /* noop */
  }

  if (options.persist !== false) sendToServer(event, clean);

  if (hasAnalyticsConsent()) {
    if (typeof window.gtag === "function") window.gtag("event", event, clean);
    else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event, ...clean });
  }

  if (hasMarketingConsent() && typeof window.fbq === "function") {
    const standard = META_EVENTS[event];
    if (standard) window.fbq("track", standard, clean);
    else window.fbq("trackCustom", event, clean);
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  sendToServer("page_view", { path });
  if (hasAnalyticsConsent()) {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: path, page_location: window.location.href });
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "page_view", page_path: path, page_location: window.location.href });
    }
  }
  if (hasMarketingConsent() && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}
