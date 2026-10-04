import {
  HOT_LEAD_THRESHOLD,
  type CompanyRevenue,
  type JobTitle,
  type LeadLevel,
  type MainProblem,
  type NumberLocations,
  type Sector,
} from "@/types/lead";

/**
 * LEAD SCORING — escala 0-100.
 *
 * Diseñado para ser fácilmente modificable: cambia los pesos en SCORING_WEIGHTS
 * y el resto del sistema (niveles, HOT lead, breakdown en admin) se adapta.
 *
 * Reparto máximo (suma = 100):
 *   Número de centros ........ 25
 *   Facturación .............. 25
 *   Cargo .................... 15
 *   Sector ...................  5
 *   Problema principal .......  5
 *   Dolor operativo .......... 20   (derivado del diagnóstico)
 *   Private Equity ...........  5
 */
export const SCORING_WEIGHTS = {
  locations: {
    "1": 0,
    "2-5": 5,
    "6-10": 10,
    "11-25": 15,
    "26-50": 20,
    "50+": 25,
  } satisfies Record<NumberLocations, number>,

  revenue: {
    "<1M": 0,
    "1-5M": 5,
    "5-10M": 10,
    "10-25M": 15,
    "25-50M": 20,
    "50M+": 25,
  } satisfies Record<CompanyRevenue, number>,

  role: {
    ceo: 15,
    founder: 15,
    managing_director: 15,
    coo: 15,
    cfo: 12,
    operations_director: 12,
    investment_director: 15,
    operating_partner: 15,
    portfolio_manager: 12,
    area_manager: 6,
    other: 3,
  } satisfies Record<JobTitle, number>,

  sector: {
    dental: 5,
    veterinaria: 5,
    healthcare: 5,
    private_equity: 5,
    retail: 4,
    fitness: 4,
    franquicias: 4,
    restauracion: 3,
    automocion: 3,
    otros: 2,
  } satisfies Record<Sector, number>,

  mainProblem: {
    rentabilidad: 5,
    integracion: 5,
    kpis: 4,
    costes: 4,
    procesos: 4,
    equipos: 3,
    expansion: 3,
    crecimiento: 2,
  } satisfies Record<MainProblem, number>,

  /** Señales de dolor operativo extraídas del diagnóstico (máximo 20 en total). */
  operationalPain: {
    noEbitdaPerCenter: 5,
    partialEbitdaPerCenter: 3,
    noCommonKpis: 3,
    partialCommonKpis: 2,
    noDashboard: 3,
    partialDashboard: 1,
    differentProcesses: 4,
    partialProcesses: 2,
    recentAcquisition: 5,
    consideringAcquisition: 3,
  },
  operationalPainMax: 20,

  privateEquity: 5,
} as const;

export const LEAD_LEVEL_THRESHOLDS: { level: LeadLevel; min: number; max: number }[] = [
  { level: "low", min: 0, max: 30 },
  { level: "medium", min: 31, max: 60 },
  { level: "high", min: 61, max: 80 },
  { level: "strategic", min: 81, max: 100 },
];

const PE_ROLES: JobTitle[] = ["investment_director", "operating_partner", "portfolio_manager"];

/** Señales de dolor operativo. Se derivan de las respuestas del diagnóstico. */
export interface OperationalPainSignals {
  ebitdaPerCenter?: "yes" | "partial" | "no";
  commonKpis?: "yes" | "partial" | "no";
  dashboard?: "yes" | "partial" | "no";
  commonProcesses?: "yes" | "partial" | "no";
  acquisitions?: "yes" | "no" | "considering";
}

export interface LeadScoringInput {
  numberLocations?: NumberLocations | null;
  companyRevenue?: CompanyRevenue | null;
  jobTitle?: JobTitle | null;
  sector?: Sector | null;
  mainProblem?: MainProblem | null;
  pain?: OperationalPainSignals | null;
}

export interface ScoreBreakdownItem {
  key: "locations" | "revenue" | "role" | "sector" | "mainProblem" | "operationalPain" | "privateEquity";
  label: string;
  points: number;
  max: number;
}

export interface LeadScore {
  score: number;
  level: LeadLevel;
  isHot: boolean;
  breakdown: ScoreBreakdownItem[];
}

function maxOf(record: Record<string, number>) {
  return Math.max(...Object.values(record));
}

export function scoreOperationalPain(pain: OperationalPainSignals | null | undefined): number {
  if (!pain) return 0;
  const w = SCORING_WEIGHTS.operationalPain;
  let points = 0;
  if (pain.ebitdaPerCenter === "no") points += w.noEbitdaPerCenter;
  else if (pain.ebitdaPerCenter === "partial") points += w.partialEbitdaPerCenter;

  if (pain.commonKpis === "no") points += w.noCommonKpis;
  else if (pain.commonKpis === "partial") points += w.partialCommonKpis;

  if (pain.dashboard === "no") points += w.noDashboard;
  else if (pain.dashboard === "partial") points += w.partialDashboard;

  if (pain.commonProcesses === "no") points += w.differentProcesses;
  else if (pain.commonProcesses === "partial") points += w.partialProcesses;

  if (pain.acquisitions === "yes") points += w.recentAcquisition;
  else if (pain.acquisitions === "considering") points += w.consideringAcquisition;

  return Math.min(SCORING_WEIGHTS.operationalPainMax, points);
}

export function isPrivateEquityLead(input: Pick<LeadScoringInput, "jobTitle" | "sector">): boolean {
  if (input.sector === "private_equity") return true;
  if (input.jobTitle && PE_ROLES.includes(input.jobTitle)) return true;
  return false;
}

export function levelForScore(score: number): LeadLevel {
  const s = Math.round(score);
  const match = LEAD_LEVEL_THRESHOLDS.find((t) => s >= t.min && s <= t.max);
  return match?.level ?? (s > 100 ? "strategic" : "low");
}

export function isHotLead(score: number): boolean {
  return score >= HOT_LEAD_THRESHOLD;
}

/**
 * Calcula el score 0-100 de un lead junto con su nivel y desglose.
 * Cualquier campo ausente aporta 0 puntos: el algoritmo funciona igual para
 * un lead de diagnóstico completo que para uno de formulario de contacto.
 */
export function scoreLead(input: LeadScoringInput): LeadScore {
  const locations = input.numberLocations ? SCORING_WEIGHTS.locations[input.numberLocations] : 0;
  const revenue = input.companyRevenue ? SCORING_WEIGHTS.revenue[input.companyRevenue] : 0;
  const role = input.jobTitle ? SCORING_WEIGHTS.role[input.jobTitle] : 0;
  const sector = input.sector ? SCORING_WEIGHTS.sector[input.sector] : 0;
  const problem = input.mainProblem ? SCORING_WEIGHTS.mainProblem[input.mainProblem] : 0;
  const pain = scoreOperationalPain(input.pain);
  const pe = isPrivateEquityLead(input) ? SCORING_WEIGHTS.privateEquity : 0;

  const breakdown: ScoreBreakdownItem[] = [
    { key: "locations", label: "Número de centros", points: locations, max: maxOf(SCORING_WEIGHTS.locations) },
    { key: "revenue", label: "Facturación", points: revenue, max: maxOf(SCORING_WEIGHTS.revenue) },
    { key: "role", label: "Cargo", points: role, max: maxOf(SCORING_WEIGHTS.role) },
    { key: "sector", label: "Sector", points: sector, max: maxOf(SCORING_WEIGHTS.sector) },
    { key: "mainProblem", label: "Problema principal", points: problem, max: maxOf(SCORING_WEIGHTS.mainProblem) },
    { key: "operationalPain", label: "Dolor operativo (diagnóstico)", points: pain, max: SCORING_WEIGHTS.operationalPainMax },
    { key: "privateEquity", label: "Private Equity", points: pe, max: SCORING_WEIGHTS.privateEquity },
  ];

  const raw = breakdown.reduce((acc, item) => acc + item.points, 0);
  const maxTotal = breakdown.reduce((acc, item) => acc + item.max, 0);
  // Normaliza a 0-100 por si los pesos se modifican y dejan de sumar 100.
  const score = Math.round(Math.min(100, Math.max(0, (raw / maxTotal) * 100)));

  return {
    score,
    level: levelForScore(score),
    isHot: isHotLead(score),
    breakdown,
  };
}
