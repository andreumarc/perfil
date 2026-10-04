import type { Metadata } from "next";

import { site } from "@/lib/site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  image?: string;
}

/** Construye metadata completa (canonical, OpenGraph, Twitter) para una ruta. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const url = `${site.url}${input.path === "/" ? "" : input.path}`;
  const image = input.image ?? `${site.url}/opengraph-image`;
  const fullTitle = input.path === "/" ? input.title : `${input.title} | ${site.name}`;
  return {
    title: input.path === "/" ? { absolute: input.title } : input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: input.type ?? "website",
      url,
      title: fullTitle,
      description: input.description,
      siteName: `${site.name} · ${site.brand}`,
      locale: site.locale,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(input.type === "article"
        ? {
            publishedTime: input.publishedTime,
            modifiedTime: input.modifiedTime,
            authors: [site.name],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [image],
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD helpers                                                     */
/* ------------------------------------------------------------------ */

type JsonLd = Record<string, unknown>;

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    jobTitle: "Director de Operaciones",
    description: site.description,
    url: site.url,
    ...(site.linkedinUrl ? { sameAs: [site.linkedinUrl] } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" },
    knowsAbout: [
      "Operaciones multicentro",
      "P&L",
      "EBITDA",
      "Integración post-adquisición",
      "Private Equity",
      "Healthcare",
      "KPIs",
      "Fractional COO",
    ],
  };
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#organization`,
    name: `${site.name} · ${site.brand}`,
    url: site.url,
    description: site.valueProposition,
    areaServed: ["ES", "EU"],
    founder: { "@id": `${site.url}/#person` },
    address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" },
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
    ...(site.linkedinUrl ? { sameAs: [site.linkedinUrl] } : {}),
    serviceType: [
      "Multisite Performance Audit",
      "EBITDA Improvement Sprint",
      "Integration 100",
      "Fractional COO",
    ],
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: `${site.name} · ${site.brand}`,
    inLanguage: "es-ES",
    publisher: { "@id": `${site.url}/#person` },
  };
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  priceFrom?: number;
  priceUnit?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: `${site.url}${input.path}`,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: ["ES", "EU"],
    serviceType: input.name,
    ...(input.priceFrom
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: input.priceFrom,
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "EUR",
              price: input.priceFrom,
              ...(input.priceUnit ? { unitText: input.priceUnit } : {}),
            },
            description: `Desde ${input.priceFrom} €${input.priceUnit ? ` ${input.priceUnit}` : ""}`,
          },
        }
      : {}),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  keywords?: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: `${site.url}${input.path}`,
    mainEntityOfPage: `${site.url}${input.path}`,
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    inLanguage: "es-ES",
    author: { "@id": `${site.url}/#person` },
    publisher: { "@id": `${site.url}/#organization` },
    image: `${site.url}/opengraph-image`,
    ...(input.keywords ? { keywords: input.keywords.join(", ") } : {}),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
