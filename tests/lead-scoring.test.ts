import { describe, expect, it } from "vitest";

import {
  LEAD_LEVEL_THRESHOLDS,
  SCORING_WEIGHTS,
  isHotLead,
  isPrivateEquityLead,
  levelForScore,
  scoreLead,
  scoreOperationalPain,
  type LeadScoringInput,
  type OperationalPainSignals,
} from "@/lib/lead-scoring";
import { HOT_LEAD_THRESHOLD, LEAD_LEVELS } from "@/types/lead";

const maxOf = (record: Record<string, number>) => Math.max(...Object.values(record));

const STRATEGIC_LEAD: LeadScoringInput = {
  numberLocations: "50+",
  companyRevenue: "50M+",
  jobTitle: "ceo",
  sector: "dental",
  mainProblem: "rentabilidad",
  pain: {
    ebitdaPerCenter: "no",
    commonKpis: "no",
    dashboard: "no",
    commonProcesses: "no",
    acquisitions: "yes",
  },
};

const MEDIUM_LEAD: LeadScoringInput = {
  numberLocations: "6-10",
  companyRevenue: "5-10M",
  jobTitle: "cfo",
  sector: "retail",
  mainProblem: "kpis",
};

describe("SCORING_WEIGHTS", () => {
  it("los pesos máximos suman exactamente 100", () => {
    const total =
      maxOf(SCORING_WEIGHTS.locations) +
      maxOf(SCORING_WEIGHTS.revenue) +
      maxOf(SCORING_WEIGHTS.role) +
      maxOf(SCORING_WEIGHTS.sector) +
      maxOf(SCORING_WEIGHTS.mainProblem) +
      SCORING_WEIGHTS.operationalPainMax +
      SCORING_WEIGHTS.privateEquity;
    expect(total).toBe(100);
  });

  it("el reparto documentado se respeta (25/25/15/5/5/20/5)", () => {
    expect(maxOf(SCORING_WEIGHTS.locations)).toBe(25);
    expect(maxOf(SCORING_WEIGHTS.revenue)).toBe(25);
    expect(maxOf(SCORING_WEIGHTS.role)).toBe(15);
    expect(maxOf(SCORING_WEIGHTS.sector)).toBe(5);
    expect(maxOf(SCORING_WEIGHTS.mainProblem)).toBe(5);
    expect(SCORING_WEIGHTS.operationalPainMax).toBe(20);
    expect(SCORING_WEIGHTS.privateEquity).toBe(5);
  });

  it("los umbrales de nivel cubren 0-100 sin huecos ni solapes", () => {
    const sorted = [...LEAD_LEVEL_THRESHOLDS].sort((a, b) => a.min - b.min);
    expect(sorted[0].min).toBe(0);
    expect(sorted[sorted.length - 1].max).toBe(100);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].min).toBe(sorted[i - 1].max + 1);
    }
    expect(sorted.map((t) => t.level)).toEqual([...LEAD_LEVELS]);
  });
});

describe("scoreLead", () => {
  it("con todo vacío devuelve 0, nivel low y no es hot", () => {
    const result = scoreLead({});
    expect(result.score).toBe(0);
    expect(result.level).toBe("low");
    expect(result.isHot).toBe(false);
    expect(result.breakdown.every((b) => b.points === 0)).toBe(true);
  });

  it("acepta nulls explícitos igual que campos ausentes", () => {
    const result = scoreLead({
      numberLocations: null,
      companyRevenue: null,
      jobTitle: null,
      sector: null,
      mainProblem: null,
      pain: null,
    });
    expect(result.score).toBe(0);
    expect(result.level).toBe("low");
  });

  it("un lead estratégico (50+ centros, 50M+, CEO, dental, rentabilidad, dolor máximo) puntúa ≥ 81, strategic y hot", () => {
    const result = scoreLead(STRATEGIC_LEAD);
    expect(result.score).toBeGreaterThanOrEqual(81);
    expect(result.score).toBe(95); // 25 + 25 + 15 + 5 + 5 + 20 + 0 (no PE)
    expect(result.level).toBe("strategic");
    expect(result.isHot).toBe(true);
  });

  it("un lead estratégico de Private Equity alcanza el máximo de 100", () => {
    const result = scoreLead({ ...STRATEGIC_LEAD, jobTitle: "operating_partner", sector: "private_equity" });
    expect(result.score).toBe(100);
    expect(result.level).toBe("strategic");
    expect(result.isHot).toBe(true);
  });

  it("un lead medio (6-10 centros, 5-10M, CFO, retail, kpis) queda en nivel medium y no es hot", () => {
    const result = scoreLead(MEDIUM_LEAD);
    expect(result.score).toBe(40); // 10 + 10 + 12 + 4 + 4
    expect(result.level).toBe("medium");
    expect(result.isHot).toBe(false);
  });

  it("el breakdown tiene 7 items con las claves esperadas y máximos coherentes", () => {
    const result = scoreLead(MEDIUM_LEAD);
    expect(result.breakdown).toHaveLength(7);
    expect(result.breakdown.map((b) => b.key)).toEqual([
      "locations",
      "revenue",
      "role",
      "sector",
      "mainProblem",
      "operationalPain",
      "privateEquity",
    ]);
    const maxTotal = result.breakdown.reduce((acc, b) => acc + b.max, 0);
    expect(maxTotal).toBe(100);
    for (const item of result.breakdown) {
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.points).toBeGreaterThanOrEqual(0);
      expect(item.points).toBeLessThanOrEqual(item.max);
    }
  });

  it("la suma de puntos del breakdown coincide con el score (max total = 100)", () => {
    const inputs: LeadScoringInput[] = [
      {},
      MEDIUM_LEAD,
      STRATEGIC_LEAD,
      { ...STRATEGIC_LEAD, jobTitle: "operating_partner", sector: "private_equity" },
      { numberLocations: "2-5", jobTitle: "other", pain: { ebitdaPerCenter: "partial" } },
      { sector: "private_equity" },
    ];
    for (const input of inputs) {
      const result = scoreLead(input);
      const sum = result.breakdown.reduce((acc, b) => acc + b.points, 0);
      expect(result.score).toBe(sum);
    }
  });

  it("el score siempre está acotado entre 0 y 100", () => {
    for (const input of [{}, MEDIUM_LEAD, STRATEGIC_LEAD]) {
      const { score } = scoreLead(input);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });
});

describe("levelForScore", () => {
  it.each([
    [0, "low"],
    [30, "low"],
    [31, "medium"],
    [60, "medium"],
    [61, "high"],
    [80, "high"],
    [81, "strategic"],
    [100, "strategic"],
  ] as const)("score %i → %s", (score, level) => {
    expect(levelForScore(score)).toBe(level);
  });

  it("redondea antes de clasificar", () => {
    expect(levelForScore(30.4)).toBe("low");
    expect(levelForScore(30.6)).toBe("medium");
    expect(levelForScore(80.5)).toBe("strategic");
  });

  it("fuera de rango: >100 es strategic y <0 es low", () => {
    expect(levelForScore(101)).toBe("strategic");
    expect(levelForScore(-5)).toBe("low");
  });
});

describe("isHotLead", () => {
  it("usa el umbral HOT_LEAD_THRESHOLD (75)", () => {
    expect(HOT_LEAD_THRESHOLD).toBe(75);
    expect(isHotLead(75)).toBe(true);
    expect(isHotLead(74)).toBe(false);
    expect(isHotLead(100)).toBe(true);
    expect(isHotLead(0)).toBe(false);
  });
});

describe("scoreOperationalPain", () => {
  const w = SCORING_WEIGHTS.operationalPain;

  it("sin señales devuelve 0", () => {
    expect(scoreOperationalPain(null)).toBe(0);
    expect(scoreOperationalPain(undefined)).toBe(0);
    expect(scoreOperationalPain({})).toBe(0);
  });

  it("las respuestas positivas no aportan dolor", () => {
    expect(
      scoreOperationalPain({
        ebitdaPerCenter: "yes",
        commonKpis: "yes",
        dashboard: "yes",
        commonProcesses: "yes",
        acquisitions: "no",
      }),
    ).toBe(0);
  });

  it("suma correctamente los parciales", () => {
    const partial: OperationalPainSignals = {
      ebitdaPerCenter: "partial",
      commonKpis: "partial",
      dashboard: "partial",
      commonProcesses: "partial",
      acquisitions: "considering",
    };
    expect(scoreOperationalPain(partial)).toBe(
      w.partialEbitdaPerCenter +
        w.partialCommonKpis +
        w.partialDashboard +
        w.partialProcesses +
        w.consideringAcquisition,
    );
    expect(scoreOperationalPain(partial)).toBe(11);
  });

  it("suma correctamente una combinación mixta", () => {
    expect(scoreOperationalPain({ ebitdaPerCenter: "no", acquisitions: "considering" })).toBe(
      w.noEbitdaPerCenter + w.consideringAcquisition,
    );
    expect(scoreOperationalPain({ dashboard: "no", commonProcesses: "partial" })).toBe(
      w.noDashboard + w.partialProcesses,
    );
  });

  it("nunca supera operationalPainMax (20)", () => {
    const worst: OperationalPainSignals = {
      ebitdaPerCenter: "no",
      commonKpis: "no",
      dashboard: "no",
      commonProcesses: "no",
      acquisitions: "yes",
    };
    const rawSum =
      w.noEbitdaPerCenter + w.noCommonKpis + w.noDashboard + w.differentProcesses + w.recentAcquisition;
    expect(rawSum).toBeGreaterThanOrEqual(SCORING_WEIGHTS.operationalPainMax);
    expect(scoreOperationalPain(worst)).toBe(SCORING_WEIGHTS.operationalPainMax);
    expect(scoreOperationalPain(worst)).toBeLessThanOrEqual(20);
  });
});

describe("isPrivateEquityLead", () => {
  it("detecta PE por sector", () => {
    expect(isPrivateEquityLead({ sector: "private_equity" })).toBe(true);
    expect(isPrivateEquityLead({ sector: "private_equity", jobTitle: "ceo" })).toBe(true);
  });

  it("detecta PE por rol", () => {
    expect(isPrivateEquityLead({ jobTitle: "investment_director" })).toBe(true);
    expect(isPrivateEquityLead({ jobTitle: "operating_partner" })).toBe(true);
    expect(isPrivateEquityLead({ jobTitle: "portfolio_manager" })).toBe(true);
    expect(isPrivateEquityLead({ jobTitle: "operating_partner", sector: "dental" })).toBe(true);
  });

  it("no detecta PE en un CEO de dental ni con datos vacíos", () => {
    expect(isPrivateEquityLead({ jobTitle: "ceo", sector: "dental" })).toBe(false);
    expect(isPrivateEquityLead({})).toBe(false);
    expect(isPrivateEquityLead({ jobTitle: null, sector: null })).toBe(false);
  });

  it("aporta los 5 puntos de privateEquity en el breakdown", () => {
    const result = scoreLead({ jobTitle: "portfolio_manager" });
    const pe = result.breakdown.find((b) => b.key === "privateEquity");
    expect(pe?.points).toBe(SCORING_WEIGHTS.privateEquity);
    expect(result.score).toBe(SCORING_WEIGHTS.role.portfolio_manager + SCORING_WEIGHTS.privateEquity);
  });
});
