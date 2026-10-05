import { HotBadge, LevelBadge } from "@/components/admin/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Lead } from "@/db/schema";
import { extractPainSignals, type DiagnosticAnswers } from "@/lib/diagnostic/calculate";
import { scoreLead } from "@/lib/lead-scoring";
import {
  COMPANY_REVENUE,
  HOT_LEAD_THRESHOLD,
  JOB_TITLES,
  MAIN_PROBLEMS,
  NUMBER_LOCATIONS,
  SECTORS,
  type CompanyRevenue,
  type JobTitle,
  type MainProblem,
  type NumberLocations,
  type Sector,
} from "@/types/lead";

/** Devuelve el valor solo si pertenece a la lista de opciones (los datos vienen de la DB como string). */
function asEnum<T extends string>(list: readonly { value: T }[], value: string | null | undefined): T | null {
  if (!value) return null;
  return list.some((o) => o.value === value) ? (value as T) : null;
}

export function ScoreCard({ lead, answers }: { lead: Lead; answers: DiagnosticAnswers }) {
  const recalculated = scoreLead({
    numberLocations: asEnum<NumberLocations>(NUMBER_LOCATIONS, lead.numberLocations),
    companyRevenue: asEnum<CompanyRevenue>(COMPANY_REVENUE, lead.companyRevenue),
    jobTitle: asEnum<JobTitle>(JOB_TITLES, lead.jobTitle),
    sector: asEnum<Sector>(SECTORS, lead.sector),
    mainProblem: asEnum<MainProblem>(MAIN_PROBLEMS, lead.mainProblem),
    pain: extractPainSignals(answers),
  });
  const differs = recalculated.score !== lead.score;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Score <span className="tabular">{lead.score}</span>
          <span className="font-normal text-gray-500">/100</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="tabular text-4xl font-semibold tracking-tight text-navy-900">{lead.score}</span>
          <div className="flex flex-col items-start gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <LevelBadge level={lead.leadLevel} />
              <HotBadge isHot={lead.isHot} />
            </div>
            <span className="text-xs text-gray-500">HOT lead a partir de {HOT_LEAD_THRESHOLD} puntos</span>
          </div>
        </div>
        <Progress
          value={lead.score}
          aria-label={`Score ${lead.score} de 100`}
          indicatorClassName={lead.isHot ? "bg-red-600" : undefined}
        />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Desglose</p>
          <ul className="mt-3 space-y-3">
            {recalculated.breakdown.map((item) => {
              const pct = item.max > 0 ? Math.round((item.points / item.max) * 100) : 0;
              return (
                <li key={item.key}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="tabular text-navy-900">
                      {item.points}
                      <span className="text-gray-400">/{item.max}</span>
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className="mt-1 h-1"
                    indicatorClassName={pct >= 60 ? "bg-signal" : "bg-navy-400"}
                    aria-label={`${item.label}: ${item.points} de ${item.max}`}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        {differs ? (
          <p className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Score guardado: <span className="tabular font-semibold">{lead.score}</span> · recalculado:{" "}
            <span className="tabular font-semibold">{recalculated.score}</span>. Los pesos del scoring han cambiado
            desde que se creó el lead.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
