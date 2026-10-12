/** Tipos del contenido editable. Los defaults viven en content/*.ts y se siembran en Neon. */

export type ContentStatus = "draft" | "published";

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type ServiceGroupSlug = "viviendas" | "negocios" | "instalaciones" | "proyectos";

export interface ServiceGroup {
  slug: ServiceGroupSlug;
  name: string;
  shortName: string;
  description: string;
}

export interface ServiceContent {
  slug: string;
  groupSlug: ServiceGroupSlug;
  name: string;
  shortName: string;
  headline: string;
  summary: string;
  /** Markdown. */
  body: string;
  features: string[];
  forWhom: string[];
  process: ProcessStep[];
  faqs: FaqItem[];
  requiresLicensedPro: boolean;
  licenseNote?: string;
  imagePath?: string;
  order: number;
  status: ContentStatus;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface SectorContent {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  body: string;
  serviceSlugs: string[];
  faqs: FaqItem[];
  imagePath?: string;
  order: number;
  status: ContentStatus;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ProjectContent {
  slug: string;
  title: string;
  serviceSlug?: string;
  sectorSlug?: string;
  locality?: string;
  summary: string;
  scope: string;
  body: string;
  coverImagePath?: string;
  galleryPaths?: string[];
  isIllustrative: boolean;
  hasVerifiedBeforeAfter: boolean;
  order: number;
  status: ContentStatus;
}

export interface LocalAreaContent {
  slug: string;
  name: string;
  province: string;
  headline: string;
  summary: string;
  body: string;
  serviceSlugs: string[];
  faqs: FaqItem[];
  order: number;
  status: ContentStatus;
  metaTitle?: string;
  metaDescription?: string;
}

export interface BlogCategoryContent {
  slug: string;
  name: string;
  description: string;
  order: number;
}

export interface AuthorContent {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

export type FormVariant = "general" | "vivienda" | "local" | "gimnasio" | "restaurante" | "clinica" | "instalaciones";

export interface ArticleContent {
  slug: string;
  title: string;
  excerpt: string;
  /** Markdown con H2/H3; el índice se genera a partir de los encabezados. */
  body: string;
  categorySlug: string;
  tags: string[];
  relatedServiceSlugs: string[];
  coverImagePath?: string;
  authorSlug: string;
  readingMinutes: number;
  status: ContentStatus;
  publishedAt?: string;
  reviewedAt?: string;
  keywordPrimary: string;
  keywordsSecondary: string[];
  faqs: FaqItem[];
  sources: { title: string; url: string }[];
  formVariant: FormVariant;
  metaTitle: string;
  metaDescription: string;
}
