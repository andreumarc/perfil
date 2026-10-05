import { clamp, formatEuro, formatPercent } from "@/lib/utils";
import { SECTORS, type CompanyRevenue, type NumberLocations, type Sector } from "@/types/lead";

/**
 * EBITDA OPPORTUNITY CALCULATOR — lógica pura (sin React).
 *
 * Compara seis datos del P&L de una red de centros con rangos de referencia
 * de gestión por sector y estima qué EBITDA tendría la red si su margen se
 * situara dentro de ese rango.
 *
 * IMPORTANTE SOBRE LOS RANGOS:
 * Los valores de `BENCHMARKS` son referencias orientativas de gestión,
 * construidas a partir de experiencia operativa en redes multicentro. NO son
 * datos sectoriales oficiales, no proceden de ningún estudio estadístico y no
 * sustituyen a un análisis del P&L real de cada centro. El resultado de la
 * calculadora es un escenario orientativo: nunca una previsión, una promesa
 * de ahorro ni un compromiso de resultados.
 */

export interface CalculatorInput {
  /** Facturación anual del grupo en euros. */
  revenue: number;
  /** Número de centros de la red. */
  locations: number;
  /** Margen EBITDA sobre ventas (%). */
  ebitdaMarginPct: number;
  /** Coste de personal sobre ventas (%). */
  staffCostPct: number;
  /** Compras y consumibles sobre ventas (%). */
  purchasesPct: number;
  /** Ocupación o uso de la capacidad instalada (%). */
  occupancyPct: number;
  sector: Sector;
}

export type Range = [low: number, high: number];

export interface SectorBenchmark {
  ebitdaMargin: Range;
  staffCost: Range;
  purchases: Range;
  occupancy: Range;
}

/**
 * Rangos orientativos de gestión por sector (porcentaje sobre ventas, salvo
 * ocupación, que es porcentaje de capacidad utilizada; en retail se interpreta
 * como conversión / uso de la capacidad comercial).
 */
export const BENCHMARKS: Record<Sector, SectorBenchmark> = {
  dental: { ebitdaMargin: [15, 25], staffCost: [35, 45], purchases: [8, 14], occupancy: [65, 80] },
  veterinaria: { ebitdaMargin: [12, 20], staffCost: [38, 48], purchases: [18, 26], occupancy: [60, 75] },
  healthcare: { ebitdaMargin: [12, 22], staffCost: [40, 50], purchases: [8, 15], occupancy: [60, 78] },
  retail: { ebitdaMargin: [6, 14], staffCost: [14, 22], purchases: [45, 60], occupancy: [70, 85] },
  fitness: { ebitdaMargin: [15, 30], staffCost: [28, 40], purchases: [5, 10], occupancy: [55, 75] },
  automocion: { ebitdaMargin: [8, 15], staffCost: [30, 40], purchases: [35, 50], occupancy: [65, 80] },
  franquicias: { ebitdaMargin: [10, 18], staffCost: [25, 35], purchases: [30, 45], occupancy: [65, 80] },
  restauracion: { ebitdaMargin: [8, 15], staffCost: [30, 38], purchases: [28, 35], occupancy: [60, 75] },
  private_equity: { ebitdaMargin: [12, 20], staffCost: [30, 45], purchases: [15, 30], occupancy: [60, 78] },
  otros: { ebitdaMargin: [12, 20], staffCost: [30, 45], purchases: [15, 30], occupancy: [60, 78] },
};

export const FALLBACK_SECTOR: Sector = "otros";

export type MetricKey = "ebitdaMargin" | "staffCost" | "purchases" | "occupancy";
export type MetricPosition = "below" | "within" | "above";
export type MetricDirection = "higher_is_better" | "lower_is_better";
export type MetricStatus = "attention" | "ok" | "strong";
export type OpportunityLevel = "alto" | "medio" | "bajo";

export const METRIC_LABELS: Record<MetricKey, string> = {
  ebitdaMargin: "Margen EBITDA",
  staffCost: "Coste de personal",
  purchases: "Compras y consumibles",
  occupancy: "Ocupación / capacidad",
};

export const METRIC_DIRECTIONS: Record<MetricKey, MetricDirection> = {
  ebitdaMargin: "higher_is_better",
  staffCost: "lower_is_better",
  purchases: "lower_is_better",
  occupancy: "higher_is_better",
};

/** Nombre corto de la palanca para construir frases ("el mayor potencial parece estar en…"). */
const LEVER_NAMES: Record<Exclude<MetricKey, "ebitdaMargin">, string> = {
  staffCost: "coste de personal",
  purchases: "compras",
  occupancy: "ocupación",
};

export const STATUS_LABELS: Record<MetricStatus, string> = {
  attention: "Fuera de rango",
  ok: "En rango",
  strong: "Mejor que el rango",
};

export interface CalculatorMetric {
  key: MetricKey;
  label: string;
  /** Valor introducido por el usuario (%), ya acotado a 0-100. */
  value: number;
  range: Range;
  position: MetricPosition;
  direction: MetricDirection;
  status: MetricStatus;
  /** Frase concreta y prudente sobre la lectura de la métrica. */
  comment: string;
}

export interface CalculatorScenario {
  targetMarginLow: number;
  targetMarginHigh: number;
  /** EBITDA (€) si el margen fuera el límite inferior del rango. */
  ebitdaAtLow: number;
  /** EBITDA (€) si el margen fuera el límite superior del rango. */
  ebitdaAtHigh: number;
  /** Diferencia frente al EBITDA actual. Negativa si ya está por encima del rango. */
  deltaLow: number;
  deltaHigh: number;
  /** `true` cuando el margen actual ya está en el rango o por encima. */
  alreadyInRange: boolean;
}

export interface CalculatorResult {
  /** Entrada normalizada (clamp, mínimos, sector válido). */
  input: CalculatorInput;
  revenuePerLocation: number;
  /** EBITDA anual estimado (€). */
  ebitda: number;
  ebitdaPerLocation: number;
  metrics: CalculatorMetric[];
  scenario: CalculatorScenario;
  opportunityLevel: OpportunityLevel;
  attentionCount: number;
  headline: string;
}

export const DEFAULT_CALCULATOR_INPUT: CalculatorInput = {
  revenue: 12_000_000,
  locations: 12,
  ebitdaMarginPct: 11,
  staffCostPct: 46,
  purchasesPct: 14,
  occupancyPct: 62,
  sector: "dental",
};

/* ------------------------------------------------------------------ */
/* Normalización                                                       */
/* ------------------------------------------------------------------ */

function finiteOr(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function isSector(value: unknown): value is Sector {
  return typeof value === "string" && SECTORS.some((s) => s.value === value);
}

/** Acota la entrada: porcentajes 0-100, facturación ≥ 0, centros entero ≥ 1, sector válido. */
export function normalizeInput(input: Partial<CalculatorInput>): CalculatorInput {
  const pct = (v: unknown) => clamp(finiteOr(v, 0), 0, 100);
  return {
    revenue: Math.max(0, finiteOr(input.revenue, 0)),
    locations: Math.max(1, Math.round(finiteOr(input.locations, 1))),
    ebitdaMarginPct: pct(input.ebitdaMarginPct),
    staffCostPct: pct(input.staffCostPct),
    purchasesPct: pct(input.purchasesPct),
    occupancyPct: pct(input.occupancyPct),
    sector: isSector(input.sector) ? input.sector : FALLBACK_SECTOR,
  };
}

export function benchmarkFor(sector: unknown): SectorBenchmark {
  return isSector(sector) ? BENCHMARKS[sector] : BENCHMARKS[FALLBACK_SECTOR];
}

/* ------------------------------------------------------------------ */
/* Bandas para el CRM (precarga del formulario y analítica)            */
/* ------------------------------------------------------------------ */

/** Convierte la facturación en euros a la banda usada en el CRM. */
export function revenueBand(revenue: number): CompanyRevenue {
  const r = Math.max(0, finiteOr(revenue, 0));
  if (r < 1_000_000) return "<1M";
  if (r < 5_000_000) return "1-5M";
  if (r < 10_000_000) return "5-10M";
  if (r < 25_000_000) return "10-25M";
  if (r < 50_000_000) return "25-50M";
  return "50M+";
}

/** Convierte el número de centros a la banda usada en el CRM. */
export function locationsBand(locations: number): NumberLocations {
  const n = Math.max(1, Math.round(finiteOr(locations, 1)));
  if (n <= 1) return "1";
  if (n <= 5) return "2-5";
  if (n <= 10) return "6-10";
  if (n <= 25) return "11-25";
  if (n <= 50) return "26-50";
  return "50+";
}

/* ------------------------------------------------------------------ */
/* Evaluación                                                          */
/* ------------------------------------------------------------------ */

export function positionInRange(value: number, [low, high]: Range): MetricPosition {
  if (value < low) return "below";
  if (value > high) return "above";
  return "within";
}

export function statusFor(position: MetricPosition, direction: MetricDirection): MetricStatus {
  if (position === "within") return "ok";
  const favourable = direction === "higher_is_better" ? "above" : "below";
  return position === favourable ? "strong" : "attention";
}

function rangeText([low, high]: Range) {
  return `${formatPercent(low)}–${formatPercent(high)}`;
}

function pointsText(points: number) {
  const p = Math.round(points * 10) / 10;
  return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(p)} ${p === 1 ? "punto" : "puntos"}`;
}

function buildComment(
  key: MetricKey,
  value: number,
  range: Range,
  status: MetricStatus,
  revenue: number,
): string {
  const [low, high] = range;
  const pointValue = revenue / 100; // € por cada punto porcentual sobre ventas
  const pointEuro = pointValue > 0 ? ` Con tu facturación, cada punto equivale a unos ${formatEuro(pointValue)} anuales.` : "";

  switch (key) {
    case "ebitdaMargin": {
      if (status === "attention") {
        return `Un margen del ${formatPercent(value, 1)} está ${pointsText(low - value)} por debajo del rango de referencia (${rangeText(range)}).${pointEuro}`;
      }
      if (status === "strong") {
        return `Tu margen (${formatPercent(value, 1)}) supera el rango de referencia (${rangeText(range)}). Conviene comprobar que se sostiene centro a centro y no depende de uno o dos centros excepcionales.`;
      }
      return `Tu margen (${formatPercent(value, 1)}) está dentro del rango de referencia (${rangeText(range)}). El recorrido suele estar en los centros que arrastran la media hacia abajo, no en la media.`;
    }
    case "staffCost": {
      if (status === "attention") {
        return `El coste de personal consume el ${formatPercent(value, 1)} de las ventas, ${pointsText(value - high)} por encima del rango (${rangeText(range)}). Dimensionamiento de turnos, agenda y productividad por profesional son la palanca más rápida.${pointEuro}`;
      }
      if (status === "strong") {
        return `El coste de personal (${formatPercent(value, 1)}) está por debajo del rango (${rangeText(range)}). Verifica que no se traduce en falta de capacidad, rotación o pérdida de calidad de servicio.`;
      }
      return `El coste de personal (${formatPercent(value, 1)}) está en rango (${rangeText(range)}). La oportunidad suele estar en la dispersión entre centros y en la relación entre horas contratadas y horas facturadas.`;
    }
    case "purchases": {
      if (status === "attention") {
        return `Compras y consumibles suponen el ${formatPercent(value, 1)} de las ventas, ${pointsText(value - high)} por encima del rango (${rangeText(range)}). Negociación centralizada, catálogo estandarizado y control de consumos por centro son las vías habituales.${pointEuro}`;
      }
      if (status === "strong") {
        return `Compras (${formatPercent(value, 1)}) por debajo del rango (${rangeText(range)}): señal de una negociación eficiente, siempre que no comprometa calidad ni disponibilidad.`;
      }
      return `Compras (${formatPercent(value, 1)}) en rango (${rangeText(range)}). Revisa la dispersión de precio y consumo por centro y proveedor: la media esconde diferencias.`;
    }
    case "occupancy": {
      if (status === "attention") {
        return `Una ocupación del ${formatPercent(value, 1)} deja ${pointsText(low - value)} de capacidad sin utilizar frente al rango (${rangeText(range)}). Con los costes fijos ya pagados, cada punto adicional de ocupación cae casi íntegro al EBITDA.`;
      }
      if (status === "strong") {
        return `Ocupación (${formatPercent(value, 1)}) por encima del rango (${rangeText(range)}): la capacidad está bien aprovechada. El riesgo pasa a ser la saturación, la lista de espera y la presión sobre el equipo.`;
      }
      return `Ocupación (${formatPercent(value, 1)}) en rango (${rangeText(range)}). El siguiente paso es igualar los centros por debajo de la media y ajustar agendas y horarios a la demanda real.`;
    }
  }
}

function joinLevers(levers: string[]): string {
  if (levers.length === 0) return "";
  if (levers.length === 1) return levers[0];
  return `${levers.slice(0, -1).join(", ")} y ${levers[levers.length - 1]}`;
}

function buildHeadline(metrics: CalculatorMetric[]): string {
  const margin = metrics.find((m) => m.key === "ebitdaMargin");
  const levers = metrics
    .filter((m) => m.key !== "ebitdaMargin" && m.status === "attention")
    .map((m) => LEVER_NAMES[m.key as Exclude<MetricKey, "ebitdaMargin">]);
  const leverText = joinLevers(levers);
  const marginStatus = margin?.status ?? "ok";

  if (marginStatus === "attention") {
    if (levers.length > 0) {
      return `Tu margen EBITDA está por debajo del rango de referencia de tu sector; el mayor potencial parece estar en ${leverText}.`;
    }
    return "Tu margen EBITDA está por debajo del rango de referencia de tu sector, pero las tres palancas analizadas están en rango: conviene revisar costes fijos, alquileres y mix de servicios.";
  }

  if (marginStatus === "strong") {
    if (levers.length > 0) {
      return `Tu margen EBITDA supera el rango de referencia de tu sector, aunque ${leverText} ${levers.length > 1 ? "están" : "está"} fuera de rango: conviene verificar la consistencia centro a centro.`;
    }
    return "Tu red opera por encima del rango de referencia de tu sector. El reto pasa a ser sostenerlo centro a centro y absorber crecimiento sin diluir el margen.";
  }

  if (levers.length > 0) {
    return `Tu margen EBITDA está dentro del rango de referencia, pero ${leverText} ${levers.length > 1 ? "apuntan" : "apunta"} a recorrido adicional.`;
  }
  return "Tu red está dentro de los rangos de referencia en las cuatro métricas. El recorrido suele estar en la dispersión entre centros, no en la media.";
}

export function opportunityLevelFor(attentionCount: number): OpportunityLevel {
  if (attentionCount >= 3) return "alto";
  if (attentionCount >= 1) return "medio";
  return "bajo";
}

/**
 * Evalúa la red frente a los rangos de referencia de su sector.
 * Nunca lanza: la entrada se normaliza (clamp 0-100, facturación ≥ 0,
 * centros ≥ 1, sector desconocido → "otros") y no hay divisiones por cero.
 */
export function evaluateCalculator(rawInput: Partial<CalculatorInput>): CalculatorResult {
  const input = normalizeInput(rawInput);
  const bench = BENCHMARKS[input.sector];

  const revenuePerLocation = input.revenue / input.locations;
  const ebitda = Math.round((input.revenue * input.ebitdaMarginPct) / 100);
  const ebitdaPerLocation = Math.round(ebitda / input.locations);

  const values: Record<MetricKey, number> = {
    ebitdaMargin: input.ebitdaMarginPct,
    staffCost: input.staffCostPct,
    purchases: input.purchasesPct,
    occupancy: input.occupancyPct,
  };

  const metrics: CalculatorMetric[] = (Object.keys(METRIC_LABELS) as MetricKey[]).map((key) => {
    const range = bench[key];
    const value = values[key];
    const direction = METRIC_DIRECTIONS[key];
    const position = positionInRange(value, range);
    const status = statusFor(position, direction);
    return {
      key,
      label: METRIC_LABELS[key],
      value,
      range,
      position,
      direction,
      status,
      comment: buildComment(key, value, range, status, input.revenue),
    };
  });

  const [targetMarginLow, targetMarginHigh] = bench.ebitdaMargin;
  const ebitdaAtLow = Math.round((input.revenue * targetMarginLow) / 100);
  const ebitdaAtHigh = Math.round((input.revenue * targetMarginHigh) / 100);
  const scenario: CalculatorScenario = {
    targetMarginLow,
    targetMarginHigh,
    ebitdaAtLow,
    ebitdaAtHigh,
    deltaLow: ebitdaAtLow - ebitda,
    deltaHigh: ebitdaAtHigh - ebitda,
    alreadyInRange: input.ebitdaMarginPct >= targetMarginLow,
  };

  const attentionCount = metrics.filter((m) => m.status === "attention").length;

  return {
    input,
    revenuePerLocation,
    ebitda,
    ebitdaPerLocation,
    metrics,
    scenario,
    opportunityLevel: opportunityLevelFor(attentionCount),
    attentionCount,
    headline: buildHeadline(metrics),
  };
}
