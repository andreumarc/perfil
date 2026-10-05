import { InfoIcon } from "lucide-react";

import { CASES_DISCLAIMER } from "@/content/cases";
import { cn } from "@/lib/utils";

/**
 * Nota visible que encabeza la página de casos: los ejemplos son hipotéticos y
 * no incluyen resultados económicos reales.
 */
export function CasesDisclaimer({ className }: { className?: string }) {
  return (
    <aside
      role="note"
      aria-label="Nota sobre los casos"
      className={cn(
        "flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-relaxed text-gray-700 md:px-5",
        className,
      )}
    >
      <InfoIcon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-signal" />
      <p>
        <span className="font-semibold text-navy-900">Nota. </span>
        {CASES_DISCLAIMER}
      </p>
    </aside>
  );
}
