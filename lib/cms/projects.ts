import "server-only";

import { asc, desc, eq } from "drizzle-orm";
import { cache } from "react";

import { PROJECTS } from "@/content/projects";
import type { ProjectContent } from "@/content/types";
import { getDb } from "@/db/client";
import { mediaAssets, projectImages, projects, type ProjectRow } from "@/db/schema";

export interface ProjectView extends ProjectContent {
  gallery: { url: string; alt: string; caption: string | null; role: string }[];
}

function fromRow(row: ProjectRow, coverUrl?: string | null): ProjectContent {
  return {
    slug: row.slug,
    title: row.title,
    serviceSlug: row.serviceSlug ?? undefined,
    sectorSlug: row.sectorSlug ?? undefined,
    locality: row.locality ?? undefined,
    summary: row.summary,
    scope: row.scope,
    body: row.body,
    coverImagePath: coverUrl ?? row.coverImagePath ?? undefined,
    isIllustrative: row.isIllustrative,
    hasVerifiedBeforeAfter: row.hasVerifiedBeforeAfter,
    order: row.order,
    status: row.status,
  };
}

export const getProjects = cache(async (): Promise<ProjectContent[]> => {
  const db = getDb();
  if (!db) return PROJECTS.filter((p) => p.status === "published");
  try {
    const rows = await db
      .select({ project: projects, coverUrl: mediaAssets.url })
      .from(projects)
      .leftJoin(mediaAssets, eq(projects.coverImageId, mediaAssets.id))
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.order), desc(projects.createdAt));
    return rows.map((r) => fromRow(r.project, r.coverUrl));
  } catch (error) {
    console.error("[cms] error leyendo projects:", error);
    return PROJECTS.filter((p) => p.status === "published");
  }
});

export const getProject = cache(async (slug: string): Promise<ProjectView | null> => {
  const db = getDb();
  if (!db) {
    const p = PROJECTS.find((x) => x.slug === slug && x.status === "published");
    return p ? { ...p, gallery: (p.galleryPaths ?? []).map((url) => ({ url, alt: p.title, caption: null, role: "gallery" })) } : null;
  }
  try {
    const rows = await db
      .select({ project: projects, coverUrl: mediaAssets.url })
      .from(projects)
      .leftJoin(mediaAssets, eq(projects.coverImageId, mediaAssets.id))
      .where(eq(projects.slug, slug))
      .limit(1);
    const row = rows[0];
    if (!row || row.project.status !== "published") return null;
    const images = await db
      .select({ image: projectImages, media: mediaAssets })
      .from(projectImages)
      .innerJoin(mediaAssets, eq(projectImages.mediaId, mediaAssets.id))
      .where(eq(projectImages.projectId, row.project.id))
      .orderBy(asc(projectImages.order));
    return {
      ...fromRow(row.project, row.coverUrl),
      gallery: images.map((i) => ({ url: i.media.url, alt: i.media.alt || row.project.title, caption: i.image.caption, role: i.image.role })),
    };
  } catch (error) {
    console.error("[cms] error leyendo project:", error);
    return null;
  }
});
