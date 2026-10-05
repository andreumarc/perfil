import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { AboutHero } from "@/components/about/about-hero";
import { profilePageJsonLd } from "@/components/about/about-json-ld";
import { AboutLinks } from "@/components/about/about-links";
import { CareerTimeline } from "@/components/about/career-timeline";
import { ConceptTags } from "@/components/about/concept-tags";
import { FitList } from "@/components/about/fit-list";
import { Principles } from "@/components/about/principles";
import { Section, SectionHeading } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { StatGrid } from "@/components/sections/stat-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sobre mí: Director de Operaciones para empresas multicentro",
  description:
    "Director de Operaciones multicentro: redes de hasta 25 centros, P&L de 35 M€ y equipos de 250 personas en healthcare, dental, veterinaria y retail. Base en Barcelona.",
  path: "/sobre-mi",
  keywords: [
    "director operaciones multicentro",
    "consultor operaciones multicentro",
    "fractional COO Barcelona",
    "director de operaciones externo",
    "integración post adquisición",
    "P&L por centro",
  ],
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      {/* Credenciales ------------------------------------------------------- */}
      <Section tone="muted" size="compact">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow">Credenciales</p>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Cifras de responsabilidad directa, no de proyectos acompañados. Sin clientes inventados ni porcentajes
              de mejora: lo que se puede comprobar en una conversación.
            </p>
          </div>
          <StatGrid />
        </div>
      </Section>

      {/* Trayectoria -------------------------------------------------------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="Trayectoria"
              title="Lo que he hecho, no dónde lo he hecho"
              description="Siete responsabilidades que se repiten a lo largo de mi carrera en redes de centros. Son las mismas que hoy pongo al servicio de otras empresas multicentro."
            />
            <Link
              href="/casos"
              className="mt-8 inline-flex min-h-11 items-center gap-2 text-base font-medium text-navy-900 underline-offset-4 hover:underline"
            >
              Ver ejemplos de intervención
              <ArrowRightIcon aria-hidden className="size-4" />
            </Link>
          </div>
          <CareerTimeline />
        </div>
      </Section>

      {/* Cómo trabajo ------------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Cómo trabajo"
          title="Cinco principios que se notan desde la primera semana"
          description="No son valores de presentación corporativa: son las reglas con las que decido qué se mide, qué se cambia y en qué orden."
        />
        <Principles className="mt-12" />
      </Section>

      {/* Útil / no útil ----------------------------------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="Encaje"
          title="En qué soy útil y en qué no"
          description="Decirlo antes ahorra tiempo a los dos. Si tu situación está en la columna de la derecha, te lo diré en la primera llamada."
        />
        <FitList className="mt-12" />
      </Section>

      {/* Conceptos clave + contacto ---------------------------------------- */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading
            eyebrow="Conceptos clave"
            title="Las ideas detrás de cada proyecto"
            description="Si estas palabras aparecen en tu plan de negocio, en el informe para el consejo o en la agenda del próximo comité de dirección, probablemente tengamos de qué hablar."
          />
          <div>
            <ConceptTags />
            <div className="mt-10 border-t border-gray-200 pt-8">
              <p className="eyebrow">Hablemos</p>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-gray-600">
                Una sesión de 30 minutos para revisar tu red: número de centros, cómo se mide hoy la rentabilidad y
                qué decisión tienes pendiente. Sin presentación comercial.
              </p>
              <AboutLinks location="about_contact" className="mt-6" />
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        location="about_final"
        title="¿Quieres saber en qué punto está tu red antes de hablar?"
        description="El diagnóstico gratuito de 3 minutos sitúa tu organización en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad. Resultado inmediato y sin compromiso."
      />

      <JsonLd data={profilePageJsonLd()} />
    </>
  );
}
