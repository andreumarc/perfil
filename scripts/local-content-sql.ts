/**
 * Genera SQL idempotente con el contenido local (zonas, FAQs de zona y artículos)
 * para ejecutarlo donde no hay conexión directa (consola de Neon, MCP).
 * Uso: npx tsx scripts/local-content-sql.ts <directorio-salida> [--only=slug1,slug2]
 *  - zones-N.sql: upsert de zonas por slug (lotes de 4, unos 30 KB cada uno).
 *  - faqs.sql: FAQs de zona solo para las zonas que aún no tienen ninguna.
 *  - articles-N.sql: artículos nuevos (los existentes no se tocan).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { ARTICLES } from "@/content/articles";
import { AUTHORS } from "@/content/blog";
import { LOCAL_AREAS } from "@/content/zones";

const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;
const chunk = <T,>(items: T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, (i + 1) * size));

const outDir = process.argv[2];
/** --only=slug1,slug2 limita las zonas a esas (útil para actualizar páginas ya cargadas). */
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",").filter(Boolean);
const ZONES = only ? LOCAL_AREAS.filter((z) => only.includes(z.slug)) : LOCAL_AREAS;
if (!outDir) {
  console.error("Uso: npx tsx scripts/local-content-sql.ts <directorio-salida>");
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });
const files: string[] = [];

chunk(ZONES, 4).forEach((batch, i) => {
  const rows = batch.map((z) => `(${q(z.slug)}, ${q(z.name)}, ${q(z.province)}, ${q(z.headline)}, ${q(z.summary)}, ${q(z.body)}, ${j(z.serviceSlugs)}, ${z.order}, ${q(z.status)}, ${z.metaTitle ? q(z.metaTitle) : "NULL"}, ${z.metaDescription ? q(z.metaDescription) : "NULL"}, now())`);
  const sql = `INSERT INTO local_areas (slug, name, province, headline, summary, body, service_slugs, "order", status, meta_title, meta_description, updated_at)\nVALUES\n${rows.join(",\n")}\nON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, province = EXCLUDED.province, headline = EXCLUDED.headline, summary = EXCLUDED.summary, body = EXCLUDED.body, service_slugs = EXCLUDED.service_slugs, "order" = EXCLUDED."order", status = EXCLUDED.status, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description, updated_at = now();`;
  const name = `zones-${i + 1}.sql`;
  writeFileSync(path.join(outDir, name), sql);
  files.push(name);
});

chunk(ZONES, 12).forEach((batch, i) => {
  const faqRows = batch.flatMap((z) => z.faqs.map((f, k) => `(${q(f.question)}, ${q(f.answer)}, 'area', ${q(z.slug)}, ${k + 1})`));
  const name = `faqs-${i + 1}.sql`;
  writeFileSync(
    path.join(outDir, name),
    `INSERT INTO faqs (question, answer, scope, scope_slug, "order")\nSELECT v.question, v.answer, v.scope, v.scope_slug, v.ord FROM (VALUES\n${faqRows.join(",\n")}\n) AS v(question, answer, scope, scope_slug, ord)\nWHERE NOT EXISTS (SELECT 1 FROM faqs f WHERE f.scope = 'area' AND f.scope_slug = v.scope_slug);`,
  );
  files.push(name);
});

const authorName = (slug: string) => AUTHORS.find((a) => a.slug === slug)?.name ?? "";
chunk(ARTICLES.filter((a) => a.status === "published"), 2).forEach((batch, i) => {
  const rows = batch.map(
    (a) =>
      `(${q(a.slug)}, ${q(a.title)}, ${q(a.excerpt)}, ${q(a.body)}, ${q(a.categorySlug)}, ${j(a.tags)}, ${j(a.relatedServiceSlugs)}, ${a.coverImagePath ? q(a.coverImagePath) : "NULL"}, (SELECT id FROM authors WHERE slug = ${q(a.authorSlug)} LIMIT 1), ${q(authorName(a.authorSlug))}, ${a.readingMinutes}, ${q(a.status)}, ${a.publishedAt ? q(a.publishedAt) : "NULL"}, ${a.reviewedAt ? q(a.reviewedAt) : "NULL"}, ${q(a.keywordPrimary)}, ${j(a.keywordsSecondary)}, ${j(a.faqs)}, ${j(a.sources)}, ${q(a.formVariant)}, ${q(a.metaTitle)}, ${q(a.metaDescription)}, now())`,
  );
  const sql = `INSERT INTO articles (slug, title, excerpt, body, category_slug, tags, related_service_slugs, cover_image_path, author_id, author_name, reading_minutes, status, published_at, reviewed_at, keyword_primary, keywords_secondary, faqs, sources, form_variant, meta_title, meta_description, updated_at)\nVALUES\n${rows.join(",\n")}\nON CONFLICT (slug) DO NOTHING;`;
  const name = `articles-${i + 1}.sql`;
  writeFileSync(path.join(outDir, name), sql);
  files.push(name);
});

console.log(files.join("\n"));
