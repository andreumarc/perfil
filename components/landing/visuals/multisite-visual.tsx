import { cn } from "@/lib/utils";

/**
 * Mapa de una red de 16 centros clasificados por cuartil de margen EBITDA.
 * Decorativo (aria-hidden), solo escritorio. Distribución ficticia, sin cifras.
 */
type Quartile = 1 | 2 | 3 | 4;

const NETWORK: readonly Quartile[] = [1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 3, 1, 3, 2, 4, 4];

const QUARTILE_STYLES: Record<Quartile, { tile: string; label: string }> = {
  1: { tile: "bg-navy-900 text-white", label: "Primer cuartil" },
  2: { tile: "bg-navy-500 text-white", label: "Segundo cuartil" },
  3: { tile: "bg-navy-200 text-navy-900", label: "Tercer cuartil" },
  4: { tile: "border border-destructive/30 bg-destructive/10 text-destructive", label: "Último cuartil" },
};

const QUARTILES: readonly Quartile[] = [1, 2, 3, 4];

export function MultisiteVisual({ className }: { className?: string }) {
  const lastQuartile = NETWORK.filter((q) => q === 4).length;

  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="absolute -inset-x-10 -inset-y-12 -z-10 rounded-[3rem] bg-navy-50/80 blur-3xl" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_28px_70px_-32px_rgba(10,26,51,0.4)] md:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Mapa de la red</p>
            <p className="font-display mt-2 text-2xl text-navy-900">16 centros · cuartiles por margen EBITDA</p>
          </div>
          <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
            Ejemplo ilustrativo
          </span>
        </div>

        <ol className="mt-6 grid grid-cols-4 gap-2.5">
          {NETWORK.map((quartile, index) => (
            <li
              key={index}
              className={cn(
                "flex aspect-[4/3] flex-col justify-between rounded-md p-3",
                QUARTILE_STYLES[quartile].tile,
              )}
            >
              <span className="tabular text-xs font-semibold opacity-80">{String(index + 1).padStart(2, "0")}</span>
              <span className="tabular text-[11px] font-medium opacity-70">Q{quartile}</span>
            </li>
          ))}
        </ol>

        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-gray-600">
          {QUARTILES.map((q) => (
            <li key={q} className="flex items-center gap-2">
              <span className={cn("size-2.5 rounded-sm", QUARTILE_STYLES[q].tile)} />
              {QUARTILE_STYLES[q].label}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-4 rounded-md bg-gray-50 px-4 py-3 text-sm">
          <p className="flex items-center gap-2.5 font-medium text-navy-900">
            <span className="size-2 shrink-0 rounded-full bg-destructive/80" />
            {lastQuartile} centros del último cuartil concentran la pérdida de margen
          </p>
          <p className="shrink-0 text-xs text-gray-500">Mismo criterio de P&amp;L en los 16</p>
        </div>
      </div>
    </div>
  );
}
