import type { ArticleCardData } from "@/components/blog/article-card";
import type { ArticleContent, BlogCategoryContent } from "@/content/types";
import { formatDate } from "@/lib/utils";

/** Fecha mostrada: publicación o, si no la hay, última revisión. */
export function articleDate(a: ArticleContent): string | undefined {
  return a.publishedAt ?? a.reviewedAt;
}

export function toCardData(a: ArticleContent, categories: BlogCategoryContent[]): ArticleCardData {
  const date = articleDate(a);
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    categorySlug: a.categorySlug,
    categoryName: categories.find((c) => c.slug === a.categorySlug)?.name ?? a.categorySlug,
    readingMinutes: a.readingMinutes,
    dateLabel: date ? formatDate(date, { month: "long" }) : "",
    coverImagePath: a.coverImagePath,
  };
}
