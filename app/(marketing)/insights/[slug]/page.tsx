import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RichContent } from "@/components/content/rich-content";
import { ArticleHeader } from "@/components/insights/article-header";
import { AuthorBox } from "@/components/insights/author-box";
import { InsightCta } from "@/components/insights/insight-cta";
import { RelatedPosts } from "@/components/insights/related-posts";
import { RelatedServices } from "@/components/landing/related-services";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { POST_SLUGS, getCategory, getPost, getRelatedPosts } from "@/content/insights";
import { articleJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return POST_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: post.title,
    description: post.metaDescription,
    path: `/insights/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    image: `${site.url}/insights/${post.slug}/opengraph-image`,
  });
}

export default async function InsightPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const category = getCategory(post.category);
  if (!category) notFound();

  const path = `/insights/${post.slug}`;
  const faqs = post.faqs ?? [];
  const related = getRelatedPosts(post);

  return (
    <>
      {/* Cabecera ---------------------------------------------------------- */}
      <section className="border-b border-gray-200 bg-white">
        <Container size="narrow" className="pt-6 pb-10 md:pt-8 md:pb-12">
          <ArticleHeader post={post} category={category} />
        </Container>
      </section>

      {/* Cuerpo ------------------------------------------------------------ */}
      <Section size="compact" containerSize="narrow">
        <RichContent blocks={post.blocks} />
        <InsightCta className="mt-12" />
      </Section>

      {/* FAQ --------------------------------------------------------------- */}
      {faqs.length > 0 ? (
        <Section tone="muted" size="compact" containerSize="narrow">
          <SectionHeading eyebrow="Preguntas frecuentes" title="Lo que suelen preguntarme sobre este tema" />
          <Faq items={faqs} className="mt-8" />
          <JsonLd data={faqJsonLd(faqs)} />
        </Section>
      ) : null}

      {/* Autor ------------------------------------------------------------- */}
      <Section size="compact" containerSize="narrow">
        <AuthorBox />
      </Section>

      {/* Servicios relacionados -------------------------------------------- */}
      {post.relatedServices.length > 0 ? (
        <RelatedServices
          slugs={post.relatedServices}
          eyebrow="Servicios relacionados"
          title="Cómo se lleva esto a la práctica"
          description="Leer sirve para reconocer el problema. Estos son los formatos con los que lo resuelvo dentro de una red de centros."
          tone="white"
        />
      ) : null}

      {/* Artículos relacionados -------------------------------------------- */}
      <RelatedPosts posts={related} />

      <CtaBand
        location="insight_final"
        title="¿Quieres saber en qué punto está tu red?"
        description="El diagnóstico gratuito de 3 minutos sitúa tu organización en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad. Si prefieres hablarlo directamente, reserva una sesión de 30 minutos."
      />

      <JsonLd
        data={{
          ...articleJsonLd({
            title: post.title,
            description: post.metaDescription,
            path,
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt ?? post.publishedAt,
            keywords: post.keywords,
          }),
          image: `${site.url}${path}/opengraph-image`,
          articleSection: category.label,
        }}
      />
    </>
  );
}
