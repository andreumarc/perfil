import { cn } from "@/lib/utils";

export interface Phase {
  step: string;
  title: string;
  /** Momento del ciclo (p. ej. "Antes del cierre", "Días 1-100"). */
  period: string;
  /** Qué se aporta en esa fase. */
  items: readonly string[];
}

/**
 * Línea temporal horizontal (vertical en móvil) con fases y aportación en cada una.
 * Pensada para ciclos de inversión o planes por hitos.
 */
export function PhaseTimeline({ phases, className }: { phases: readonly Phase[]; className?: string }) {
  return (
    <ol
      className={cn(
        "relative grid gap-10 lg:gap-8",
        phases.length === 4 && "lg:grid-cols-4",
        phases.length === 3 && "lg:grid-cols-3",
        phases.length === 5 && "lg:grid-cols-5",
        className,
      )}
    >
      {phases.map((phase, index) => {
        const last = index === phases.length - 1;
        return (
          <li key={phase.step} className="relative pl-8 lg:pl-0 lg:pt-9">
            {/* Línea de conexión: vertical en móvil, horizontal en escritorio */}
            <span
              aria-hidden
              className={cn(
                "absolute top-2 left-[7px] w-px bg-gray-200 lg:top-[7px] lg:left-0 lg:h-px lg:w-full",
                last ? "bottom-auto h-0 lg:w-4" : "bottom-[-2.5rem]",
              )}
            />
            <span
              aria-hidden
              className="absolute top-0.5 left-0 size-[15px] rounded-full border-2 border-signal bg-white lg:top-0 lg:left-0"
            />
            <p className="tabular text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              {phase.step} · {phase.period}
            </p>
            <h3 className="font-display mt-2 text-2xl text-navy-900">{phase.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {phase.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-600 md:text-[15px]">
                  <span aria-hidden className="mt-[0.6rem] size-1.5 shrink-0 rounded-full bg-navy-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}
