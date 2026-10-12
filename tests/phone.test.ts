import { describe, expect, it } from "vitest";

import { formatPhone, telHref, toE164, whatsappHref } from "@/lib/phone";

describe("toE164", () => {
  it("normaliza móviles españoles de 9 dígitos", () => {
    expect(toE164("600 123 456")).toBe("+34600123456");
    expect(toE164("93-123-45-67")).toBe("+34931234567");
  });
  it("respeta prefijos internacionales", () => {
    expect(toE164("+34 600 123 456")).toBe("+34600123456");
    expect(toE164("0034600123456")).toBe("+34600123456");
    expect(toE164("+33 6 12 34 56 78")).toBe("+33612345678");
  });
  it("rechaza valores no válidos", () => {
    expect(toE164("")).toBeNull();
    expect(toE164("12345")).toBeNull();
    expect(toE164("abc")).toBeNull();
    expect(toE164(null)).toBeNull();
  });
});

describe("enlaces", () => {
  it("genera tel: y wa.me", () => {
    expect(telHref("600123456")).toBe("tel:+34600123456");
    expect(whatsappHref("600123456")).toBe("https://wa.me/34600123456");
    expect(whatsappHref("600123456", "Hola")).toBe("https://wa.me/34600123456?text=Hola");
    expect(whatsappHref("")).toBeNull();
  });
  it("formatea para mostrar", () => {
    expect(formatPhone("+34600123456")).toBe("600 123 456");
  });
});
