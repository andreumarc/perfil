import "server-only";

import { asc, eq } from "drizzle-orm";
import { cache } from "react";

import { SERVICES, SERVICE_GROUPS } from "@/content/services";
import { SECTORS } from "@/content/sectors";
import type { ProcessStep, SectorContent, ServiceContent, ServiceGroupSlug } from "@/content/types";
import { getDb } from "@/db/client";
import { sectors, services, type SectorRow, type ServiceRow } from "@/db/schema";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

function asSteps(value: unknown): ProcessStep[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is { title: string; description: string } => Boolean(v && typeof v === "object" && "title" in v))
    .map((v) => ({ title: String(v.title), description: String(v.description ?? "") }));
}

export function serviceFromRow(row: ServiceRow, fallback?: ServiceContent): ServiceContent {
  return {
    slug: row.slug,
    groupSlug: row.groupSlug as ServiceGroupSlug,
    name: row.name,
    shortName: row.shortName,
    headline: row.headline,
    summary: row.summary,
    body: row.body,
    features: asStringArray(row.features),
    forWhom: asStringArray(row.forWhom),
    process: asSteps(row.process),
    faqs: fallback?.faqs ?? [],
    requiresLicensedPro: row.requiresLicensedPro,
    licenseNote: row.licenseNote ?? undefined,
    imagePath: row.imagePath ?? undefined,
    order: row.order,
    status: row.status,
    metaTitle: row.metaTitle ?? undefined,
    metaDescription: row.metaDescription ?? undefined,
    keywords: fallback?.keywords,
  };
}

export function sectorFromRow(row: SectorRow, fallback?: SectorContent): SectorContent {
  return {
    slug: row.slug,
    name: row.name,
    headline: row.headline,
    summary: row.summary,
    body: row.body,
    serviceSlugs: asStringArray(row.serviceSlugs),
    faqs: fallback?.faqs ?? [],
    imagePath: row.imagePath ?? undefined,
    order: row.order,
    status: row.status,
    metaTitle: row.metaTitle ?? undefined,
    metaDescription: row.metaDescription ?? undefined,
  };
}

/** Servicios: BD si existe (ordenados), si no los defaults de content/. Solo publicados. */
export const getServices = cache(async (): Promise<ServiceContent[]> => {
  const db = getDb();
  if (!db) return SERVICES.filter((s) => s.status === "published");
  try {
    const rows = await db.select().from(services).where(eq(services.status, "published")).orderBy(asc(services.order), asc(services.name));
    return rows.map((row) => serviceFromRow(row, SERVICES.find((s) => s.slug === row.slug)));
  } catch (error) {
    console.error("[cms] error leyendo services:", error);
    return SERVICES.filter((s) => s.status === "published");
  }
});

export const getService = cache(async (slug: string): Promise<ServiceContent | null> => {
  const db = getDb();
  if (!db) return SERVICES.find((s) => s.slug === slug && s.status === "published") ?? null;
  try {
    const row = await db.query.services.findFirst({ where: eq(services.slug, slug) });
    if (!row || row.status !== "published") return null;
    return serviceFromRow(row, SERVICES.find((s) => s.slug === slug));
  } catch (error) {
    console.error("[cms] error leyendo service:", error);
    return SERVICES.find((s) => s.slug === slug) ?? null;
  }
});

export async function getServicesByGroup() {
  const all = await getServices();
  return SERVICE_GROUPS.map((group) => ({ group, services: all.filter((s) => s.groupSlug === group.slug) }));
}

export const getSectors = cache(async (): Promise<SectorContent[]> => {
  const db = getDb();
  if (!db) return SECTORS.filter((s) => s.status === "published");
  try {
    const rows = await db.select().from(sectors).where(eq(sectors.status, "published")).orderBy(asc(sectors.order), asc(sectors.name));
    return rows.map((row) => sectorFromRow(row, SECTORS.find((s) => s.slug === row.slug)));
  } catch (error) {
    console.error("[cms] error leyendo sectors:", error);
    return SECTORS.filter((s) => s.status === "published");
  }
});

export const getSector = cache(async (slug: string): Promise<SectorContent | null> => {
  const db = getDb();
  if (!db) return SECTORS.find((s) => s.slug === slug && s.status === "published") ?? null;
  try {
    const row = await db.query.sectors.findFirst({ where: eq(sectors.slug, slug) });
    if (!row || row.status !== "published") return null;
    return sectorFromRow(row, SECTORS.find((s) => s.slug === slug));
  } catch (error) {
    console.error("[cms] error leyendo sector:", error);
    return SECTORS.find((s) => s.slug === slug) ?? null;
  }
});
