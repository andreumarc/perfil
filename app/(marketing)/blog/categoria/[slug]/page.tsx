import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogList } from "@/components/blog/blog-list";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { BLOG_CATEGORIES } from "@/content/blog";
import { toCardData } from "@/lib/blog";
import { getArticles, getCategories, getCategory } from "@/lib/cms/articles";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [category, s] = await Promise.all([getCategory(slug), getSettings()]);
  if (!category) return {};
  return pageMetadata({
    title: `${category.name}: artículos del blog`,
    description: category.description,
    path: `/blog/categoria/${category.slug}`,
    siteName: s.company.name,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const [settings, articles, categories] = await Promise.all([getSettings(), getArticles(), getCategories()]);
  const cards = articles.filter((a) => a.categorySlug === category.slug).map((a) => toCardData(a, categories));
  const usedCategories = categories.filter((c) => articles.some((a) => a.categorySlug === c.slug) || c.slug === category.slug);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: category.name, path: `/blog/categoria/${category.slug}` }]} />
          <p className="eyebrow mt-6">Categoría</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl text-ink-900 sm:text-4xl md:text-5xl">{category.name}</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-600 md:text-lg">{category.description}</p>
          <nav aria-label="Categorías" className="mt-6 flex flex-wrap gap-2">
            <Link href="/blog" className="inline-flex rounded-full border border-gray-300 bg-white px-3.5 py-1.5 text-sm text-ink-900 hover:border-copper-400 hover:bg-copper-50">
              Todos
            </Link>
            {usedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/categoria/${c.slug}`}
                aria-current={c.slug === category.slug ? "page" : undefined}
                className={cn(
                  "inline-flex rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  c.slug === category.slug ? "border-copper-500 bg-copper-500 text-white" : "border-gray-300 bg-white text-ink-900 hover:border-copper-400 hover:bg-copper-50",
                )}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </Container>
      </section>

      <Section tone="muted">
        <BlogList articles={cards} emptyMessage="Todavía no hay artículos publicados en esta categoría." />
      </Section>

      <CtaBand location="blog_category_footer" whatsappHref={wa} />
    </>
  );
}
