import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ComparisonTable } from "@/components/landing/comparison-table";
import {
  MULTISITE_BEFORE_AFTER,
  MULTISITE_FAQS,
  MULTISITE_SECTORS,
  MULTISITE_SYMPTOMS,
} from "@/components/landing/data/multisite";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingHero } from "@/components/landing/landing-hero";
import { Pillars } from "@/components/landing/pillars";
import { RelatedServices } from "@/components/landing/related-services";
import { SectorGrid } from "@/components/landing/sector-grid";
import { MultisiteVisual } from "@/components/landing/visuals/multisite-visual";
import { Section, SectionHeading } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { Methodology } from "@/components/sections/methodology";
import { pageMetadata } from "@/lib/seo";
import { meetingHref, primaryCta } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Gestión de empresas multicentro: más control, más EBITDA",
  description:
    "Para redes de 5 a 100 centros que crecen en unidades más rápido que en EBITDA: P&L por centro, benchmarking interno, estandarización y managers que dirigen con datos. Gimnasios, academias, ópticas, automoción, restauración, franquicias, retail y hospitality.",
  path: "/multisite",
  keywords: [
    "gestión multicentro",
    "empresa multicentro",
    "rentabilidad por centro",
    "P&L por centro",
    "benchmarking interno centros",
    "estandarización de procesos red de centros",
    "director de operaciones multicentro",
    "gestión de franquicias operaciones",
    "gestión de gimnasios rentabilidad",
    "consultor EBITDA multicentro",
  ],
});

export default function MultisitePage() {
  return (
    <>
      <LandingHero
        location="multisite_hero"
        breadcrumbs={[{ name: "Empresas multicentro", path: "/multisite" }]}
        eyebrow="Empresas multicentro"
        title="Más control. Más EBITDA. Una sola forma de operar en todos tus centros."
        description="Para redes de 5 a 100 centros que crecen en unidades más rápido que en resultado: gimnasios, academias, ópticas, audiología, automoción, restauración, franquicias, retail y hospitality. P&L por centro, benchmarking interno, palancas priorizadas y managers que dirigen con indicadores."
        primary={{ label: primaryCta.label, href: primaryCta.href }}
        secondary={{ label: "Solicitar sesión estratégica", href: meetingHref, event: "meeting_clicked" }}
        visual={<MultisiteVisual />}
      />

      <Section>
        <SectionHeading
          eyebrow="La trampa del crecimiento multicentro"
          title="Crecer en centros no es lo mismo que crecer en EBITDA."
          description="A partir del quinto o sexto centro, el modelo que funcionaba con dos o tres deja de escalar. No es falta de esfuerzo ni de talento: es falta de un modelo operativo común. Cinco síntomas que lo delatan."
        />
        <Pillars items={MULTISITE_SYMPTOMS} columns={1} className="mt-12" />
      </Section>

      <Section id="metodologia" tone="muted" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Cómo trabajo"
          title="Medir, comparar, priorizar, ejecutar, escalar."
          description="Cinco pasos, siempre en este orden. Es el método con el que he dirigido redes de hasta 25 centros y el que aplico en cada intervención, sea un diagnóstico de tres semanas o una dirección de operaciones continuada."
        />
        <Methodology className="mt-12" />
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base text-gray-600">
            Cada paso deja algo tangible: un P&amp;L por centro, un ranking, una lista corta de palancas, cambios
            implantados y un playbook de apertura e integración.
          </p>
          <TrackedLink
            href={meetingHref}
            event="meeting_clicked"
            props={{ location: "multisite_methodology" }}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-navy-900 underline-offset-4 hover:underline"
          >
            Ver cómo se aplicaría a tu red
            <ArrowRightIcon className="size-4" />
          </TrackedLink>
        </div>
      </Section>

      <Section id="antes-despues" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Qué cambia cuando la red se gestiona con datos"
          title="Seis cosas que cambian cuando todos los centros se miden igual."
          description="Sin promesas de porcentajes: el objetivo se fija con tus datos en las primeras semanas. Lo que sí cambia desde el primer mes es cómo se decide, quién dirige y con qué información."
        />
        <ComparisonTable rows={MULTISITE_BEFORE_AFTER} className="mt-12" />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Sectores"
          title="Distintos sectores, el mismo problema de red."
          description="He dirigido redes en healthcare, dental, veterinaria y retail. Los indicadores cambian de un sector a otro; la forma de dirigir una red de centros, no."
        />
        <SectorGrid items={MULTISITE_SECTORS} columns={5} className="mt-12" />
      </Section>

      <RelatedServices
        slugs={["multisite-performance-audit", "ebitda-improvement", "integration-100", "fractional-coo"]}
        title="Cuatro formas de intervenir. Un mismo objetivo: más EBITDA por centro."
        description="Del diagnóstico ejecutivo de tres semanas a la dirección de operaciones a tiempo parcial. Alcance, calendario y presupuesto cerrados antes de empezar; resultados medidos en el P&L."
        tone="white"
      />

      <LandingFaq
        items={MULTISITE_FAQS}
        title="Lo que suelen preguntar los CEOs de redes de centros."
        description="Tamaño, sector, datos necesarios y dedicación del equipo directivo. Si tu pregunta no está aquí, la primera conversación es sin compromiso."
        tone="muted"
      />

      <CtaBand
        title="¿Cuánto EBITDA pierde tu red por no operar de la misma forma en todos los centros?"
        description="Completa el diagnóstico de 3 minutos y descubre el nivel de madurez operativa de tu red en finanzas, operaciones, personas, datos y escalabilidad. Sin compromiso, resultado inmediato."
        location="multisite_final"
      />
    </>
  );
}
