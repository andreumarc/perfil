import type { ReactNode } from "react";
import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs, type Crumb } from "@/components/sections/breadcrumbs";
import { Button } from "@/components/ui/button";
import type { EventType } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

export interface HeroCta {
  label: string;
  href: string;
  /** Evento de analítica. Por defecto `cta_clicked`; para reuniones usar `meeting_clicked`. */
  event?: EventType;
}

interface LandingHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primary: HeroCta;
  secondary?: HeroCta;
  /** Identificador de ubicación para analítica (p. ej. `pe_hero`). */
  location: string;
  breadcrumbs: Crumb[];
  tone?: "white" | "navy";
  /** Credenciales reales bajo los CTAs. Nunca resultados económicos inventados. */
  proofPoints?: readonly string[];
  /** Visual decorativo (CSS/SVG). Solo se muestra en escritorio. */
  visual?: ReactNode;
  className?: string;
}

const DEFAULT_PROOF_POINTS = [
  "25 centros dirigidos",
  "35 M€ de P&L",
  "250 personas",
  "Healthcare, dental, veterinaria y retail",
] as const;

/**
 * Hero de landing sectorial: breadcrumbs, un único h1, dos CTAs grandes y
 * credenciales verificables. El visual se oculta en móvil para llegar antes al CTA.
 */
export function LandingHero({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  location,
  breadcrumbs,
  tone = "white",
  proofPoints = DEFAULT_PROOF_POINTS,
  visual,
  className,
}: LandingHeroProps) {
  const dark = tone === "navy";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        dark ? "bg-navy-radial border-navy-800 text-white" : "border-gray-200 bg-white",
        className,
      )}
    >
      <Container size="wide" className="pt-8 pb-16 md:pt-10 md:pb-24 lg:pb-28">
        <Breadcrumbs
          items={breadcrumbs}
          className={cn(
            dark &&
              "text-navy-200/80 [&_a:hover]:text-white [&_svg]:text-navy-300/70 [&_[aria-current=page]]:text-white",
          )}
        />

        <div className="mt-10 grid items-center gap-12 md:mt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className={cn("eyebrow", dark && "text-navy-200")}>{eyebrow}</p>
            <h1
              className={cn(
                "font-display mt-5 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.4rem]",
                dark ? "text-white" : "text-navy-900",
              )}
            >
              {title}
            </h1>
            <p
              className={cn(
                "mt-6 text-lg leading-relaxed md:text-xl",
                dark ? "text-navy-100/85" : "text-gray-600",
              )}
            >
              {description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" variant={dark ? "white" : "default"} className="w-full sm:w-auto">
                <TrackedLink href={primary.href} event={primary.event ?? "cta_clicked"} props={{ location }}>
                  {primary.label}
                  <ArrowRightIcon />
                </TrackedLink>
              </Button>
              {secondary ? (
                <Button
                  asChild
                  size="xl"
                  variant={dark ? "outline-light" : "outline"}
                  className="w-full sm:w-auto"
                >
                  <TrackedLink
                    href={secondary.href}
                    event={secondary.event ?? "cta_clicked"}
                    props={{ location: `${location}_secondary` }}
                  >
                    {secondary.label}
                  </TrackedLink>
                </Button>
              ) : null}
            </div>

            <ul
              className={cn(
                "mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm",
                dark ? "text-navy-100/70" : "text-gray-500",
              )}
            >
              {proofPoints.map((point, index) => (
                <li key={point} className="flex items-center gap-3">
                  {index > 0 ? <span className={dark ? "text-white/25" : "text-gray-300"}>·</span> : null}
                  <span className={index < 3 ? cn("font-semibold", dark ? "text-white" : "text-navy-900") : undefined}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {visual ? <div className="hidden lg:block">{visual}</div> : null}
        </div>
      </Container>
    </section>
  );
}
