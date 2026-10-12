import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";

import { requireDb } from "@/db/client";
import { articles, authors, blogCategories, faqs, leads, localAreas, projects, sectors, services } from "@/db/schema";
import { RESOURCE_SCHEMAS, type ResourceKey } from "@/lib/validation/content";

/** Tablas, columnas anulables y columnas de fecha por recurso. */
const TABLES = {
  services,
  sectors,
  projects,
  articles,
  faqs,
  zones: localAreas,
  categories: blogCategories,
  authors,
} as const;

const NULLABLE: Record<ResourceKey, string[]> = {
  services: ["licenseNote", "imagePath", "metaTitle", "metaDescription"],
  sectors: ["imagePath", "metaTitle", "metaDescription"],
  projects: ["serviceSlug", "sectorSlug", "locality", "coverImagePath", "metaTitle", "metaDescription"],
  articles: ["coverImagePath", "authorId", "canonicalUrl", "keywordPrimary", "metaTitle", "metaDescription"],
  faqs: ["scopeSlug"],
  zones: ["metaTitle", "metaDescription"],
  categories: [],
  authors: ["avatarPath"],
};

const DATES: Record<ResourceKey, string[]> = {
  services: [],
  sectors: [],
  projects: [],
  articles: ["publishedAt", "reviewedAt"],
  faqs: [],
  zones: [],
  categories: [],
  authors: [],
};

export type ResourceRow = Record<string, unknown> & { id: string };

function orderBy(key: ResourceKey) {
  switch (key) {
    case "articles":
      return [desc(articles.updatedAt)];
    case "faqs":
      return [asc(faqs.scope), asc(faqs.scopeSlug), asc(faqs.order)];
    case "categories":
      return [asc(blogCategories.order), asc(blogCategories.name)];
    case "authors":
      return [asc(authors.name)];
    case "services":
      return [asc(services.groupSlug), asc(services.order), asc(services.name)];
    case "sectors":
      return [asc(sectors.order), asc(sectors.name)];
    case "projects":
      return [asc(projects.order), desc(projects.createdAt)];
    case "zones":
      return [asc(localAreas.order), asc(localAreas.name)];
  }
}

export async function listRows(key: ResourceKey): Promise<ResourceRow[]> {
  const db = requireDb();
  const table = TABLES[key];
  const rows = await db.select().from(table).orderBy(...orderBy(key));
  return rows as ResourceRow[];
}

export async function getRow(key: ResourceKey, id: string): Promise<ResourceRow | null> {
  const db = requireDb();
  const table = TABLES[key];
  const rows = await db.select().from(table).where(eq(table.id, id)).limit(1);
  return (rows[0] as ResourceRow | undefined) ?? null;
}

/** Convierte una fila de BD a los valores del formulario (fechas a texto, null a ""). */
export function rowToForm(key: ResourceKey, row: ResourceRow): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (k === "id" || k === "createdAt" || k === "updatedAt" || k === "imageId" || k === "coverImageId" || k === "authorName") continue;
    if (v instanceof Date) out[k] = DATES[key].includes(k) && k === "publishedAt" ? toLocalDateTime(v) : v.toISOString().slice(0, 10);
    else if (v === null || v === undefined) out[k] = "";
    else out[k] = v;
  }
  return out;
}

function toLocalDateTime(d: Date): string {
  return d.toISOString().slice(0, 16);
}

/** Valida y prepara los valores del formulario para insertar/actualizar. */
export function parseValues(key: ResourceKey, input: unknown): Record<string, unknown> {
  const schema = RESOURCE_SCHEMAS[key];
  const parsed = schema.parse(input) as Record<string, unknown>;
  const out: Record<string, unknown> = { ...parsed };
  for (const col of NULLABLE[key]) if (out[col] === "") out[col] = null;
  for (const col of DATES[key]) out[col] = out[col] === "" || out[col] === null ? null : new Date(String(out[col]));
  return out;
}

export class SlugConflictError extends Error {
  constructor() {
    super("Ya existe un elemento con ese slug.");
    this.name = "SlugConflictError";
  }
}

function isUniqueViolation(error: unknown): boolean {
  const e = error as { code?: string; cause?: { code?: string } };
  return e?.code === "23505" || e?.cause?.code === "23505";
}

export async function insertRow(key: ResourceKey, values: Record<string, unknown>): Promise<string> {
  const db = requireDb();
  const table = TABLES[key];
  try {
    // Los valores ya están validados por el esquema Zod del recurso.
    const rows = await db
      .insert(table)
      .values(values as never)
      .returning({ id: table.id });
    return rows[0].id;
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlugConflictError();
    throw error;
  }
}

export async function updateRow(key: ResourceKey, id: string, values: Record<string, unknown>): Promise<boolean> {
  const db = requireDb();
  const table = TABLES[key];
  const hasUpdatedAt = "updatedAt" in table;
  try {
    const rows = await db
      .update(table)
      .set({ ...(values as object), ...(hasUpdatedAt ? { updatedAt: new Date() } : {}) } as never)
      .where(eq(table.id, id))
      .returning({ id: table.id });
    return rows.length > 0;
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlugConflictError();
    throw error;
  }
}

export async function deleteRow(key: ResourceKey, id: string): Promise<boolean> {
  const db = requireDb();
  const table = TABLES[key];
  const rows = await db.delete(table).where(eq(table.id, id)).returning({ id: table.id });
  return rows.length > 0;
}

export async function setRowStatus(key: ResourceKey, id: string, status: "draft" | "published"): Promise<boolean> {
  if (key === "faqs" || key === "categories" || key === "authors") return false;
  const db = requireDb();
  const table = TABLES[key];
  const extra = key === "articles" && status === "published" ? { publishedAt: sql`coalesce(${articles.publishedAt}, now())` } : {};
  const rows = await db
    .update(table)
    .set({ status, updatedAt: new Date(), ...extra } as never)
    .where(eq(table.id, id))
    .returning({ id: table.id });
  return rows.length > 0;
}

/** Solicitudes generadas por cada artículo (para el listado del blog). */
export async function leadsPerArticle(): Promise<Record<string, number>> {
  const db = requireDb();
  const rows = await db
    .select({ slug: leads.articleSlug, total: sql<number>`count(*)::int` })
    .from(leads)
    .where(sql`${leads.articleSlug} is not null`)
    .groupBy(leads.articleSlug);
  return Object.fromEntries(rows.filter((r) => r.slug).map((r) => [r.slug as string, r.total]));
}
