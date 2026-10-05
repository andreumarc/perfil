import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { ServiceCard } from "@/components/sections/service-card";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceComparisonTable } from "@/components/services/service-comparison-table";
import { ServiceJourney } from "@/components/services/service-journey";
import { ServiceScenarios } from "@/components/services/service-scenarios";
import { servicesItemListJsonLd } from "@/components/services/services-json-ld";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { meetingCta, meetingHref, primaryCta } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Servicios para empresas multicentro",
  description:
    "Auditoría operativa, sprint de EBITDA, integración post-adquisición y Fractional COO para redes de centros. Precios orientativos y alcance cerrado antes de empezar.",
  path: "/servicios",
  keywords: [
    "consultor operaciones multicentro",
    "auditoría operativa multicentro",
    "mejorar EBITDA empresa",
    "integración post adquisición",
    "fractional COO España",
    "P&L por centro",
  ],
});

export default function ServicesPage() {
  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <section className="border-b border-gray-200 bg-white">
        <Container className="pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "Servicios", path: "/servicios" }]} />
          <div className="mt-8 grid gap-10 md:mt-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
            <div>
              <SectionHeading
                as="h1"
                eyebrow="Servicios"
                title="Cuatro formas de mejorar el rendimiento de una red de centros"
                description={
                  <>
                    <p>
                      Todos parten del mismo principio: medir cada centro con los mismos criterios, comparar,
                      priorizar y ejecutar. Cambian la profundidad, la duración y el grado de implicación en la
                      ejecución.
                    </p>
                    <p className="mt-4">
                      Pensados para CEOs, Directores Generales, COOs, CFOs e inversores de redes de 5 a 100 centros en
                      healthcare, dental, veterinaria, retail y servicios. Precios orientativos; el alcance se
                      cierra por escrito antes de empezar.
                    </p>
                  </>
                }
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location: "services_hero" }}>
                    {primaryCta.label}
                    <ArrowRightIcon />
                  </TrackedLink>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: "services_hero" }}>
                    {meetingCta.label}
                  </TrackedLink>
                </Button>
              </div>
            </div>
            <ServiceJourney />
          </div>
        </Container>
      </section>

      {/* Grid de servicios ------------------------------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="Catálogo"
          title="Un servicio para cada fase: medir, ejecutar, integrar, dirigir"
          description="Cada uno tiene un alcance, una duración y un precio orientativo definidos. Sin cuotas abiertas ni propuestas que cambian a mitad de camino."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>

      {/* Comparativa ------------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Comparativa"
          title="Los cuatro servicios, lado a lado"
          description="Para quién es cada uno, cuánto dura, desde qué inversión y qué resultado deja en la organización."
        />
        <ServiceComparisonTable className="mt-12" />
      </Section>

      {/* Escenarios -------------------------------------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="¿Cuál encaja con tu situación?"
          title="Empieza por el problema, no por el servicio"
          description="Cuatro situaciones habituales en redes de centros y el servicio que las resuelve. Si la tuya no está aquí, el diagnóstico gratuito la localiza en 3 minutos."
        />
        <ServiceScenarios className="mt-12" />
      </Section>

      <CtaBand location="services_final" />

      <JsonLd data={servicesItemListJsonLd(SERVICES)} />
    </>
  );
}
