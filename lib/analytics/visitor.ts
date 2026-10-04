import { hasAnalyticsConsent } from "./consent";

/**
 * Identificador anónimo de visitante.
 * - Sin consentimiento de analítica: identificador efímero en memoria (solo
 *   dura la carga de página; no se almacena nada en el dispositivo).
 * - Con consentimiento: cookie first-party `mg_vid` de 12 meses, que permite
 *   unir las visitas con el lead cuando convierte.
 */
const COOKIE = "mg_vid";
const MAX_AGE = 60 * 60 * 24 * 365;

let ephemeralId: string | null = null;

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function readCookie(): string | undefined {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${COOKIE}=`));
  return match ? decodeURIComponent(match.slice(COOKIE.length + 1)) : undefined;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "server";
  if (hasAnalyticsConsent()) {
    const existing = readCookie();
    if (existing) return existing;
    const id = ephemeralId ?? randomId();
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${encodeURIComponent(id)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
    ephemeralId = id;
    return id;
  }
  if (!ephemeralId) ephemeralId = randomId();
  return ephemeralId;
}

/** Identificador de sesión (pestaña). Almacenamiento técnico, sin persistencia. */
let sessionId: string | null = null;
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  if (sessionId) return sessionId;
  try {
    const existing = window.sessionStorage.getItem("mg_sid");
    if (existing) {
      sessionId = existing;
      return existing;
    }
    sessionId = randomId();
    window.sessionStorage.setItem("mg_sid", sessionId);
  } catch {
    sessionId = randomId();
  }
  return sessionId;
}
