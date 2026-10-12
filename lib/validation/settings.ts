import { z } from "zod";

/**
 * Esquema de la configuración editable del sitio (fila única `site_settings`).
 * Los valores por defecto viven en `content/settings.ts`; este esquema valida
 * lo que llega del panel y lo que se lee de la base de datos.
 */

const shortText = (max: number) => z.string().trim().max(max);
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\//.test(v), { error: "Debe ser una URL completa (https://…)" })
  .optional()
  .default("");

export const COMMITMENT_ICONS = ["advice", "management", "deadline", "quality", "team", "installations", "shield", "design"] as const;
export type CommitmentIcon = (typeof COMMITMENT_ICONS)[number];

export const menuItemSchema = z.object({
  label: shortText(60).min(1, { error: "Texto obligatorio" }),
  href: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v) || v.startsWith("#"), {
      error: "Debe ser una ruta interna (/servicios) o una URL completa",
    }),
});

export const siteSettingsSchema = z.object({
  company: z.object({
    name: shortText(80).min(1),
    tagline: shortText(120),
    legalName: shortText(160),
    nif: shortText(20),
    address: shortText(200),
    postalCode: shortText(10),
    city: shortText(80),
    province: shortText(80),
    /** Teléfono en formato legible (se normaliza para tel:). Vacío = no se muestra. */
    phone: shortText(30),
    /** Número de WhatsApp (se normaliza a dígitos para wa.me). Vacío = no se muestra. */
    whatsapp: shortText(30),
    whatsappMessage: shortText(300),
    email: z.string().trim().max(254).pipe(z.email({ error: "Email no válido" }).or(z.literal(""))),
    hours: shortText(160),
    zones: z.array(shortText(80)).max(40),
    socials: z.object({
      instagram: optionalUrl,
      facebook: optionalUrl,
      linkedin: optionalUrl,
      youtube: optionalUrl,
      tiktok: optionalUrl,
    }),
  }),
  hero: z.object({
    eyebrow: shortText(80),
    titleBefore: shortText(80),
    titleHighlight: shortText(40),
    titleAfter: shortText(80),
    subtitle: shortText(300),
    imagePath: shortText(300),
    imageAlt: shortText(200),
    primaryCtaLabel: shortText(60).min(1),
    secondaryCtaLabel: shortText(60),
  }),
  commitments: z
    .array(
      z.object({
        icon: z.enum(COMMITMENT_ICONS),
        title: shortText(60).min(1),
        description: shortText(200),
      }),
    )
    .max(6),
  /** Cifras: solo se muestran si `verified` es true (contadores con datos reales). */
  verifiedStats: z
    .array(
      z.object({
        value: shortText(12),
        suffix: shortText(8),
        label: shortText(80).min(1),
        verified: z.boolean(),
      }),
    )
    .max(4),
  process: z.array(z.object({ title: shortText(80).min(1), description: shortText(300) })).max(8),
  about: z.object({
    title: shortText(120),
    intro: shortText(400),
    body: z.string().max(20_000),
  }),
  seo: z.object({
    defaultTitle: shortText(120).min(1),
    defaultDescription: shortText(320).min(1),
    keywords: z.array(shortText(80)).max(30),
  }),
  integrations: z.object({
    gtmId: z
      .string()
      .trim()
      .max(20)
      .refine((v) => v === "" || /^GTM-[A-Z0-9]{4,10}$/.test(v), { error: "Formato GTM-XXXXXXX" }),
    ga4Id: z
      .string()
      .trim()
      .max(24)
      .refine((v) => v === "" || /^G-[A-Z0-9]{4,20}$/.test(v), { error: "Formato G-XXXXXXXXXX" }),
    metaPixelId: z
      .string()
      .trim()
      .max(24)
      .refine((v) => v === "" || /^\d{6,20}$/.test(v), { error: "Solo dígitos" }),
    gscVerification: z
      .string()
      .trim()
      .max(120)
      .refine((v) => v === "" || /^[A-Za-z0-9_-]+$/.test(v), { error: "Token no válido" }),
    gbpUrl: optionalUrl,
    mapsUrl: optionalUrl,
  }),
  notifications: z.object({
    leadEmails: z.array(z.string().trim().toLowerCase().pipe(z.email())).max(5),
  }),
  menus: z.object({
    main: z.array(menuItemSchema).max(8),
    footer: z.array(z.object({ title: shortText(40).min(1), items: z.array(menuItemSchema).max(10) })).max(4),
  }),
  legal: z.object({
    /** Datos del responsable del tratamiento. Marcadores [POR CONFIRMAR] hasta que el admin los rellene. */
    responsibleName: shortText(160),
    nif: shortText(20),
    address: shortText(200),
    email: shortText(254),
    registry: shortText(300),
    lastUpdated: shortText(20),
  }),
});

export type SiteSettings = z.infer<typeof siteSettingsSchema>;
export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;
