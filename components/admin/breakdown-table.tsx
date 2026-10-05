import { EmptyHint } from "@/components/admin/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber } from "@/lib/utils";

export interface BreakdownRow {
  key: string;
  value: number;
}

/** Ordena un desglose según el orden de una lista de valores (los no listados van al final). */
export function sortByOrder<T extends BreakdownRow>(items: T[], order: readonly string[]): T[] {
  const index = new Map(order.map((value, i) => [value, i]));
  return [...items].sort((a, b) => {
    const ia = index.get(a.key) ?? Number.MAX_SAFE_INTEGER;
    const ib = index.get(b.key) ?? Number.MAX_SAFE_INTEGER;
    if (ia !== ib) return ia - ib;
    return b.value - a.value;
  });
}

/**
 * Tabla compacta con barra proporcional CSS. Pensada para desgloses pequeños
 * (fuente, nivel, facturación, páginas…). Siempre con overflow horizontal.
 */
export function BreakdownTable({
  items,
  labelFor,
  keyHeader = "Categoría",
  valueHeader = "Leads",
  showPercent = true,
  mono = false,
  emptyText,
}: {
  items: BreakdownRow[];
  labelFor?: (key: string) => string;
  keyHeader?: string;
  valueHeader?: string;
  showPercent?: boolean;
  /** Muestra la clave en monoespaciada (rutas, utm_source). */
  mono?: boolean;
  emptyText?: string;
}) {
  if (items.length === 0) return <EmptyHint>{emptyText ?? "Sin datos en el periodo."}</EmptyHint>;

  const total = items.reduce((acc, item) => acc + item.value, 0);
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{keyHeader}</TableHead>
          <TableHead className="w-[40%] min-w-32">Proporción</TableHead>
          <TableHead className="text-right">{valueHeader}</TableHead>
          {showPercent ? <TableHead className="text-right">%</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const width = Math.max(1.5, (item.value / max) * 100);
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <TableRow key={item.key}>
              <TableCell className={mono ? "font-mono text-xs text-navy-900" : "font-medium text-navy-900"}>
                {labelFor ? labelFor(item.key) : item.key}
              </TableCell>
              <TableCell>
                <div className="h-2 w-full rounded-sm bg-gray-100" aria-hidden>
                  <div className="h-full rounded-sm bg-navy-900" style={{ width: `${width}%` }} />
                </div>
              </TableCell>
              <TableCell className="tabular text-right font-semibold text-navy-900">{formatNumber(item.value)}</TableCell>
              {showPercent ? <TableCell className="tabular text-right text-gray-500">{pct}%</TableCell> : null}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
