import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { ServiceContent, ServiceGroup } from "@/content/types";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, compact = false, priority = false }: { service: ServiceContent; compact?: boolean; priority?: boolean }) {
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className={cn(
        "group relative flex overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-[0_12px_32px_rgba(23,25,29,0.10)] focus-visible:outline-2 focus-visible:outline-copper-500",
        compact ? "aspect-[3/4] flex-col justify-end" : "aspect-[4/3] flex-col justify-end",
      )}
    >
      {service.imagePath ? (
        <>
          <Image
            src={service.imagePath}
            alt=""
            fill
            sizes={compact ? "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-ink-grid" aria-hidden />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" aria-hidden />
      <div className="relative p-4 md:p-5">
        <h3 className={cn("font-display text-white", compact ? "text-base leading-snug" : "text-lg md:text-xl")}>{service.shortName}</h3>
        {!compact ? <p className="mt-1 line-clamp-2 text-sm text-ink-100/85">{service.headline}</p> : null}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-copper-300">
          Ver servicio <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ServicesOverview({ groups }: { groups: { group: ServiceGroup; services: ServiceContent[] }[] }) {
  const viviendas = groups.find((g) => g.group.slug === "viviendas");
  const negocios = groups.find((g) => g.group.slug === "negocios");
  const instalaciones = groups.find((g) => g.group.slug === "instalaciones");

  return (
    <Section tone="white" id="servicios">
      <SectionHeading
        eyebrow="Servicios"
        title="Reformas integrales e instalaciones para viviendas y negocios"
        description="Un único equipo coordina la obra y todos los gremios: albañilería, electricidad, fontanería, climatización, carpintería y pintura, con presupuesto cerrado por partidas."
      />

      {viviendas && viviendas.services.length ? (
        <div className="mt-12">
          <GroupHeader group={viviendas.group} />
          <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {viviendas.services.slice(0, 4).map((s, i) => (
              <RevealItem key={s.slug}><ServiceCard service={s} priority={i < 2} /></RevealItem>
            ))}
          </RevealGroup>
        </div>
      ) : null}

      {negocios && negocios.services.length ? (
        <div className="mt-12">
          <GroupHeader group={negocios.group} />
          <RevealGroup className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {negocios.services.slice(0, 4).map((s) => (
              <RevealItem key={s.slug}><ServiceCard service={s} /></RevealItem>
            ))}
          </RevealGroup>
        </div>
      ) : null}

      {instalaciones && instalaciones.services.length ? (
        <div className="mt-12">
          <GroupHeader group={instalaciones.group} />
          <RevealGroup className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" amount={0.05}>
            {instalaciones.services.slice(0, 10).map((s) => (
              <RevealItem key={s.slug} scale><ServiceCard service={s} compact /></RevealItem>
            ))}
          </RevealGroup>
        </div>
      ) : null}

      <div className="mt-10">
        <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
          Ver todos los servicios <ArrowRightIcon className="size-4" aria-hidden />
        </Link>
      </div>
    </Section>
  );
}

function GroupHeader({ group }: { group: ServiceGroup }) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-copper-500 pl-4 sm:flex-row sm:items-baseline sm:justify-between">
      <h3 className="font-display text-xl text-ink-900 md:text-2xl">{group.name}</h3>
      <p className="text-sm text-gray-600">{group.description}</p>
    </div>
  );
}
