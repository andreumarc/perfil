/**
 * Gestión del consentimiento de cookies (cliente).
 * Se guarda en una cookie first-party `mg_consent` (6 meses) y se replica
 * en localStorage como respaldo.
 */
export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
}

export const CONSENT_COOKIE = "mg_consent";
export const CONSENT_VERSION = 1;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 6 meses

export const CONSENT_EVENT = "mg:consent-change";

export function defaultConsent(): ConsentState {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    updatedAt: new Date(0).toISOString(),
    version: CONSENT_VERSION,
  };
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (typeof parsed !== "object" || parsed === null) return null;
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
      version: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

/** Devuelve el consentimiento guardado o null si el usuario aún no ha decidido. */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  const fromCookie = parseConsent(readCookie(CONSENT_COOKIE));
  if (fromCookie) return fromCookie;
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_COOKIE));
  } catch {
    return null;
  }
}

export function saveConsent(partial: Pick<ConsentState, "analytics" | "marketing">): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: partial.analytics,
    marketing: partial.marketing,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  const value = encodeURIComponent(JSON.stringify(state));
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  try {
    window.localStorage.setItem(CONSENT_COOKIE, JSON.stringify(state));
  } catch {
    // Almacenamiento no disponible (modo privado): la cookie basta.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  return state;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics ?? false;
}

export function hasMarketingConsent(): boolean {
  return getConsent()?.marketing ?? false;
}
