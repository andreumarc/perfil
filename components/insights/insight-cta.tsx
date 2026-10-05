import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { primaryCta } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * CTA sobrio justo después del cuerpo del artículo: el lector que ha llegado hasta
 * aquí puede convertir sin esperar al final de la página.
 */
export function InsightCta({ className, location = "insight_inline" }: { className?: string; location?: string }) {
  return (
    <aside className={cn("rounded-lg bg-navy-900 p-6 text-white md:p-8", className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-navy-200">Aplicarlo a tu red</p>
          <p className="font-display mt-3 text-2xl leading-tight md:text-3xl">
            ¿En qué nivel de madurez operativa está tu red de centros?
          </p>
          <p className="mt-3 text-base text-navy-100/85">
            Diagnóstico gratuito de 3 minutos: finanzas, operaciones, personas, datos y escalabilidad. Resultado
            inmediato, sin compromiso.
          </p>
        </div>
        <Button asChild size="xl" variant="white" className="w-full md:w-auto">
          <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location }}>
            {primaryCta.label}
            <ArrowRightIcon />
          </TrackedLink>
        </Button>
      </div>
    </aside>
  );
}
