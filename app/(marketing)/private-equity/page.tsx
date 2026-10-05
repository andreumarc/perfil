import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import {
  PE_ADVANTAGES,
  PE_FAQS,
  PE_PHASES,
  PE_PILLARS,
  PE_PROFILES,
} from "@/components/landing/data/private-equity";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingHero } from "@/components/landing/landing-hero";
import { OperatorAdvantage } from "@/components/landing/operator-advantage";
import { PhaseTimeline } from "@/components/landing/phase-timeline";
import { Pillars } from "@/components/landing/pillars";
import { RelatedServices } from "@/components/landing/related-services";
import { PeVisual } from "@/components/landing/visuals/pe-visual";
import { WhoIsItFor } from "@/components/landing/who-is-it-for";
import { Section, SectionHeading } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { pageMetadata } from "@/lib/seo";
import { primaryCta } from "@/lib/site";

const PE_CONTACT_HREF = "/contacto?interes=private-equity";

export const metadata = pageMetadata({
  title: "Operational Value Creation para Private Equity y Buy & Build",
  description:
    "Due diligence operativa, integración de add-ons en 100 días y mejora de EBITDA en participadas multicentro. Ejecutado por un operador: 25 centros, 35 M€ de P&L, 250 personas.",
  path: "/private-equity",
  keywords: [
    "operational due diligence",
    "buy and build operations",
    "operational value creation",
    "operating partner España",
    "value creation plan participada",
    "integración post adquisición",
    "post merger integration",
    "plan 100 días add-on",
    "mejora EBITDA participada",
    "private equity operaciones multicentro",
  ],
});

export default function PrivateEquityPage() {
  return (
    <>
      <LandingHero
        tone="navy"
        location="pe_hero"
        breadcrumbs={[{ name: "Private Equity", path: "/private-equity" }]}
        eyebrow="Private Equity · Buy & Build · Operating Partners"
        title="Operational Value Creation para compañías Buy & Build"
        description="Due diligence operativa, integración de add-ons en 100 días y mejora de EBITDA en participadas multicentro. Ejecutado por un operador que ha dirigido 25 centros, 35 M€ de P&L y 250 personas, no por un equipo de analistas."
        primary={{ label: "Analizar una participada", href: PE_CONTACT_HREF }}
        secondary={{ label: primaryCta.label, href: primaryCta.href }}
        proofPoints={["25 centros dirigidos", "35 M€ de P&L", "250 personas", "Integración post-adquisición"]}
        visual={<PeVisual />}
      />

      <Section>
        <SectionHeading
          eyebrow="Para quién"
          title="Para quien tiene que responder por el EBITDA de una participada multicentro."
          description="Fondos con estrategia Buy & Build en healthcare, dental, veterinaria, retail, fitness y servicios; plataformas de 5 a 100 centros que crecen por adquisición; y sus equipos directivos."
        />
        <WhoIsItFor items={PE_PROFILES} className="mt-12" />
      </Section>

      <Section tone="muted" id="pilares" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Qué hago en una participada"
          title="Diez pilares. Un único objetivo: EBITDA demostrable y una plataforma replicable."
          description="No son servicios aislados sino las piezas de un mismo modelo operativo. En cada participada se trabaja sobre las que el plan de inversión necesita, en el orden que marca el ciclo."
        />
        <Pillars items={PE_PILLARS} columns={2} className="mt-12" />
      </Section>

      <Section id="ciclo" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Ciclo de inversión"
          title="Qué aporto en cada fase, del pre-deal a la salida."
          description="El valor operativo se construye antes de la firma y se demuestra en la venta. Entre medias, 100 días para integrar y el resto del periodo de inversión para mejorar y escalar."
        />
        <PhaseTimeline phases={PE_PHASES} className="mt-14" />

        <div className="mt-14 flex flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-base text-gray-600">
            Si el target o la participada ya está identificada, la primera conversación sirve para situar en qué fase
            está y qué pieza falta.
          </p>
          <TrackedLink
            href={PE_CONTACT_HREF}
            event="cta_clicked"
            props={{ location: "pe_cycle" }}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 text-base font-semibold text-navy-900 underline-offset-4 hover:underline"
          >
            Analizar una participada
            <ArrowRightIcon className="size-4" />
          </TrackedLink>
        </div>
      </Section>

      <OperatorAdvantage
        eyebrow="Por qué un operador y no una consultora"
        title="He estado al otro lado de la mesa: responsable del P&L, de los equipos y del resultado."
        description="Director de operaciones de redes de hasta 25 centros, con un P&L de 35 M€ y equipos de 250 personas en healthcare, dental, veterinaria y retail. Integración operativa de centros adquiridos y dirección regional. Eso cambia el diagnóstico y, sobre todo, la ejecución con los managers que tienen que sostener el cambio."
        items={PE_ADVANTAGES}
        location="pe_operator"
      />

      <RelatedServices
        slugs={["integration-100", "multisite-performance-audit", "fractional-coo"]}
        eyebrow="Servicios para fondos y participadas"
        title="Tres formatos de intervención, con alcance y honorarios cerrados antes de empezar."
        description="Integración de add-ons en 100 días, diagnóstico de una participada o de un target en 3-4 semanas y dirección operativa a tiempo parcial durante el periodo de inversión."
        tone="white"
      />

      <LandingFaq
        items={PE_FAQS}
        title="Lo que suele preguntar un inversor antes de empezar."
        description="Confidencialidad, plazos, reporting y honorarios. Si tu pregunta no está aquí, la primera conversación es sin compromiso."
        tone="muted"
      />

      <CtaBand
        eyebrow="Siguiente paso"
        title="¿Tienes una participada multicentro con potencial de EBITDA sin capturar?"
        description="Cuéntame el caso en 30 minutos: situación, objetivo de EBITDA y calendario. Te diré con franqueza si puedo aportar y por dónde empezaría."
        primaryLabel="Analizar una participada"
        primaryHref={PE_CONTACT_HREF}
        location="pe_final"
      />
    </>
  );
}
