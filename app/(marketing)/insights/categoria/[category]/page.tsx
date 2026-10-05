import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { CategoryChips } from "@/components/insights/category-chips";
import { InsightsEmptyState } from "@/components/insights/empty-state";
import { PostGrid } from "@/components/insights/post-grid";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { INSIGHT_CATEGORIES, getCategory, getPostsByCategory, type InsightCategorySlug } from "@/content/insights";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ category: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return INSIGHT_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return pageMetadata({
    title: `${category.label}: artículos sobre ${category.label.toLowerCase()} en empresas multicentro`,
    description: `${category.description} Artículos para CEOs, COOs, CFOs e inversores de redes de centros.`,
    path: `/insights/categoria/${category.slug}`,
    keywords: [category.label.toLowerCase(), "gestión multicentro", "P&L por centro", "rentabilidad por centro", "EBITDA"],
  });
}

export default async function InsightsCategoryPage({ params }: { params: Params }) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(category.slug as InsightCategorySlug);
  const otherCategories = INSIGHT_CATEGORIES.filter((c) => c.slug !== category.slug);

  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <section className="border-b border-gray-200 bg-white">
        <Container className="pt-6 pb-10 md:pt-8 md:pb-14">
          <Breadcrumbs
            items={[
              { name: "Insights", path: "/insights" },
              { name: category.label, path: `/insights/categoria/${category.slug}` },
            ]}
          />
          <div className="mt-8 md:mt-12">
            <SectionHeading as="h1" eyebrow="Insights" title={category.label} description={category.description} />
          </div>
          <CategoryChips active={category.slug} className="mt-10" />
        </Container>
      </section>

      {/* Artículos --------------------------------------------------------- */}
      <Section>
        {posts.length > 0 ? (
          <>
            <p className="eyebrow">
              {posts.length} {posts.length === 1 ? "artículo" : "artículos"}
            </p>
            <PostGrid posts={posts} headingLevel="h2" className="mt-6" />
          </>
        ) : (
          <InsightsEmptyState
            location="insights_category_empty"
            title={`Todavía no hay artículos en ${category.label}.`}
            description="Se publican nuevos artículos cada pocas semanas. Mientras tanto, el diagnóstico gratuito de 3 minutos te dice en qué nivel de madurez operativa está tu red y por dónde empezar."
          />
        )}
      </Section>

      {/* Otras categorías -------------------------------------------------- */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Otras categorías"
          title="Explorar el resto de temas"
          description="Los mismos problemas de una red de centros vistos desde el P&L, los KPIs, la integración de adquisiciones o la dirección de managers."
        />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {otherCategories.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/insights/categoria/${other.slug}`}
                className="group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-[0_18px_40px_-24px_rgba(10,26,51,0.35)]"
              >
                <span className="text-lg font-semibold tracking-tight text-navy-900">{other.label}</span>
                <span className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{other.description}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy-900 transition-all group-hover:gap-2">
                  Ver artículos
                  <ArrowRightIcon className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        location="insights_category_final"
        title="¿Quieres saber en qué punto está tu red?"
        description="El diagnóstico gratuito de 3 minutos sitúa tu organización en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad. Resultado inmediato y sin compromiso."
      />
    </>
  );
}
