import { cn } from "@/lib/utils";

export interface Pillar {
  title: string;
  description: string;
}

/**
 * Lista numerada de pilares, dolores o síntomas con título y dos líneas de detalle.
 * `columns={1}` muestra cada elemento como fila (número · título · descripción).
 */
export function Pillars({
  items,
  columns = 2,
  className,
}: {
  items: readonly Pillar[];
  columns?: 1 | 2 | 3;
  className?: string;
}) {
  if (columns === 1) {
    return (
      <ol className={cn("divide-y divide-gray-200 border-y border-gray-200", className)}>
        {items.map((item, index) => (
          <li key={item.title} className="grid gap-3 py-6 md:grid-cols-[3rem_1fr_1.6fr] md:gap-8 md:py-7">
            <span className="tabular text-sm font-semibold text-signal">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-lg font-semibold text-navy-900 md:text-xl">{item.title}</h3>
            <p className="text-base leading-relaxed text-gray-600">{item.description}</p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol
      className={cn(
        "grid gap-x-10 gap-y-8",
        columns === 2 && "md:grid-cols-2",
        columns === 3 && "md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item, index) => (
        <li key={item.title} className="border-t border-gray-200 pt-5">
          <span className="tabular text-sm font-semibold text-signal">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-lg font-semibold text-navy-900">{item.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
