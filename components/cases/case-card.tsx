import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CASE_BADGE_LABEL, type Case } from "@/content/cases";
import { getService } from "@/content/services";
import { primaryCta } from "@/lib/site";
import { cn } from "@/lib/utils";

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

/**
 * Tarjeta expandible de un caso de intervención. Cabecera y cierre siempre
 * visibles (situación, servicio relacionado y CTA); detalle en <details> sin JS.
 * Todo el caso lleva el ancla `id={slug}`.
 */
export function CaseCard({ item, index, className }: { item: Case; index: number; className?: string }) {
  const service = getService(item.relatedService);

  return (
    <article
      id={item.slug}
      aria-labelledby={`${item.slug}-title`}
      className={cn("scroll-mt-28 overflow-hidden rounded-lg border border-gray-200 bg-white", className)}
    >
      {/* Cabecera: siempre visible ----------------------------------------- */}
      <header className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="signal">{CASE_BADGE_LABEL}</Badge>
            <Badge variant="secondary">{item.sector}</Badge>
          </div>
          <p className="font-display tabular mt-6 text-5xl leading-none text-navy-200">{pad(index)}</p>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Red</dt>
              <dd className="mt-1 leading-snug text-gray-700">{item.context}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Horizonte</dt>
              <dd className="mt-1 leading-snug text-gray-700">{item.horizon}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Palancas</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {item.levers.map((lever) => (
                  <span
                    key={lever}
                    className="rounded-sm border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700"
                  >
                    {lever}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h2
            id={`${item.slug}-title`}
            className="font-display text-2xl leading-[1.15] text-navy-900 sm:text-3xl md:text-[2.125rem]"
          >
            {item.title}
          </h2>
          <p className="eyebrow mt-7">Situación de partida</p>
          <p className="mt-3 text-base leading-relaxed text-gray-700 md:text-lg">{item.situation}</p>
        </div>
      </header>

      {/* Detalle: expandible ------------------------------------------------ */}
      <details className="group border-t border-gray-200">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-navy-900 transition-colors hover:bg-gray-50 marker:content-none md:px-8 [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Ver la intervención completa: problemas, qué se hace y resultado esperado</span>
          <span className="hidden group-open:inline">Ocultar la intervención</span>
          <ChevronDownIcon
            aria-hidden
            className="size-5 shrink-0 text-gray-500 transition-transform duration-200 group-open:rotate-180"
          />
        </summary>

        <div className="border-t border-gray-200 bg-gray-50/60 px-6 py-8 md:px-8 md:py-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
            <section aria-label="Problemas detectados">
              <p className="eyebrow">Problemas detectados</p>
              <ul className="mt-4 divide-y divide-gray-200">
                {item.problems.map((problem, i) => (
                  <li key={problem} className="flex gap-4 py-3.5">
                    <span className="tabular shrink-0 pt-0.5 text-sm font-semibold text-gray-400">{pad(i)}</span>
                    <p className="text-[15px] leading-relaxed text-gray-700">{problem}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label="Intervención">
              <p className="eyebrow">Intervención</p>
              <ol className="mt-4 divide-y divide-gray-200">
                {item.intervention.map((step, i) => (
                  <li key={step} className="flex gap-4 py-3.5">
                    <span className="tabular shrink-0 pt-0.5 text-sm font-semibold text-signal">{pad(i)}</span>
                    <p className="text-[15px] leading-relaxed text-gray-700">{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section
            aria-label="Resultado esperado"
            className="mt-10 rounded-lg border border-navy-100 bg-white p-6 md:p-7"
          >
            <p className="eyebrow">Resultado esperado</p>
            <p className="font-display mt-3 text-xl leading-snug text-navy-900 md:text-2xl">{item.expectedOutcome}</p>
            <p className="mt-4 text-xs text-gray-500">
              Resultado cualitativo del ejemplo. No se incluyen cifras económicas ni porcentajes de mejora.
            </p>
          </section>
        </div>
      </details>

      {/* Cierre: servicio relacionado + CTA --------------------------------- */}
      <footer className="flex flex-col gap-5 border-t border-gray-200 p-6 md:flex-row md:items-center md:justify-between md:px-8">
        {service ? (
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Servicio relacionado</p>
            <TrackedLink
              href={`/servicios/${service.slug}`}
              event="cta_clicked"
              props={{ location: "case_related_service", case: item.slug, service: service.slug }}
              className="mt-1 inline-flex items-center gap-1.5 font-semibold tracking-tight text-navy-900 underline-offset-4 hover:underline"
            >
              {service.name}
              <ArrowRightIcon aria-hidden className="size-4" />
            </TrackedLink>
            <p className="tabular mt-0.5 text-sm text-gray-600">
              {service.format} · {service.priceLabel}
            </p>
          </div>
        ) : null}
        <Button asChild size="lg" className="w-full shrink-0 md:w-auto">
          <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location: "case_card", case: item.slug }}>
            {primaryCta.label}
            <ArrowRightIcon />
          </TrackedLink>
        </Button>
      </footer>
    </article>
  );
}
