import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { primaryCta, secondaryCta } from "@/lib/site";

import { HeroVisual } from "./hero-visual";

/** Línea de prueba bajo los CTAs: credenciales reales, sin resultados inventados. */
const PROOF_POINTS = ["25 centros", "35 M€ de P&L", "250 personas", "Healthcare, dental, veterinaria y retail"] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-white">
      <Container size="wide" className="pt-14 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-2xl">
            <p className="eyebrow">Director de Operaciones · Empresas multicentro</p>
            <h1 className="font-display mt-5 text-4xl leading-[1.05] text-navy-900 sm:text-5xl lg:text-[3.6rem]">
              Más control. Más EBITDA. Una sola forma de operar.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
              Ayudo a empresas multicentro a mejorar su rentabilidad, estandarizar operaciones e integrar nuevos
              centros.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" className="w-full sm:w-auto">
                <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location: "hero" }}>
                  {primaryCta.label}
                  <ArrowRightIcon />
                </TrackedLink>
              </Button>
              <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-gray-500">
              {PROOF_POINTS.map((point, index) => (
                <li key={point} className="flex items-center gap-3">
                  {index > 0 ? <span className="text-gray-300">·</span> : null}
                  <span className={index < 3 ? "font-semibold text-navy-900" : undefined}>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual className="hidden lg:block" />
        </div>
      </Container>
    </section>
  );
}
