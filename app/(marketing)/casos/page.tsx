import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { CaseIndex } from "@/components/cases/case-index";
import { CaseList } from "@/components/cases/case-list";
import { CasesDisclaimer } from "@/components/cases/cases-disclaimer";
import { casesItemListJsonLd } from "@/components/cases/cases-json-ld";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { CASES } from "@/content/cases";
import { pageMetadata } from "@/lib/seo";
import { meetingCta, meetingHref, primaryCta } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Casos de intervención en redes multicentro",
  description:
    "Seis ejemplos de intervención en redes de clínicas, tiendas, gimnasios y plataformas de Private Equity: P&L por centro, KPIs, coste de personal e integración de adquisiciones.",
  path: "/casos",
  keywords: [
    "casos gestión multicentro",
    "P&L por centro",
    "rentabilidad por centro",
    "integración de clínicas adquiridas",
    "coste de personal retail",
    "playbook integración private equity",
    "cuadro de mando multicentro",
  ],
});

export default function CasesPage() {
  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <section className="border-b border-gray-200 bg-white">
        <Container className="pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "Casos de intervención", path: "/casos" }]} />
          <div className="mt-8 max-w-3xl md:mt-12">
            <SectionHeading
              as="h1"
              eyebrow="Casos de intervención"
              title="Seis situaciones habituales en redes multicentro y cómo se intervienen"
              description="Ejemplos construidos a partir de los problemas que se repiten en redes de clínicas, tiendas, gimnasios y plataformas de inversión. Sirven para reconocer tu situación y ver, paso a paso, qué se haría en cada caso: qué se mide, qué se cambia y qué queda en la organización al terminar."
            />
            <CasesDisclaimer className="mt-8" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" className="w-full sm:w-auto">
                <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location: "cases_hero" }}>
                  {primaryCta.label}
                  <ArrowRightIcon />
                </TrackedLink>
              </Button>
              <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
                <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: "cases_hero" }}>
                  {meetingCta.label}
                </TrackedLink>
              </Button>
            </div>
          </div>

          <div className="mt-14 md:mt-16">
            <p className="eyebrow">En un vistazo</p>
            <CaseIndex className="mt-4" />
          </div>
        </Container>
      </section>

      {/* Casos ------------------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Los seis casos"
          title="Mismo método, distinta situación: medir, comparar, priorizar y ejecutar"
          description="Cada caso describe la red, la situación de partida, los problemas detectados, la intervención y el resultado esperado. Al final de cada uno, el servicio con el que se abordaría y el acceso al diagnóstico gratuito."
        />
        <CaseList className="mt-12" />
      </Section>

      <CtaBand
        location="cases_final"
        title="¿Reconoces tu red en alguno de estos casos?"
        description="El diagnóstico gratuito de 3 minutos sitúa tu organización en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad. Si prefieres hablarlo directamente, reserva una sesión de 30 minutos."
      />

      <JsonLd data={casesItemListJsonLd(CASES)} />
    </>
  );
}
