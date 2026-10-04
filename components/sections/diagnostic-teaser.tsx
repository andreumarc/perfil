import { ArrowRightIcon, CheckIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { DIMENSIONS, DIMENSION_LABELS } from "@/lib/diagnostic/questions";
import { cn } from "@/lib/utils";

/**
 * Bloque de presentación del Diagnóstico Multisite (lead magnet principal).
 * Incluye una previsualización estática del resultado para anclar la expectativa.
 */
export function DiagnosticTeaser({ location, className }: { location: string; className?: string }) {
  const preview: Record<string, number> = {
    finance: 72,
    operations: 54,
    people: 61,
    data: 40,
    scalability: 58,
  };
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Diagnóstico Multisite · gratuito</p>
            <h2 className="font-display mt-3 text-3xl leading-tight text-navy-900 md:text-[2.75rem]">
              ¿Cuánto potencial de mejora tiene tu red de centros?
            </h2>
            <p className="mt-5 text-lg text-gray-600">
              Completa este diagnóstico de 3 minutos y descubre el nivel de madurez operativa de tu
              organización en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              {[
                "15 preguntas, una por pantalla. Sin rodeos.",
                "Resultado inmediato con puntuación 0-100 y nivel de madurez.",
                "3 problemas, 3 oportunidades y 3 acciones prioritarias para tu red.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="mt-0.5 size-5 shrink-0 text-signal" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <TrackedLink href="/diagnostico" event="cta_clicked" props={{ location }}>
                  Analizar mi red
                  <ArrowRightIcon />
                </TrackedLink>
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Pensado para CEOs, directores generales, COOs, CFOs e inversores de redes de 5 a 100 centros.
            </p>
          </div>

          <div aria-hidden className="relative">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(10,26,51,0.35)] md:p-8">
              <div className="flex items-end justify-between border-b border-gray-200 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Madurez operativa</p>
                  <p className="font-display tabular mt-2 text-5xl text-navy-900">
                    62<span className="text-2xl text-gray-400"> / 100</span>
                  </p>
                </div>
                <p className="max-w-[11rem] text-right text-sm font-medium text-navy-900">
                  Organización en fase de profesionalización
                </p>
              </div>
              <ul className="mt-6 space-y-4">
                {DIMENSIONS.map((dim) => (
                  <li key={dim}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-navy-900">{DIMENSION_LABELS[dim]}</span>
                      <span className="tabular text-gray-600">{preview[dim]}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-navy-100">
                      <div
                        className={cn("h-full rounded-full", preview[dim] < 50 ? "bg-signal" : "bg-navy-900")}
                        style={{ width: `${preview[dim]}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                <span className="font-semibold text-navy-900">Mayor potencial:</span> estandarización operativa y
                reporting. Los datos llegan tarde y cada centro mide cosas distintas.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
