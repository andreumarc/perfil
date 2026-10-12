import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectsGallery } from "@/components/projects/projects-gallery";
import { CtaBand } from "@/components/sections/cta-band";
import { SERVICE_SLUGS } from "@/content/services";
import { getProjects } from "@/lib/cms/projects";
import { getSectors, getService, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [service, s] = await Promise.all([getService(slug), getSettings()]);
  if (!service) return {};
  return pageMetadata({
    title: `Proyectos de ${service.shortName.toLowerCase()}`,
    description: `Alcance y proceso de proyectos de ${service.name.toLowerCase()}. ${service.summary}`,
    path: `/proyectos/servicio/${service.slug}`,
    siteName: s.company.name,
  });
}

export default async function ProjectsByServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) notFound();
  const [settings, projects, services, sectors] = await Promise.all([getSettings(), getProjects(), getServices(), getSectors()]);
  return (
    <>
      <ProjectsGallery
        projects={projects}
        services={services}
        sectors={sectors}
        activeService={service}
        crumbs={[{ name: "Proyectos", path: "/proyectos" }, { name: service.shortName, path: `/proyectos/servicio/${service.slug}` }]}
        title={`Proyectos de ${service.shortName.toLowerCase()}`}
        description={service.summary}
      />
      <CtaBand location="projects_service_footer" whatsappHref={whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage)} />
    </>
  );
}
