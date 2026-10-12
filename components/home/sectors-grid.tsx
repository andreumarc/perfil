import Image from "next/image";
import Link from "next/link";

import { Section, SectionHeading } from "@/components/layout/section";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { SectorContent } from "@/content/types";

export function SectorsGrid({ sectors }: { sectors: SectorContent[] }) {
  const featured = sectors.slice(0, 8);
  const rest = sectors.slice(8);
  return (
    <Section tone="muted" id="sectores">
      <SectionHeading
        eyebrow="Sectores"
        title="Experiencia en cada tipo de espacio"
        description="Cada actividad tiene requisitos propios de instalaciones, normativa y licencias. Trabajamos con viviendas y con negocios de todo tipo."
      />
      <RevealGroup className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4" amount={0.05}>
        {featured.map((sector) => (
          <RevealItem key={sector.slug} scale>
          <Link
            href={`/sectores/${sector.slug}`}
            className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg bg-ink-900 focus-visible:outline-2 focus-visible:outline-copper-500"
          >
            {sector.imagePath ? (
              <>
                <Image src={sector.imagePath} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
                <IllustrativeBadge className="absolute top-3 left-3" />
              </>
            ) : (
              <div className="absolute inset-0 bg-ink-grid" aria-hidden />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/20 to-transparent" aria-hidden />
            <h3 className="font-display relative p-4 text-base text-white md:text-lg">{sector.name}</h3>
          </Link>
          </RevealItem>
        ))}
      </RevealGroup>
      {rest.length ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {rest.map((s) => (
            <li key={s.slug}>
              <Link href={`/sectores/${s.slug}`} className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink-900 hover:border-copper-400 hover:bg-copper-50">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}
