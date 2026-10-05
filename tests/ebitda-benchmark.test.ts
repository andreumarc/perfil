import { describe, expect, it } from "vitest";

import {
  BENCHMARKS,
  DEFAULT_CALCULATOR_INPUT,
  evaluateCalculator,
  locationsBand,
  normalizeInput,
  opportunityLevelFor,
  positionInRange,
  revenueBand,
  statusFor,
  type CalculatorInput,
} from "@/lib/ebitda-benchmark";
import { SECTORS } from "@/types/lead";

const metric = (result: ReturnType<typeof evaluateCalculator>, key: string) => {
  const m = result.metrics.find((x) => x.key === key);
  if (!m) throw new Error(`Métrica ${key} no encontrada`);
  return m;
};

describe("ebitda-benchmark · posiciones y estados", () => {
  it("clasifica below / within / above frente al rango", () => {
    expect(positionInRange(10, [15, 25])).toBe("below");
    expect(positionInRange(15, [15, 25])).toBe("within");
    expect(positionInRange(25, [15, 25])).toBe("within");
    expect(positionInRange(26, [15, 25])).toBe("above");
  });

  it("traduce la posición a estado según la dirección de la métrica", () => {
    expect(statusFor("below", "higher_is_better")).toBe("attention");
    expect(statusFor("above", "higher_is_better")).toBe("strong");
    expect(statusFor("above", "lower_is_better")).toBe("attention");
    expect(statusFor("below", "lower_is_better")).toBe("strong");
    expect(statusFor("within", "lower_is_better")).toBe("ok");
  });

  it("marca en atención un margen bajo, personal alto y ocupación baja (entrada por defecto, dental)", () => {
    const result = evaluateCalculator(DEFAULT_CALCULATOR_INPUT);
    expect(metric(result, "ebitdaMargin").position).toBe("below");
    expect(metric(result, "ebitdaMargin").status).toBe("attention");
    expect(metric(result, "staffCost").position).toBe("above");
    expect(metric(result, "staffCost").status).toBe("attention");
    expect(metric(result, "purchases").position).toBe("within");
    expect(metric(result, "purchases").status).toBe("ok");
    expect(metric(result, "occupancy").position).toBe("below");
    expect(metric(result, "occupancy").status).toBe("attention");
    expect(result.attentionCount).toBe(3);
    expect(result.opportunityLevel).toBe("alto");
  });

  it("reconoce una red que supera el rango como 'strong' y oportunidad baja", () => {
    const result = evaluateCalculator({
      ...DEFAULT_CALCULATOR_INPUT,
      ebitdaMarginPct: 28,
      staffCostPct: 33,
      purchasesPct: 7,
      occupancyPct: 84,
    });
    expect(result.metrics.every((m) => m.status === "strong")).toBe(true);
    expect(result.attentionCount).toBe(0);
    expect(result.opportunityLevel).toBe("bajo");
    expect(result.headline).toContain("por encima del rango de referencia");
  });
});

describe("ebitda-benchmark · cálculo económico", () => {
  it("calcula EBITDA, EBITDA por centro y facturación por centro", () => {
    const result = evaluateCalculator({
      revenue: 12_000_000,
      locations: 12,
      ebitdaMarginPct: 11,
      staffCostPct: 46,
      purchasesPct: 14,
      occupancyPct: 62,
      sector: "dental",
    });
    expect(result.ebitda).toBe(1_320_000);
    expect(result.ebitdaPerLocation).toBe(110_000);
    expect(result.revenuePerLocation).toBe(1_000_000);
  });

  it("construye el escenario con deltas positivos cuando el margen está por debajo del rango", () => {
    const result = evaluateCalculator(DEFAULT_CALCULATOR_INPUT);
    const [low, high] = BENCHMARKS.dental.ebitdaMargin;
    expect(result.scenario.targetMarginLow).toBe(low);
    expect(result.scenario.targetMarginHigh).toBe(high);
    expect(result.scenario.ebitdaAtLow).toBe(1_800_000);
    expect(result.scenario.ebitdaAtHigh).toBe(3_000_000);
    expect(result.scenario.deltaLow).toBe(480_000);
    expect(result.scenario.deltaHigh).toBe(1_680_000);
    expect(result.scenario.alreadyInRange).toBe(false);
  });

  it("devuelve deltas negativos y alreadyInRange cuando el margen ya supera el rango", () => {
    const result = evaluateCalculator({ ...DEFAULT_CALCULATOR_INPUT, ebitdaMarginPct: 30 });
    expect(result.scenario.deltaLow).toBeLessThan(0);
    expect(result.scenario.deltaHigh).toBeLessThan(0);
    expect(result.scenario.alreadyInRange).toBe(true);
  });
});

describe("ebitda-benchmark · robustez de la entrada", () => {
  it("acota porcentajes a 0-100, facturación ≥ 0 y centros ≥ 1", () => {
    const normalized = normalizeInput({
      revenue: -500,
      locations: 0,
      ebitdaMarginPct: 140,
      staffCostPct: -10,
      purchasesPct: Number.NaN,
      occupancyPct: 62.4,
      sector: "dental",
    });
    expect(normalized.revenue).toBe(0);
    expect(normalized.locations).toBe(1);
    expect(normalized.ebitdaMarginPct).toBe(100);
    expect(normalized.staffCostPct).toBe(0);
    expect(normalized.purchasesPct).toBe(0);
    expect(normalized.occupancyPct).toBe(62.4);
  });

  it("no rompe con facturación cero ni con centros a cero (sin divisiones por cero)", () => {
    const result = evaluateCalculator({ ...DEFAULT_CALCULATOR_INPUT, revenue: 0, locations: 0 });
    expect(result.ebitda).toBe(0);
    expect(result.ebitdaPerLocation).toBe(0);
    expect(Number.isFinite(result.revenuePerLocation)).toBe(true);
    expect(result.metrics).toHaveLength(4);
  });

  it("un sector desconocido no lanza y usa los rangos de 'otros'", () => {
    const input = { ...DEFAULT_CALCULATOR_INPUT, sector: "metaverso" } as unknown as CalculatorInput;
    expect(() => evaluateCalculator(input)).not.toThrow();
    const result = evaluateCalculator(input);
    expect(result.input.sector).toBe("otros");
    expect(metric(result, "ebitdaMargin").range).toEqual(BENCHMARKS.otros.ebitdaMargin);
  });

  it("todos los sectores del CRM tienen benchmark y rangos coherentes (low < high dentro de 0-100)", () => {
    for (const { value } of SECTORS) {
      const bench = BENCHMARKS[value];
      expect(bench).toBeDefined();
      for (const [low, high] of Object.values(bench)) {
        expect(low).toBeGreaterThanOrEqual(0);
        expect(high).toBeLessThanOrEqual(100);
        expect(low).toBeLessThan(high);
      }
    }
  });
});

describe("ebitda-benchmark · headline y niveles", () => {
  it("la headline nombra las palancas en atención cuando el margen está bajo", () => {
    const result = evaluateCalculator(DEFAULT_CALCULATOR_INPUT);
    expect(result.headline).toContain("por debajo del rango de referencia");
    expect(result.headline).toContain("coste de personal");
    expect(result.headline).toContain("ocupación");
    expect(result.headline).not.toContain("compras");
  });

  it("la headline indica recorrido adicional cuando el margen está en rango pero una palanca no", () => {
    const result = evaluateCalculator({ ...DEFAULT_CALCULATOR_INPUT, ebitdaMarginPct: 18, staffCostPct: 40, occupancyPct: 70, purchasesPct: 20 });
    expect(result.opportunityLevel).toBe("medio");
    expect(result.headline).toContain("dentro del rango de referencia");
    expect(result.headline).toContain("compras");
  });

  it("los comentarios de las métricas incluyen el valor y el rango de referencia", () => {
    const result = evaluateCalculator(DEFAULT_CALCULATOR_INPUT);
    const staff = metric(result, "staffCost");
    expect(staff.comment).toContain("46%");
    expect(staff.comment).toContain("35%–45%");
  });

  it("asigna el nivel de oportunidad por número de métricas en atención", () => {
    expect(opportunityLevelFor(0)).toBe("bajo");
    expect(opportunityLevelFor(1)).toBe("medio");
    expect(opportunityLevelFor(2)).toBe("medio");
    expect(opportunityLevelFor(3)).toBe("alto");
    expect(opportunityLevelFor(4)).toBe("alto");
  });
});

describe("ebitda-benchmark · bandas para el CRM", () => {
  it("convierte facturación en euros a banda", () => {
    expect(revenueBand(800_000)).toBe("<1M");
    expect(revenueBand(1_000_000)).toBe("1-5M");
    expect(revenueBand(12_000_000)).toBe("10-25M");
    expect(revenueBand(49_999_999)).toBe("25-50M");
    expect(revenueBand(80_000_000)).toBe("50M+");
  });

  it("convierte número de centros a banda", () => {
    expect(locationsBand(1)).toBe("1");
    expect(locationsBand(5)).toBe("2-5");
    expect(locationsBand(12)).toBe("11-25");
    expect(locationsBand(26)).toBe("26-50");
    expect(locationsBand(120)).toBe("50+");
  });
});
