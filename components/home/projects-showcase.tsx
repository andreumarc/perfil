import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { ProjectContent } from "@/content/types";

export function ProjectCard({ project, serviceName }: { project: ProjectContent; serviceName?: string }) {
  return (
    <Link href={`/proyectos/${project.slug}`} className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white focus-visible:outline-2 focus-visible:outline-copper-500">
      <div className="relative aspect-[4/3] bg-ink-900">
        {project.coverImagePath ? (
          <Image src={project.coverImagePath} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        ) : (
          <div className="absolute inset-0 bg-ink-grid" aria-hidden />
        )}
        {project.isIllustrative ? <IllustrativeBadge className="absolute top-3 left-3" label="Proyecto tipo · imagen ilustrativa" /> : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-copper-600">{serviceName ?? "Proyecto"}{project.locality ? ` · ${project.locality}` : ""}</p>
        <h3 className="font-display mt-2 text-lg text-ink-900">{project.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">{project.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
          Ver detalle <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ProjectsShowcase({ projects, serviceNames }: { projects: ProjectContent[]; serviceNames: Record<string, string> }) {
  if (!projects.length) return null;
  const illustrative = projects.some((p) => p.isIllustrative);
  return (
    <Section tone="white" id="proyectos">
      <SectionHeading
        eyebrow="Proyectos"
        title="Alcance y proceso de cada tipo de reforma"
        description={
          illustrative
            ? "Ejemplos del alcance habitual de cada tipo de obra. Las imágenes son ilustrativas: los proyectos reales se publican con fotografías propias desde el panel."
            : "Una selección de obras realizadas."
        }
      />
      <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.slice(0, 6).map((p) => (
          <RevealItem key={p.slug}><ProjectCard project={p} serviceName={p.serviceSlug ? serviceNames[p.serviceSlug] : undefined} /></RevealItem>
        ))}
      </RevealGroup>
      <div className="mt-8">
        <Link href="/proyectos" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
          Ver todos los proyectos <ArrowRightIcon className="size-4" aria-hidden />
        </Link>
      </div>
    </Section>
  );
}
