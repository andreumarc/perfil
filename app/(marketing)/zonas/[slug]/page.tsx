import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Markdown } from "@/components/content/markdown";
import { QuoteForm } from "@/components/forms/quote-form";
import { ServiceCard } from "@/components/home/services-overview";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { LOCAL_AREAS } from "@/content/zones";
import { getFaqs } from "@/lib/cms/faqs";
import { getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { getZone, getZones } from "@/lib/cms/zones";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return LOCAL_AREAS.filter((z) => z.status === "published").map((z) => ({ slug: z.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [zone, s] = await Promise.all([getZone(slug), getSettings()]);
  if (!zone) return {};
  return pageMetadata({
    title: zone.metaTitle ?? zone.headline,
    description: zone.metaDescription ?? zone.summary,
    path: `/zonas/${zone.slug}`,
    siteName: s.company.name,
  });
}

export default async function ZonePage({ params }: { params: Params }) {
  const { slug } = await params;
  const zone = await getZone(slug);
  if (!zone) notFound();

  const [services, zones, faqs] = await Promise.all([getServices(), getZones(), getFaqs("area", slug)]);
  const related = zone.serviceSlugs.map((s) => services.find((x) => x.slug === s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const others = zones.filter((z) => z.slug !== zone.slug);
  const faqItems = faqs.length ? faqs : zone.faqs;
  const path = `/zonas/${zone.slug}`;

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: zone.headline, description: zone.summary, path, areaServed: [zone.name] })} />

      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Zonas", path: "/zonas" }, { name: zone.name, path }]} />
          <p className="eyebrow mt-6">Zona de actuación · {zone.province}</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">{zone.headline}</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">{zone.summary}</p>
          <div className="mt-8">
            <Button asChild size="xl">
              <TrackedLink href="#presupuesto" event="cta_clicked" props={{ location: "zone_hero", slug: zone.slug }}>
                Pedir presupuesto sin compromiso
                <ArrowRightIcon aria-hidden />
              </TrackedLink>
            </Button>
          </div>
        </Container>
      </section>

      {zone.body ? (
        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <SectionHeading eyebrow="Cómo trabajamos aquí" title={`Reformas e instalaciones en ${zone.name}`} />
            <Markdown content={zone.body} />
          </div>
        </Section>
      ) : null}

      {related.length ? (
        <Section tone="muted">
          <SectionHeading eyebrow="Servicios" title={`Servicios más demandados en ${zone.name}`} />
          <RevealGroup className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" amount={0.05}>
            {related.map((s) => (
              <RevealItem key={s.slug} scale>
                <ServiceCard service={s} compact />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {faqItems.length ? (
        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="Preguntas frecuentes" title={`Dudas habituales en ${zone.name}`} />
            <Faq items={faqItems} />
          </div>
          <JsonLd data={faqJsonLd(faqItems)} />
        </Section>
      ) : null}

      <Section tone="muted" id="presupuesto" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="eyebrow">Presupuesto</p>
            <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">Tu proyecto en {zone.name}</h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">Cuéntanos qué necesitas y dónde. Te llamamos, visitamos el espacio y te enviamos un presupuesto por partidas sin compromiso.</p>
            {others.length ? (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Otras zonas</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {others.map((z) => (
                    <li key={z.slug}>
                      <Link href={`/zonas/${z.slug}`} className="inline-flex rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-ink-900 hover:border-copper-400 hover:bg-copper-50">
                        {z.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.06)] md:p-8">
            <QuoteForm layout="full" source="zona" variant="general" />
          </div>
        </div>
      </Section>
    </>
  );
}
