import { describe, expect, it } from "vitest";

import { QUOTE_POPUP_COOLDOWN_MS, canShowQuotePopup, isQuotePopupPath, parseQuotePopupState } from "@/lib/quote-popup";

const NOW = 1_800_000_000_000;

describe("pop-up de presupuesto", () => {
  it("parsea el estado guardado y tolera valores corruptos", () => {
    expect(parseQuotePopupState(null)).toEqual({});
    expect(parseQuotePopupState("no es json")).toEqual({});
    expect(parseQuotePopupState('{"shownAt":"ayer","converted":"sí"}')).toEqual({ shownAt: undefined, converted: false });
    expect(parseQuotePopupState(JSON.stringify({ shownAt: NOW, converted: true }))).toEqual({ shownAt: NOW, converted: true });
  });

  it("se muestra en páginas de contenido y no en formularios, panel ni legales", () => {
    expect(isQuotePopupPath("/")).toBe(true);
    expect(isQuotePopupPath("/servicios/reformas-cocinas")).toBe(true);
    expect(isQuotePopupPath("/blog/cuanto-cuesta-reforma-integral-piso")).toBe(true);
    for (const path of ["/presupuesto", "/contacto", "/admin/leads", "/privacidad/solicitud", "/aviso-legal", "/politica-privacidad", "/politica-cookies", "/terminos"]) {
      expect(isQuotePopupPath(path), path).toBe(false);
    }
  });

  it("respeta la conversión y el periodo de espera de siete días", () => {
    expect(canShowQuotePopup({}, NOW, "/")).toBe(true);
    expect(canShowQuotePopup({ converted: true }, NOW, "/")).toBe(false);
    expect(canShowQuotePopup({ shownAt: NOW - 60_000 }, NOW, "/")).toBe(false);
    expect(canShowQuotePopup({ shownAt: NOW - QUOTE_POPUP_COOLDOWN_MS + 1 }, NOW, "/")).toBe(false);
    expect(canShowQuotePopup({ shownAt: NOW - QUOTE_POPUP_COOLDOWN_MS }, NOW, "/")).toBe(true);
    expect(canShowQuotePopup({}, NOW, "/presupuesto")).toBe(false);
  });
});
