import { ArrowDownIcon } from "lucide-react";

import { CASES, casePath } from "@/content/cases";
import { cn } from "@/lib/utils";

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

/**
 * Índice de casos con anclas: permite al lector ir directamente a la situación
 * que reconoce como suya sin recorrer toda la página.
 */
export function CaseIndex({ className }: { className?: string }) {
  return (
    <nav aria-label="Índice de casos" className={className}>
      <ol className="grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((item, index) => (
          <li key={item.slug} className="bg-white">
            <a
              href={casePath(item.slug)}
              className={cn(
                "group flex h-full flex-col p-5 transition-colors hover:bg-navy-50/60 focus-visible:bg-navy-50/60 focus-visible:outline-none md:p-6",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-display tabular text-2xl text-navy-300">{pad(index)}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{item.sector}</span>
              </div>
              <p className="mt-3 flex-1 text-base font-semibold leading-snug tracking-tight text-navy-900">
                {item.title}
              </p>
              <p className="mt-2 text-sm text-gray-600">{item.context}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-900 transition-all group-hover:gap-2">
                Ver el caso
                <ArrowDownIcon aria-hidden className="size-4" />
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
