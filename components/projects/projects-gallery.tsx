import Link from "next/link";

import { ProjectCard } from "@/components/home/projects-showcase";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs, type Crumb } from "@/components/sections/breadcrumbs";
import type { ProjectContent, SectorContent, ServiceContent } from "@/content/types";
import { cn } from "@/lib/utils";

interface Props {
  projects: ProjectContent[];
  services: ServiceContent[];
  sectors: SectorContent[];
  activeService?: ServiceContent;
  activeSector?: SectorContent;
  crumbs: Crumb[];
  title: string;
  description: string;
}

/** Galería de proyectos con filtros por ruta (/proyectos/servicio/<slug>, /proyectos/sector/<slug>). */
export function ProjectsGallery({ projects, services, sectors, activeService, activeSector, crumbs, title, description }: Props) {
  const serviceNames = Object.fromEntries(services.map((s) => [s.slug, s.shortName]));
  const usedServices = services.filter((s) => projects.some((p) => p.serviceSlug === s.slug) || s.slug === activeService?.slug);
  const usedSectors = sectors.filter((s) => projects.some((p) => p.sectorSlug === s.slug) || s.slug === activeSector?.slug);
  const visible = projects.filter((p) => (!activeService || p.serviceSlug === activeService.slug) && (!activeSector || p.sectorSlug === activeSector.slug));
  const illustrative = visible.some((p) => p.isIllustrative);

  const chip = (href: string, label: string, active: boolean) => (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex rounded-full border px-3.5 py-1.5 text-sm transition-colors",
        active ? "border-copper-500 bg-copper-500 text-white" : "border-gray-300 bg-white text-ink-900 hover:border-copper-400 hover:bg-copper-50",
      )}
    >
      {label}
    </Link>
  );

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={crumbs} />
          <p className="eyebrow mt-6">Proyectos</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">{description}</p>
          {illustrative ? (
            <p className="mt-4 max-w-2xl rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Los proyectos marcados como <strong className="text-ink-900">proyecto tipo</strong> son ejemplos de alcance con imágenes ilustrativas, no obras ejecutadas. Los proyectos reales se publican con fotografías propias desde el panel.
            </p>
          ) : null}
        </Container>
      </section>

      <Section tone="muted">
        {usedServices.length > 1 || usedSectors.length > 1 ? (
          <div className="space-y-4">
            {usedServices.length > 1 ? (
              <nav aria-label="Filtrar por servicio" className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Servicio</span>
                {chip("/proyectos", "Todos", !activeService && !activeSector)}
                {usedServices.map((s) => chip(`/proyectos/servicio/${s.slug}`, s.shortName, activeService?.slug === s.slug))}
              </nav>
            ) : null}
            {usedSectors.length > 1 ? (
              <nav aria-label="Filtrar por sector" className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Sector</span>
                {usedSectors.map((s) => chip(`/proyectos/sector/${s.slug}`, s.name, activeSector?.slug === s.slug))}
              </nav>
            ) : null}
          </div>
        ) : null}

        {visible.length ? (
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
            {visible.map((p) => (
              <RevealItem key={p.slug}>
                <ProjectCard project={p} serviceName={p.serviceSlug ? serviceNames[p.serviceSlug] : undefined} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className="mt-10 rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">
            Todavía no hay proyectos publicados en esta categoría. Cuéntanos el tuyo y te explicamos cómo lo plantearíamos.
          </p>
        )}
      </Section>
    </>
  );
}
