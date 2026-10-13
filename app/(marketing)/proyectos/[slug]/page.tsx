import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, MapPinIcon } from "lucide-react";

import { TrackView } from "@/components/analytics/track-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Markdown } from "@/components/content/markdown";
import { QuoteForm } from "@/components/forms/quote-form";
import { ProjectCard } from "@/components/home/projects-showcase";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/content/projects";
import { getProject, getProjects } from "@/lib/cms/projects";
import { getSectors, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { variantForService } from "@/lib/forms";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return PROJECTS.filter((p) => p.status === "published").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [project, s] = await Promise.all([getProject(slug), getSettings()]);
  if (!project) return {};
  return pageMetadata({
    title: project.isIllustrative ? `${project.title} (proyecto tipo)` : project.title,
    description: project.summary,
    path: `/proyectos/${project.slug}`,
    siteName: s.company.name,
    image: project.coverImagePath,
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const [services, sectors, projects] = await Promise.all([getServices(), getSectors(), getProjects()]);
  const service = services.find((s) => s.slug === project.serviceSlug);
  const sector = sectors.find((s) => s.slug === project.sectorSlug);
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const serviceNames = Object.fromEntries(services.map((s) => [s.slug, s.shortName]));
  const path = `/proyectos/${project.slug}`;
  const before = project.gallery.find((g) => g.role === "before");
  const after = project.gallery.find((g) => g.role === "after");
  const gallery = project.gallery.filter((g) => g.role === "gallery");
  const variant = service ? variantForService(service.slug, service.groupSlug) : "general";

  return (
    <>
      <TrackView event="project_viewed" props={{ slug: project.slug, illustrative: project.isIllustrative }} />

      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Proyectos", path: "/proyectos" }, { name: project.title, path }]} />
          <p className="eyebrow mt-6">{project.isIllustrative ? "Proyecto tipo" : "Proyecto"}{service ? ` · ${service.shortName}` : ""}</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">{project.title}</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">{project.summary}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {service ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Servicio</dt>
                <dd><Link href={`/servicios/${service.slug}`} className="text-ink-900 underline-offset-4 hover:underline">{service.name}</Link></dd>
              </div>
            ) : null}
            {sector ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Sector</dt>
                <dd><Link href={`/sectores/${sector.slug}`} className="text-ink-900 underline-offset-4 hover:underline">{sector.name}</Link></dd>
              </div>
            ) : null}
            {project.locality ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Localidad</dt>
                <dd className="inline-flex items-center gap-1 text-ink-900"><MapPinIcon className="size-3.5 text-copper-500" aria-hidden />{project.locality}</dd>
              </div>
            ) : null}
          </dl>
        </Container>
      </section>

      <Section tone="white" size="compact">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-ink-900">
          {project.coverImagePath ? (
            <Image src={project.coverImagePath} alt={project.title} fill priority sizes="(min-width: 1024px) 1100px, 100vw" className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-ink-grid" aria-hidden />
          )}
          {project.isIllustrative ? <IllustrativeBadge className="absolute top-4 left-4" label="Proyecto tipo" /> : null}
        </div>
        {project.isIllustrative ? (
          <p className="mt-4 text-sm text-gray-600">
            Este proyecto tipo describe el alcance y el proceso habituales de una obra de este tipo.
          </p>
        ) : null}
      </Section>

      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Alcance" title="Qué incluye este proyecto" />
            {service ? (
              <Button asChild size="lg" className="mt-8">
                <TrackedLink href={`/servicios/${service.slug}`} event="cta_clicked" props={{ location: "project_service", slug: project.slug }}>
                  Ver el servicio
                  <ArrowRightIcon aria-hidden />
                </TrackedLink>
              </Button>
            ) : null}
          </div>
          <div>
            {project.scope ? <Markdown content={project.scope} /> : null}
            {project.body ? <Markdown content={project.body} className="prose-site mt-8" /> : null}
          </div>
        </div>
      </Section>

      {project.hasVerifiedBeforeAfter && before && after ? (
        <Section tone="white">
          <SectionHeading eyebrow="Antes y después" title="El cambio, lado a lado" />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {[before, after].map((img, i) => (
              <figure key={img.url} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="relative aspect-[4/3] bg-ink-900">
                  <Image src={img.url} alt={img.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="p-3 text-sm text-gray-600">
                  <span className="font-semibold text-ink-900">{i === 0 ? "Antes" : "Después"}</span>
                  {img.caption ? ` · ${img.caption}` : ""}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      {gallery.length ? (
        <Section tone="white">
          <SectionHeading eyebrow="Galería" title="Imágenes del proyecto" />
          <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" amount={0.05}>
            {gallery.map((img) => (
              <RevealItem key={img.url} scale>
                <figure className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <div className="relative aspect-[4/3] bg-ink-900">
                    <Image src={img.url} alt={img.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  {img.caption ? <figcaption className="p-3 text-sm text-gray-600">{img.caption}</figcaption> : null}
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      <Section tone="muted" id="presupuesto" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="eyebrow">Presupuesto</p>
            <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">¿Tienes un proyecto parecido?</h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">Cuéntanoslo y te preparamos un presupuesto por partidas adaptado a tu espacio, tras una visita sin compromiso.</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.06)] md:p-8">
            <QuoteForm layout="full" source="proyecto" variant={variant} defaultServiceSlug={service?.slug ?? ""} defaultSectorSlug={sector?.slug ?? ""} />
          </div>
        </div>
      </Section>

      {others.length ? (
        <Section tone="white">
          <SectionHeading eyebrow="Más proyectos" title="Otros tipos de obra" />
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <RevealItem key={p.slug}>
                <ProjectCard project={p} serviceName={p.serviceSlug ? serviceNames[p.serviceSlug] : undefined} />
              </RevealItem>
            ))}
          </RevealGroup>
          <div className="mt-8">
            <Link href="/proyectos" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900 underline-offset-4 hover:underline">
              Ver todos los proyectos <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
        </Section>
      ) : null}
    </>
  );
}
