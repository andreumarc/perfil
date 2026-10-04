import type { Attribution } from "@/types/lead";

/**
 * Atribución de marketing (cliente).
 * Captura UTMs, referrer y landing page en la primera visita de la sesión y
 * los conserva en sessionStorage (almacenamiento técnico de sesión, se borra
 * al cerrar la pestaña) para adjuntarlos al lead cuando convierta.
 */
const STORAGE_KEY = "mg_attr";

const UTM_KEYS: Record<string, keyof Attribution> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
};

function sanitize(value: string | null | undefined, max = 200): string | undefined {
  if (!value) return undefined;
  const v = value.trim().slice(0, max);
  return v.length ? v : undefined;
}

function read(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function write(attr: Attribution) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
  } catch {
    // Sin almacenamiento disponible: la atribución se pierde entre páginas.
  }
}

/** Debe llamarse en cada navegación: solo escribe si hay UTMs nuevos o no hay registro. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const existing = read();
  const params = new URLSearchParams(window.location.search);

  const fromUrl: Attribution = {};
  for (const [param, key] of Object.entries(UTM_KEYS)) {
    const v = sanitize(params.get(param));
    if (v) fromUrl[key] = v;
  }

  const hasUtm = Object.keys(fromUrl).length > 0;

  if (existing && !hasUtm) return existing;

  const referrer = sanitize(document.referrer, 500);
  const isInternalReferrer = referrer ? referrer.startsWith(window.location.origin) : false;

  const next: Attribution = {
    ...(existing ?? {}),
    ...fromUrl,
    referrer: existing?.referrer ?? (isInternalReferrer ? undefined : referrer),
    landingPage: existing?.landingPage ?? sanitize(window.location.pathname + window.location.search, 500),
  };

  // Si el usuario llega con UTMs nuevas, prevalecen (last non-direct touch).
  if (hasUtm) {
    next.landingPage = sanitize(window.location.pathname + window.location.search, 500);
    if (!isInternalReferrer && referrer) next.referrer = referrer;
  }

  write(next);
  return next;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return read() ?? captureAttribution();
}

/**
 * Para landings de campaña: si el visitante llega sin UTMs (p. ej. desde un
 * post orgánico de LinkedIn), fija una atribución por defecto sin sobrescribir
 * UTMs reales ya capturadas.
 */
export function setDefaultAttribution(defaults: Attribution): Attribution {
  if (typeof window === "undefined") return {};
  const current = captureAttribution();
  if (current.utmSource) return current;
  const next: Attribution = { ...current, ...defaults, landingPage: current.landingPage ?? defaults.landingPage };
  write(next);
  return next;
}
