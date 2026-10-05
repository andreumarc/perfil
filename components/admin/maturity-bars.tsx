import { cn } from "@/lib/utils";

export interface MaturityBarItem {
  key: string;
  label: string;
  /** 0-100 */
  value: number;
  description?: string;
}

/** Barras horizontales CSS con la madurez media (0-100) por bloque del diagnóstico. */
export function MaturityBars({ items, className }: { items: MaturityBarItem[]; className?: string }) {
  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item) => {
        const width = Math.min(100, Math.max(0, item.value));
        return (
          <li key={item.key}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-sm font-medium text-navy-900">{item.label}</span>
              <span className="tabular text-sm font-semibold text-navy-900">
                {Math.round(item.value)}
                <span className="ml-0.5 text-xs font-normal text-gray-400">/100</span>
              </span>
            </div>
            <div
              className="mt-1.5 h-2.5 w-full rounded-sm bg-gray-100"
              role="img"
              aria-label={`${item.label}: ${Math.round(item.value)} sobre 100`}
            >
              <div className="h-full rounded-sm bg-signal" style={{ width: `${width}%` }} />
            </div>
            {item.description ? <p className="mt-1 text-xs text-gray-500">{item.description}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}
