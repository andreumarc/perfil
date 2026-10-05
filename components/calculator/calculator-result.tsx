import { ArrowRightIcon, InfoIcon } from "lucide-react";

import { BenchmarkBar } from "@/components/calculator/benchmark-bar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { labelFor, SECTORS } from "@/types/lead";
import type { CalculatorResult, OpportunityLevel } from "@/lib/ebitda-benchmark";
import { cn, formatEuro, formatNumber, formatPercent } from "@/lib/utils";

const LEVEL_LABELS: Record<OpportunityLevel, string> = {
  alto: "Potencial de mejora alto",
  medio: "Potencial de mejora medio",
  bajo: "Potencial de mejora bajo",
};

const LEVEL_VARIANT: Record<OpportunityLevel, "destructive" | "warning" | "signal"> = {
  alto: "destructive",
  medio: "warning",
  bajo: "signal",
};

function signedEuro(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${formatEuro(Math.abs(value))}`;
}

function ScenarioText({ result }: { result: CalculatorResult }) {
  const { scenario, input } = result;
  const range = `${formatPercent(scenario.targetMarginLow)}–${formatPercent(scenario.targetMarginHigh)}`;
  const margin = formatPercent(input.ebitdaMarginPct, 1);

  if (scenario.deltaHigh < 0) {
    return (
      <>
        Tu margen ({margin}) ya está <strong className="text-navy-900">por encima</strong> del rango de referencia ({range}).
        El EBITDA equivalente al rango sería inferior al actual, entre {formatEuro(scenario.ebitdaAtLow)} y{" "}
        {formatEuro(scenario.ebitdaAtHigh)}. El recorrido no está en el margen medio, sino en sostenerlo centro a centro.
      </>
    );
  }

  if (scenario.alreadyInRange) {
    return (
      <>
        Tu margen ({margin}) ya está <strong className="text-navy-900">dentro</strong> del rango de referencia ({range}).
        Si se situara en el límite superior ({formatPercent(scenario.targetMarginHigh)}), el EBITDA alcanzaría{" "}
        <strong className="tabular text-navy-900">{formatEuro(scenario.ebitdaAtHigh)}</strong> (Δ{" "}
        <span className="tabular">{signedEuro(scenario.deltaHigh)}</span>).
      </>
    );
  }

  return (
    <>
      Si el margen se situara en el rango de referencia ({range}), el EBITDA se movería entre{" "}
      <strong className="tabular text-navy-900">{formatEuro(scenario.ebitdaAtLow)}</strong> y{" "}
      <strong className="tabular text-navy-900">{formatEuro(scenario.ebitdaAtHigh)}</strong> (Δ{" "}
      <span className="tabular">
        {signedEuro(scenario.deltaLow)} a {signedEuro(scenario.deltaHigh)}
      </span>
      ).
    </>
  );
}

interface CalculatorResultPanelProps {
  result: CalculatorResult;
  onAnalyze: () => void;
  formOpen: boolean;
  className?: string;
}

/** Panel de resultado del benchmark: cabecera, headline, cuatro métricas, escenario y CTA. */
export function CalculatorResultPanel({ result, onAnalyze, formOpen, className }: CalculatorResultPanelProps) {
  const { input } = result;
  const outOfRange = result.attentionCount;

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white", className)}>
      {/* Cabecera */}
      <div className="border-b border-gray-200 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow mb-0">Resultado del benchmark · {labelFor(SECTORS, input.sector)}</p>
          <Badge variant={LEVEL_VARIANT[result.opportunityLevel]}>
            {LEVEL_LABELS[result.opportunityLevel]} · {outOfRange} de 4 métricas fuera de rango
          </Badge>
        </div>

        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="border-l border-navy-200 pl-5">
            <dt className="text-sm text-gray-600">EBITDA anual estimado</dt>
            <dd className="font-display tabular mt-2 text-4xl leading-none text-navy-900 md:text-5xl">
              {formatEuro(result.ebitda)}
            </dd>
            <p className="mt-2 text-sm text-gray-500">
              {formatPercent(input.ebitdaMarginPct, 1)} de margen sobre {formatEuro(input.revenue)} de facturación
            </p>
          </div>
          <div className="border-l border-navy-200 pl-5">
            <dt className="text-sm text-gray-600">EBITDA por centro</dt>
            <dd className="font-display tabular mt-2 text-4xl leading-none text-navy-900 md:text-5xl">
              {formatEuro(result.ebitdaPerLocation)}
            </dd>
            <p className="mt-2 text-sm text-gray-500">
              {formatNumber(input.locations)} centros · {formatEuro(result.revenuePerLocation)} de facturación media por centro
            </p>
          </div>
        </dl>

        <p className="mt-8 border-l-2 border-signal pl-4 text-base font-medium leading-relaxed text-navy-900 md:text-lg">
          {result.headline}
        </p>
      </div>

      {/* Métricas */}
      <div className="p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Tus datos frente al rango de referencia</p>
        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-x-10">
          {result.metrics.map((metric) => (
            <BenchmarkBar key={metric.key} metric={metric} />
          ))}
        </div>
      </div>

      {/* Escenario */}
      <div className="border-t border-gray-200 bg-gray-50 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Escenario de margen</p>
        <p className="mt-3 text-base leading-relaxed text-gray-700 md:text-lg">
          <ScenarioText result={result} />
        </p>
        <Alert className="mt-5 border-navy-200 bg-white">
          <InfoIcon />
          <AlertTitle>Escenario orientativo basado en rangos generales de gestión.</AlertTitle>
          <AlertDescription>
            <p>
              No es una previsión ni una promesa de ahorro. El EBITDA real depende de la estructura de costes
              fijos, el mix de servicios y la situación concreta de cada centro.
            </p>
          </AlertDescription>
        </Alert>
      </div>

      {/* CTA */}
      {!formOpen ? (
        <div className="border-t border-gray-200 p-6 md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[1.4fr_1fr]">
            <div>
              <h3 className="font-display text-2xl text-navy-900">¿Dónde está exactamente el recorrido en tu red?</h3>
              <p className="mt-2 text-gray-600">
                Te envío una primera lectura de tu benchmark en menos de 48 horas: qué palanca atacar primero,
                qué dato pedir a cada centro y qué esperar de un plan de 90 días. Sin compromiso.
              </p>
            </div>
            <Button size="xl" className="w-full" onClick={onAnalyze}>
              Analizar oportunidades
              <ArrowRightIcon />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
