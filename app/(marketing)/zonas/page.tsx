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
    title: "Zonas de actuación: toda Cataluña y toda España, con oficina en L'Hospitalet",
    description: "Empresa de reformas e instalaciones con oficina en L'Hospitalet de Llobregat. Trabajamos en toda Cataluña y en el resto de España: Barcelona, Baix Llobregat, Garraf, Penedès, Anoia y más de treinta municipios con página propia.",
    path: "/zonas",
    siteName: s.company.name,
    keywords: ["empresa de reformas Cataluña", "reformas en toda España", "reformas L'Hospitalet", "reformas Baix Llobregat", "reformas Barcelona", "reformas Garraf", "reformas Anoia"],
  });
}

export default async function ZonesPage() {
  const [settings, zones] = await Promise.all([getSettings(), getZones()]);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);
  // Agrupadas por comarca/ámbito, en el orden de aparición (el campo `order` ya ordena las zonas).
  const groups = [...zones.reduce((map, z) => map.set(z.province, [...(map.get(z.province) ?? []), z]), new Map<string, typeof zones>())];

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Zonas", path: "/zonas" }]} />
          <p className="eyebrow mt-6">Zonas de actuación</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">Reformas en toda España y, sobre todo, en toda Cataluña</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Oficina en L&apos;Hospitalet de Llobregat y obra diaria en Barcelona y el Baix Llobregat. Conocemos los edificios, los trámites y la logística de cada municipio de nuestra zona, y organizamos obras en el resto de Cataluña y de España según el tipo y el tamaño del proyecto.
          </p>
        </Container>
      </section>

      {groups.map(([province, items]) => (
        <Section key={province} tone="muted" className="border-t border-gray-200/70">
          <SectionHeading eyebrow="Zona" title={province} />
          <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
            {items.map((z) => (
              <RevealItem key={z.slug}>
                <Link href={`/zonas/${z.slug}`} className="group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-[0_12px_32px_rgba(23,25,29,0.10)] focus-visible:outline-2 focus-visible:outline-copper-500">
                  <MapPinIcon className="size-6 text-copper-500" aria-hidden />
                  <h3 className="font-display mt-4 text-xl text-ink-900">{z.name}</h3>
                  <p className="mt-3 flex-1 text-sm text-gray-600">{z.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
                    Ver zona <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ))}
      {!zones.length ? (
        <Section tone="muted">
          <SectionHeading eyebrow="Zonas" title="Dónde trabajamos" />
          <ul className="mt-8 flex flex-wrap gap-2">
            {settings.company.zones.map((z) => (
              <li key={z} className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink-900">
                {z}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBand location="zones_footer" whatsappHref={wa} />
    </>
  );
}
