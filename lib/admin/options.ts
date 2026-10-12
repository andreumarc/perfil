import "server-only";

import { asc } from "drizzle-orm";

import type { Option, OptionSets } from "@/components/admin/content/resource-form";
import { BLOG_CATEGORIES } from "@/content/blog";
import { SECTORS } from "@/content/sectors";
import { SERVICES, SERVICE_GROUPS } from "@/content/services";
import { getDb } from "@/db/client";
import { authors, blogCategories, mediaAssets, sectors, services } from "@/db/schema";
import { FORM_VARIANTS } from "@/lib/validation/lead";

const FORM_VARIANT_LABELS: Record<string, string> = {
  general: "General",
  vivienda: "Vivienda",
  local: "Local o negocio",
  gimnasio: "Gimnasio",
  restaurante: "Restaurante",
  clinica: "Clínica",
  instalaciones: "Instalaciones",
};

/** Conjuntos de opciones para los selects del formulario genérico (BD con fallback a content/). */
export async function loadOptionSets(): Promise<OptionSets> {
  const db = getDb();
  let serviceOpts: Option[] = SERVICES.map((s) => ({ value: s.slug, label: s.name }));
  let sectorOpts: Option[] = SECTORS.map((s) => ({ value: s.slug, label: s.name }));
  let categoryOpts: Option[] = BLOG_CATEGORIES.map((c) => ({ value: c.slug, label: c.name }));
  let authorOpts: Option[] = [];
  if (db) {
    try {
      const [s, se, c, a] = await Promise.all([
        db.select({ slug: services.slug, name: services.name }).from(services).orderBy(asc(services.name)),
        db.select({ slug: sectors.slug, name: sectors.name }).from(sectors).orderBy(asc(sectors.name)),
        db.select({ slug: blogCategories.slug, name: blogCategories.name }).from(blogCategories).orderBy(asc(blogCategories.order)),
        db.select({ id: authors.id, name: authors.name }).from(authors).orderBy(asc(authors.name)),
      ]);
      if (s.length) serviceOpts = s.map((x) => ({ value: x.slug, label: x.name }));
      if (se.length) sectorOpts = se.map((x) => ({ value: x.slug, label: x.name }));
      if (c.length) categoryOpts = c.map((x) => ({ value: x.slug, label: x.name }));
      authorOpts = a.map((x) => ({ value: x.id, label: x.name }));
    } catch (error) {
      console.error("[admin] error cargando opciones:", error);
    }
  }
  return {
    services: serviceOpts,
    sectors: sectorOpts,
    categories: categoryOpts,
    authors: authorOpts,
    groups: SERVICE_GROUPS.map((g) => ({ value: g.slug, label: g.name })),
    status: [
      { value: "draft", label: "Borrador" },
      { value: "published", label: "Publicado" },
    ],
    formVariants: FORM_VARIANTS.map((v) => ({ value: v, label: FORM_VARIANT_LABELS[v] ?? v })),
    faqScopes: [
      { value: "global", label: "Global (home)" },
      { value: "service", label: "Servicio" },
      { value: "sector", label: "Sector" },
      { value: "area", label: "Zona" },
    ],
  };
}

/** Imágenes de la biblioteca de medios (para los campos de imagen). */
export async function loadMediaOptions(): Promise<Option[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db.select({ url: mediaAssets.url, filename: mediaAssets.filename, kind: mediaAssets.kind }).from(mediaAssets).orderBy(asc(mediaAssets.filename)).limit(300);
    return rows.map((r) => ({ value: r.url, label: `${r.filename}${r.kind === "illustrative" ? " (ilustrativa)" : ""}` }));
  } catch {
    return [];
  }
}
