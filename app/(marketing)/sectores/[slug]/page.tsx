import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { ArticleCard } from "@/components/blog/article-card";
import { Markdown } from "@/components/content/markdown";
import { QuoteForm } from "@/components/forms/quote-form";
import { ProjectCard } from "@/components/home/projects-showcase";
import { ServiceCard } from "@/components/home/services-overview";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { SECTOR_SLUGS } from "@/content/sectors";
import { toCardData } from "@/lib/blog";
import { getArticlesForServices, getCategories } from "@/lib/cms/articles";
import { getFaqs } from "@/lib/cms/faqs";
import { getProjects } from "@/lib/cms/projects";
import { getSector, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { variantForSector } from "@/lib/forms";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return SECTOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [sector, s] = await Promise.all([getSector(slug), getSettings()]);
  if (!sector) return {};
  return pageMetadata({
    title: sector.metaTitle ?? sector.headline,
    description: sector.metaDescription ?? sector.summary,
    path: `/sectores/${sector.slug}`,
    siteName: s.company.name,
    image: sector.imagePath,
  });
}

export default async function SectorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) notFound();

  const [settings, services, faqs, projects, articles, categories] = await Promise.all([
    getSettings(),
    getServices(),
    getFaqs("sector", slug),
    getProjects(),
    getArticlesForServices(sector.serviceSlugs, 3),
    getCategories(),
  ]);
  const related = sector.serviceSlugs.map((s) => services.find((x) => x.slug === s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const relatedProjects = projects.filter((p) => p.sectorSlug === sector.slug).slice(0, 3);
  const faqItems = faqs.length ? faqs : sector.faqs;
  const variant = variantForSector(sector.slug);
  const path = `/sectores/${sector.slug}`;
  const serviceNames = Object.fromEntries(services.map((s) => [s.slug, s.shortName]));

  return (
    <>
      <JsonLd data={serviceJsonLd({ name: sector.headline, description: sector.summary, path, areaServed: settings.company.zones })} />

      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Sectores", path: "/sectores" }, { name: sector.name, path }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">Sector · {sector.name}</p>
              <h1 className="font-display mt-3 text-3xl text-ink-900 sm:text-4xl md:text-5xl">{sector.headline}</h1>
              <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">{sector.summary}</p>
              <div className="mt-8">
                <Button asChild size="xl">
                  <TrackedLink href="#presupuesto" event="cta_clicked" props={{ location: "sector_hero", slug: sector.slug }}>
                    Pedir presupuesto sin compromiso
                    <ArrowRightIcon aria-hidden />
                  </TrackedLink>
                </Button>
              </div>
            </div>
            {sector.imagePath ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-900">
                <Image src={sector.imagePath} alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {sector.body ? (
        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <SectionHeading eyebrow="Cómo lo planteamos" title={`Reformar ${sector.name.toLowerCase()}: lo que hay que tener en cuenta`} />
            <Markdown content={sector.body} />
          </div>
        </Section>
      ) : null}

      {related.length ? (
        <Section tone="muted">
          <SectionHeading eyebrow="Servicios" title={`Servicios más habituales en ${sector.name.toLowerCase()}`} />
          <RevealGroup className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" amount={0.05}>
            {related.map((s) => (
              <RevealItem key={s.slug} scale>
                <ServiceCard service={s} compact />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {relatedProjects.length ? (
        <Section tone="white">
          <SectionHeading eyebrow="Proyectos" title="Alcance habitual en este sector" description="Ejemplos del alcance y el proceso habituales en este sector." />
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((p) => (
              <RevealItem key={p.slug}>
                <ProjectCard project={p} serviceName={p.serviceSlug ? serviceNames[p.serviceSlug] : undefined} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {faqItems.length ? (
        <Section tone="muted">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="Preguntas frecuentes" title={`Dudas habituales en ${sector.name.toLowerCase()}`} />
            <Faq items={faqItems} />
          </div>
          <JsonLd data={faqJsonLd(faqItems)} />
        </Section>
      ) : null}

      {articles.length ? (
        <Section tone="white">
          <SectionHeading eyebrow="Blog" title="Guías y precios relacionados" />
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <RevealItem key={a.slug}>
                <ArticleCard article={toCardData(a, categories)} className="h-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      <Section tone="muted" id="presupuesto" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="eyebrow">Presupuesto</p>
            <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">Cuéntanos tu proyecto</h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              Te llamamos para entender la actividad y el espacio, lo visitamos y te enviamos un presupuesto detallado por partidas, sin compromiso.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.06)] md:p-8">
            <QuoteForm layout="full" source="sector" variant={variant} defaultSectorSlug={sector.slug} defaultServiceSlug={related[0]?.slug ?? ""} />
          </div>
        </div>
      </Section>
    </>
  );
}
