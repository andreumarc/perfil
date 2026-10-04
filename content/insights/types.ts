import type { ServiceSlug } from "@/content/services";

/** Categorías del blog. El slug es la URL (/insights/categoria/[slug]). */
export const INSIGHT_CATEGORIES = [
  { slug: "operaciones", label: "Operaciones", description: "Modelo operativo, procesos y dirección de redes de centros." },
  { slug: "pl", label: "P&L", description: "Cuenta de resultados por centro, imputación de costes y análisis de desviaciones." },
  { slug: "ebitda", label: "EBITDA", description: "Palancas de rentabilidad y planes de mejora de margen." },
  { slug: "multisite", label: "Multisite", description: "Gestión de empresas multicentro: benchmarking, estandarización y escala." },
  { slug: "private-equity", label: "Private Equity", description: "Value creation operativa en participadas, Buy & Build y due diligence." },
  { slug: "healthcare", label: "Healthcare", description: "Clínicas dentales, veterinarias y otros servicios sanitarios en red." },
  { slug: "integraciones", label: "Integraciones", description: "Integración post-adquisición y planes de 100 días." },
  { slug: "kpis", label: "KPIs", description: "Indicadores, cuadros de mando y reporting para dirección." },
  { slug: "expansion", label: "Expansión", description: "Aperturas, adquisiciones y crecimiento rentable de la red." },
  { slug: "management", label: "Management", description: "Dirección de equipos, managers de centro y Fractional COO." },
] as const;

export type InsightCategorySlug = (typeof INSIGHT_CATEGORIES)[number]["slug"];

/** Bloques de contenido tipados: se renderizan con <RichContent/>. */
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "callout"; title?: string; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface InsightPost {
  /** URL: /insights/[slug] */
  slug: string;
  title: string;
  /** Resumen para listados (1-2 frases). */
  excerpt: string;
  /** Meta description SEO (≤ 160 caracteres). */
  metaDescription: string;
  category: InsightCategorySlug;
  tags: string[];
  /** Keywords SEO objetivo del artículo. */
  keywords: string[];
  /** ISO date YYYY-MM-DD */
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  blocks: ContentBlock[];
  /** Servicios relacionados que se muestran al final. */
  relatedServices: ServiceSlug[];
  /** Preguntas frecuentes opcionales (generan FAQPage schema). */
  faqs?: { question: string; answer: string }[];
}

export function getCategory(slug: string) {
  return INSIGHT_CATEGORIES.find((c) => c.slug === slug);
}
