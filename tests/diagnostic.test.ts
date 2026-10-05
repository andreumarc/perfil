import { describe, expect, it } from "vitest";

import {
  RESULT_LEVELS,
  calculateDiagnostic,
  extractPainSignals,
  extractProfile,
  levelForMaturity,
  pointsForAnswer,
  type DiagnosticAnswers,
} from "@/lib/diagnostic/calculate";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_MAX,
  QUESTIONS,
  QUESTION_IDS,
  TOTAL_QUESTIONS,
  getOption,
  getQuestion,
} from "@/lib/diagnostic/questions";
import { COMPANY_REVENUE, MAIN_PROBLEMS, NUMBER_LOCATIONS, SECTORS } from "@/types/lead";

/** Respuestas de perfil neutras (no puntúan madurez). */
const PROFILE: DiagnosticAnswers = {
  q1: "11-25",
  q13: "10-25M",
  q14: "dental",
  q15: "kpis",
};

/** Todas las respuestas de madurez en su mejor opción. q9 = "no" (sin adquisiciones). */
const BEST: DiagnosticAnswers = {
  ...PROFILE,
  q2: "yes",
  q3: "yes",
  q4: "yes",
  q5: "yes",
  q6: "yes",
  q7: "yes",
  q8: "realtime",
  q9: "no",
  q10: "kpis",
  q11: "yes",
  q12: "yes",
};

/** Todas las respuestas de madurez en su peor opción. */
const WORST: DiagnosticAnswers = {
  ...PROFILE,
  q2: "no",
  q3: "no",
  q4: "no",
  q5: "no",
  q6: "no",
  q7: "no",
  q8: "30+",
  q9: "no",
  q10: "incidents",
  q11: "no",
  q12: "no",
};

/** Mezcla: finanzas y personas muy bajas, resto alto. */
const MIXED: DiagnosticAnswers = {
  ...PROFILE,
  q2: "no",
  q3: "yes",
  q4: "yes",
  q5: "yes",
  q6: "no",
  q7: "yes",
  q8: "1-7",
  q9: "considering",
  q10: "kpis",
  q11: "no",
  q12: "no",
};

const unique = <T>(arr: readonly T[]) => new Set(arr).size === arr.length;

describe("QUESTIONS", () => {
  it("contiene 15 preguntas con ids únicos q1..q15 en orden", () => {
    expect(QUESTIONS).toHaveLength(15);
    expect(TOTAL_QUESTIONS).toBe(15);
    expect(QUESTION_IDS).toEqual(Array.from({ length: 15 }, (_, i) => `q${i + 1}`));
    expect(unique(QUESTION_IDS)).toBe(true);
  });

  it("cada pregunta tiene título, ≥ 2 opciones con values únicos y labels no vacíos", () => {
    for (const q of QUESTIONS) {
      expect(q.title.trim().length).toBeGreaterThan(0);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(unique(q.options.map((o) => o.value))).toBe(true);
      for (const o of q.options) {
        expect(o.value.length).toBeGreaterThan(0);
        expect(o.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("las 4 preguntas de perfil son q1, q13, q14 y q15 y no puntúan madurez", () => {
    const profileQuestions = QUESTIONS.filter((q) => q.profileField);
    expect(profileQuestions.map((q) => q.id)).toEqual(["q1", "q13", "q14", "q15"]);
    expect(profileQuestions.map((q) => q.profileField)).toEqual([
      "numberLocations",
      "companyRevenue",
      "sector",
      "mainProblem",
    ]);
    for (const q of profileQuestions) {
      expect(q.options.every((o) => o.points === undefined)).toBe(true);
    }
  });

  it("los values de las preguntas de perfil coinciden con los enums de types/lead.ts", () => {
    const values = (id: string) => getQuestion(id)!.options.map((o) => o.value);
    expect(values("q1")).toEqual(NUMBER_LOCATIONS.map((i) => i.value));
    expect(values("q13")).toEqual(COMPANY_REVENUE.map((i) => i.value));
    expect(new Set(values("q14"))).toEqual(new Set(SECTORS.map((i) => i.value)));
    expect(new Set(values("q15"))).toEqual(new Set(MAIN_PROBLEMS.map((i) => i.value)));
  });

  it("las preguntas de madurez (no perfil, salvo q9) puntúan en al menos una dimensión", () => {
    for (const q of QUESTIONS) {
      if (q.profileField || q.id === "q9") continue;
      const hasPoints = q.options.some((o) => Object.values(o.points ?? {}).some((p) => (p ?? 0) > 0));
      expect(hasPoints, `${q.id} debería puntuar`).toBe(true);
    }
  });

  it("getQuestion / getOption devuelven undefined para ids desconocidos", () => {
    expect(getQuestion("q99")).toBeUndefined();
    expect(getOption("q99", "yes")).toBeUndefined();
    expect(getOption("q2", "maybe")).toBeUndefined();
    expect(getOption("q2", "yes")?.points).toEqual({ finance: 10 });
  });

  it("DIMENSION_MAX es la suma del mejor valor por pregunta y es > 0 en cada bloque", () => {
    for (const dim of DIMENSIONS) {
      const expected = QUESTIONS.reduce(
        (sum, q) => sum + Math.max(0, ...q.options.map((o) => o.points?.[dim] ?? 0)),
        0,
      );
      expect(DIMENSION_MAX[dim]).toBe(expected);
      expect(DIMENSION_MAX[dim]).toBeGreaterThan(0);
    }
  });
});

describe("calculateDiagnostic", () => {
  it("todas las mejores respuestas → 100 en cada dimensión, total 100 y nivel scalable", () => {
    const result = calculateDiagnostic(BEST);
    expect(result.totalScore).toBe(100);
    expect(result.level).toBe("scalable");
    expect(result.answeredCount).toBe(15);
    expect(result.dimensions).toHaveLength(5);
    for (const d of result.dimensions) {
      expect(d.points).toBe(d.max);
      expect(d.score).toBe(100);
    }
    for (const dim of DIMENSIONS) expect(result.scores[dim]).toBe(100);
    expect(result.levelLabel).toBe(RESULT_LEVELS[3].label);
    expect(result.levelSummary).toBe(RESULT_LEVELS[3].summary);
  });

  it("todas las peores respuestas → 0 en cada dimensión, total 0 y nivel reactive", () => {
    const result = calculateDiagnostic(WORST);
    expect(result.totalScore).toBe(0);
    expect(result.level).toBe("reactive");
    expect(result.answeredCount).toBe(15);
    for (const d of result.dimensions) {
      expect(d.points).toBe(0);
      expect(d.score).toBe(0);
    }
    expect(result.levelLabel).toBe(RESULT_LEVELS[0].label);
  });

  it("respuestas mixtas → scores 0-100 y total = media redondeada de los 5 bloques", () => {
    const result = calculateDiagnostic(MIXED);
    expect(result.dimensions.map((d) => d.dimension)).toEqual([...DIMENSIONS]);
    for (const d of result.dimensions) {
      expect(d.score).toBeGreaterThanOrEqual(0);
      expect(d.score).toBeLessThanOrEqual(100);
      expect(d.points).toBeLessThanOrEqual(d.max);
      expect(d.max).toBe(DIMENSION_MAX[d.dimension]);
      expect(d.score).toBe(Math.round((d.points / d.max) * 100));
    }
    const mean = result.dimensions.reduce((acc, d) => acc + d.score, 0) / result.dimensions.length;
    expect(result.totalScore).toBe(Math.round(mean));
    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.totalScore).toBeLessThan(100);
    expect(result.level).toBe(levelForMaturity(result.totalScore).key);
    // Finanzas: q2 no, q11 no, q12 no → 0. Personas: solo q10 kpis (8/24).
    expect(result.scores.finance).toBe(0);
    expect(result.scores.people).toBe(33);
    expect(result.scores.operations).toBe(100);
    expect(result.scores.data).toBe(Math.round(((8 + 8 + 8 + 7) / DIMENSION_MAX.data) * 100));
  });

  it("respuestas incompletas no lanzan y answeredCount es correcto", () => {
    expect(() => calculateDiagnostic({})).not.toThrow();
    const empty = calculateDiagnostic({});
    expect(empty.answeredCount).toBe(0);
    expect(empty.totalScore).toBe(0);
    expect(empty.level).toBe("reactive");
    expect(empty.profile).toEqual({});
    expect(empty.pain).toEqual({});

    const partial = calculateDiagnostic({ q2: "yes", q3: "partial", q1: "2-5" });
    expect(partial.answeredCount).toBe(3);
    expect(partial.scores.finance).toBe(Math.round((10 / DIMENSION_MAX.finance) * 100));
    expect(partial.profile.numberLocations).toBe("2-5");
  });

  it("valores no válidos o preguntas desconocidas se ignoran sin lanzar", () => {
    const result = calculateDiagnostic({ q2: "nope", q99: "yes", q3: "yes" });
    expect(result.answeredCount).toBe(1);
    expect(result.scores.finance).toBe(0);
    expect(result.scores.data).toBe(Math.round((8 / DIMENSION_MAX.data) * 100));
  });
});

describe("levelForMaturity", () => {
  it.each([
    [0, "reactive"],
    [35, "reactive"],
    [36, "structuring"],
    [55, "structuring"],
    [56, "professionalizing"],
    [75, "professionalizing"],
    [76, "scalable"],
    [100, "scalable"],
  ] as const)("score %i → %s", (score, key) => {
    expect(levelForMaturity(score).key).toBe(key);
  });

  it("los niveles cubren 0-100 sin huecos", () => {
    expect(RESULT_LEVELS[0].min).toBe(0);
    expect(RESULT_LEVELS[RESULT_LEVELS.length - 1].max).toBe(100);
    for (let i = 1; i < RESULT_LEVELS.length; i++) {
      expect(RESULT_LEVELS[i].min).toBe(RESULT_LEVELS[i - 1].max + 1);
    }
  });
});

describe("extractPainSignals", () => {
  it("mapea q2/q3/q4/q5/q9 a las señales de dolor operativo", () => {
    expect(
      extractPainSignals({ q2: "no", q3: "partial", q4: "yes", q5: "no", q9: "considering" }),
    ).toEqual({
      ebitdaPerCenter: "no",
      commonKpis: "partial",
      dashboard: "yes",
      commonProcesses: "no",
      acquisitions: "considering",
    });
  });

  it("devuelve un objeto vacío sin respuestas o con respuestas no válidas", () => {
    expect(extractPainSignals({})).toEqual({});
    expect(extractPainSignals({ q2: "invalid", q6: "yes", q1: "50+" })).toEqual({});
  });

  it("q9 'yes' marca adquisición reciente", () => {
    expect(extractPainSignals({ q9: "yes" })).toEqual({ acquisitions: "yes" });
  });
});

describe("extractProfile", () => {
  it("extrae los 4 campos de perfil", () => {
    expect(extractProfile(PROFILE)).toEqual({
      numberLocations: "11-25",
      companyRevenue: "10-25M",
      sector: "dental",
      mainProblem: "kpis",
    });
  });

  it("ignora valores que no existen en las opciones", () => {
    expect(extractProfile({ q1: "999", q13: "10-25M", q14: "banca" })).toEqual({ companyRevenue: "10-25M" });
    expect(extractProfile({})).toEqual({});
  });
});

describe("pointsForAnswer", () => {
  it("suma los puntos de todas las dimensiones de la opción", () => {
    expect(pointsForAnswer("q2", "yes")).toBe(10);
    expect(pointsForAnswer("q3", "yes")).toBe(14); // data 8 + scalability 6
    expect(pointsForAnswer("q5", "partial")).toBe(9); // operations 5 + scalability 4
    expect(pointsForAnswer("q8", "realtime")).toBe(10);
  });

  it("devuelve 0 para preguntas de perfil, q9, opciones sin puntos o desconocidas", () => {
    expect(pointsForAnswer("q1", "50+")).toBe(0);
    expect(pointsForAnswer("q9", "yes")).toBe(0);
    expect(pointsForAnswer("q2", "no")).toBe(0);
    expect(pointsForAnswer("q2", "unknown")).toBe(0);
    expect(pointsForAnswer("q99", "yes")).toBe(0);
  });
});

describe("recommendations", () => {
  it("el headline nombra los dos bloques con menor puntuación", () => {
    const result = calculateDiagnostic(MIXED);
    const { recommendations, scores } = result;
    const ordered = [...DIMENSIONS].sort((a, b) => scores[a] - scores[b]);
    expect(recommendations.focusDimensions).toEqual(ordered.slice(0, 2));
    expect(recommendations.focusDimensions).toEqual(["finance", "people"]);
    expect(recommendations.headline).toContain(DIMENSION_LABELS.finance.toLowerCase());
    expect(recommendations.headline).toContain(DIMENSION_LABELS.people.toLowerCase());
    expect(recommendations.headline).toContain("finanzas");
    expect(recommendations.headline).toContain("personas");
    // El titular incluye la puntuación de cada bloque para que sea específico.
    expect(recommendations.headline).toContain(`(${scores.finance}/100)`);
    expect(recommendations.headline).toContain(`(${scores.people}/100)`);
  });

  it.each([
    ["mejores", BEST],
    ["peores", WORST],
    ["mixtas", MIXED],
    ["vacías", {}],
  ])("con respuestas %s devuelve exactamente 3 problems/opportunities/actions distintos y no vacíos", (_, answers) => {
    const { recommendations } = calculateDiagnostic(answers);
    for (const list of [recommendations.problems, recommendations.opportunities, recommendations.actions]) {
      expect(list).toHaveLength(3);
      expect(unique(list)).toBe(true);
      for (const text of list) {
        expect(typeof text).toBe("string");
        expect(text.trim().length).toBeGreaterThan(0);
      }
    }
    expect(recommendations.focusDimensions).toHaveLength(2);
    expect(recommendations.headline.length).toBeGreaterThan(0);
    expect(recommendations.recommendedService.reason.length).toBeGreaterThan(0);
  });

  it("los problemas priorizan las respuestas negativas concretas", () => {
    const { recommendations } = calculateDiagnostic(MIXED);
    // finance[0] habla del EBITDA por centro (q2 = no).
    expect(recommendations.problems[0]).toMatch(/EBITDA real de cada centro/);
    // people[0] habla de productividad por empleado (q6 = no).
    expect(recommendations.problems[1]).toMatch(/productividad por empleado/);
  });

  describe("recommendedService", () => {
    it("q9 'yes' (adquisición reciente) → integration-100", () => {
      const { recommendations } = calculateDiagnostic({ ...BEST, q9: "yes", q15: "rentabilidad" });
      expect(recommendations.recommendedService.slug).toBe("integration-100");
    });

    it("problema principal 'integracion' → integration-100", () => {
      expect(calculateDiagnostic({ ...WORST, q15: "integracion" }).recommendations.recommendedService.slug).toBe(
        "integration-100",
      );
    });

    it("private_equity: integration-100 solo si estudia una adquisición; si no, audit (¿es real el EBITDA?)", () => {
      expect(
        calculateDiagnostic({ ...WORST, q14: "private_equity", q9: "considering" }).recommendations.recommendedService
          .slug,
      ).toBe("integration-100");
      const pe = calculateDiagnostic({ ...WORST, q14: "private_equity", q9: "no" }).recommendations.recommendedService;
      expect(pe.slug).toBe("multisite-performance-audit");
      expect(pe.reason).toMatch(/participada|target/i);
    });

    it("cada disparador de integration-100 tiene una razón específica", () => {
      const byAcquisition = calculateDiagnostic({ ...BEST, q9: "yes", q15: "rentabilidad" }).recommendations;
      const byProblem = calculateDiagnostic({ ...WORST, q9: "no", q15: "integracion" }).recommendations;
      expect(byAcquisition.recommendedService.reason).not.toBe(byProblem.recommendedService.reason);
    });

    it("sin adquisiciones, madurez alta y problema de rentabilidad → ebitda-improvement", () => {
      const { recommendations, totalScore } = calculateDiagnostic({ ...BEST, q9: "no", q15: "rentabilidad" });
      expect(totalScore).toBeGreaterThanOrEqual(60);
      expect(recommendations.recommendedService.slug).toBe("ebitda-improvement");
      expect(calculateDiagnostic({ ...BEST, q15: "costes" }).recommendations.recommendedService.slug).toBe(
        "ebitda-improvement",
      );
    });

    it("madurez baja con problema de rentabilidad NO recomienda ebitda-improvement", () => {
      const { recommendations } = calculateDiagnostic({ ...WORST, q15: "rentabilidad" });
      expect(recommendations.recommendedService.slug).toBe("multisite-performance-audit");
    });

    it("red grande en crecimiento con madurez suficiente → fractional-coo", () => {
      for (const locations of ["11-25", "26-50", "50+"]) {
        for (const problem of ["crecimiento", "expansion", "equipos"]) {
          const { recommendations } = calculateDiagnostic({
            ...BEST,
            q9: "no",
            q1: locations,
            q14: "retail",
            q15: problem,
          });
          expect(recommendations.recommendedService.slug, `${locations}/${problem}`).toBe("fractional-coo");
        }
      }
    });

    it("red pequeña en crecimiento no llega a fractional-coo → audit por defecto", () => {
      const { recommendations } = calculateDiagnostic({ ...BEST, q9: "no", q1: "2-5", q14: "retail", q15: "crecimiento" });
      expect(recommendations.recommendedService.slug).toBe("multisite-performance-audit");
    });

    it("por defecto → multisite-performance-audit", () => {
      expect(calculateDiagnostic(WORST).recommendations.recommendedService.slug).toBe("multisite-performance-audit");
      expect(calculateDiagnostic({}).recommendations.recommendedService.slug).toBe("multisite-performance-audit");
      expect(calculateDiagnostic({ ...BEST, q15: "kpis" }).recommendations.recommendedService.slug).toBe(
        "multisite-performance-audit",
      );
    });
  });
});
