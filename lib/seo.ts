import type { Metadata } from "next";

import { publicEnv } from "@/lib/env";
import type { SiteSettings } from "@/lib/validation/settings";

export const siteUrl = publicEnv.siteUrl;

export function absoluteUrl(path: string) {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  siteName: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  image?: string;
}

/** Construye metadata completa (canonical, OpenGraph, Twitter) para una ruta. */
export function pageMetadata(input: PageMetaInput): Metadata {
  const url = absoluteUrl(input.path);
  const image = input.image ? (input.image.startsWith("http") ? input.image : absoluteUrl(input.image)) : absoluteUrl("/opengraph-image");
  const fullTitle = input.path === "/" ? input.title : `${input.title} | ${input.siteName}`;
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
      siteName: input.siteName,
      locale: "es_ES",
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(input.type === "article"
        ? { publishedTime: input.publishedTime, modifiedTime: input.modifiedTime, authors: [input.siteName] }
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

/**
 * Sufijo geográfico para títulos de servicio: "en L'Hospitalet de Llobregat, Barcelona y Baix Llobregat".
 * Toma las tres primeras zonas de ajustes que no empiecen por "Toda".
 */
export function localTitleSuffix(settings: SiteSettings): string {
  const zones = settings.company.zones.filter((z) => !/^toda\s/i.test(z)).slice(0, 3);
  if (!zones.length) return "";
  if (zones.length === 1) return `en ${zones[0]}`;
  return `en ${zones.slice(0, -1).join(", ")} y ${zones[zones.length - 1]}`;
}

/* ------------------------------------------------------------------ */
/* JSON-LD helpers                                                     */
/* ------------------------------------------------------------------ */

type JsonLd = Record<string, unknown>;

/** Empresa de reformas: HomeAndConstructionBusiness (subtipo de LocalBusiness). Solo campos confirmados. */
/** "Lunes a viernes, de 9:00 a 19:00" → OpeningHoursSpecification (solo si el texto sigue ese patrón). */
export function openingHoursJsonLd(hours: string): JsonLd | null {
  const m = hours.match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
  if (!m) return null;
  const lower = hours.toLowerCase();
  const days = lower.includes("lunes a viernes") ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] : lower.includes("lunes a sábado") ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : null;
  if (!days) return null;
  return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens: m[1].padStart(5, "0"), closes: m[2].padStart(5, "0") };
}

export function organizationJsonLd(settings: SiteSettings, extraAreas: string[] = [], services: { name: string; slug: string; summary: string }[] = []): JsonLd {
  const c = settings.company;
  const areas = [...new Set([...c.zones, ...extraAreas])];
  const hours = c.hours ? openingHoursJsonLd(c.hours) : null;
  const sameAs = Object.values(c.socials).filter((v): v is string => Boolean(v));
  const hasAddress = Boolean(c.address && c.city);
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": absoluteUrl("/#organization"),
    name: c.name,
    url: siteUrl,
    description: settings.seo.defaultDescription,
    image: absoluteUrl("/opengraph-image"),
    logo: absoluteUrl("/images/logo/mardari.png"),
    ...(c.phone ? { telephone: c.phone } : {}),
    ...(c.email ? { email: c.email } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: c.address,
            addressLocality: c.city,
            postalCode: c.postalCode || undefined,
            addressRegion: c.province || undefined,
            addressCountry: "ES",
          },
        }
      : { address: { "@type": "PostalAddress", addressLocality: c.city || "Barcelona", addressCountry: "ES" } }),
    areaServed: areaServedJsonLd(areas),
    ...(c.tagline ? { slogan: c.tagline } : {}),
    ...(c.legalName ? { legalName: c.legalName } : {}),
    ...(hours ? { openingHoursSpecification: [hours] } : {}),
    ...(services.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Servicios de reformas e instalaciones",
            itemListElement: services.map((svc) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: svc.name, description: svc.summary, url: absoluteUrl(`/servicios/${svc.slug}`) } })),
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings.integrations.gbpUrl ? { hasMap: settings.integrations.gbpUrl } : {}),
  };
}

export function websiteJsonLd(settings: SiteSettings): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteUrl,
    name: settings.company.name,
    inLanguage: "es-ES",
    publisher: { "@id": absoluteUrl("/#organization") },
  };
}

const COMARCAS = ["baix llobregat", "barcelonès", "barcelones", "garraf", "alt penedès", "alt penedes", "anoia", "vallès", "valles", "maresme", "bages", "osona"];

/** "Toda Cataluña" → AdministrativeArea, "Toda España" → Country, comarcas → AdministrativeArea, resto → City. */
export function areaServedJsonLd(zones: string[]): JsonLd[] {
  return zones.map((z) => {
    const n = z.toLowerCase();
    if (n.includes("españa") || n.includes("espana")) return { "@type": "Country", name: "España" };
    if (n.includes("cataluña") || n.includes("catalunya")) return { "@type": "AdministrativeArea", name: "Cataluña" };
    if (COMARCAS.some((c) => n === c || n === `comarca de l'${c}` || n.startsWith("comarca "))) return { "@type": "AdministrativeArea", name: z };
    return { "@type": "City", name: z.replace(/^toda\s+/i, "") };
  });
}

export function serviceJsonLd(input: { name: string; description: string; path: string; areaServed: string[] }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: areaServedJsonLd(input.areaServed),
    serviceType: input.name,
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  keywords?: string[];
  image?: string;
  articleSection?: string;
  authorName?: string;
}): JsonLd {
  const image = input.image ? (input.image.startsWith("http") ? input.image : absoluteUrl(input.image)) : absoluteUrl("/opengraph-image");
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    inLanguage: "es-ES",
    author: input.authorName ? { "@type": "Person", name: input.authorName } : { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
    image,
    ...(input.articleSection ? { articleSection: input.articleSection } : {}),
    ...(input.keywords?.length ? { keywords: input.keywords.join(", ") } : {}),
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
      item: absoluteUrl(item.path),
    })),
  };
}
