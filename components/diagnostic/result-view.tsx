import Link from "next/link";
import { ArrowRightIcon, CalendarCheckIcon, LinkIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { DimensionBars } from "@/components/diagnostic/dimension-bars";
import { CopyResultLink } from "@/components/diagnostic/result-actions";
import { ScoreGauge } from "@/components/diagnostic/score-gauge";
import { Button } from "@/components/ui/button";
import { getService } from "@/content/services";
import type { DiagnosticResult } from "@/lib/diagnostic/calculate";
import type { LeadScore } from "@/lib/lead-scoring";
import { meetingHref, site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface ResultViewProps {
  result: DiagnosticResult;
  /** Lead score interno: se acepta para tipado, pero nunca se muestra. */
  score?: LeadScore;
  firstName?: string;
  company?: string;
  email?: string;
  resultToken?: string | null;
  persisted?: boolean;
  className?: string;
}

function InsightColumn({ eyebrow, title, items }: { eyebrow: string; title: string; items: string[] }) {
  return (
    <div>
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-2 text-lg font-semibold text-navy-900">{title}</h3>
      <ol className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={item} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
            <span className="tabular shrink-0 text-sm font-semibold text-signal">0{index + 1}</span>
            <p className="text-sm leading-relaxed text-gray-700">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Resultado completo del Diagnóstico Multisite. Sin hooks: lo renderiza el
 * wizard (cliente) y la página privada /diagnostico/resultado/[token] (servidor).
 */
export function ResultView({ result, firstName, company, email, resultToken, persisted, className }: ResultViewProps) {
  const { recommendations } = result;
  const service = getService(recommendations.recommendedService.slug);
  const serviceHref = `/servicios/${recommendations.recommendedService.slug}`;
  const resultPath = resultToken ? `/diagnostico/resultado/${resultToken}` : null;

  return (
    <div className={cn("space-y-12", className)}>
      {/* 1. Cabecera: puntuación y nivel */}
      <section aria-labelledby="diag-result-title" className="rounded-lg border border-gray-200 bg-white p-6 md:p-10">
        <p className="eyebrow">Madurez operativa</p>
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <ScoreGauge value={result.totalScore} className="mx-auto lg:mx-0" />
          <div>
            {firstName && company ? (
              <p className="text-sm font-medium text-gray-500">
                {firstName}, este es el diagnóstico de {company}.
              </p>
            ) : null}
            <h2 id="diag-result-title" className="font-display mt-2 text-3xl leading-tight text-navy-900 md:text-4xl">
              {result.levelLabel}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">{result.levelSummary}</p>
            {email ? (
              <p className="mt-4 text-sm text-gray-500">Te hemos enviado una copia a {email}.</p>
            ) : null}
            {persisted === false ? (
              <p className="mt-2 text-xs text-gray-500">Resultado calculado en tiempo real.</p>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. Cinco bloques */}
      <section aria-labelledby="diag-dimensions-title">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h3 id="diag-dimensions-title" className="text-xl font-semibold text-navy-900">
            Puntuación por bloque
          </h3>
          <p className="text-sm text-gray-500">
            Los bloques marcados como prioridad concentran el mayor potencial de mejora.
          </p>
        </div>
        <DimensionBars dimensions={result.dimensions} focus={recommendations.focusDimensions} className="mt-6" />
      </section>

      {/* 3. Titular de recomendación */}
      <section className="rounded-lg bg-navy-900 p-6 text-white md:p-8">
        <p className="eyebrow text-navy-200">Lectura ejecutiva</p>
        <p className="font-display mt-3 text-xl leading-snug md:text-2xl">{recommendations.headline}</p>
      </section>

      {/* 4. Problemas / oportunidades / acciones */}
      <section aria-label="Problemas, oportunidades y acciones" className="grid gap-8 md:grid-cols-3">
        <InsightColumn eyebrow="Diagnóstico" title="3 problemas detectados" items={recommendations.problems} />
        <InsightColumn eyebrow="Potencial" title="3 oportunidades" items={recommendations.opportunities} />
        <InsightColumn eyebrow="Plan" title="3 acciones prioritarias" items={recommendations.actions} />
      </section>

      {/* 5. Servicio recomendado */}
      {service ? (
        <section aria-labelledby="diag-service-title" className="rounded-lg border border-navy-100 bg-navy-50 p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow">Servicio recomendado</p>
              <h3 id="diag-service-title" className="font-display mt-2 text-2xl text-navy-900">
                {service.name}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-700">{recommendations.recommendedService.reason}</p>
              <p className="mt-3 text-sm text-gray-500">
                <span className="font-semibold text-navy-900">{service.priceLabel}</span> · {service.format}
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="w-full lg:w-auto">
              <TrackedLink href={serviceHref} event="cta_clicked" props={{ location: "diagnostic_result_service" }}>
                Ver el servicio recomendado
                <ArrowRightIcon />
              </TrackedLink>
            </Button>
          </div>
        </section>
      ) : null}

      {/* 6. CTA principal */}
      <section aria-labelledby="diag-cta-title" className="rounded-lg border border-gray-200 bg-white p-6 md:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Siguiente paso</p>
          <h3 id="diag-cta-title" className="font-display mt-3 text-2xl leading-tight text-navy-900 md:text-3xl">
            Revisemos juntos qué palancas tendrían más impacto en vuestro EBITDA.
          </h3>
          <p className="mt-4 text-base text-gray-600">
            Una sesión de 30 minutos para leer estos resultados sobre vuestro P&amp;L real y decidir si tiene
            sentido ir más allá. Sin compromiso.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: "diagnostic_result" }}>
                <CalendarCheckIcon />
                Solicitar una sesión estratégica de 30 minutos
              </TrackedLink>
            </Button>
            <Button asChild variant="link" size="lg">
              <TrackedLink href={serviceHref} event="cta_clicked" props={{ location: "diagnostic_result_cta_secondary" }}>
                Ver el servicio recomendado
              </TrackedLink>
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            <Link href="/calculadora-ebitda" className="underline underline-offset-4 hover:text-navy-900">
              Compara también tu P&amp;L con la calculadora EBITDA
            </Link>
          </p>
        </div>
      </section>

      {/* 7. Guardar o compartir */}
      {resultPath ? (
        <section aria-labelledby="diag-share-title" className="border-t border-gray-200 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p id="diag-share-title" className="text-sm font-semibold text-navy-900">
                Guardar o compartir este resultado
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Enlace privado, no indexable. Compártelo con tu equipo directivo o con tu inversor.
              </p>
              <Link
                href={resultPath}
                className="mt-2 inline-flex items-center gap-1.5 text-sm text-navy-700 underline underline-offset-4 hover:text-navy-900"
              >
                <LinkIcon className="size-3.5" />
                Abrir enlace del resultado
              </Link>
            </div>
            <CopyResultLink url={`${site.url}${resultPath}`} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
