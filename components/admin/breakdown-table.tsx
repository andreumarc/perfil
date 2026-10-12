import { EmptyHint } from "@/components/admin/section-card";
import { formatNumber } from "@/lib/utils";

/** Tabla compacta clave → valor con barra proporcional. */
export function BreakdownTable({ items, labels = {}, emptyText }: { items: { key: string; value: number }[]; labels?: Record<string, string>; emptyText?: string }) {
  if (!items.length) return <EmptyHint>{emptyText ?? "Sin datos todavía."}</EmptyHint>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.key} className="text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-gray-700">{labels[item.key] ?? item.key}</span>
            <span className="tabular shrink-0 font-semibold text-ink-900">{formatNumber(item.value)}</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
            <div className="h-1.5 rounded-full bg-copper-400" style={{ width: `${Math.max(3, Math.round((item.value / max) * 100))}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
