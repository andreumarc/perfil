import { z } from "zod";

import { SERVICE_SLUGS } from "@/content/services";
import { SECTOR_SLUGS } from "@/content/sectors";
import { toE164 } from "@/lib/phone";
import { BUDGET_RANGE_VALUES, LEAD_SOURCES, PROPERTY_TYPE_VALUES, TIMELINE_VALUES } from "@/types/lead";

/** Texto corto saneado: sin etiquetas HTML ni caracteres de control. */
export const safeText = (max: number, min = 1) =>
  z
    .string()
    .trim()
    .min(min, { error: min > 1 ? `Mínimo ${min} caracteres` : "Campo obligatorio" })
    .max(max, { error: `Máximo ${max} caracteres` })
    .refine((v) => !/[<>]/.test(v), { error: "Caracteres no permitidos" })
    .transform((v) => v.replace(/[\u0000-\u001F\u007F]/g, ""));

/** Texto opcional saneado (vacío permitido). */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, { error: `Máximo ${max} caracteres` })
    .refine((v) => !/[<>]/.test(v), { error: "Caracteres no permitidos" })
    .transform((v) => v.replace(/[\u0000-\u001F\u007F]/g, ""))
    .optional()
    .or(z.literal(""));

/**
 * Texto de identidad (nombre): además, sin URLs ni emails, para que el email de
 * confirmación no pueda usarse como relé de phishing con texto del remitente.
 */
export const identityText = (max: number) =>
  safeText(max, 2).refine((v) => !/https?:\/\/|www\.|:\/\/|@/i.test(v), {
    error: "No se admiten enlaces ni direcciones en este campo",
  });

/** Email genérico (particulares usan Gmail, Hotmail…). Se normaliza antes de validar. */
export const emailSchema = z
  .string({ error: "Introduce un email válido" })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "Introduce un email válido" }).max(254));

/** Teléfono español o internacional; se normaliza a E.164 (+34…). */
export const phoneSchema = z
  .string({ error: "Introduce un teléfono válido" })
  .trim()
  .min(9, { error: "Introduce un teléfono válido" })
  .max(30)
  .refine((v) => /^[+()\d\s.-]{9,30}$/.test(v), { error: "Introduce un teléfono válido" })
  .transform((v, ctx) => {
    const e164 = toE164(v);
    if (!e164) {
      ctx.addIssue({ code: "custom", message: "Introduce un teléfono válido" });
      return z.NEVER;
    }
    return e164;
  });

export const postalCodeSchema = z
  .string()
  .trim()
  .max(10)
  .refine((v) => v === "" || /^\d{5}$/.test(v), { error: "Código postal de 5 dígitos" })
  .optional()
  .or(z.literal(""));

export const squareMetersSchema = z
  .union([z.literal(""), z.coerce.number().int().min(1, { error: "Mínimo 1 m²" }).max(100_000, { error: "Valor demasiado alto" })])
  .optional();

/** Atribución capturada en cliente. Todos los campos opcionales y acotados. */
export const attributionSchema = z
  .object({
    utmSource: z.string().trim().max(120).optional(),
    utmMedium: z.string().trim().max(120).optional(),
    utmCampaign: z.string().trim().max(200).optional(),
    utmContent: z.string().trim().max(200).optional(),
    utmTerm: z.string().trim().max(200).optional(),
    referrer: z.string().trim().max(500).optional(),
    landingPage: z.string().trim().max(500).optional(),
  })
  .partial()
  .default({});

export type AttributionInput = z.infer<typeof attributionSchema>;

/** Campos anti-spam comunes a todos los formularios. */
export const antiSpamSchema = z.object({
  /** Honeypot: debe llegar vacío. */
  website: z.string().max(0, { error: "Spam detectado" }).default(""),
  /** Timestamp de inicio del formulario (ms). Sin él no hay control de tiempo. */
  startedAt: z.coerce.number({ error: "Envío no válido" }).int().positive(),
  /** Token de Cloudflare Turnstile (solo si está configurado). */
  turnstileToken: z.string().max(4000).optional(),
});

/** Ventana de cumplimentación aceptada: ≥ 3 s (bots) y ≤ 6 h (sesiones zombis / replay). */
export const MIN_FILL_TIME_MS = 3_000;
export const MAX_FILL_TIME_MS = 6 * 60 * 60 * 1000;

export function isSuspiciousFillTime(startedAt: number, now = Date.now()): boolean {
  const elapsed = now - startedAt;
  return elapsed < MIN_FILL_TIME_MS || elapsed > MAX_FILL_TIME_MS;
}

export const privacyConsentSchema = z.literal(true, {
  error: "Debes aceptar la política de privacidad para continuar",
});

const serviceSlugSchema = z
  .string()
  .trim()
  .max(120)
  .refine((v) => v === "" || SERVICE_SLUGS.includes(v), { error: "Servicio no válido" })
  .optional()
  .or(z.literal(""));

const sectorSlugSchema = z
  .string()
  .trim()
  .max(120)
  .refine((v) => v === "" || SECTOR_SLUGS.includes(v), { error: "Sector no válido" })
  .optional()
  .or(z.literal(""));

export const FORM_VARIANTS = ["general", "vivienda", "local", "gimnasio", "restaurante", "clinica", "instalaciones"] as const;
export type FormVariantValue = (typeof FORM_VARIANTS)[number];

/** Campos contextuales por variante (todos opcionales, acotados). Se guardan en `leads.context`. */
export const contextSchema = z
  .object({
    activity: optionalText(120), // actividad del negocio
    premisesState: z.enum(["bruto", "reformar", "buen_estado", ""]).optional(), // estado del local
    installations: z.array(z.string().trim().max(60)).max(10).optional(), // instalaciones necesarias
    kitchenType: optionalText(60), // restaurante: tipo de cocina
    extraction: z.enum(["si", "no", "no_se", ""]).optional(),
    systemType: optionalText(80), // instalaciones: tipo de sistema
    interventionType: optionalText(80), // vivienda: tipo de intervención
  })
  .partial()
  .default({});

/** Formulario de presupuesto / contacto (campos comunes). */
export const leadFormSchema = z.object({
  name: identityText(160),
  email: emailSchema,
  phone: phoneSchema,
  locality: optionalText(120),
  postalCode: postalCodeSchema,
  propertyType: z.enum(PROPERTY_TYPE_VALUES).optional().or(z.literal("")),
  serviceSlug: serviceSlugSchema,
  sectorSlug: sectorSlugSchema,
  squareMeters: squareMetersSchema,
  budgetRange: z.enum(BUDGET_RANGE_VALUES).optional().or(z.literal("")),
  timeline: z.enum(TIMELINE_VALUES).optional().or(z.literal("")),
  message: optionalText(3000),
  privacyConsent: privacyConsentSchema,
  marketingConsent: z.boolean().default(false),
});

export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadFormValues = z.infer<typeof leadFormSchema>;

/** Payload completo del envío (server action). */
export const leadSubmissionSchema = z.object({
  lead: leadFormSchema,
  context: contextSchema,
  attribution: attributionSchema,
  antiSpam: antiSpamSchema,
  visitorId: z.string().trim().max(64).optional(),
  source: z.enum(LEAD_SOURCES).default("presupuesto"),
  sourcePage: z.string().trim().max(500).optional(),
  formVariant: z.enum(FORM_VARIANTS).default("general"),
  articleSlug: z.string().trim().max(160).optional(),
  /** Adjuntos opcionales (se validan aparte: tipo/tamaño). */
  attachmentCount: z.coerce.number().int().min(0).max(5).default(0),
});

export type LeadSubmission = z.infer<typeof leadSubmissionSchema>;

/** Convierte errores Zod a un mapa campo → mensaje (primer error por campo). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Versión del texto de consentimiento mostrado en los formularios (cambiar al modificar el texto legal). */
export const CONSENT_TEXT_VERSION = "2026-10-12";

/** Límites de adjuntos: imágenes y PDF, 4 MB combinados (límite real de Vercel por petición: 4,5 MB). */
export const ATTACHMENT_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
export const ATTACHMENT_MAX_FILES = 5;
export const ATTACHMENT_MAX_TOTAL_BYTES = 4 * 1024 * 1024;
export const ATTACHMENT_MAX_FILE_BYTES = 3 * 1024 * 1024;
