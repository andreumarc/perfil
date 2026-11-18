/**
 * Carga en la base de datos el contenido de código que aún no existe, sin pisar
 * nada editado desde el panel: zonas nuevas, FAQs de zonas que no tienen ninguna
 * y artículos nuevos. Las filas que ya existen no se tocan.
 * Se ejecuta en cada build de Vercel (scripts/sync-on-build.mjs) y a mano con
 * `npm run db:sync-local` (necesita DATABASE_URL).
 */
import { eq, sql } from "drizzle-orm";

import { ARTICLES } from "@/content/articles";
import { AUTHORS } from "@/content/blog";
import { LOCAL_AREAS } from "@/content/zones";
import { scriptDb, schema } from "@/db/seed-client";

const { articles, authors, faqs, localAreas } = schema;

async function main() {
  const db = scriptDb();
  const now = new Date();
  let zonesInserted = 0;
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
    const inserted = await db.insert(localAreas).values(values).onConflictDoNothing({ target: localAreas.slug }).returning({ slug: localAreas.slug });
    zonesInserted += inserted.length;
  }

  let faqsInserted = 0;
  for (const z of LOCAL_AREAS) {
    if (!z.faqs.length) continue;
    const [existing] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(faqs)
      .where(sql`${faqs.scope} = 'area' and ${faqs.scopeSlug} = ${z.slug}`);
    if (existing && existing.n > 0) continue;
    await db.insert(faqs).values(z.faqs.map((f, i) => ({ question: f.question, answer: f.answer, scope: "area", scopeSlug: z.slug, order: i + 1 })));
    faqsInserted += z.faqs.length;
  }

  const authorRows = await db.select({ id: authors.id, slug: authors.slug }).from(authors);
  const authorId = (slug: string) => authorRows.find((a) => a.slug === slug)?.id ?? null;
  const authorName = (slug: string) => AUTHORS.find((a) => a.slug === slug)?.name ?? null;
  let articlesInserted = 0;
  for (const a of ARTICLES) {
    const [existing] = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, a.slug));
    if (existing) continue;
    await db.insert(articles).values({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      categorySlug: a.categorySlug,
      tags: a.tags,
      relatedServiceSlugs: a.relatedServiceSlugs,
      coverImagePath: a.coverImagePath ?? null,
      authorId: authorId(a.authorSlug),
      authorName: authorName(a.authorSlug),
      readingMinutes: a.readingMinutes,
      status: a.status,
      publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
      reviewedAt: a.reviewedAt ? new Date(a.reviewedAt) : null,
      keywordPrimary: a.keywordPrimary,
      keywordsSecondary: a.keywordsSecondary,
      faqs: a.faqs,
      sources: a.sources,
      formVariant: a.formVariant,
      metaTitle: a.metaTitle,
      metaDescription: a.metaDescription,
      updatedAt: now,
    });
    articlesInserted += 1;
  }

  console.log(JSON.stringify({ zonesInserted, faqsInserted, articlesInserted }));
}

main().catch((error) => {
  console.error("Sync fallido:", error instanceof Error ? error.message.slice(0, 200) : error);
  if (error instanceof Error && error.cause) console.error("Causa:", error.cause instanceof Error ? error.cause.message : error.cause);
  process.exit(1);
});
