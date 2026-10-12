import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/components/blog/article-card";
import { BlogList } from "@/components/blog/blog-list";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { toCardData } from "@/lib/blog";
import { getArticles, getCategories } from "@/lib/cms/articles";
import { getSettings } from "@/lib/cms/settings";
import { whatsappHref } from "@/lib/phone";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return pageMetadata({
    title: "Blog de reformas e instalaciones: precios, normativa y guías",
    description: "Guías prácticas con precios orientativos, normativa y consejos para reformar viviendas, locales, gimnasios, restaurantes y clínicas, y para renovar instalaciones.",
    path: "/blog",
    siteName: s.company.name,
    keywords: ["blog reformas", "precio reforma", "guía reforma local", "normativa reformas"],
  });
}

export default async function BlogPage() {
  const [settings, articles, categories] = await Promise.all([getSettings(), getArticles(), getCategories()]);
  const cards = articles.map((a) => toCardData(a, categories));
  const [featured, ...rest] = cards;
  const usedCategories = categories.filter((c) => articles.some((a) => a.categorySlug === c.slug));
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);

  return (
    <>
      <section className="bg-ink-grid text-white">
        <Container className="py-14 md:py-20">
          <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} className="text-ink-300 [&_a:hover]:text-white [&_[aria-current]]:text-white" />
          <p className="eyebrow mt-8 text-copper-300">Blog</p>
          <h1 className="font-display mt-3 max-w-3xl text-3xl sm:text-4xl md:text-5xl">Precios, normativa y guías para reformar con criterio</h1>
          <p className="mt-5 max-w-2xl text-base text-ink-200 md:text-lg">
            Artículos escritos por el equipo técnico a partir de la práctica diaria: cuánto cuesta cada reforma, qué exige la normativa y qué errores evitar. Con rangos orientativos y fecha de revisión.
          </p>
          {usedCategories.length ? (
            <nav aria-label="Categorías" className="mt-8 flex flex-wrap gap-2">
              {usedCategories.map((c) => (
                <Link key={c.slug} href={`/blog/categoria/${c.slug}`} className="inline-flex rounded-full border border-white/25 px-3.5 py-1.5 text-sm text-white transition-colors hover:border-copper-400 hover:bg-white/10">
                  {c.name}
                </Link>
              ))}
            </nav>
          ) : null}
        </Container>
      </section>

      <Section tone="muted">
        {featured ? (
          <div className="mb-12">
            <p className="eyebrow mb-4">Destacado</p>
            <ArticleCard article={featured} featured priority />
          </div>
        ) : null}
        <BlogList articles={rest.length ? rest : cards.slice(0, 0)} emptyMessage={featured ? "No hay más artículos por ahora." : "Todavía no hay artículos publicados. Los primeros se publicarán desde el panel de administración."} />
      </Section>

      <CtaBand location="blog_footer" whatsappHref={wa} title="¿Prefieres hablar de tu proyecto?" description="Los artículos orientan; el presupuesto lo hacemos tras una visita. Cuéntanos qué necesitas." />
    </>
  );
}
