import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectsGallery } from "@/components/projects/projects-gallery";
import { CtaBand } from "@/components/sections/cta-band";
import { SECTOR_SLUGS } from "@/content/sectors";
import { getProjects } from "@/lib/cms/projects";
import { getSector, getSectors, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return SECTOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [sector, s] = await Promise.all([getSector(slug), getSettings()]);
  if (!sector) return {};
  return pageMetadata({
    title: `Proyectos en ${sector.name.toLowerCase()}`,
    description: `Alcance y proceso de reformas en ${sector.name.toLowerCase()}. ${sector.summary}`,
    path: `/proyectos/sector/${sector.slug}`,
    siteName: s.company.name,
  });
}

export default async function ProjectsBySectorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const sector = await getSector(slug);
  if (!sector) notFound();
  const [settings, projects, services, sectors] = await Promise.all([getSettings(), getProjects(), getServices(), getSectors()]);
  return (
    <>
      <ProjectsGallery
        projects={projects}
        services={services}
        sectors={sectors}
        activeSector={sector}
        crumbs={[{ name: "Proyectos", path: "/proyectos" }, { name: sector.name, path: `/proyectos/sector/${sector.slug}` }]}
        title={`Proyectos en ${sector.name.toLowerCase()}`}
        description={sector.summary}
      />
      <CtaBand location="projects_sector_footer" whatsappHref={whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage)} />
    </>
  );
}
