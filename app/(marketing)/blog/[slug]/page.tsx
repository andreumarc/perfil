import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon, CalculatorIcon, CalendarCheckIcon, CalendarIcon, ClockIcon, ExternalLinkIcon, UserRoundIcon } from "lucide-react";

import { TrackView } from "@/components/analytics/track-view";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { ArticleCard } from "@/components/blog/article-card";
import { Markdown, extractToc } from "@/components/content/markdown";
import { Toc } from "@/components/content/toc";
import { QuoteForm } from "@/components/forms/quote-form";
import { Container } from "@/components/layout/container";
import { Section, SectionHeading } from "@/components/layout/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { Faq } from "@/components/sections/faq";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { ARTICLES } from "@/content/articles";
import { articleDate, toCardData } from "@/lib/blog";
import { CALCULATORS } from "@/lib/calculators/definitions";
import { getArticle, getAuthor, getCategories, getRelatedArticles } from "@/lib/cms/articles";
import { getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { splitMarkdownAtHeading } from "@/lib/markdown-split";
import { articleJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export const dynamicParams = true;

export function generateStaticParams() {
  return ARTICLES.filter((a) => a.status === "published").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const [article, s] = await Promise.all([getArticle(slug), getSettings()]);
  if (!article) return {};
  return pageMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/blog/${article.slug}`,
    siteName: s.company.name,
    keywords: [article.keywordPrimary, ...article.keywordsSecondary].filter(Boolean),
    type: "article",
    publishedTime: articleDate(article),
    modifiedTime: article.reviewedAt ?? article.publishedAt,
    image: article.coverImagePath,
  });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const [categories, author, related, services] = await Promise.all([
    getCategories(),
    getAuthor(article.authorSlug),
    getRelatedArticles(article, 3),
    getServices(),
  ]);
  const category = categories.find((c) => c.slug === article.categorySlug);
  const toc = extractToc(article.body);
  const [part1, part2] = splitMarkdownAtHeading(article.body, 3);
  const relatedServices = article.relatedServiceSlugs.map((s) => services.find((x) => x.slug === s)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const calculator = CALCULATORS.find((c) => article.relatedServiceSlugs.includes(c.serviceSlug));
  const date = articleDate(article);
  const path = `/blog/${article.slug}`;

  return (
    <>
      <TrackView event="article_viewed" props={{ slug: article.slug, category: article.categorySlug }} />
      <JsonLd
        data={[
          articleJsonLd({
            title: article.title,
            description: article.metaDescription,
            path,
            publishedTime: date ?? new Date().toISOString(),
            modifiedTime: article.reviewedAt ?? date,
            keywords: [article.keywordPrimary, ...article.keywordsSecondary].filter(Boolean),
            image: article.coverImagePath,
            articleSection: category?.name,
            authorName: author?.name,
          }),
          ...(article.faqs.length ? [faqJsonLd(article.faqs)] : []),
        ]}
      />

      <article>
        <header className="border-b border-gray-200 bg-white">
          <Container className="py-10 md:py-14">
            <Breadcrumbs items={[{ name: "Blog", path: "/blog" }, ...(category ? [{ name: category.name, path: `/blog/categoria/${category.slug}` }] : []), { name: article.title, path }]} />
            {category ? (
              <Link href={`/blog/categoria/${category.slug}`} className="eyebrow mt-6 inline-flex hover:text-copper-700">
                {category.name}
              </Link>
            ) : null}
            <h1 className="font-display mt-3 max-w-4xl text-3xl leading-tight text-ink-900 sm:text-4xl md:text-5xl">{article.title}</h1>
            <p className="mt-5 max-w-3xl text-base text-gray-600 md:text-lg">{article.excerpt}</p>
            <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              {author ? (
                <div className="inline-flex items-center gap-1.5">
                  <UserRoundIcon className="size-4 text-copper-500" aria-hidden />
                  <dt className="sr-only">Autor</dt>
                  <dd>{author.name}</dd>
                </div>
              ) : null}
              {date ? (
                <div className="inline-flex items-center gap-1.5">
                  <CalendarIcon className="size-4 text-copper-500" aria-hidden />
                  <dt className="sr-only">Fecha</dt>
                  <dd className="tabular">{formatDate(date, { month: "long" })}</dd>
                </div>
              ) : null}
              {article.reviewedAt ? (
                <div className="inline-flex items-center gap-1.5">
                  <CalendarCheckIcon className="size-4 text-copper-500" aria-hidden />
                  <dt className="sr-only">Revisión</dt>
                  <dd className="tabular">Revisado el {formatDate(article.reviewedAt, { month: "long" })}</dd>
                </div>
              ) : null}
              <div className="inline-flex items-center gap-1.5">
                <ClockIcon className="size-4 text-copper-500" aria-hidden />
                <dt className="sr-only">Lectura</dt>
                <dd className="tabular">{article.readingMinutes} min de lectura</dd>
              </div>
            </dl>
          </Container>
        </header>

        {article.coverImagePath ? (
          <Container className="pt-8 md:pt-10">
            <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-ink-900">
              <Image src={article.coverImagePath} alt="" fill priority sizes="(min-width: 1024px) 1100px, 100vw" className="object-cover" />
              <IllustrativeBadge className="absolute top-4 left-4" />
            </div>
          </Container>
        ) : null}

        <Container className="py-10 md:py-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
            <div className="min-w-0">
              <Markdown content={part1} />
              {part2 ? (
                <>
                  <aside className="my-10 rounded-lg bg-ink-900 p-6 text-white md:p-8" aria-label="Pedir presupuesto">
                    <p className="eyebrow text-copper-300">Presupuesto sin compromiso</p>
                    <p className="font-display mt-3 text-2xl">¿Quieres saber cuánto costaría en tu caso?</p>
                    <p className="mt-2 text-sm text-ink-200">Visitamos el espacio y te enviamos un presupuesto detallado por partidas.</p>
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Button asChild size="lg">
                        <TrackedLink href="#presupuesto-articulo" event="cta_clicked" props={{ location: "article_inline", slug: article.slug }}>
                          Pedir presupuesto
                          <ArrowRightIcon aria-hidden />
                        </TrackedLink>
                      </Button>
                      {calculator ? (
                        <Button asChild size="lg" variant="outline-light">
                          <TrackedLink href={`/calculadoras/${calculator.id}`} event="cta_clicked" props={{ location: "article_inline_calculator", slug: article.slug }}>
                            <CalculatorIcon aria-hidden />
                            {calculator.shortName}: calcular precio
                          </TrackedLink>
                        </Button>
                      ) : null}
                    </div>
                  </aside>
                  <Markdown content={part2} />
                </>
              ) : null}

              {article.faqs.length ? (
                <section className="mt-12" aria-labelledby="faq-heading">
                  <h2 id="faq-heading" className="font-display text-2xl text-ink-900 md:text-3xl">Preguntas frecuentes</h2>
                  <Faq items={article.faqs} className="mt-5" />
                </section>
              ) : null}

              {article.sources.length ? (
                <section className="mt-12" aria-labelledby="sources-heading">
                  <h2 id="sources-heading" className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-500">Fuentes consultadas</h2>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {article.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-ink-900 underline underline-offset-4 hover:text-copper-700">
                          {s.title}
                          <ExternalLinkIcon className="size-3.5" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {author ? (
                <section className="mt-12 flex gap-4 rounded-lg border border-gray-200 bg-white p-5" aria-label="Sobre el autor">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-copper-100 text-copper-700">
                    <UserRoundIcon className="size-6" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{author.name}</p>
                    {author.role ? <p className="text-xs text-gray-500">{author.role}</p> : null}
                    {author.bio ? <p className="mt-2 text-sm leading-relaxed text-gray-600">{author.bio}</p> : null}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <Toc entries={toc} />
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                  <p className="text-sm font-semibold text-ink-900">¿Tienes un proyecto parecido?</p>
                  <p className="mt-1 text-sm text-gray-600">Te damos un presupuesto por partidas sin compromiso.</p>
                  <Button asChild size="lg" className="mt-4 w-full">
                    <TrackedLink href="#presupuesto-articulo" event="cta_clicked" props={{ location: "article_sidebar", slug: article.slug }}>
                      Pedir presupuesto
                    </TrackedLink>
                  </Button>
                  {calculator ? (
                    <Link href={`/calculadoras/${calculator.id}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink-900 underline-offset-4 hover:underline">
                      <CalculatorIcon className="size-4 text-copper-500" aria-hidden />
                      Calculadora de {calculator.shortName.toLowerCase()}
                    </Link>
                  ) : null}
                </div>
                {relatedServices.length ? (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Servicios relacionados</p>
                    <ul className="mt-3 space-y-2">
                      {relatedServices.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/servicios/${s.slug}`} className="inline-flex items-center gap-1 text-sm text-ink-900 underline-offset-4 hover:underline">
                            {s.name} <ArrowRightIcon className="size-3.5 text-copper-500" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </Container>
      </article>

      <Section tone="muted" id="presupuesto-articulo" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="eyebrow">Presupuesto</p>
            <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">Pasa de la lectura al presupuesto</h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">Cuéntanos tu caso y te llamamos para concretar detalles. Visita y presupuesto por partidas sin compromiso.</p>
            {relatedServices.length ? (
              <ul className="mt-8 flex flex-wrap gap-2">
                {relatedServices.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/servicios/${s.slug}`} className="inline-flex rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-ink-900 hover:border-copper-400 hover:bg-copper-50">
                      {s.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.06)] md:p-8">
            <QuoteForm layout="full" source="blog" variant={article.formVariant} articleSlug={article.slug} defaultServiceSlug={relatedServices[0]?.slug ?? ""} />
          </div>
        </div>
      </Section>

      {related.length ? (
        <Section tone="white">
          <SectionHeading eyebrow="Seguir leyendo" title="Artículos relacionados" />
          <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <RevealItem key={a.slug}>
                <ArticleCard article={toCardData(a, categories)} className="h-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}
    </>
  );
}
