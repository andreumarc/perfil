import { cn, formatNumber } from "@/lib/utils";

import { SEQUENTIAL_NAVY, percentOf } from "./palette";

export interface FunnelDatum {
  key: string;
  label: string;
  value: number;
}

/**
 * Embudo de conversión: barras horizontales descendentes (CSS, sin JS en
 * cliente) con el % de conversión respecto al paso anterior. Se renderiza en
 * servidor y funciona en cualquier ancho.
 */
export function FunnelChart({
  steps,
  size = "default",
  className,
}: {
  steps: FunnelDatum[];
  size?: "default" | "lg";
  className?: string;
}) {
  if (steps.length === 0) return null;

  const max = Math.max(1, ...steps.map((step) => step.value));
  const first = steps[0];
  const last = steps[steps.length - 1];
  const leadsStep = steps.find((step) => step.key === "leads");
  const allZero = steps.every((step) => step.value === 0);

  return (
    <div className={className}>
      <ol className={cn("space-y-4", size === "lg" && "space-y-5")}>
        {steps.map((step, index) => {
          const prev = index > 0 ? steps[index - 1] : null;
          const width = step.value > 0 ? Math.max(1.5, (step.value / max) * 100) : 0;
          const conversion = prev ? percentOf(step.value, prev.value) : null;
          const color = SEQUENTIAL_NAVY[Math.min(index, SEQUENTIAL_NAVY.length - 1)];
          return (
            <li key={step.key}>
              <div className="flex items-baseline justify-between gap-4">
                <span className={cn("text-sm font-medium text-navy-900", size === "lg" && "text-base")}>
                  <span className="tabular mr-2 inline-block w-4 text-xs text-gray-400">{index + 1}</span>
                  {step.label}
                </span>
                <span className={cn("tabular text-sm font-semibold text-navy-900", size === "lg" && "text-base")}>
                  {formatNumber(step.value)}
                </span>
              </div>
              <div
                className={cn("mt-2 w-full rounded-sm bg-gray-100", size === "lg" ? "h-4" : "h-3")}
                role="img"
                aria-label={`${step.label}: ${formatNumber(step.value)}`}
              >
                <div
                  className="h-full rounded-sm transition-[width] duration-500"
                  style={{ width: `${width}%`, backgroundColor: color }}
                />
              </div>
              {conversion !== null ? (
                <p className="tabular mt-1 text-xs text-gray-500">
                  {prev && prev.value > 0 ? `${conversion}% del paso anterior` : "Sin volumen en el paso anterior"}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>

      {!allZero ? (
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-200 pt-4 text-sm">
          {leadsStep ? (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                {first.label} → {leadsStep.label}
              </dt>
              <dd className="tabular mt-1 text-lg font-semibold text-navy-900">
                {percentOf(leadsStep.value, first.value)}%
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
              {first.label} → {last.label}
            </dt>
            <dd className="tabular mt-1 text-lg font-semibold text-navy-900">{percentOf(last.value, first.value)}%</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-xs text-gray-500">Todavía no hay eventos registrados en el periodo.</p>
      )}
    </div>
  );
}
