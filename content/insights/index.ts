import { ebitdaManagementPosts } from "./posts/ebitda-management";
import { healthcarePosts } from "./posts/healthcare";
import { operacionesPlPosts } from "./posts/operaciones-pl";
import { privateEquityPosts } from "./posts/private-equity-integraciones";
import type { InsightCategorySlug, InsightPost } from "./types";

export * from "./types";

const ALL: InsightPost[] = [
  ...operacionesPlPosts,
  ...ebitdaManagementPosts,
  ...privateEquityPosts,
  ...healthcarePosts,
];

/** Todos los artículos ordenados por fecha de publicación (más reciente primero). */
export function getAllPosts(): InsightPost[] {
  return [...ALL].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPost(slug: string): InsightPost | undefined {
  return ALL.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: InsightCategorySlug): InsightPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getRelatedPosts(post: InsightPost, limit = 3): InsightPost[] {
  const sameCategory = getAllPosts().filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = getAllPosts().filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function getLatestPosts(limit = 3): InsightPost[] {
  return getAllPosts().slice(0, limit);
}

export const POST_SLUGS = ALL.map((p) => p.slug);
