import { CategoryChips } from "@/components/insights/category-chips";
import { InsightsEmptyState } from "@/components/insights/empty-state";
import { FeaturedPost } from "@/components/insights/featured-post";
import { PostGrid } from "@/components/insights/post-grid";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { getAllPosts, type InsightPost } from "@/content/insights";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const TITLE = "Insights sobre operaciones, P&L y EBITDA en empresas multicentro";
const DESCRIPTION =
  "Artículos para CEOs, COOs, CFOs e inversores de empresas multicentro: P&L por centro, ranking y benchmarking, palancas de EBITDA, integraciones post-adquisición y dirección de managers.";

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/insights",
  keywords: [
    "gestión multicentro",
    "P&L por centro",
    "rentabilidad por centro",
    "mejorar EBITDA empresa",
    "director operaciones multicentro",
    "integración post adquisición",
    "KPIs multicentro",
  ],
});

function collectionJsonLd(posts: InsightPost[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${site.url}/insights`,
    url: `${site.url}/insights`,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "es-ES",
    isPartOf: { "@id": `${site.url}/#website` },
    author: { "@id": `${site.url}/#person` },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${site.url}/insights/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

export default function InsightsPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      {/* Hero ------------------------------------------------------------- */}
      <section className="border-b border-gray-200 bg-white">
        <Container className="pt-6 pb-10 md:pt-8 md:pb-14">
          <Breadcrumbs items={[{ name: "Insights", path: "/insights" }]} />
          <div className="mt-8 md:mt-12">
            <SectionHeading
              as="h1"
              eyebrow="Insights"
              title={TITLE}
              description="Escritos para quien tiene que decidir: CEOs, Directores Generales, COOs, CFOs e inversores con una red de centros a su cargo. P&L por centro, ranking y benchmarking, palancas de EBITDA, integraciones post-adquisición y dirección de managers. Sin teoría de manual: lo que se mide, lo que se cambia y en qué orden."
            />
          </div>
          <CategoryChips className="mt-10" />
        </Container>
      </section>

      {/* Contenido --------------------------------------------------------- */}
      {featured ? (
        <>
          <Section size="compact" className="pt-10 md:pt-14">
            <FeaturedPost post={featured} />
          </Section>
          {rest.length > 0 ? (
            <Section tone="muted">
              <SectionHeading
                eyebrow="Todos los artículos"
                title="Más artículos"
                description="Ordenados del más reciente al más antiguo. Cada uno termina con el servicio con el que se aborda en la práctica."
              />
              <PostGrid posts={rest} className="mt-12" />
            </Section>
          ) : null}
          <JsonLd data={collectionJsonLd(posts)} />
        </>
      ) : (
        <Section>
          <InsightsEmptyState location="insights_empty" />
        </Section>
      )}

      <CtaBand
        location="insights_final"
        title="¿Quieres saber en qué punto está tu red?"
        description="Leer ayuda a reconocer el problema; medir ayuda a resolverlo. El diagnóstico gratuito de 3 minutos sitúa tu organización en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad."
      />
    </>
  );
}
