import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getService } from "@/content/services";
import type { DiagnosticAnswerRow, DiagnosticResultRow } from "@/db/schema";
import { RESULT_LEVELS } from "@/lib/diagnostic/calculate";
import { DIMENSIONS, DIMENSION_LABELS, QUESTIONS, getOption, getQuestion, type Dimension } from "@/lib/diagnostic/questions";
import type { Recommendations } from "@/lib/diagnostic/recommendations";
import { formatDateTime } from "@/lib/utils";

const DIMENSION_COLUMN: Record<Dimension, keyof DiagnosticResultRow> = {
  finance: "financeScore",
  operations: "operationsScore",
  people: "peopleScore",
  data: "dataScore",
  scalability: "scalabilityScore",
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

/** Cast seguro del jsonb de recomendaciones: solo devuelve los campos con el tipo esperado. */
function asRecommendations(value: unknown): Partial<Recommendations> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const v = value as Record<string, unknown>;
  const out: Partial<Recommendations> = {};
  if (typeof v.headline === "string") out.headline = v.headline;
  if (isStringArray(v.problems)) out.problems = v.problems;
  if (isStringArray(v.opportunities)) out.opportunities = v.opportunities;
  if (isStringArray(v.actions)) out.actions = v.actions;
  const rs = v.recommendedService;
  if (rs && typeof rs === "object" && !Array.isArray(rs)) {
    const r = rs as Record<string, unknown>;
    if (typeof r.slug === "string" && typeof r.reason === "string") {
      out.recommendedService = {
        slug: r.slug as Recommendations["recommendedService"]["slug"],
        reason: r.reason,
      };
    }
  }
  return out;
}

function InsightList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-2 space-y-2 text-sm text-gray-700">
        {items.map((item) => (
          <li key={item} className="border-l-2 border-gray-200 pl-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiagnosticSection({
  result,
  answers,
  message,
}: {
  result: DiagnosticResultRow | null;
  answers: DiagnosticAnswerRow[];
  message: string | null;
}) {
  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Diagnóstico Multisite</CardTitle>
          <CardDescription>Este lead no realizó el diagnóstico.</CardDescription>
        </CardHeader>
        {message ? (
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Mensaje del formulario</p>
            <blockquote className="mt-2 border-l-2 border-signal pl-4 text-sm whitespace-pre-wrap text-navy-900">
              {message}
            </blockquote>
          </CardContent>
        ) : null}
      </Card>
    );
  }

  const level = RESULT_LEVELS.find((l) => l.key === result.resultLevel);
  const rec = asRecommendations(result.recommendations);
  const service = rec.recommendedService ? getService(rec.recommendedService.slug) : undefined;
  const answersById = new Map(answers.map((a) => [a.questionId, a]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagnóstico Multisite</CardTitle>
        <CardDescription>
          Completado el {formatDateTime(result.createdAt)} · {answers.length} de {QUESTIONS.length} respuestas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,260px)_1fr]">
          <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Madurez operativa</p>
            <p className="mt-2 flex items-baseline gap-1">
              <span className="tabular text-4xl font-semibold tracking-tight text-navy-900">{result.totalScore}</span>
              <span className="text-sm text-gray-500">/100</span>
            </p>
            <p className="mt-2 text-sm font-medium text-navy-900">{level?.label ?? result.resultLevel}</p>
            {level ? <p className="mt-1 text-xs leading-relaxed text-gray-600">{level.summary}</p> : null}
          </div>

          <ul className="space-y-4">
            {DIMENSIONS.map((dim) => {
              const raw = result[DIMENSION_COLUMN[dim]];
              const value = typeof raw === "number" ? raw : 0;
              return (
                <li key={dim}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-navy-900">{DIMENSION_LABELS[dim]}</span>
                    <span className="tabular text-gray-700">{value}/100</span>
                  </div>
                  <Progress
                    value={value}
                    className="mt-1.5"
                    indicatorClassName={value < 40 ? "bg-red-500" : value < 70 ? "bg-navy-400" : "bg-signal"}
                    aria-label={`${DIMENSION_LABELS[dim]}: ${value} de 100`}
                  />
                </li>
              );
            })}
          </ul>
        </div>

        {rec.headline || rec.problems?.length || rec.opportunities?.length || rec.actions?.length ? (
          <div className="space-y-5">
            {rec.headline ? <p className="font-display text-lg text-navy-900 md:text-xl">{rec.headline}</p> : null}
            <div className="grid gap-6 md:grid-cols-3">
              {rec.problems?.length ? <InsightList title="Problemas" items={rec.problems} /> : null}
              {rec.opportunities?.length ? <InsightList title="Oportunidades" items={rec.opportunities} /> : null}
              {rec.actions?.length ? <InsightList title="Acciones" items={rec.actions} /> : null}
            </div>
            {rec.recommendedService ? (
              <div className="flex flex-col gap-2 rounded-lg border border-navy-100 bg-navy-50 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Servicio recomendado</p>
                  <p className="mt-1 font-semibold text-navy-900">{service?.name ?? rec.recommendedService.slug}</p>
                  <p className="mt-1 text-sm text-gray-700">{rec.recommendedService.reason}</p>
                </div>
                {service ? (
                  <Link
                    href={`/servicios/${service.slug}`}
                    target="_blank"
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-navy-700 hover:underline"
                  >
                    Ver servicio
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Respuestas</p>
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Pregunta</TableHead>
                  <TableHead>Respuesta</TableHead>
                  <TableHead className="w-20 text-right">Puntos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {QUESTIONS.map((q, index) => {
                  const row = answersById.get(q.id);
                  const question = getQuestion(q.id);
                  const option = row ? getOption(q.id, row.answer) : undefined;
                  const scored = Boolean(option?.points);
                  return (
                    <TableRow key={q.id}>
                      <TableCell className="tabular text-gray-500">{index + 1}</TableCell>
                      <TableCell className="max-w-[360px] whitespace-normal text-gray-700">{question?.title ?? q.id}</TableCell>
                      <TableCell className="max-w-[320px] whitespace-normal">
                        {row ? (
                          <span className="font-medium text-navy-900">{option?.label ?? row.answer}</span>
                        ) : (
                          <span className="text-gray-400">Sin respuesta</span>
                        )}
                      </TableCell>
                      <TableCell className="tabular text-right text-gray-700">
                        {row && scored ? row.points : <span className="text-gray-400">—</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {message ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Mensaje del formulario</p>
            <blockquote className="mt-2 border-l-2 border-signal pl-4 text-sm whitespace-pre-wrap text-navy-900">
              {message}
            </blockquote>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
