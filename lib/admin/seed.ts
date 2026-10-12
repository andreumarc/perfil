import { eq, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import { ARTICLES } from "@/content/articles";
import { AUTHORS, BLOG_CATEGORIES } from "@/content/blog";
import { GLOBAL_FAQS } from "@/content/faqs";
import { PROJECTS } from "@/content/projects";
import { SECTORS } from "@/content/sectors";
import { SERVICES } from "@/content/services";
import { DEFAULT_SETTINGS } from "@/content/settings";
import { LOCAL_AREAS } from "@/content/zones";
import * as schema from "@/db/schema";

/**
 * Siembra idempotente del contenido inicial (upsert por slug; nunca crea leads
 * ni pisa estados/fechas de publicación editados). La usan `npm run db:seed` y
 * el botón "Cargar contenido inicial" del panel.
 */
export type SeedDb = NeonHttpDatabase<typeof schema>;

const { services, sectors, projects, blogCategories, authors, articles, faqs, localAreas, siteSettings } = schema;

export async function seedContent(db: SeedDb): Promise<Record<string, number>> {
  const now = new Date();
  const summary: Record<string, number> = {};

  for (const s of SERVICES) {
    const values = {
      slug: s.slug,
      groupSlug: s.groupSlug,
      name: s.name,
      shortName: s.shortName,
      headline: s.headline,
      summary: s.summary,
      body: s.body,
      features: s.features,
      forWhom: s.forWhom,
      process: s.process,
      requiresLicensedPro: s.requiresLicensedPro,
      licenseNote: s.licenseNote ?? null,
      imagePath: s.imagePath ?? null,
      order: s.order,
      status: s.status,
      metaTitle: s.metaTitle ?? null,
      metaDescription: s.metaDescription ?? null,
      updatedAt: now,
    };
    await db.insert(services).values(values).onConflictDoUpdate({ target: services.slug, set: values });
  }
  summary.services = SERVICES.length;

  for (const s of SECTORS) {
    const values = {
      slug: s.slug,
      name: s.name,
      headline: s.headline,
      summary: s.summary,
      body: s.body,
      serviceSlugs: s.serviceSlugs,
      imagePath: s.imagePath ?? null,
      order: s.order,
      status: s.status,
      metaTitle: s.metaTitle ?? null,
      metaDescription: s.metaDescription ?? null,
      updatedAt: now,
    };
    await db.insert(sectors).values(values).onConflictDoUpdate({ target: sectors.slug, set: values });
  }
  summary.sectors = SECTORS.length;

  for (const p of PROJECTS) {
    const values = {
      slug: p.slug,
      title: p.title,
      serviceSlug: p.serviceSlug ?? null,
      sectorSlug: p.sectorSlug ?? null,
      locality: p.locality ?? null,
      summary: p.summary,
      scope: p.scope,
      body: p.body,
      coverImagePath: p.coverImagePath ?? null,
      isIllustrative: p.isIllustrative,
      hasVerifiedBeforeAfter: p.hasVerifiedBeforeAfter,
      order: p.order,
      status: p.status,
      updatedAt: now,
    };
    await db.insert(projects).values(values).onConflictDoUpdate({ target: projects.slug, set: values });
  }
  summary.projects = PROJECTS.length;

  for (const c of BLOG_CATEGORIES) {
    const values = { slug: c.slug, name: c.name, description: c.description, order: c.order };
    await db.insert(blogCategories).values(values).onConflictDoUpdate({ target: blogCategories.slug, set: values });
  }
  summary.categories = BLOG_CATEGORIES.length;

  const authorIds = new Map<string, string>();
  for (const a of AUTHORS) {
    const values = { slug: a.slug, name: a.name, role: a.role, bio: a.bio, updatedAt: now };
    const [row] = await db.insert(authors).values(values).onConflictDoUpdate({ target: authors.slug, set: values }).returning({ id: authors.id });
    if (row) authorIds.set(a.slug, row.id);
  }
  summary.authors = AUTHORS.length;

  // Artículos: se siembran como borradores y no se pisa el estado ni la fecha de publicación de uno ya editado.
  for (const a of ARTICLES) {
    const base = {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      categorySlug: a.categorySlug,
      tags: a.tags,
      relatedServiceSlugs: a.relatedServiceSlugs,
      coverImagePath: a.coverImagePath ?? null,
      authorId: authorIds.get(a.authorSlug) ?? null,
      authorName: null,
      readingMinutes: a.readingMinutes,
      reviewedAt: a.reviewedAt ? new Date(a.reviewedAt) : null,
      keywordPrimary: a.keywordPrimary,
      keywordsSecondary: a.keywordsSecondary,
      faqs: a.faqs,
      sources: a.sources,
      formVariant: a.formVariant,
      metaTitle: a.metaTitle,
      metaDescription: a.metaDescription,
      updatedAt: now,
    };
    await db
      .insert(articles)
      .values({ ...base, status: a.status, publishedAt: a.publishedAt ? new Date(a.publishedAt) : null })
      .onConflictDoUpdate({ target: articles.slug, set: base });
  }
  summary.articles = ARTICLES.length;

  for (const z of LOCAL_AREAS) {
    const values = {
      slug: z.slug,
      name: z.name,
      province: z.province,
      headline: z.headline,
      summary: z.summary,
      body: z.body,
      serviceSlugs: z.serviceSlugs,
      order: z.order,
      status: z.status,
      metaTitle: z.metaTitle ?? null,
      metaDescription: z.metaDescription ?? null,
      updatedAt: now,
    };
    await db.insert(localAreas).values(values).onConflictDoUpdate({ target: localAreas.slug, set: values });
  }
  summary.zones = LOCAL_AREAS.length;

  // FAQs: solo se siembran los ámbitos que aún no tienen ninguna (no se duplican ni se pisan ediciones).
  let faqCount = 0;
  const faqSets: { scope: string; scopeSlug: string | null; items: { question: string; answer: string }[] }[] = [
    { scope: "global", scopeSlug: null, items: GLOBAL_FAQS },
    ...SERVICES.map((s) => ({ scope: "service", scopeSlug: s.slug, items: s.faqs })),
    ...SECTORS.map((s) => ({ scope: "sector", scopeSlug: s.slug, items: s.faqs })),
    ...LOCAL_AREAS.map((z) => ({ scope: "area", scopeSlug: z.slug, items: z.faqs })),
  ];
  for (const set of faqSets) {
    if (!set.items.length) continue;
    const [existing] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(faqs)
      .where(set.scopeSlug ? sql`${faqs.scope} = ${set.scope} and ${faqs.scopeSlug} = ${set.scopeSlug}` : sql`${faqs.scope} = ${set.scope} and ${faqs.scopeSlug} is null`);
    if (existing && existing.n > 0) continue;
    await db.insert(faqs).values(set.items.map((f, i) => ({ question: f.question, answer: f.answer, scope: set.scope, scopeSlug: set.scopeSlug, order: i + 1 })));
    faqCount += set.items.length;
  }
  summary.faqs = faqCount;

  // Ajustes: solo si no existe la fila (los cambios del panel nunca se pisan).
  const existingSettings = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.id, 1));
  if (!existingSettings.length) {
    await db.insert(siteSettings).values({ id: 1, data: DEFAULT_SETTINGS });
    summary.settings = 1;
  } else summary.settings = 0;

  return summary;
}

