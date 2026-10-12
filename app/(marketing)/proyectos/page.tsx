import type { Metadata } from "next";

import { ProjectsGallery } from "@/components/projects/projects-gallery";
import { CtaBand } from "@/components/sections/cta-band";
import { getProjects } from "@/lib/cms/projects";
import { getSectors, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Proyectos de reformas e instalaciones",
    description: "Alcance, proceso y resultado de cada tipo de reforma: viviendas, locales, oficinas, gimnasios, restaurantes y clínicas. Filtra por servicio o sector.",
    path: "/proyectos",
    siteName: s.company.name,
  });
}

export default async function ProjectsPage() {
  const [settings, projects, services, sectors] = await Promise.all([getSettings(), getProjects(), getServices(), getSectors()]);
  return (
    <>
      <ProjectsGallery
        projects={projects}
        services={services}
        sectors={sectors}
        crumbs={[{ name: "Proyectos", path: "/proyectos" }]}
        title="Proyectos: alcance, proceso y resultado"
        description="Así planteamos cada tipo de obra: qué incluye, cómo se organiza y qué puedes esperar. Filtra por servicio o por sector."
      />
      <CtaBand location="projects_footer" whatsappHref={whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage)} />
    </>
  );
}
