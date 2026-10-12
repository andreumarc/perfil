import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { getSettings } from "@/lib/cms/settings";
import { getZones } from "@/lib/cms/zones";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Zonas de actuación: Barcelona, Igualada, Anoia, Cataluña y España",
    description: "Empresa de reformas e instalaciones con base en Barcelona, Igualada y la comarca de l'Anoia. Trabajamos en toda Cataluña y en el resto de España.",
    path: "/zonas",
    siteName: s.company.name,
    keywords: ["reformas Barcelona", "reformas Igualada", "reformas Anoia", "empresa de reformas Cataluña", "reformas en toda España"],
  });
}

export default async function ZonesPage() {
  const [settings, zones] = await Promise.all([getSettings(), getZones()]);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Zonas", path: "/zonas" }]} />
          <p className="eyebrow mt-6">Zonas de actuación</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">Base en Barcelona, Igualada y Anoia. Obras en toda Cataluña y toda España.</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Conocemos los edificios, los trámites y la logística de obra de nuestra zona de base. Para el resto de Cataluña y de España valoramos cada proyecto según su tipo y tamaño.
          </p>
        </Container>
      </section>

      <Section tone="muted">
        {zones.length ? (
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
            {zones.map((z) => (
              <RevealItem key={z.slug}>
                <Link href={`/zonas/${z.slug}`} className="group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-[0_12px_32px_rgba(23,25,29,0.10)] focus-visible:outline-2 focus-visible:outline-copper-500">
                  <MapPinIcon className="size-6 text-copper-500" aria-hidden />
                  <h2 className="font-display mt-4 text-xl text-ink-900">{z.name}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">{z.province}</p>
                  <p className="mt-3 flex-1 text-sm text-gray-600">{z.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
                    Ver zona <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <div>
            <SectionHeading eyebrow="Zonas" title="Dónde trabajamos" />
            <ul className="mt-8 flex flex-wrap gap-2">
              {settings.company.zones.map((z) => (
                <li key={z} className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink-900">
                  {z}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <CtaBand location="zones_footer" whatsappHref={wa} />
    </>
  );
}
