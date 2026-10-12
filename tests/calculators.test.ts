import { describe, expect, it } from "vitest";

import { CALCULATORS, allDefaultRates, defaultInputs, describeInputs, getCalculator, resolveRates, sanitizeInputs } from "@/lib/calculators/definitions";
import { DEFAULT_SETTINGS } from "@/content/settings";
import { siteSettingsSchema } from "@/lib/validation/settings";

describe("calculadoras", () => {
  it("todas producen un rango coherente con sus valores por defecto", () => {
    for (const c of CALCULATORS) {
      const estimate = c.compute(sanitizeInputs(c, defaultInputs(c)), resolveRates(c));
      expect(estimate.min, c.id).toBeGreaterThan(0);
      expect(estimate.max, c.id).toBeGreaterThanOrEqual(estimate.min);
      expect(estimate.lines.length, c.id).toBeGreaterThan(0);
      expect(estimate.notes.some((n) => /IVA/.test(n)), c.id).toBe(true);
      for (const line of estimate.lines) expect(line.max).toBeGreaterThanOrEqual(line.min);
    }
  });

  it("sanea entradas fuera de rango y opciones inválidas", () => {
    const c = getCalculator("suelos")!;
    const clean = sanitizeInputs(c, { m2: "abc", material: "oro", demolition: "si", skirting: true });
    expect(clean.m2).toBe(60);
    expect(clean.material).toBe("laminado");
    expect(clean.demolition).toBe(false);
    expect(clean.skirting).toBe(true);
    const capped = sanitizeInputs(c, { m2: 999999 });
    expect(capped.m2).toBe(5000);
  });

  it("escala con los metros y con la calidad", () => {
    const c = getCalculator("reforma-integral")!;
    const rates = resolveRates(c);
    const small = c.compute(sanitizeInputs(c, { ...defaultInputs(c), m2: 60 }), rates);
    const big = c.compute(sanitizeInputs(c, { ...defaultInputs(c), m2: 120 }), rates);
    const alta = c.compute(sanitizeInputs(c, { ...defaultInputs(c), m2: 120, quality: "alta" }), rates);
    expect(big.min).toBeGreaterThan(small.min);
    expect(alta.max).toBeGreaterThan(big.max);
  });

  it("ignora tarifas guardadas incoherentes y respeta las válidas", () => {
    const c = getCalculator("pintura")!;
    const rates = resolveRates(c, { paint_m2: { min: 50, max: 10 }, door: { min: 100, max: 200 } });
    expect(rates.paint_m2).toEqual({ min: 7, max: 11 });
    expect(rates.door).toEqual({ min: 100, max: 200 });
  });

  it("describe las entradas de forma legible para el CRM", () => {
    const c = getCalculator("climatizacion")!;
    const text = describeInputs(c, sanitizeInputs(c, { system: "conductos", units: 3, m2: 90 }));
    expect(text).toContain("Conductos");
    expect(text).toContain("90 m²");
    expect(text).not.toContain("Unidades interiores");
  });

  it("las tarifas por defecto validan contra el esquema de ajustes", () => {
    const parsed = siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, calculators: { ...DEFAULT_SETTINGS.calculators, rates: allDefaultRates() } });
    expect(parsed.success).toBe(true);
  });
});
