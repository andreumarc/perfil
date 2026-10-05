import { cn } from "@/lib/utils";

export interface Metric {
  name: string;
  /** Unidad de medida mostrada como etiqueta (p. ej. "%", "€/h"). */
  unit: string;
  definition: string;
  /** Qué decisión permite tomar o qué problema delata. */
  why: string;
}

/** Grid de KPIs con definición y lectura directiva. Sin cifras: aquí se define qué se mide y por qué. */
export function MetricGrid({ items, className }: { items: readonly Metric[]; className?: string }) {
  return (
    <ul className={cn("grid gap-5 md:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((metric) => (
        <li key={metric.name} className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold text-navy-900">{metric.name}</h3>
            <span className="tabular shrink-0 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold text-gray-600">
              {metric.unit}
            </span>
          </div>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 md:text-[15px]">{metric.definition}</p>
          <div className="mt-5 border-t border-gray-200 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-signal">Por qué importa</p>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{metric.why}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
