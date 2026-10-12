import "server-only";

import { and, asc, desc, eq, lte } from "drizzle-orm";
import { cache } from "react";

import { ARTICLES } from "@/content/articles";
import { AUTHORS, BLOG_CATEGORIES } from "@/content/blog";
import type { ArticleContent, AuthorContent, BlogCategoryContent, FaqItem, FormVariant } from "@/content/types";
import { getDb } from "@/db/client";
import { articles, authors, blogCategories, mediaAssets, type ArticleRow } from "@/db/schema";

/** En desarrollo sin base de datos, PREVIEW_DRAFTS=1 muestra los borradores (para revisar el contenido). */
const PREVIEW_DRAFTS = process.env.PREVIEW_DRAFTS === "1";

const FORM_VARIANTS: ReadonlySet<string> = new Set(["general", "vivienda", "local", "gimnasio", "restaurante", "clinica", "instalaciones"]);

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function asFaqs(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is { question: unknown; answer: unknown } => Boolean(v && typeof v === "object" && "question" in v && "answer" in v))
    .map((v) => ({ question: String(v.question), answer: String(v.answer) }));
}

function asSources(value: unknown): { title: string; url: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is { title: unknown; url: unknown } => Boolean(v && typeof v === "object" && "url" in v))
    .map((v) => ({ title: String(v.title ?? v.url), url: String(v.url) }))
    .filter((v) => /^https?:\/\//.test(v.url));
}

export function articleFromRow(row: ArticleRow, extra?: { coverUrl?: string | null; authorSlug?: string | null }): ArticleContent {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    categorySlug: row.categorySlug,
    tags: asStringArray(row.tags),
    relatedServiceSlugs: asStringArray(row.relatedServiceSlugs),
    coverImagePath: extra?.coverUrl ?? row.coverImagePath ?? undefined,
    authorSlug: extra?.authorSlug ?? "equipo-tecnico",
    readingMinutes: row.readingMinutes,
    status: row.status,
    publishedAt: row.publishedAt?.toISOString(),
    reviewedAt: row.reviewedAt?.toISOString(),
    keywordPrimary: row.keywordPrimary ?? "",
    keywordsSecondary: asStringArray(row.keywordsSecondary),
    faqs: asFaqs(row.faqs),
    sources: asSources(row.sources),
    formVariant: FORM_VARIANTS.has(row.formVariant) ? (row.formVariant as FormVariant) : "general",
    metaTitle: row.metaTitle ?? row.title,
    metaDescription: row.metaDescription ?? row.excerpt,
  };
}

function isPublic(a: ArticleContent): boolean {
  if (a.status !== "published") return PREVIEW_DRAFTS;
  if (!a.publishedAt) return true;
  return new Date(a.publishedAt).getTime() <= Date.now();
}

function byDate(a: ArticleContent, b: ArticleContent) {
  return (b.publishedAt ?? b.reviewedAt ?? "").localeCompare(a.publishedAt ?? a.reviewedAt ?? "") || a.slug.localeCompare(b.slug);
}

function fallbackArticles(): ArticleContent[] {
  return ARTICLES.filter(isPublic).sort(byDate);
}

/** Artículos publicados (y con fecha de publicación alcanzada), más recientes primero. */
export const getArticles = cache(async (): Promise<ArticleContent[]> => {
  const db = getDb();
  if (!db) return fallbackArticles();
  try {
    const rows = await db
      .select({ article: articles, coverUrl: mediaAssets.url, authorSlug: authors.slug })
      .from(articles)
      .leftJoin(mediaAssets, eq(articles.coverImageId, mediaAssets.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(and(eq(articles.status, "published"), lte(articles.publishedAt, new Date())))
      .orderBy(desc(articles.publishedAt), asc(articles.slug));
    return rows.map((r) => articleFromRow(r.article, { coverUrl: r.coverUrl, authorSlug: r.authorSlug }));
  } catch (error) {
    console.error("[cms] error leyendo articles:", error);
    return fallbackArticles();
  }
});

export const getArticle = cache(async (slug: string): Promise<ArticleContent | null> => {
  const db = getDb();
  if (!db) return fallbackArticles().find((a) => a.slug === slug) ?? null;
  try {
    const rows = await db
      .select({ article: articles, coverUrl: mediaAssets.url, authorSlug: authors.slug })
      .from(articles)
      .leftJoin(mediaAssets, eq(articles.coverImageId, mediaAssets.id))
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(eq(articles.slug, slug))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    const article = articleFromRow(row.article, { coverUrl: row.coverUrl, authorSlug: row.authorSlug });
    return article.status === "published" && isPublic(article) ? article : null;
  } catch (error) {
    console.error("[cms] error leyendo article:", error);
    return null;
  }
});

export const getCategories = cache(async (): Promise<BlogCategoryContent[]> => {
  const db = getDb();
  if (!db) return BLOG_CATEGORIES;
  try {
    const rows = await db.select().from(blogCategories).orderBy(asc(blogCategories.order), asc(blogCategories.name));
    return rows.length ? rows.map((r) => ({ slug: r.slug, name: r.name, description: r.description, order: r.order })) : BLOG_CATEGORIES;
  } catch (error) {
    console.error("[cms] error leyendo blog_categories:", error);
    return BLOG_CATEGORIES;
  }
});

export async function getCategory(slug: string): Promise<BlogCategoryContent | null> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) ?? null;
}

export const getAuthor = cache(async (slug: string): Promise<AuthorContent | null> => {
  const fallback = AUTHORS.find((a) => a.slug === slug) ?? AUTHORS[0] ?? null;
  const db = getDb();
  if (!db) return fallback;
  try {
    const row = await db.query.authors.findFirst({ where: eq(authors.slug, slug) });
    return row ? { slug: row.slug, name: row.name, role: row.role, bio: row.bio } : fallback;
  } catch (error) {
    console.error("[cms] error leyendo authors:", error);
    return fallback;
  }
});

/** Artículos relacionados: misma categoría primero, luego servicios compartidos. */
export async function getRelatedArticles(article: ArticleContent, limit = 3): Promise<ArticleContent[]> {
  const all = (await getArticles()).filter((a) => a.slug !== article.slug);
  const score = (a: ArticleContent) =>
    (a.categorySlug === article.categorySlug ? 2 : 0) + a.relatedServiceSlugs.filter((s) => article.relatedServiceSlugs.includes(s)).length;
  return all
    .map((a) => ({ a, s: score(a) }))
    .sort((x, y) => y.s - x.s)
    .slice(0, limit)
    .map((x) => x.a);
}

/** Artículos que enlazan con un servicio (para la ficha de servicio). */
export async function getArticlesForService(serviceSlug: string, limit = 3): Promise<ArticleContent[]> {
  const all = await getArticles();
  return all.filter((a) => a.relatedServiceSlugs.includes(serviceSlug)).slice(0, limit);
}

export async function getArticlesForServices(serviceSlugs: string[], limit = 3): Promise<ArticleContent[]> {
  const all = await getArticles();
  return all.filter((a) => a.relatedServiceSlugs.some((s) => serviceSlugs.includes(s))).slice(0, limit);
}
