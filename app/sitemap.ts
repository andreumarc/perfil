import type { MetadataRoute } from "next";

import { BLOG_CATEGORIES } from "@/content/blog";
import { CALCULATOR_IDS } from "@/lib/calculators/definitions";
import { getArticles } from "@/lib/cms/articles";
import { getProjects } from "@/lib/cms/projects";
import { getSectors, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { getZones } from "@/lib/cms/zones";
import { LEGAL_PAGES } from "@/lib/legal";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, services, sectors, projects, zones, articles] = await Promise.all([getSettings(), getServices(), getSectors(), getProjects(), getZones(), getArticles()]);
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"], lastModified: Date = now): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  const usedCategories = BLOG_CATEGORIES.filter((c) => articles.some((a) => a.categorySlug === c.slug));

  return [
    entry("/", 1, "weekly"),
    entry("/presupuesto", 0.9, "monthly"),
    entry("/servicios", 0.9, "weekly"),
    ...services.map((s) => entry(`/servicios/${s.slug}`, 0.8, "monthly")),
    entry("/sectores", 0.8, "monthly"),
    ...sectors.map((s) => entry(`/sectores/${s.slug}`, 0.7, "monthly")),
    entry("/proyectos", 0.7, "weekly"),
    ...projects.map((p) => entry(`/proyectos/${p.slug}`, 0.6, "monthly")),
    entry("/calculadoras", 0.8, "monthly"),
    ...CALCULATOR_IDS.map((id) => entry(`/calculadoras/${id}`, 0.7, "monthly")),
    entry("/zonas", 0.6, "monthly"),
    ...zones.map((z) => entry(`/zonas/${z.slug}`, 0.6, "monthly")),
    entry("/empresa", 0.6, "monthly"),
    entry("/contacto", 0.7, "yearly"),
    entry("/blog", 0.8, "weekly"),
    ...usedCategories.map((c) => entry(`/blog/categoria/${c.slug}`, 0.5, "weekly")),
    ...articles.map((a) => entry(`/blog/${a.slug}`, 0.7, "monthly", new Date(a.reviewedAt ?? a.publishedAt ?? now))),
    ...(settings.calculators.enabled ? [] : []),
    ...LEGAL_PAGES.map((p) => entry(p.path, 0.2, "yearly")),
  ];
}
