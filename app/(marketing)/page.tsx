import { existsSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { ProcessSteps } from "@/components/home/process-steps";
import { ProjectsShowcase } from "@/components/home/projects-showcase";
import { QuoteSection } from "@/components/home/quote-section";
import { SectorsGrid } from "@/components/home/sectors-grid";
import { ServicesOverview } from "@/components/home/services-overview";
import { Section, SectionHeading } from "@/components/layout/section";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { StatGrid } from "@/components/sections/stat-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { getFaqs } from "@/lib/cms/faqs";
import { getProjects } from "@/lib/cms/projects";
import { getSectors, getServices, getServicesByGroup } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: `${s.company.name} | ${s.seo.defaultTitle}`,
    description: s.seo.defaultDescription,
    path: "/",
    siteName: s.company.name,
    keywords: s.seo.keywords,
  });
}

/** Comprueba si la imagen del hero existe en /public (si falta, se usa un fondo con textura). */
function publicFileExists(p: string): boolean {
  if (!p.startsWith("/") || p.startsWith("//")) return false;
  try {
    return existsSync(path.join(process.cwd(), "public", p));
  } catch {
    return false;
  }
}

export default async function HomePage() {
  const [settings, groups, services, sectors, projects, faqs] = await Promise.all([
    getSettings(),
    getServicesByGroup(),
    getServices(),
    getSectors(),
    getProjects(),
    getFaqs("global"),
  ]);
  const serviceNames = Object.fromEntries(services.map((s) => [s.slug, s.shortName]));
  const heroHasImage = settings.hero.imagePath.startsWith("http") || publicFileExists(settings.hero.imagePath);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);
  const verifiedStats = settings.verifiedStats.filter((s) => s.verified && s.value);

  return (
    <>
      <Hero settings={settings} hasImage={heroHasImage} />

      {verifiedStats.length ? (
        <Section tone="white" size="compact">
          <StatGrid stats={settings.verifiedStats} />
        </Section>
      ) : null}

      <ServicesOverview groups={groups} />
      <SectorsGrid sectors={sectors} />
      <ProcessSteps steps={settings.process} />
      <ProjectsShowcase projects={projects} serviceNames={serviceNames} />

      {settings.commitments.length ? (
        <Section tone="muted" id="compromisos">
          <SectionHeading eyebrow="Compromisos" title="Lo que puedes esperar de nosotros" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {settings.commitments.map((c) => (
              <div key={c.title} className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="text-base font-semibold text-ink-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.description}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {faqs.length ? (
        <Section tone="white" id="faq">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
            <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que nos preguntan antes de empezar" />
            <Faq items={faqs} />
          </div>
          <JsonLd data={faqJsonLd(faqs)} />
        </Section>
      ) : null}

      <QuoteSection />
      <CtaBand location="home_footer" whatsappHref={wa} />
    </>
  );
}
