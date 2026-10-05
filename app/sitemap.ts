import type { MetadataRoute } from "next";

import { INSIGHT_CATEGORIES, getAllPosts } from "@/content/insights";
import { SERVICE_SLUGS } from "@/content/services";
import { site } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];
type Frequency = NonNullable<Entry["changeFrequency"]>;

function url(path: string) {
  return `${site.url}${path === "/" ? "" : path}`;
}

function entry(path: string, priority: number, changeFrequency: Frequency, lastModified: Date): Entry {
  return { url: url(path), lastModified, changeFrequency, priority };
}

/**
 * Sitemap del sitio público. Quedan fuera, a propósito: /admin, /api, las landings
 * de campaña (/linkedin/*) y los resultados de diagnóstico (/diagnostico/resultado/*).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  const postDate = (post: (typeof posts)[number]) => new Date(post.updatedAt ?? post.publishedAt);
  const latestPostDate = posts.length > 0 ? new Date(Math.max(...posts.map((p) => postDate(p).getTime()))) : now;

  const staticPages: Entry[] = [
    entry("/", 1.0, "weekly", now),
    entry("/diagnostico", 0.9, "monthly", now),
    entry("/servicios", 0.8, "monthly", now),
    ...SERVICE_SLUGS.map((slug) => entry(`/servicios/${slug}`, 0.8, "monthly", now)),
    entry("/private-equity", 0.7, "monthly", now),
    entry("/healthcare", 0.7, "monthly", now),
    entry("/multisite", 0.7, "monthly", now),
    entry("/casos", 0.7, "monthly", now),
    entry("/insights", 0.7, "weekly", latestPostDate),
    entry("/calculadora-ebitda", 0.7, "monthly", now),
    entry("/sobre-mi", 0.6, "monthly", now),
    entry("/contacto", 0.6, "yearly", now),
    entry("/legal", 0.2, "yearly", now),
    entry("/politica-privacidad", 0.2, "yearly", now),
    entry("/cookies", 0.2, "yearly", now),
  ];

  const categoryPages: Entry[] = INSIGHT_CATEGORIES.map((category) => {
    const inCategory = posts.filter((p) => p.category === category.slug);
    const lastModified =
      inCategory.length > 0 ? new Date(Math.max(...inCategory.map((p) => postDate(p).getTime()))) : now;
    return entry(`/insights/categoria/${category.slug}`, 0.5, "weekly", lastModified);
  });

  const postPages: Entry[] = posts.map((post) => entry(`/insights/${post.slug}`, 0.6, "monthly", postDate(post)));

  return [...staticPages, ...categoryPages, ...postPages];
}
