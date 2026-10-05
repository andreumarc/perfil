import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { meetingHref, primaryCta } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Estado vacío de listados de insights. Convierte la ausencia de artículos en una
 * oportunidad de conversión: diagnóstico gratuito + sesión de 30 minutos.
 */
export function InsightsEmptyState({
  location,
  title = "Los primeros artículos se publican esta semana.",
  description = "Mientras tanto, el diagnóstico gratuito de 3 minutos te dice en qué nivel de madurez operativa está tu red y por dónde empezar.",
  className,
}: {
  location: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 md:p-12",
        className,
      )}
    >
      <div className="max-w-2xl">
        <p className="eyebrow">Insights</p>
        <p className="font-display mt-3 text-2xl leading-tight text-navy-900 md:text-3xl">{title}</p>
        <p className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">{description}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location }}>
              {primaryCta.label}
              <ArrowRightIcon />
            </TrackedLink>
          </Button>
          <TrackedLink
            href={meetingHref}
            event="meeting_clicked"
            props={{ location }}
            className="inline-flex min-h-11 items-center justify-center text-sm font-semibold text-navy-900 underline-offset-4 hover:underline sm:justify-start"
          >
            Reservar sesión de 30 min
          </TrackedLink>
        </div>
      </div>
    </div>
  );
}
