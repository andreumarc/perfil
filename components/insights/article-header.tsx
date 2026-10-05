import Link from "next/link";

import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import type { INSIGHT_CATEGORIES, InsightPost } from "@/content/insights";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Category = (typeof INSIGHT_CATEGORIES)[number];

/**
 * Cabecera de artículo: migas de pan, categoría, H1, extracto y fila de autor.
 * Único H1 de la página.
 */
export function ArticleHeader({ post, category }: { post: InsightPost; category: Category }) {
  const updated = post.updatedAt && post.updatedAt !== post.publishedAt ? post.updatedAt : undefined;

  return (
    <header className="max-w-3xl">
      <Breadcrumbs
        items={[
          { name: "Insights", path: "/insights" },
          { name: category.label, path: `/insights/categoria/${category.slug}` },
          { name: post.title, path: `/insights/${post.slug}` },
        ]}
      />
      <Link
        href={`/insights/categoria/${category.slug}`}
        className="eyebrow mt-8 inline-block hover:text-signal-dark md:mt-12"
      >
        {category.label}
      </Link>
      <h1 className="font-display mt-4 text-3xl leading-[1.1] text-navy-900 sm:text-4xl md:text-5xl">{post.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">{post.excerpt}</p>

      <div className="mt-8 flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-md bg-navy-900 text-sm font-bold text-white"
          >
            MA
          </div>
          <div className="text-sm leading-tight">
            <p className="font-semibold text-navy-900">{site.name}</p>
            <p className="text-gray-500">Director de Operaciones</p>
          </div>
        </div>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, { month: "long" })}</time>
          {updated ? (
            <>
              <span aria-hidden>·</span>
              <span>
                Actualizado <time dateTime={updated}>{formatDate(updated, { month: "long" })}</time>
              </span>
            </>
          ) : null}
          <span aria-hidden>·</span>
          <span className="tabular">{post.readingMinutes} min de lectura</span>
        </p>
      </div>
    </header>
  );
}
