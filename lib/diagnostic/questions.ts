import type { OperationalPainSignals } from "@/lib/lead-scoring";

/**
 * DIAGNÓSTICO MULTISITE — definición de preguntas.
 *
 * Cada opción puede aportar puntos de madurez a uno o varios bloques
 * (finance, operations, people, data, scalability). Las preguntas de perfil
 * (centros, facturación, sector, problema) no puntúan madurez: sirven para
 * precargar el formulario de lead y para el lead scoring.
 */

export const DIMENSIONS = ["finance", "operations", "people", "data", "scalability"] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  finance: "Finanzas",
  operations: "Operaciones",
  people: "Personas",
  data: "Datos",
  scalability: "Escalabilidad",
};

export const DIMENSION_DESCRIPTIONS: Record<Dimension, string> = {
  finance: "Visibilidad del P&L y del EBITDA por centro, control del coste de personal y plan de rentabilidad.",
  operations: "Procedimientos comunes, forma de dirigir a los responsables de centro y cuadro de mando operativo.",
  people: "Productividad por empleado, dimensionamiento de plantilla y profesionalización de los managers.",
  data: "KPIs homogéneos, comparativa entre centros y velocidad con la que la dirección obtiene información fiable.",
  scalability: "Capacidad de replicar el modelo: estandarización, benchmarking y plan para absorber nuevos centros.",
};

export type ProfileField = "numberLocations" | "companyRevenue" | "sector" | "mainProblem";

export interface QuestionOption {
  value: string;
  label: string;
  /** Puntos de madurez por bloque. Ausente en preguntas de perfil. */
  points?: Partial<Record<Dimension, number>>;
  /** Señal de dolor operativo para el lead scoring. */
  pain?: Partial<OperationalPainSignals>;
}

export interface Question {
  id: string;
  title: string;
  help?: string;
  options: readonly QuestionOption[];
  /** Si la pregunta es de perfil, indica el campo del lead que precarga. */
  profileField?: ProfileField;
}

export const QUESTIONS: readonly Question[] = [
  {
    id: "q1",
    title: "¿Cuántos centros tiene actualmente tu organización?",
    profileField: "numberLocations",
    options: [
      { value: "1", label: "1" },
      { value: "2-5", label: "2-5" },
      { value: "6-10", label: "6-10" },
      { value: "11-25", label: "11-25" },
      { value: "26-50", label: "26-50" },
      { value: "50+", label: "Más de 50" },
    ],
  },
  {
    id: "q2",
    title: "¿Conocéis el EBITDA individual de cada centro?",
    help: "No la facturación: el resultado real de cada centro después de todos sus costes.",
    options: [
      { value: "yes", label: "Sí, mensualmente y con criterios homogéneos", points: { finance: 10 }, pain: { ebitdaPerCenter: "yes" } },
      { value: "partial", label: "Parcialmente o con retraso", points: { finance: 5 }, pain: { ebitdaPerCenter: "partial" } },
      { value: "no", label: "No", points: { finance: 0 }, pain: { ebitdaPerCenter: "no" } },
    ],
  },
  {
    id: "q3",
    title: "¿Todos los centros utilizan los mismos KPIs?",
    options: [
      { value: "yes", label: "Sí, los mismos indicadores con la misma definición", points: { data: 8, scalability: 6 }, pain: { commonKpis: "yes" } },
      { value: "partial", label: "Parcialmente", points: { data: 4, scalability: 3 }, pain: { commonKpis: "partial" } },
      { value: "no", label: "No", points: { data: 0, scalability: 0 }, pain: { commonKpis: "no" } },
    ],
  },
  {
    id: "q4",
    title: "¿Disponéis de un cuadro de mando semanal o mensual?",
    options: [
      { value: "yes", label: "Sí, se revisa de forma sistemática", points: { data: 8, operations: 6 }, pain: { dashboard: "yes" } },
      { value: "partial", label: "Parcial: informes sueltos o manuales", points: { data: 4, operations: 3 }, pain: { dashboard: "partial" } },
      { value: "no", label: "No", points: { data: 0, operations: 0 }, pain: { dashboard: "no" } },
    ],
  },
  {
    id: "q5",
    title: "¿Existen procedimientos operativos comunes?",
    options: [
      { value: "yes", label: "Sí, documentados y aplicados en todos los centros", points: { operations: 10, scalability: 8 }, pain: { commonProcesses: "yes" } },
      { value: "partial", label: "Parcialmente", points: { operations: 5, scalability: 4 }, pain: { commonProcesses: "partial" } },
      { value: "no", label: "Cada centro funciona diferente", points: { operations: 0, scalability: 0 }, pain: { commonProcesses: "no" } },
    ],
  },
  {
    id: "q6",
    title: "¿Conocéis la productividad por empleado?",
    help: "Por ejemplo: facturación por profesional, por hora trabajada o por puesto.",
    options: [
      { value: "yes", label: "Sí, por centro y por perfil", points: { people: 10 } },
      { value: "partial", label: "Parcial", points: { people: 5 } },
      { value: "no", label: "No", points: { people: 0 } },
    ],
  },
  {
    id: "q7",
    title: "¿Tenéis comparativa entre centros?",
    help: "Ranking o benchmarking interno con los mismos indicadores.",
    options: [
      { value: "yes", label: "Sí, de forma periódica", points: { data: 8, scalability: 6 } },
      { value: "partial", label: "Limitada", points: { data: 4, scalability: 3 } },
      { value: "no", label: "No", points: { data: 0, scalability: 0 } },
    ],
  },
  {
    id: "q8",
    title: "¿Cuánto tarda la dirección en obtener información fiable?",
    options: [
      { value: "realtime", label: "Tiempo real", points: { data: 10 } },
      { value: "1-7", label: "1-7 días", points: { data: 7 } },
      { value: "8-30", label: "8-30 días", points: { data: 3 } },
      { value: "30+", label: "Más de 30 días", points: { data: 0 } },
    ],
  },
  {
    id: "q9",
    title: "¿Habéis adquirido empresas o centros recientemente?",
    options: [
      { value: "yes", label: "Sí", pain: { acquisitions: "yes" } },
      { value: "no", label: "No", pain: { acquisitions: "no" } },
      { value: "considering", label: "Estamos estudiándolo", pain: { acquisitions: "considering" } },
    ],
  },
  {
    id: "q10",
    title: "¿Cómo se gestionan actualmente los responsables de centro?",
    options: [
      { value: "kpis", label: "KPIs claros + reuniones periódicas", points: { operations: 8, people: 8 } },
      { value: "irregular", label: "Seguimiento irregular", points: { operations: 4, people: 4 } },
      { value: "incidents", label: "Principalmente por incidencias", points: { operations: 0, people: 0 } },
    ],
  },
  {
    id: "q11",
    title: "¿Conocéis el coste de personal óptimo por centro?",
    help: "Plantilla objetivo en función de la actividad y la capacidad de cada centro.",
    options: [
      { value: "yes", label: "Sí", points: { finance: 8, people: 6 } },
      { value: "approx", label: "Aproximadamente", points: { finance: 4, people: 3 } },
      { value: "no", label: "No", points: { finance: 0, people: 0 } },
    ],
  },
  {
    id: "q12",
    title: "¿Existe un plan claro para mejorar el EBITDA?",
    options: [
      { value: "yes", label: "Sí, con objetivos, responsables y seguimiento", points: { finance: 8, scalability: 6 } },
      { value: "partial", label: "Parcial", points: { finance: 4, scalability: 3 } },
      { value: "no", label: "No", points: { finance: 0, scalability: 0 } },
    ],
  },
  {
    id: "q13",
    title: "¿Cuál es la facturación anual aproximada del grupo?",
    profileField: "companyRevenue",
    options: [
      { value: "<1M", label: "Menos de 1 M€" },
      { value: "1-5M", label: "1-5 M€" },
      { value: "5-10M", label: "5-10 M€" },
      { value: "10-25M", label: "10-25 M€" },
      { value: "25-50M", label: "25-50 M€" },
      { value: "50M+", label: "Más de 50 M€" },
    ],
  },
  {
    id: "q14",
    title: "¿En qué sector opera tu red?",
    profileField: "sector",
    options: [
      { value: "dental", label: "Dental" },
      { value: "veterinaria", label: "Veterinaria" },
      { value: "healthcare", label: "Healthcare" },
      { value: "retail", label: "Retail" },
      { value: "fitness", label: "Fitness" },
      { value: "automocion", label: "Automoción" },
      { value: "franquicias", label: "Franquicias" },
      { value: "restauracion", label: "Restauración" },
      { value: "private_equity", label: "Private Equity" },
      { value: "otros", label: "Otros" },
    ],
  },
  {
    id: "q15",
    title: "¿Cuál es hoy vuestro principal problema?",
    profileField: "mainProblem",
    options: [
      { value: "rentabilidad", label: "Rentabilidad" },
      { value: "crecimiento", label: "Crecimiento" },
      { value: "equipos", label: "Equipos" },
      { value: "kpis", label: "KPIs" },
      { value: "integracion", label: "Integración" },
      { value: "costes", label: "Costes" },
      { value: "procesos", label: "Procesos" },
      { value: "expansion", label: "Expansión" },
    ],
  },
] as const;

export const QUESTION_IDS = QUESTIONS.map((q) => q.id);
export const TOTAL_QUESTIONS = QUESTIONS.length;

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export function getOption(questionId: string, value: string): QuestionOption | undefined {
  return getQuestion(questionId)?.options.find((o) => o.value === value);
}

/** Máximo de puntos alcanzable por bloque (calculado a partir de las preguntas). */
export const DIMENSION_MAX: Record<Dimension, number> = DIMENSIONS.reduce(
  (acc, dim) => {
    acc[dim] = QUESTIONS.reduce((sum, q) => {
      const best = Math.max(0, ...q.options.map((o) => o.points?.[dim] ?? 0));
      return sum + best;
    }, 0);
    return acc;
  },
  {} as Record<Dimension, number>,
);
