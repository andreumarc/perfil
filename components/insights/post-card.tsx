import Link from "next/link";

import { getCategory, type InsightPost } from "@/content/insights";
import { cn, formatDate } from "@/lib/utils";

/**
 * Tarjeta de artículo para listados. Toda la tarjeta es clicable (enlace de área
 * completa sobre el título), sin imágenes: categoría, título, extracto y metadatos.
 */
export function PostCard({
  post,
  headingLevel = "h3",
  className,
}: {
  post: InsightPost;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  const category = getCategory(post.category);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-[0_18px_40px_-24px_rgba(10,26,51,0.35)]",
        className,
      )}
    >
      <p className="eyebrow">{category?.label ?? post.category}</p>
      <Heading className="mt-3 text-xl font-semibold tracking-tight text-navy-900">
        <Link href={`/insights/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </Heading>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 md:text-[15px]">{post.excerpt}</p>
      <p className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span className="tabular">{post.readingMinutes} min de lectura</span>
      </p>
    </article>
  );
}
