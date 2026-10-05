import type { DimensionScore } from "@/lib/diagnostic/calculate";
import { DIMENSION_DESCRIPTIONS, DIMENSION_LABELS, type Dimension } from "@/lib/diagnostic/questions";
import { cn } from "@/lib/utils";

/**
 * Los cinco bloques del diagnóstico con su puntuación 0-100. Los bloques
 * prioritarios (mayor potencial de mejora) se marcan con el acento teal.
 */
export function DimensionBars({
  dimensions,
  focus,
  className,
}: {
  dimensions: DimensionScore[];
  focus: Dimension[];
  className?: string;
}) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-5", className)}>
      {dimensions.map((item) => {
        const label = DIMENSION_LABELS[item.dimension];
        const priority = focus.includes(item.dimension);
        return (
          <li
            key={item.dimension}
            className={cn(
              "flex flex-col rounded-lg border bg-white p-4",
              priority ? "border-signal/40" : "border-gray-200",
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-semibold text-navy-900">{label}</p>
              <p className="tabular text-lg font-semibold text-navy-900">
                {item.score}
                <span className="text-xs font-normal text-gray-500">%</span>
              </p>
            </div>
            <div
              role="img"
              aria-label={`${label}: ${item.score} sobre 100`}
              className="mt-3 h-2 w-full overflow-hidden rounded-full bg-navy-100"
            >
              <div
                className={cn("h-full rounded-full", priority ? "bg-signal" : "bg-navy-900")}
                style={{ width: `${Math.max(2, item.score)}%` }}
              />
            </div>
            {priority ? <p className="eyebrow mt-3">Prioridad</p> : null}
            <p className={cn("text-xs leading-relaxed text-gray-500", priority ? "mt-1.5" : "mt-3")}>
              {DIMENSION_DESCRIPTIONS[item.dimension]}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
