import type { OperationalPainSignals } from "@/lib/lead-scoring";
import type { CompanyRevenue, MainProblem, NumberLocations, Sector } from "@/types/lead";

import {
  DIMENSIONS,
  DIMENSION_MAX,
  QUESTIONS,
  getOption,
  type Dimension,
} from "./questions";
import { buildRecommendations, type Recommendations } from "./recommendations";

export type DiagnosticAnswers = Record<string, string>;

export const RESULT_LEVELS = [
  {
    key: "reactive",
    min: 0,
    max: 35,
    label: "Organización en fase reactiva",
    summary:
      "La red se gestiona por intuición e incidencias. La dirección no dispone de datos comparables por centro y cada unidad funciona con criterios propios.",
  },
  {
    key: "structuring",
    min: 36,
    max: 55,
    label: "Organización en fase de estructuración",
    summary:
      "Existen algunos indicadores y procedimientos, pero no son homogéneos ni se revisan de forma sistemática. La rentabilidad real por centro todavía es parcialmente desconocida.",
  },
  {
    key: "professionalizing",
    min: 56,
    max: 75,
    label: "Organización en fase de profesionalización",
    summary:
      "La red cuenta con P&L y KPIs razonablemente consolidados. El potencial está en cerrar los huecos de estandarización, acelerar la información y convertir los datos en decisiones.",
  },
  {
    key: "scalable",
    min: 76,
    max: 100,
    label: "Organización escalable",
    summary:
      "Modelo operativo maduro, con información fiable y una única forma de operar. El foco pasa a la optimización fina del EBITDA y a absorber nuevos centros sin perder control.",
  },
] as const;

export type ResultLevelKey = (typeof RESULT_LEVELS)[number]["key"];

export interface DimensionScore {
  dimension: Dimension;
  points: number;
  max: number;
  /** 0-100 */
  score: number;
}

export interface DiagnosticProfile {
  numberLocations?: NumberLocations;
  companyRevenue?: CompanyRevenue;
  sector?: Sector;
  mainProblem?: MainProblem;
}

export interface DiagnosticResult {
  totalScore: number;
  level: ResultLevelKey;
  levelLabel: string;
  levelSummary: string;
  dimensions: DimensionScore[];
  /** Puntuación 0-100 por bloque, en el orden de DIMENSIONS. */
  scores: Record<Dimension, number>;
  recommendations: Recommendations;
  pain: OperationalPainSignals;
  profile: DiagnosticProfile;
  answeredCount: number;
}

export function levelForMaturity(score: number) {
  const s = Math.round(score);
  return RESULT_LEVELS.find((l) => s >= l.min && s <= l.max) ?? RESULT_LEVELS[0];
}

/** Extrae las señales de dolor operativo (para el lead scoring) de las respuestas. */
export function extractPainSignals(answers: DiagnosticAnswers): OperationalPainSignals {
  const pain: OperationalPainSignals = {};
  for (const q of QUESTIONS) {
    const value = answers[q.id];
    if (!value) continue;
    const option = getOption(q.id, value);
    if (option?.pain) Object.assign(pain, option.pain);
  }
  return pain;
}

/** Extrae los campos de perfil (centros, facturación, sector, problema). */
export function extractProfile(answers: DiagnosticAnswers): DiagnosticProfile {
  const profile: DiagnosticProfile = {};
  for (const q of QUESTIONS) {
    if (!q.profileField) continue;
    const value = answers[q.id];
    if (!value || !getOption(q.id, value)) continue;
    switch (q.profileField) {
      case "numberLocations":
        profile.numberLocations = value as NumberLocations;
        break;
      case "companyRevenue":
        profile.companyRevenue = value as CompanyRevenue;
        break;
      case "sector":
        profile.sector = value as Sector;
        break;
      case "mainProblem":
        profile.mainProblem = value as MainProblem;
        break;
    }
  }
  return profile;
}

/** Puntos obtenidos por cada respuesta (para persistir en diagnostic_answers). */
export function pointsForAnswer(questionId: string, value: string): number {
  const option = getOption(questionId, value);
  if (!option?.points) return 0;
  return Object.values(option.points).reduce((a, b) => a + (b ?? 0), 0);
}

/**
 * Calcula el resultado completo del diagnóstico a partir de las respuestas.
 * Las preguntas sin responder puntúan 0 (el máximo no cambia), lo que penaliza
 * diagnósticos incompletos de forma coherente.
 */
export function calculateDiagnostic(answers: DiagnosticAnswers): DiagnosticResult {
  const totals: Record<Dimension, number> = {
    finance: 0,
    operations: 0,
    people: 0,
    data: 0,
    scalability: 0,
  };

  let answeredCount = 0;
  for (const q of QUESTIONS) {
    const value = answers[q.id];
    if (!value) continue;
    const option = getOption(q.id, value);
    if (!option) continue;
    answeredCount += 1;
    if (!option.points) continue;
    for (const dim of DIMENSIONS) {
      totals[dim] += option.points[dim] ?? 0;
    }
  }

  const dimensions: DimensionScore[] = DIMENSIONS.map((dimension) => {
    const max = DIMENSION_MAX[dimension];
    const points = totals[dimension];
    const score = max > 0 ? Math.round((points / max) * 100) : 0;
    return { dimension, points, max, score };
  });

  const scores = dimensions.reduce(
    (acc, d) => {
      acc[d.dimension] = d.score;
      return acc;
    },
    {} as Record<Dimension, number>,
  );

  const totalScore = Math.round(
    dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length,
  );

  const level = levelForMaturity(totalScore);
  const pain = extractPainSignals(answers);
  const profile = extractProfile(answers);
  const recommendations = buildRecommendations({ scores, answers, pain, profile });

  return {
    totalScore,
    level: level.key,
    levelLabel: level.label,
    levelSummary: level.summary,
    dimensions,
    scores,
    recommendations,
    pain,
    profile,
    answeredCount,
  };
}
