import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCategory, type InsightPost } from "@/content/insights";
import { formatDate } from "@/lib/utils";

/**
 * Artículo destacado (el más reciente) en formato de dos columnas: texto a la
 * izquierda y ficha navy con los datos clave a la derecha. Sin imágenes.
 */
export function FeaturedPost({ post }: { post: InsightPost }) {
  const category = getCategory(post.category);
  const href = `/insights/${post.slug}`;

  return (
    <article className="grid overflow-hidden rounded-lg border border-gray-200 bg-white lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col p-6 md:p-10">
        <p className="eyebrow">Último artículo</p>
        <h2 className="font-display mt-4 text-3xl leading-[1.1] text-navy-900 md:text-4xl">
          <Link href={href} className="hover:text-navy-700">
            {post.title}
          </Link>
        </h2>
        <p className="mt-5 flex-1 text-base leading-relaxed text-gray-600 md:text-lg">{post.excerpt}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, { month: "long" })}</time>
            <span aria-hidden>·</span>
            <span className="tabular">{post.readingMinutes} min de lectura</span>
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href={href}>
              Leer el artículo
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>

      <aside className="flex flex-col justify-between gap-8 bg-navy-900 p-6 text-white md:p-10">
        <p className="eyebrow text-navy-200">En este artículo</p>
        <dl className="grid gap-6">
          <div className="border-t border-white/15 pt-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-100/70">Categoría</dt>
            <dd className="mt-1.5 text-lg font-semibold">{category?.label ?? post.category}</dd>
          </div>
          <div className="border-t border-white/15 pt-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-100/70">Lectura</dt>
            <dd className="tabular mt-1.5 text-lg font-semibold">{post.readingMinutes} minutos</dd>
          </div>
          <div className="border-t border-white/15 pt-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-100/70">Publicado</dt>
            <dd className="tabular mt-1.5 text-lg font-semibold">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </dd>
          </div>
        </dl>
        {post.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Temas">
            {post.tags.slice(0, 4).map((tag) => (
              <li key={tag} className="rounded-full border border-white/20 px-3 py-1 text-xs text-navy-100/85">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </aside>
    </article>
  );
}
