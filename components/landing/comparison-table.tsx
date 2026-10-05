import { cn } from "@/lib/utils";

export interface ComparisonRow {
  /** Dimensión comparada (p. ej. "Información"). */
  label: string;
  before: string;
  after: string;
}

/**
 * Tabla comparativa antes/después (o consultora/operador) sin cifras.
 * Una sola estructura responsive: en móvil cada fila se apila con sus etiquetas.
 */
export function ComparisonTable({
  rows,
  dimensionLabel = "Dimensión",
  beforeLabel = "Antes",
  afterLabel = "Después",
  className,
}: {
  rows: readonly ComparisonRow[];
  dimensionLabel?: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-gray-200 bg-white", className)}>
      <div
        aria-hidden
        className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500 md:grid md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-8"
      >
        <span>{dimensionLabel}</span>
        <span>{beforeLabel}</span>
        <span className="text-signal md:pl-6">{afterLabel}</span>
      </div>
      <ul className="divide-y divide-gray-200">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-4 px-6 py-5 md:grid-cols-[1fr_1.4fr_1.4fr] md:gap-8 md:py-6">
            <p className="text-base font-semibold text-navy-900">{row.label}</p>
            <div>
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 md:sr-only">
                {beforeLabel}
              </span>
              <p className="text-[15px] leading-relaxed text-gray-600">{row.before}</p>
            </div>
            <div className="md:border-l md:border-signal/40 md:pl-6">
              <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-signal md:sr-only">
                {afterLabel}
              </span>
              <p className="text-[15px] leading-relaxed font-medium text-navy-900">{row.after}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
