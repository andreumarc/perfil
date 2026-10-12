import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CalculatorIcon, CheckIcon, UsersIcon } from "lucide-react";

import { TrackView } from "@/components/analytics/track-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ArticleCard } from "@/components/blog/article-card";
import { Markdown } from "@/components/content/markdown";
import { QuoteForm } from "@/components/forms/quote-form";
import { ProjectCard } from "@/components/home/projects-showcase";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Faq } from "@/components/sections/faq";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { LicenseNotice } from "@/components/sections/license-notice";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { SERVICE_SLUGS, getServiceGroup } from "@/content/services";
import { toCardData } from "@/lib/blog";
import { CALCULATORS } from "@/lib/calculators/definitions";
import { getArticlesForService, getCategories } from "@/lib/cms/articles";
import { getFaqs } from "@/lib/cms/faqs";
import { getProjects } from "@/lib/cms/projects";
import { getService, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { variantForService } from "@/lib/forms";
import { faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [service, s] = await Promise.all([getService(slug), getSettings()]);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle ?? `${service.name} en ${s.company.city || "Barcelona"} y toda España`,
    description: service.metaDescription ?? service.summary,
    path: `/servicios/${service.slug}`,
    siteName: s.company.name,
    keywords: service.keywords,
    image: service.imagePath,
  });
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();

  const [settings, all, faqs, projects, articles, categories] = await Promise.all([
    getSettings(),
    getServices(),
    getFaqs("service", slug),
    getProjects(),
    getArticlesForService(slug, 3),
    getCategories(),
  ]);
  const group = getServiceGroup(service.groupSlug);
  const siblings = all.filter((s) => s.groupSlug === service.groupSlug && s.slug !== service.slug);
  const relatedProjects = projects.filter((p) => p.serviceSlug === service.slug).slice(0, 3);
  const calculator = CALCULATORS.find((c) => c.serviceSlug === service.slug);
  const faqItems = faqs.length ? faqs : service.faqs;
  const variant = variantForService(service.slug, service.groupSlug);
  const path = `/servicios/${service.slug}`;
  const serviceNames = Object.fromEntries(all.map((s) => [s.slug, s.shortName]));

  return (
    <>
      <TrackView event="service_viewed" props={{ slug: service.slug, group: service.groupSlug }} />
      <JsonLd data={serviceJsonLd({ name: service.name, description: service.summary, path, areaServed: settings.company.zones })} />

      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Servicios", path: "/servicios" }, { name: service.shortName, path }]} />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow">{group.name}</p>
              <h1 className="font-display mt-3 text-3xl text-ink-900 sm:text-4xl md:text-5xl">{service.name}</h1>
              <p className="mt-4 text-lg text-ink-700 md:text-xl">{service.headline}</p>
              <p className="mt-4 max-w-2xl text-base text-gray-600 md:text-lg">{service.summary}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <TrackedLink href="#presupuesto" event="cta_clicked" props={{ location: "service_hero", slug: service.slug }}>
                    Pedir presupuesto sin compromiso
                    <ArrowRightIcon aria-hidden />
                  </TrackedLink>
                </Button>
                {calculator ? (
                  <Button asChild size="xl" variant="outline">
                    <TrackedLink href={`/calculadoras/${calculator.id}`} event="cta_clicked" props={{ location: "service_hero_calculator", slug: service.slug }}>
                      <CalculatorIcon aria-hidden />
                      Calcular precio orientativo
                    </TrackedLink>
                  </Button>
                ) : null}
              </div>
            </div>
            {service.imagePath ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-900">
                <Image src={service.imagePath} alt="" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                <IllustrativeBadge className="absolute top-3 left-3" />
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <Section tone="white">
        {service.requiresLicensedPro ? <LicenseNotice note={service.licenseNote} className="mb-10" /> : null}
        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          {service.features.length ? (
            <div>
              <h2 className="font-display text-2xl text-ink-900 md:text-3xl">Qué incluye</h2>
              <ul className="mt-5 space-y-3">
                {service.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-base text-gray-700">
                    <CheckIcon className="mt-1 size-4 shrink-0 text-copper-500" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {service.forWhom.length ? (
            <div>
              <h2 className="font-display text-2xl text-ink-900 md:text-3xl">Para quién</h2>
              <ul className="mt-5 space-y-3">
                {service.forWhom.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-base text-gray-700">
                    <UsersIcon className="mt-1 size-4 shrink-0 text-olive-500" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Section>

      {service.body ? (
        <Section tone="muted">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <SectionHeading eyebrow="En detalle" title={`Cómo trabajamos ${service.shortName.toLowerCase()}`} />
            <Markdown content={service.body} />
          </div>
        </Section>
      ) : null}

      {service.process.length ? (
        <Section tone="dark-grid">
          <SectionHeading eyebrow="Proceso" tone="dark" title="Paso a paso, sin sorpresas" />
          <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {service.process.map((step, i) => (
              <RevealItem key={step.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                <span className="font-display tabular text-3xl text-copper-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-200">{step.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {relatedProjects.length ? (
        <Section tone="white">
          <SectionHeading eyebrow="Proyectos" title="Alcance habitual de este tipo de obra" description="Ejemplos del alcance y el proceso. Las imágenes son ilustrativas hasta que se publiquen proyectos reales desde el panel." />
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProjects.map((p) => (
              <RevealItem key={p.slug}>
                <ProjectCard project={p} serviceName={serviceNames[service.slug]} />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {faqItems.length ? (
        <Section tone="muted">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="Preguntas frecuentes" title={`Dudas habituales sobre ${service.shortName.toLowerCase()}`} />
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
            <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">Cuéntanos tu proyecto de {service.shortName.toLowerCase()}</h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              Te llamamos para entender lo que necesitas, visitamos el espacio y te enviamos un presupuesto detallado por partidas, sin compromiso.
            </p>
            {siblings.length ? (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">También en {group.shortName.toLowerCase()}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {siblings.slice(0, 8).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/servicios/${s.slug}`} className="inline-flex rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-ink-900 hover:border-copper-400 hover:bg-copper-50">
                        {s.shortName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.06)] md:p-8">
            <QuoteForm layout="full" source="servicio" variant={variant} defaultServiceSlug={service.slug} />
          </div>
        </div>
      </Section>
    </>
  );
}
