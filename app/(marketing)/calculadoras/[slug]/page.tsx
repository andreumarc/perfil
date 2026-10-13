import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CheckIcon, MinusIcon } from "lucide-react";

import { CalculatorForm } from "@/components/calculators/calculator-form";
import { QuoteForm } from "@/components/forms/quote-form";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { CALCULATORS, CALCULATOR_IDS, getCalculator, resolveRates } from "@/lib/calculators/definitions";
import { getService } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return CALCULATOR_IDS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const def = getCalculator(slug);
  if (!def) return {};
  const s = await getSettings();
  return pageMetadata({
    title: def.metaTitle,
    description: def.metaDescription,
    path: `/calculadoras/${def.id}`,
    siteName: s.company.name,
    keywords: def.keywords,
    image: def.imagePath,
  });
}

export default async function CalculatorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const def = getCalculator(slug);
  const settings = await getSettings();
  if (!def || !settings.calculators.enabled) notFound();

  const rates = resolveRates(def, settings.calculators.rates[def.id]);
  const service = await getService(def.serviceSlug);
  const others = CALCULATORS.filter((c) => c.id !== def.id);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);
  const path = `/calculadoras/${def.id}`;

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Calculadoras", path: "/calculadoras" }, { name: def.shortName, path }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Calculadora · {def.shortName}</p>
              <h1 className="font-display mt-3 text-3xl text-ink-900 sm:text-4xl md:text-5xl">{def.headline}</h1>
              <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">{def.description}</p>
            </div>
            {def.imagePath ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-900">
                <Image src={def.imagePath} alt="" fill priority sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="muted" className="py-12 md:py-16">
        <CalculatorForm id={def.id} rates={rates} disclaimer={settings.calculators.disclaimer}>
          <QuoteForm
            layout="compact"
            source="calculadora"
            variant={def.formVariant}
            defaultServiceSlug={service?.slug ?? ""}
            submitLabel="Pedir presupuesto con estos datos"
            intro="Te llamamos en horario comercial para concretar detalles. El resumen del cálculo se adjunta automáticamente a tu solicitud."
          />
        </CalculatorForm>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-ink-900">Qué incluye la estimación</h2>
            <ul className="mt-5 space-y-3">
              {def.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-olive-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink-900">Qué no incluye</h2>
            <ul className="mt-5 space-y-3">
              {def.excludes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                  <MinusIcon className="mt-0.5 size-4 shrink-0 text-gray-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {service ? (
          <p className="mt-10 text-base text-gray-600">
            Más información sobre este servicio:{" "}
            <Link href={`/servicios/${service.slug}`} className="inline-flex items-center gap-1 font-semibold text-ink-900 underline-offset-4 hover:underline">
              {service.name} <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </p>
        ) : null}
      </Section>

      {def.faqs.length ? (
        <Section tone="muted">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="Preguntas frecuentes" title={`Dudas habituales sobre ${def.shortName.toLowerCase()}`} />
            <Faq items={def.faqs} />
          </div>
          <JsonLd data={faqJsonLd(def.faqs)} />
        </Section>
      ) : null}

      <Section tone="white" size="compact">
        <SectionHeading eyebrow="Otras calculadoras" title="Calcula otras partidas de tu proyecto" />
        <ul className="mt-8 flex flex-wrap gap-2">
          {others.map((c) => (
            <li key={c.id}>
              <Link href={`/calculadoras/${c.id}`} className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink-900 hover:border-copper-400 hover:bg-copper-50">
                {c.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand location="calculator_footer" whatsappHref={wa} />
    </>
  );
}
