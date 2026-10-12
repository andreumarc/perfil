import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";

import { Markdown } from "@/components/content/markdown";
import { ProcessSteps } from "@/components/home/process-steps";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CommitmentIcon } from "@/components/sections/commitment-icon";
import { CtaBand } from "@/components/sections/cta-band";
import { StatGrid } from "@/components/sections/stat-grid";
import { getSettings } from "@/lib/cms/settings";
import { getZones } from "@/lib/cms/zones";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Empresa: quiénes somos y cómo trabajamos",
    description: `${s.about.intro} Reformas e instalaciones con base en ${s.company.city || "Barcelona"}, Igualada y Anoia, en toda Cataluña y toda España.`,
    path: "/empresa",
    siteName: s.company.name,
  });
}

export default async function CompanyPage() {
  const [settings, zones] = await Promise.all([getSettings(), getZones()]);
  const { about, commitments, company } = settings;
  const wa = whatsappHref(company.whatsapp, company.whatsappMessage);
  const verified = settings.verifiedStats.filter((s) => s.verified && s.value);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Empresa", path: "/empresa" }]} />
          <p className="eyebrow mt-6">Empresa</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">{about.title}</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">{about.intro}</p>
        </Container>
      </section>

      {verified.length ? (
        <Section tone="white" size="compact">
          <StatGrid stats={settings.verifiedStats} />
        </Section>
      ) : null}

      {about.body ? (
        <Section tone="white">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <SectionHeading eyebrow="Quiénes somos" title="Una forma de trabajar clara desde el primer día" />
            <Markdown content={about.body} />
          </div>
        </Section>
      ) : null}

      {commitments.length ? (
        <Section tone="muted" id="compromisos">
          <SectionHeading eyebrow="Compromisos" title="Lo que puedes esperar de nosotros" />
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((c) => (
              <RevealItem key={c.title} className="rounded-lg border border-gray-200 bg-white p-6">
                <CommitmentIcon name={c.icon} className="size-7 text-copper-500" />
                <h3 className="mt-4 text-base font-semibold text-ink-900">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.description}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      <ProcessSteps steps={settings.process} />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Zonas de actuación" title="Base en Barcelona, Igualada y Anoia. Obras en toda Cataluña y toda España." description="Para proyectos fuera de nuestra área habitual valoramos cada caso según el tipo y el tamaño de la obra." />
          <div>
            {zones.length ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {zones.map((z) => (
                  <li key={z.slug}>
                    <Link href={`/zonas/${z.slug}`} className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-copper-400">
                      <MapPinIcon className="mt-0.5 size-4 shrink-0 text-copper-500" aria-hidden />
                      <span>
                        <span className="block text-sm font-semibold text-ink-900">{z.name}</span>
                        <span className="mt-0.5 block text-xs text-gray-600">{z.headline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {company.zones.map((z) => (
                  <li key={z} className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink-900">
                    {z}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/zonas" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
              Ver zonas de actuación <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand location="company_footer" whatsappHref={wa} />
    </>
  );
}
