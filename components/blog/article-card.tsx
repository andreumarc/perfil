import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  categoryName: string;
  readingMinutes: number;
  dateLabel: string;
  coverImagePath?: string;
}

/** Tarjeta de artículo (usable desde servidor y cliente). */
export function ArticleCard({ article, featured = false, priority = false, className }: { article: ArticleCardData; featured?: boolean; priority?: boolean; className?: string }) {
  return (
    <article className={cn("group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-[0_12px_32px_rgba(23,25,29,0.10)]", featured && "lg:grid lg:grid-cols-2", className)}>
      <Link href={`/blog/${article.slug}`} className={cn("relative block bg-ink-900", featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[320px]" : "aspect-[16/10]")} aria-label={article.title} tabIndex={-1}>
        {article.coverImagePath ? (
          <>
            <Image
              src={article.coverImagePath}
              alt=""
              fill
              priority={priority}
              sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-ink-grid" aria-hidden />
        )}
      </Link>
      <div className={cn("flex flex-1 flex-col p-5", featured && "lg:p-8")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <Link href={`/blog/categoria/${article.categorySlug}`} className="font-semibold uppercase tracking-[0.12em] text-copper-600 hover:underline">
            {article.categoryName}
          </Link>
          <span className="tabular">{article.dateLabel}</span>
          <span className="tabular inline-flex items-center gap-1">
            <ClockIcon className="size-3.5" aria-hidden />
            {article.readingMinutes} min
          </span>
        </div>
        <h3 className={cn("font-display mt-3 text-ink-900", featured ? "text-2xl leading-tight md:text-3xl" : "text-lg leading-snug")}>
          <Link href={`/blog/${article.slug}`} className="hover:underline underline-offset-4">
            {article.title}
          </Link>
        </h3>
        <p className={cn("mt-2 text-sm text-gray-600", featured ? "line-clamp-4 md:text-base" : "line-clamp-3")}>{article.excerpt}</p>
        <Link href={`/blog/${article.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-900">
          Leer artículo <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
