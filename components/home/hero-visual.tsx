import { cn } from "@/lib/utils";

/**
 * Mockup ilustrativo de un "P&L por centro": ranking de seis centros ficticios
 * por margen EBITDA. Decorativo (aria-hidden), solo desktop. No son datos reales.
 */
interface CenterRow {
  name: string;
  /** Margen EBITDA en % (ficticio). */
  margin: number;
}

const CENTERS: readonly CenterRow[] = [
  { name: "Centro A", margin: 18.4 },
  { name: "Centro B", margin: 14.2 },
  { name: "Centro C", margin: 9.7 },
  { name: "Centro D", margin: 4.1 },
  { name: "Centro E", margin: -3.6 },
  { name: "Centro F", margin: -8.2 },
];

/* Dominio del eje: de -10 % a +20 %. La línea de cero queda a un tercio. */
const DOMAIN_MIN = -10;
const DOMAIN_MAX = 20;
const DOMAIN_SPAN = DOMAIN_MAX - DOMAIN_MIN;
const ZERO_PCT = ((0 - DOMAIN_MIN) / DOMAIN_SPAN) * 100;

const percent = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function barWidth(margin: number) {
  return `${(Math.abs(margin) / DOMAIN_SPAN) * 100}%`;
}

export function HeroVisual({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="absolute -inset-x-10 -inset-y-12 -z-10 rounded-[3rem] bg-navy-50/80 blur-3xl" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_28px_70px_-32px_rgba(10,26,51,0.4)] md:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">P&amp;L por centro</p>
            <p className="font-display mt-2 text-2xl text-navy-900">Margen EBITDA · últimos 12 meses</p>
          </div>
          <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
            Ejemplo ilustrativo
          </span>
        </div>

        <ol className="mt-6 space-y-4">
          {CENTERS.map((center, index) => {
            const negative = center.margin < 0;
            const width = barWidth(center.margin);
            return (
              <li key={center.name} className="grid grid-cols-[1.25rem_4.75rem_1fr_3.75rem] items-center gap-3 text-sm">
                <span className="tabular text-xs text-gray-400">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-medium text-navy-900">{center.name}</span>
                <div className="relative h-2.5 rounded-full bg-gray-100">
                  <span className="absolute inset-y-[-3px] w-px bg-gray-300" style={{ left: `${ZERO_PCT}%` }} />
                  <span
                    className={cn("absolute inset-y-0 rounded-full", negative ? "bg-destructive/75" : "bg-navy-900")}
                    style={negative ? { right: `${100 - ZERO_PCT}%`, width } : { left: `${ZERO_PCT}%`, width }}
                  />
                </div>
                <span className={cn("tabular text-right font-medium", negative ? "text-destructive" : "text-navy-900")}>
                  {percent.format(center.margin)}&nbsp;%
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-md bg-gray-50 px-4 py-3 text-sm">
          <p className="flex items-center gap-2.5 font-medium text-navy-900">
            <span className="size-2 shrink-0 rounded-full bg-destructive/80" />3 de 12 centros destruyen margen
          </p>
          <p className="shrink-0 text-xs text-gray-500">Mostrando 6 de 12</p>
        </div>
      </div>
    </div>
  );
}
