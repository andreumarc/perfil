import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Button } from "@/components/ui/button";
import { meetingHref, primaryCta } from "@/lib/site";

import { Portrait } from "./portrait";

/** Cabecera de /sobre-mi: titular en primera persona, presentación y retrato. */
export function AboutHero() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <Container className="pt-6 pb-14 md:pt-8 md:pb-20">
        <Breadcrumbs items={[{ name: "Sobre mí", path: "/sobre-mi" }]} />
        <div className="mt-8 grid gap-12 md:mt-12 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow">Sobre mí · Director de Operaciones</p>
            <h1 className="font-display mt-4 text-3xl leading-[1.12] text-navy-900 sm:text-4xl md:text-[2.75rem]">
              He dirigido redes de hasta 25 centros, P&amp;L de hasta 35 M€ y equipos de 250 personas. Ahora ayudo a
              otras empresas multicentro a operar con una sola forma de hacer las cosas.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
              Soy Marc Andreu Guerao, Director de Operaciones especializado en empresas multicentro. He trabajado
              desde dentro, con responsabilidad directa sobre el P&amp;L, los equipos y los resultados de redes en
              healthcare, dental, veterinaria y retail. Hoy pongo esa experiencia al servicio de CEOs, directores
              generales e inversores que necesitan más control, más EBITDA y una única forma de operar.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" className="w-full sm:w-auto">
                <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location: "about_hero" }}>
                  {primaryCta.label}
                  <ArrowRightIcon />
                </TrackedLink>
              </Button>
              <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
                <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: "about_hero" }}>
                  Reservar sesión de 30 min
                </TrackedLink>
              </Button>
            </div>
          </div>

          <Portrait className="mx-auto w-full max-w-sm lg:max-w-none" />
        </div>
      </Container>
    </section>
  );
}
