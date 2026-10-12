import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { getSectors } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Sectores: reformas para viviendas y cada tipo de negocio",
    description:
      "Reformas e instalaciones para viviendas, comunidades, locales comerciales, oficinas, gimnasios, restaurantes, hoteles, clínicas y naves industriales. Cada actividad con sus requisitos.",
    path: "/sectores",
    siteName: s.company.name,
    keywords: ["reformas por sectores", "reforma de locales", "reforma de gimnasios", "reforma de restaurantes", "reforma de clínicas"],
  });
}

export default async function SectorsPage() {
  const [settings, sectors] = await Promise.all([getSettings(), getSectors()]);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Sectores", path: "/sectores" }]} />
          <p className="eyebrow mt-6">Sectores</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">Cada espacio tiene sus reglas. Las conocemos.</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">
            Una vivienda, un restaurante o una clínica no se reforman igual: cambian las instalaciones, la normativa, las licencias y los plazos. Elige tu sector para ver cómo lo planteamos.
          </p>
        </Container>
      </section>

      <Section tone="muted">
        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
          {sectors.map((sector, i) => (
            <RevealItem key={sector.slug}>
              <Link href={`/sectores/${sector.slug}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-[0_12px_32px_rgba(23,25,29,0.10)] focus-visible:outline-2 focus-visible:outline-copper-500">
                <div className="relative aspect-[16/10] bg-ink-900">
                  {sector.imagePath ? (
                    <>
                      <Image src={sector.imagePath} alt="" fill priority={i < 3} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                      <IllustrativeBadge className="absolute top-3 left-3" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-ink-grid" aria-hidden />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-display text-xl text-ink-900">{sector.name}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">{sector.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
                    Ver sector <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Section>

      <CtaBand location="sectors_footer" whatsappHref={wa} />
    </>
  );
}
