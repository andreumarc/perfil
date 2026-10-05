import {
  HEALTHCARE_FAQS,
  HEALTHCARE_METRICS,
  HEALTHCARE_PROBLEMS,
  HEALTHCARE_SUBSECTORS,
} from "@/components/landing/data/healthcare";
import { LandingFaq } from "@/components/landing/landing-faq";
import { LandingHero } from "@/components/landing/landing-hero";
import { MetricGrid } from "@/components/landing/metric-grid";
import { Pillars } from "@/components/landing/pillars";
import { RelatedServices } from "@/components/landing/related-services";
import { SectorGrid } from "@/components/landing/sector-grid";
import { HealthcareVisual } from "@/components/landing/visuals/healthcare-visual";
import { Section, SectionHeading } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { DiagnosticTeaser } from "@/components/sections/diagnostic-teaser";
import { pageMetadata } from "@/lib/seo";
import { meetingCta, meetingHref, primaryCta } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Operaciones y rentabilidad para grupos de clínicas | Healthcare",
  description:
    "Rentabilidad por clínica, ocupación de gabinetes, productividad por profesional y conversión de primera visita para grupos dentales, veterinarios, oftalmológicos, capilares, de fisioterapia, estética, centros médicos y residencias.",
  path: "/healthcare",
  keywords: [
    "consultor healthcare",
    "gestión clínicas dentales",
    "gestión clínicas veterinarias",
    "rentabilidad por clínica",
    "grupo de clínicas operaciones",
    "KPIs clínica dental",
    "ocupación de gabinetes",
    "conversión primera visita tratamiento",
    "integración de clínicas adquiridas",
    "director de operaciones clínicas",
  ],
});

export default function HealthcarePage() {
  return (
    <>
      <LandingHero
        location="healthcare_hero"
        breadcrumbs={[{ name: "Healthcare", path: "/healthcare" }]}
        eyebrow="Healthcare · Grupos de clínicas"
        title="Rentabilidad por clínica, una sola forma de operar y managers que dirigen con datos."
        description="Para grupos de clínicas dentales, veterinarias, oftalmológicas, capilares, de fisioterapia, estética, centros médicos y residencias. Ocupación de gabinetes, productividad por profesional, conversión de primera visita y EBITDA por clínica, con un método dirigido desde dentro de redes de hasta 25 centros."
        primary={{ label: primaryCta.label, href: primaryCta.href }}
        secondary={{ label: meetingCta.label, href: meetingHref, event: "meeting_clicked" }}
        proofPoints={["25 centros dirigidos", "35 M€ de P&L", "250 personas", "Healthcare, dental y veterinaria"]}
        visual={<HealthcareVisual />}
      />

      <Section>
        <SectionHeading
          eyebrow="¿Te resulta familiar?"
          title="Los problemas típicos de un grupo de clínicas no son clínicos. Son de operación."
          description="Buenos profesionales, demanda suficiente y, aun así, un EBITDA que no crece con el número de clínicas. Seis síntomas que aparecen en casi todos los grupos a partir de la quinta clínica."
        />
        <Pillars items={HEALTHCARE_PROBLEMS} columns={3} className="mt-12" />
      </Section>

      <Section tone="muted" id="kpis" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Qué medimos en una red de clínicas"
          title="Seis indicadores, una sola definición para todas las clínicas."
          description="No hacen falta cuarenta KPIs. Hacen falta seis bien definidos, calculados igual en cada clínica y revisados cada semana con el responsable que puede actuar sobre ellos."
        />
        <MetricGrid items={HEALTHCARE_METRICS} className="mt-12" />
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Subsectores"
          title="Cada especialidad tiene sus palancas. El modelo de gestión es el mismo."
          description="He dirigido redes en healthcare, dental y veterinaria. El método de P&L por clínica, benchmarking interno y managers con rutinas se aplica igual en el resto de especialidades; cambian los indicadores que más pesan."
        />
        <SectorGrid items={HEALTHCARE_SUBSECTORS} columns={4} className="mt-12" />
      </Section>

      <RelatedServices
        slugs={["multisite-performance-audit", "ebitda-improvement", "integration-100", "fractional-coo"]}
        eyebrow="Servicios para grupos de clínicas"
        title="Del diagnóstico por clínica a la dirección operativa del grupo."
        description="Cuatro formatos según la situación: saber dónde gana y pierde dinero cada clínica, mover el EBITDA en un trimestre, integrar las clínicas adquiridas o contar con un Director de Operaciones a tiempo parcial."
      />

      <DiagnosticTeaser location="healthcare_mid" />

      <LandingFaq
        items={HEALTHCARE_FAQS}
        title="Lo que suelen preguntar los directores de grupos de clínicas."
        description="Software, equipos clínicos, tamaño mínimo y autonomía clínica. Si tu pregunta no está aquí, la primera conversación es sin compromiso."
        tone="muted"
      />

      <CtaBand
        title="¿Sabes qué clínicas de tu grupo sostienen el EBITDA y cuáles lo consumen?"
        description="Completa el diagnóstico de 3 minutos y descubre el nivel de madurez operativa de tu grupo. Sin compromiso, resultado inmediato."
        location="healthcare_final"
      />
    </>
  );
}
