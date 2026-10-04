/**
 * Tipos de dominio compartidos entre UI, validación, scoring y base de datos.
 * Los valores (`value`) son los que se persisten; las etiquetas (`label`) son
 * las que ve el usuario.
 */

export const NUMBER_LOCATIONS = [
  { value: "1", label: "1 centro" },
  { value: "2-5", label: "2-5 centros" },
  { value: "6-10", label: "6-10 centros" },
  { value: "11-25", label: "11-25 centros" },
  { value: "26-50", label: "26-50 centros" },
  { value: "50+", label: "Más de 50 centros" },
] as const;
export type NumberLocations = (typeof NUMBER_LOCATIONS)[number]["value"];

export const COMPANY_REVENUE = [
  { value: "<1M", label: "Menos de 1 M€" },
  { value: "1-5M", label: "1-5 M€" },
  { value: "5-10M", label: "5-10 M€" },
  { value: "10-25M", label: "10-25 M€" },
  { value: "25-50M", label: "25-50 M€" },
  { value: "50M+", label: "Más de 50 M€" },
] as const;
export type CompanyRevenue = (typeof COMPANY_REVENUE)[number]["value"];

export const SECTORS = [
  { value: "dental", label: "Clínicas dentales" },
  { value: "veterinaria", label: "Veterinaria" },
  { value: "healthcare", label: "Healthcare (otras especialidades)" },
  { value: "retail", label: "Retail" },
  { value: "fitness", label: "Fitness / gimnasios" },
  { value: "automocion", label: "Automoción / talleres" },
  { value: "franquicias", label: "Franquicias" },
  { value: "restauracion", label: "Restauración" },
  { value: "private_equity", label: "Private Equity / inversión" },
  { value: "otros", label: "Otros servicios multicentro" },
] as const;
export type Sector = (typeof SECTORS)[number]["value"];

export const MAIN_PROBLEMS = [
  { value: "rentabilidad", label: "Rentabilidad" },
  { value: "crecimiento", label: "Crecimiento" },
  { value: "equipos", label: "Equipos" },
  { value: "kpis", label: "KPIs / información" },
  { value: "integracion", label: "Integración de adquisiciones" },
  { value: "costes", label: "Costes" },
  { value: "procesos", label: "Procesos" },
  { value: "expansion", label: "Expansión" },
] as const;
export type MainProblem = (typeof MAIN_PROBLEMS)[number]["value"];

export const JOB_TITLES = [
  { value: "ceo", label: "CEO" },
  { value: "founder", label: "Fundador/a · Propietario/a" },
  { value: "managing_director", label: "Director/a General · Managing Director" },
  { value: "coo", label: "COO · Director/a de Operaciones" },
  { value: "cfo", label: "CFO · Director/a Financiero/a" },
  { value: "operations_director", label: "Director/a de Operaciones regional" },
  { value: "investment_director", label: "Investment Director · Partner (PE)" },
  { value: "operating_partner", label: "Operating Partner (PE)" },
  { value: "portfolio_manager", label: "Portfolio Manager (PE)" },
  { value: "area_manager", label: "Area Manager · Responsable de zona" },
  { value: "other", label: "Otro cargo" },
] as const;
export type JobTitle = (typeof JOB_TITLES)[number]["value"];

export const LEAD_LEVELS = ["low", "medium", "high", "strategic"] as const;
export type LeadLevel = (typeof LEAD_LEVELS)[number];

export const LEAD_LEVEL_LABELS: Record<LeadLevel, string> = {
  low: "Lead bajo",
  medium: "Lead medio",
  high: "Lead alto",
  strategic: "Lead estratégico",
};

export const LEAD_STATUSES = ["NEW", "CONTACTED", "MEETING", "PROPOSAL", "WON", "LOST"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  MEETING: "Reunión",
  PROPOSAL: "Propuesta",
  WON: "Ganado",
  LOST: "Perdido",
};

export const LEAD_SOURCES = ["diagnostic", "contact", "calculator", "linkedin"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  diagnostic: "Diagnóstico Multisite",
  contact: "Formulario de contacto",
  calculator: "Calculadora EBITDA",
  linkedin: "Landing LinkedIn",
};

export const HOT_LEAD_THRESHOLD = 75;

/** Atribución de marketing capturada en cliente y persistida con el lead. */
export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
}

export function labelFor<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string | null | undefined,
): string {
  if (!value) return "—";
  return list.find((item) => item.value === value)?.label ?? value;
}
