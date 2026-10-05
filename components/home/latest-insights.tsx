import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { getCategory, getLatestPosts } from "@/content/insights";
import { formatDate } from "@/lib/utils";

/** Últimos tres artículos. No se renderiza nada si todavía no hay contenido publicado. */
export function LatestInsights() {
  const posts = getLatestPosts(3);
  if (posts.length === 0) return null;

  return (
    <Section tone="muted">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Insights"
          title="Ideas para dirigir redes de centros con datos."
          description="P&L por centro, palancas de EBITDA, integraciones y dirección de managers. Artículos cortos, escritos para quien tiene que decidir."
        />
        <Link
          href="/insights"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-navy-900 underline-offset-4 hover:underline"
        >
          Ver todos los insights
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-[0_18px_40px_-24px_rgba(10,26,51,0.35)]"
          >
            <p className="eyebrow">{getCategory(post.category)?.label ?? post.category}</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-navy-900">
              <Link href={`/insights/${post.slug}`} className="after:absolute after:inset-0">
                {post.title}
              </Link>
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 md:text-[15px]">{post.excerpt}</p>
            <p className="mt-6 flex items-center gap-2 border-t border-gray-200 pt-4 text-xs text-gray-500">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min de lectura</span>
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
