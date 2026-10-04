import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { meetingHref, primaryCta } from "@/lib/site";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  location: string;
  tone?: "navy" | "light";
  className?: string;
}

/**
 * Bloque de llamada a la acción reutilizable (final de página, mitad de página).
 * Por defecto: diagnóstico gratuito + sesión estratégica.
 */
export function CtaBand({
  eyebrow = "Siguiente paso",
  title = "¿Cuánto potencial de mejora tiene tu red de centros?",
  description = "Completa el diagnóstico de 3 minutos y descubre el nivel de madurez operativa de tu organización. Sin compromiso, resultado inmediato.",
  primaryLabel = primaryCta.label,
  primaryHref = primaryCta.href,
  secondaryLabel = "Solicitar sesión estratégica de 30 min",
  secondaryHref = meetingHref,
  location,
  tone = "navy",
  className,
}: CtaBandProps) {
  const dark = tone === "navy";
  return (
    <section className={cn(dark ? "bg-navy-grid text-white" : "bg-gray-50", "py-16 md:py-20", className)}>
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className={cn("eyebrow", dark && "text-navy-200")}>{eyebrow}</p>
            <h2 className={cn("font-display mt-3 text-3xl leading-tight md:text-4xl", dark ? "text-white" : "text-navy-900")}>
              {title}
            </h2>
            <p className={cn("mt-4 max-w-xl text-base md:text-lg", dark ? "text-navy-100/85" : "text-gray-600")}>
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <Button asChild size="xl" variant={dark ? "white" : "default"} className="w-full lg:w-auto">
              <TrackedLink href={primaryHref} event="cta_clicked" props={{ location }}>
                {primaryLabel}
                <ArrowRightIcon />
              </TrackedLink>
            </Button>
            {secondaryLabel ? (
              <Button asChild size="lg" variant={dark ? "outline-light" : "outline"} className="w-full lg:w-auto">
                <TrackedLink href={secondaryHref} event="meeting_clicked" props={{ location }}>
                  {secondaryLabel}
                </TrackedLink>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
