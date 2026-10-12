import "server-only";

import { asc, eq } from "drizzle-orm";
import { cache } from "react";

import type { LocalAreaContent } from "@/content/types";
import { LOCAL_AREAS } from "@/content/zones";
import { getDb } from "@/db/client";
import { localAreas, type LocalAreaRow } from "@/db/schema";

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export function zoneFromRow(row: LocalAreaRow, fallback?: LocalAreaContent): LocalAreaContent {
  return {
    slug: row.slug,
    name: row.name,
    province: row.province,
    headline: row.headline,
    summary: row.summary,
    body: row.body,
    serviceSlugs: asStringArray(row.serviceSlugs),
    faqs: fallback?.faqs ?? [],
    order: row.order,
    status: row.status,
    metaTitle: row.metaTitle ?? undefined,
    metaDescription: row.metaDescription ?? undefined,
  };
}

export const getZones = cache(async (): Promise<LocalAreaContent[]> => {
  const db = getDb();
  if (!db) return LOCAL_AREAS.filter((z) => z.status === "published");
  try {
    const rows = await db.select().from(localAreas).where(eq(localAreas.status, "published")).orderBy(asc(localAreas.order), asc(localAreas.name));
    return rows.map((row) => zoneFromRow(row, LOCAL_AREAS.find((z) => z.slug === row.slug)));
  } catch (error) {
    console.error("[cms] error leyendo local_areas:", error);
    return LOCAL_AREAS.filter((z) => z.status === "published");
  }
});

export const getZone = cache(async (slug: string): Promise<LocalAreaContent | null> => {
  const db = getDb();
  if (!db) return LOCAL_AREAS.find((z) => z.slug === slug && z.status === "published") ?? null;
  try {
    const row = await db.query.localAreas.findFirst({ where: eq(localAreas.slug, slug) });
    if (!row || row.status !== "published") return null;
    return zoneFromRow(row, LOCAL_AREAS.find((z) => z.slug === slug));
  } catch (error) {
    console.error("[cms] error leyendo local_area:", error);
    return null;
  }
});
