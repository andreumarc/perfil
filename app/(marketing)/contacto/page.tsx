import { Suspense } from "react";
import { ArrowRightIcon, CalculatorIcon, ClipboardCheckIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ContactAside } from "@/components/contact/contact-aside";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactFormSkeleton } from "@/components/contact/contact-form-skeleton";
import { CONTACT_PATH, contactPageJsonLd } from "@/components/contact/contact-json-ld";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contacto: cuéntame tu situación en dos líneas",
  description:
    "Escribe a Marc Andreu Guerao, Director de Operaciones para empresas multicentro. Número de centros, sector y qué te quita el sueño: respuesta personal en menos de 48 h o sesión de 30 min.",
  path: CONTACT_PATH,
  keywords: [
    "contacto director operaciones multicentro",
    "consultor operaciones multicentro",
    "fractional COO Barcelona",
    "sesión estratégica operaciones",
    "integración post adquisición",
  ],
});

const RESOURCES = [
  {
    slug: "diagnostico",
    title: "Diagnóstico Multisite",
    description:
      "15 preguntas, 3 minutos. Sitúa tu red en cinco bloques (finanzas, operaciones, personas, datos y escalabilidad) y devuelve las tres acciones prioritarias.",
    href: "/diagnostico",
    cta: "Hacer diagnóstico gratuito",
    icon: ClipboardCheckIcon,
  },
  {
    slug: "calculadora",
    title: "Calculadora EBITDA",
    description:
      "Seis datos de tu P&L frente a rangos de referencia de gestión por sector. Sin registro para ver el benchmark; con una primera lectura personal si la pides.",
    href: "/calculadora-ebitda",
    cta: "Calcular mi oportunidad",
    icon: CalculatorIcon,
  },
] as const;

export default function ContactoPage() {
  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "Contacto", path: CONTACT_PATH }]} />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <ContactAside />
            <div className="relative rounded-lg border border-gray-200 bg-white p-6 md:p-8">
              <Suspense fallback={<ContactFormSkeleton />}>
                <ContactForm />
              </Suspense>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="muted" size="compact">
        <SectionHeading
          eyebrow="Si prefieres empezar por los datos"
          title="Dos formas de llegar con los deberes hechos"
          description="Ninguna sustituye a la conversación, pero las dos la hacen más corta: llegas sabiendo dónde está tu red y qué quieres decidir."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {RESOURCES.map((resource) => {
            const Icon = resource.icon;
            return (
              <TrackedLink
                key={resource.slug}
                href={resource.href}
                event="cta_clicked"
                props={{ location: "contact_resources", resource: resource.slug }}
                className="group flex flex-col rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:border-navy-900/30 md:p-7"
              >
                <Icon className="size-6 text-signal" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold text-navy-900">{resource.title}</h3>
                <p className="mt-2 flex-1 text-base leading-relaxed text-gray-600">{resource.description}</p>
                <span className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-navy-900">
                  {resource.cta}
                  <ArrowRightIcon
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </TrackedLink>
            );
          })}
        </div>
      </Section>

      <JsonLd data={contactPageJsonLd()} />
    </>
  );
}
