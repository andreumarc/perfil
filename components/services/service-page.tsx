import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ClockIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { ProblemList } from "@/components/sections/problem-list";
import { StatGrid } from "@/components/sections/stat-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { getService, type Service, type ServiceSlug } from "@/content/services";
import { faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { meetingHref, primaryCta } from "@/lib/site";

import { ServiceViewTracker } from "./service-view-tracker";
import { serviceContactHref, servicePath } from "./services-json-ld";

/** Titular y texto del bloque final de conversión, adaptados a cada servicio. */
const FINAL_CTA: Record<ServiceSlug, { title: string; description: string }> = {
  "multisite-performance-audit": {
    title: "¿Quieres saber dónde gana y dónde pierde dinero tu red?",
    description:
      "Empieza con el diagnóstico gratuito de 3 minutos para medir la madurez operativa de tu organización, o reserva una sesión de 30 minutos para hablar directamente de tus centros.",
  },
  "ebitda-improvement": {
    title: "¿Cuánto EBITDA puede recuperar tu red en un trimestre?",
    description:
      "El diagnóstico gratuito te da una primera lectura en 3 minutos. Si prefieres ir al grano, reserva una sesión de 30 minutos y lo valoramos con tus propios datos.",
  },
  "integration-100": {
    title: "¿Tienes una adquisición cerrada o a punto de cerrarse?",
    description:
      "Cuanto antes se prepare el plan de los 100 días, menos cuesta la integración. Haz el diagnóstico gratuito o reserva una sesión de 30 minutos para revisar la operación.",
  },
  "fractional-coo": {
    title: "¿Necesitas dirección operativa sin un COO a jornada completa?",
    description:
      "Haz el diagnóstico gratuito para ver el nivel de madurez de tu red o reserva una sesión de 30 minutos para valorar la dedicación que necesita tu empresa.",
  },
};

const PROCESS_COLS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

function pad(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** Separa "desde 1.950 €" en prefijo discreto + importe grande. */
function splitPrice(label: string): { prefix?: string; amount: string } {
  const match = /^(desde)\s+(.+)$/i.exec(label.trim());
  if (!match) return { amount: label };
  return { prefix: match[1].toLowerCase(), amount: match[2] };
}

/** Plantilla completa de la página de un servicio. */
export function ServicePage({ service }: { service: Service }) {
  const path = servicePath(service.slug);
  const contactHref = serviceContactHref(service.slug);
  const price = splitPrice(service.priceLabel);
  const next = service.nextStep ? getService(service.nextStep.slug) : undefined;
  const finalCta = FINAL_CTA[service.slug];

  return (
    <>
      <ServiceViewTracker slug={service.slug} name={service.name} />

      {/* Hero ------------------------------------------------------------- */}
      <section className="border-b border-gray-200 bg-white">
        <Container className="pt-6 pb-14 md:pt-8 md:pb-20">
          <Breadcrumbs
            items={[
              { name: "Servicios", path: "/servicios" },
              { name: service.name, path },
            ]}
          />
          <div className="mt-8 grid gap-10 md:mt-12 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-16">
            <div>
              <p className="eyebrow">{service.format}</p>
              <h1 className="font-display mt-4 text-4xl leading-[1.08] text-navy-900 sm:text-5xl md:text-[3.25rem]">
                {service.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
                {service.subheadline}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <TrackedLink
                    href={contactHref}
                    event="cta_clicked"
                    props={{ location: "service_hero", service: service.slug }}
                  >
                    {service.cta}
                    <ArrowRightIcon />
                  </TrackedLink>
                </Button>
                <Button asChild size="xl" variant="outline">
                  <TrackedLink
                    href={primaryCta.href}
                    event="cta_clicked"
                    props={{ location: "service_hero_secondary", service: service.slug }}
                  >
                    {primaryCta.label}
                  </TrackedLink>
                </Button>
              </div>
            </div>

            <aside
              aria-label="Inversión y formato"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Inversión orientativa</p>
              <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
                {price.prefix ? <span className="text-sm font-medium text-gray-500">{price.prefix}</span> : null}
                <span className="font-display tabular text-4xl leading-none text-navy-900 md:text-[2.75rem]">
                  {price.amount}
                </span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{service.priceNote}</p>
              <dl className="mt-6 border-t border-gray-200 pt-6 text-sm">
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 size-4 shrink-0 text-signal" />
                  <div>
                    <dt className="font-semibold text-navy-900">Formato</dt>
                    <dd className="mt-0.5 text-gray-600">{service.format}</dd>
                  </div>
                </div>
              </dl>
              <TrackedLink
                href={meetingHref}
                event="meeting_clicked"
                props={{ location: "service_price_card", service: service.slug }}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 underline-offset-4 hover:underline"
              >
                ¿Prefieres hablarlo antes? Reserva 30 minutos
                <ArrowRightIcon className="size-4" />
              </TrackedLink>
            </aside>
          </div>
        </Container>
      </section>

      {/* Para quién -------------------------------------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="Para quién"
          title="A quién va dirigido"
          description="Tres perfiles de decisión para los que este trabajo tiene un retorno claro y medible."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {service.forWhom.map((item, index) => (
            <li key={item} className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 md:p-7">
              <span className="font-display tabular text-3xl text-navy-300">{pad(index)}</span>
              <p className="mt-4 text-base leading-relaxed text-gray-700">{item}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Situaciones ------------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Situaciones que lo motivan"
          title="Las situaciones que suelen desencadenar este trabajo"
          description="Si reconoces alguna, el problema no es de esfuerzo del equipo: es de información, estructura o ejecución."
        />
        <ProblemList items={service.triggers} className="mt-12" />
      </Section>

      {/* Alcance ----------------------------------------------------------- */}
      <Section>
        <SectionHeading eyebrow="Alcance" title={service.scope.title} />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {service.scope.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3.5"
            >
              <CheckIcon className="mt-0.5 size-5 shrink-0 text-signal" />
              <span className="text-base leading-snug text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Entregables ------------------------------------------------------- */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <SectionHeading
            eyebrow="Entregables"
            title="Qué recibes"
            description="Documentos y herramientas de trabajo pensados para que el comité de dirección pueda decidir y el equipo pueda ejecutar."
          />
          <ol className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
            {service.deliverables.map((item, index) => (
              <li key={item} className="flex gap-4 p-5">
                <span className="tabular shrink-0 pt-0.5 text-sm font-semibold text-signal">{pad(index)}</span>
                <p className="text-base leading-relaxed text-gray-700">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Cómo se trabaja --------------------------------------------------- */}
      <Section>
        <SectionHeading
          eyebrow="Cómo se trabaja"
          title="Un método con fases, entregables y calendario cerrados"
          description="Cada fase tiene un objetivo, un resultado y una duración acotada. Sin sorpresas en el alcance ni en el calendario."
        />
        <ol className={`mt-12 grid gap-5 md:grid-cols-2 ${PROCESS_COLS[service.process.length] ?? "lg:grid-cols-4"}`}>
          {service.process.map((step, index) => (
            <li key={step.title} className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 md:p-7">
              <span className="font-display tabular text-3xl text-navy-300">{pad(index)}</span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-navy-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 md:text-[15px]">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Resultado --------------------------------------------------------- */}
      <Section tone="navy">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <SectionHeading tone="dark" eyebrow="Resultado" title="Qué cambia al terminar" />
          <p className="font-display text-2xl leading-snug text-white md:text-3xl">{service.outcome}</p>
        </div>
        <div className="mt-16 border-t border-white/15 pt-12">
          <p className="eyebrow text-navy-200">La experiencia detrás del servicio</p>
          <StatGrid tone="dark" className="mt-8" />
        </div>
      </Section>

      {/* FAQ --------------------------------------------------------------- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading
            eyebrow="Preguntas frecuentes"
            title="Lo que suelen preguntar antes de empezar"
            description={
              <>
                ¿Tienes otra pregunta?{" "}
                <TrackedLink
                  href={contactHref}
                  event="contact_clicked"
                  props={{ location: "service_faq", service: service.slug }}
                  className="font-medium text-navy-900 underline decoration-navy-300 underline-offset-4 hover:decoration-navy-900"
                >
                  Escríbeme
                </TrackedLink>{" "}
                y te respondo personalmente.
              </>
            }
          />
          <Faq items={service.faqs} />
        </div>
      </Section>

      {/* Siguiente paso ---------------------------------------------------- */}
      {next && service.nextStep ? (
        <Section tone="muted" size="compact">
          <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-2xl">
              <p className="eyebrow">Siguiente paso</p>
              <h2 className="font-display mt-3 text-2xl text-navy-900 md:text-3xl">{next.name}</h2>
              <p className="mt-3 text-base leading-relaxed text-gray-600">{service.nextStep.text}</p>
              <p className="tabular mt-3 text-sm text-gray-500">
                {next.format} · {next.priceLabel}
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="shrink-0">
              <Link href={servicePath(next.slug)}>
                Ver {next.shortName}
                <ArrowRightIcon />
              </Link>
            </Button>
          </div>
        </Section>
      ) : null}

      <CtaBand location="service_final" title={finalCta.title} description={finalCta.description} />

      <JsonLd
        data={[
          serviceJsonLd({
            name: service.name,
            description: service.metaDescription,
            path,
            priceFrom: service.priceFrom,
            priceUnit: service.priceUnit,
          }),
          faqJsonLd(service.faqs),
        ]}
      />
    </>
  );
}
