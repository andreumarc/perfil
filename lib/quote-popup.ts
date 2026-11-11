/**
 * Reglas del pop-up de presupuesto (sin dependencias de servidor ni de navegador,
 * para poder probarlas en Vitest). El componente cliente decide cuándo abrirlo.
 */

/** Tras mostrarse o cerrarse, no vuelve a aparecer hasta pasados 7 días. */
export const QUOTE_POPUP_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
/** Tiempo en página antes de mostrarlo si el visitante no ha hecho scroll suficiente. */
export const QUOTE_POPUP_DELAY_MS = 20_000;
/** Porcentaje de scroll de la página que también lo dispara. */
export const QUOTE_POPUP_SCROLL_RATIO = 0.55;

/** Páginas donde no tiene sentido: formularios, panel, legales. */
export const QUOTE_POPUP_HIDDEN_PREFIXES = ["/presupuesto", "/contacto", "/admin", "/privacidad", "/aviso-legal", "/politica-", "/terminos"] as const;

export interface QuotePopupState {
  /** Última vez que se mostró (ms desde epoch). */
  shownAt?: number;
  /** El visitante ya envió una solicitud: no se vuelve a mostrar. */
  converted?: boolean;
}

export function parseQuotePopupState(raw: string | null | undefined): QuotePopupState {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Partial<QuotePopupState> | null;
    if (!parsed || typeof parsed !== "object") return {};
    return {
      shownAt: typeof parsed.shownAt === "number" && Number.isFinite(parsed.shownAt) ? parsed.shownAt : undefined,
      converted: parsed.converted === true,
    };
  } catch {
    return {};
  }
}

export function isQuotePopupPath(pathname: string): boolean {
  return !QUOTE_POPUP_HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** True si el pop-up puede mostrarse ahora en esta ruta con el estado guardado. */
export function canShowQuotePopup(state: QuotePopupState, now: number, pathname: string): boolean {
  if (!isQuotePopupPath(pathname)) return false;
  if (state.converted) return false;
  if (state.shownAt !== undefined && now - state.shownAt < QUOTE_POPUP_COOLDOWN_MS) return false;
  return true;
}
