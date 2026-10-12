import { z } from "zod";

import { CONTENT_STATUSES } from "@/types/lead";

import { FORM_VARIANTS } from "./lead";

/** Esquemas de los formularios de contenido del panel (servicios, sectores, proyectos, blog, FAQs, zonas). */

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, { error: "Mínimo 2 caracteres" })
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: "Solo minúsculas, números y guiones (ej. reformas-cocinas)" });

const shortText = (max: number) => z.string().trim().max(max, { error: `Máximo ${max} caracteres` });
const requiredText = (max: number) => shortText(max).min(1, { error: "Campo obligatorio" });
const markdown = z.string().max(120_000, { error: "Texto demasiado largo" });
const stringList = z.array(z.string().trim().min(1).max(200)).max(60);
const order = z.coerce.number().int().min(0).max(9999).default(0);
const statusSchema = z.enum(CONTENT_STATUSES);
const imagePath = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), { error: "Ruta (/images/…) o URL completa" })
  .default("");
const optionalDate = z
  .string()
  .trim()
  .refine((v) => v === "" || !Number.isNaN(Date.parse(v)), { error: "Fecha no válida" })
  .default("");
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//.test(v), { error: "URL completa (https://…)" })
  .default("");

export const stepsSchema = z.array(z.object({ title: requiredText(120), description: shortText(400) })).max(12);
export const faqListSchema = z.array(z.object({ question: requiredText(300), answer: z.string().trim().min(1, { error: "Respuesta obligatoria" }).max(3000) })).max(20);
export const sourcesSchema = z.array(z.object({ title: requiredText(200), url: z.string().trim().refine((v) => /^https?:\/\//.test(v), { error: "URL completa" }) })).max(12);

export const serviceFormSchema = z.object({
  slug: slugSchema,
  groupSlug: z.enum(["viviendas", "negocios", "instalaciones", "proyectos"]),
  name: requiredText(160),
  shortName: requiredText(80),
  headline: shortText(200),
  summary: z.string().trim().max(2000),
  body: markdown,
  features: stringList,
  forWhom: stringList,
  process: stepsSchema,
  requiresLicensedPro: z.boolean().default(false),
  licenseNote: z.string().trim().max(2000).default(""),
  imagePath,
  order,
  status: statusSchema,
  metaTitle: shortText(120).default(""),
  metaDescription: shortText(320).default(""),
});

export const sectorFormSchema = z.object({
  slug: slugSchema,
  name: requiredText(160),
  headline: shortText(200),
  summary: z.string().trim().max(2000),
  body: markdown,
  serviceSlugs: stringList,
  imagePath,
  order,
  status: statusSchema,
  metaTitle: shortText(120).default(""),
  metaDescription: shortText(320).default(""),
});

export const projectFormSchema = z.object({
  slug: slugSchema,
  title: requiredText(200),
  serviceSlug: shortText(120).default(""),
  sectorSlug: shortText(120).default(""),
  locality: shortText(120).default(""),
  summary: z.string().trim().max(2000),
  scope: markdown,
  body: markdown,
  coverImagePath: imagePath,
  isIllustrative: z.boolean().default(true),
  hasVerifiedBeforeAfter: z.boolean().default(false),
  order,
  status: statusSchema,
  metaTitle: shortText(120).default(""),
  metaDescription: shortText(320).default(""),
});

export const articleFormSchema = z.object({
  slug: slugSchema,
  title: requiredText(200),
  excerpt: z.string().trim().min(1, { error: "Campo obligatorio" }).max(400),
  body: markdown,
  categorySlug: requiredText(120),
  tags: stringList,
  relatedServiceSlugs: stringList,
  coverImagePath: imagePath,
  authorId: z.string().trim().refine((v) => v === "" || z.uuid().safeParse(v).success, { error: "Autor no válido" }).default(""),
  readingMinutes: z.coerce.number().int().min(1).max(120).default(5),
  status: statusSchema,
  publishedAt: optionalDate,
  reviewedAt: optionalDate,
  canonicalUrl: optionalUrl,
  keywordPrimary: shortText(120).default(""),
  keywordsSecondary: stringList,
  faqs: faqListSchema,
  sources: sourcesSchema,
  formVariant: z.enum(FORM_VARIANTS).default("general"),
  metaTitle: shortText(120).default(""),
  metaDescription: shortText(320).default(""),
});

export const faqFormSchema = z.object({
  question: requiredText(300),
  answer: z.string().trim().min(1, { error: "Campo obligatorio" }).max(3000),
  scope: z.enum(["global", "service", "sector", "area"]),
  scopeSlug: shortText(120).default(""),
  order,
});

export const zoneFormSchema = z.object({
  slug: slugSchema,
  name: requiredText(120),
  province: requiredText(120),
  headline: shortText(200),
  summary: z.string().trim().max(2000),
  body: markdown,
  serviceSlugs: stringList,
  order,
  status: statusSchema,
  metaTitle: shortText(120).default(""),
  metaDescription: shortText(320).default(""),
});

export const categoryFormSchema = z.object({
  slug: slugSchema,
  name: requiredText(120),
  description: z.string().trim().max(600).default(""),
  order,
});

export const authorFormSchema = z.object({
  slug: slugSchema,
  name: requiredText(120),
  role: shortText(160).default(""),
  bio: z.string().trim().max(2000).default(""),
  avatarPath: imagePath,
  isActive: z.boolean().default(true),
});

export const RESOURCE_SCHEMAS = {
  services: serviceFormSchema,
  sectors: sectorFormSchema,
  projects: projectFormSchema,
  articles: articleFormSchema,
  faqs: faqFormSchema,
  zones: zoneFormSchema,
  categories: categoryFormSchema,
  authors: authorFormSchema,
} as const;

export type ResourceKey = keyof typeof RESOURCE_SCHEMAS;
export const RESOURCE_KEYS = Object.keys(RESOURCE_SCHEMAS) as ResourceKey[];
