import { z } from "zod";

import { QUESTIONS } from "@/lib/diagnostic/questions";
import {
  COMPANY_REVENUE,
  JOB_TITLES,
  MAIN_PROBLEMS,
  NUMBER_LOCATIONS,
  SECTORS,
} from "@/types/lead";

import { isFreeEmail } from "./free-email-domains";

const values = <T extends readonly { value: string }[]>(list: T) =>
  list.map((i) => i.value) as [T[number]["value"], ...T[number]["value"][]];

/** Texto corto saneado: sin etiquetas HTML ni caracteres de control. */
export const safeText = (max: number, min = 1) =>
  z
    .string()
    .trim()
    .min(min, { error: "Campo obligatorio" })
    .max(max, { error: `Máximo ${max} caracteres` })
    .refine((v) => !/[<>]/.test(v), { error: "Caracteres no permitidos" })
    .transform((v) => v.replace(/[\u0000-\u001F\u007F]/g, ""));

/**
 * Email corporativo. Se normaliza (trim + minúsculas) ANTES de validar el
 * formato: en Zod v4 `z.email().trim()` validaría primero y rechazaría un
 * espacio final añadido por el autocompletado móvil.
 */
export const corporateEmailSchema = z
  .string({ error: "Introduce un email válido" })
  .trim()
  .toLowerCase()
  .pipe(
    z
      .email({ error: "Introduce un email válido" })
      .max(254)
      .refine((email) => !isFreeEmail(email), {
        error: "Utiliza tu email corporativo (no Gmail, Hotmail, etc.)",
      }),
  );

export const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v === "" || /^[+()\d\s.-]{6,30}$/.test(v), {
    error: "Introduce un teléfono válido",
  })
  .optional()
  .or(z.literal(""));

export const numberLocationsSchema = z.enum(values(NUMBER_LOCATIONS), {
  error: "Selecciona el número de centros",
});
export const companyRevenueSchema = z.enum(values(COMPANY_REVENUE), {
  error: "Selecciona la facturación aproximada",
});
export const sectorSchema = z.enum(values(SECTORS), { error: "Selecciona el sector" });
export const mainProblemSchema = z.enum(values(MAIN_PROBLEMS), {
  error: "Selecciona el problema principal",
});
export const jobTitleSchema = z.enum(values(JOB_TITLES), { error: "Selecciona tu cargo" });

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
  website: z.string().max(0, { error: "Spam detectado" }).optional().or(z.literal("")),
  /** Timestamp de renderizado del formulario (ms). Rechaza envíos en < 3 s. */
  startedAt: z.coerce.number().int().positive().optional(),
});

export const gdprConsentSchema = z.literal(true, {
  error: "Debes aceptar la política de privacidad para continuar",
});

/** Formulario de captura de lead al final del diagnóstico. */
export const leadFormSchema = z.object({
  firstName: safeText(80),
  lastName: safeText(120),
  company: safeText(160),
  jobTitle: jobTitleSchema,
  email: corporateEmailSchema,
  phone: phoneSchema,
  numberLocations: numberLocationsSchema,
  companyRevenue: companyRevenueSchema,
  sector: sectorSchema,
  gdprConsent: gdprConsentSchema,
});

export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadFormValues = z.infer<typeof leadFormSchema>;

/** Respuestas del diagnóstico: cada id de pregunta debe tener una opción válida. */
export const diagnosticAnswersSchema = z
  .record(z.string(), z.string().max(40))
  .superRefine((answers, ctx) => {
    for (const q of QUESTIONS) {
      const value = answers[q.id];
      if (!value) {
        ctx.addIssue({ code: "custom", message: `Falta la respuesta a ${q.id}`, path: [q.id] });
        continue;
      }
      if (!q.options.some((o) => o.value === value)) {
        ctx.addIssue({ code: "custom", message: `Respuesta no válida en ${q.id}`, path: [q.id] });
      }
    }
    for (const key of Object.keys(answers)) {
      if (!QUESTIONS.some((q) => q.id === key)) {
        ctx.addIssue({ code: "custom", message: `Pregunta desconocida ${key}`, path: [key] });
      }
    }
  });

/** Payload completo del envío del diagnóstico (server action). */
export const diagnosticSubmissionSchema = z.object({
  lead: leadFormSchema,
  answers: diagnosticAnswersSchema,
  attribution: attributionSchema,
  antiSpam: antiSpamSchema.default({}),
  /** Identificador anónimo de visitante (solo tras consentimiento). */
  visitorId: z.string().trim().max(64).optional(),
  /** Origen del formulario para atribución interna. */
  source: z.enum(["diagnostic", "linkedin"]).default("diagnostic"),
});

export type DiagnosticSubmission = z.infer<typeof diagnosticSubmissionSchema>;

/** Formulario de contacto directo. */
export const contactFormSchema = z.object({
  firstName: safeText(80),
  lastName: safeText(120),
  company: safeText(160),
  jobTitle: jobTitleSchema,
  email: corporateEmailSchema,
  phone: phoneSchema,
  numberLocations: numberLocationsSchema,
  companyRevenue: companyRevenueSchema.optional(),
  sector: sectorSchema.optional(),
  mainProblem: mainProblemSchema,
  message: safeText(2000, 10),
  gdprConsent: gdprConsentSchema,
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const contactSubmissionSchema = z.object({
  contact: contactFormSchema,
  attribution: attributionSchema,
  antiSpam: antiSpamSchema.default({}),
  visitorId: z.string().trim().max(64).optional(),
  /** Para distinguir el origen (contacto, calculadora…). */
  source: z.enum(["contact", "calculator"]).default("contact"),
  /** Contexto adicional opcional (p. ej. inputs de la calculadora). */
  context: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

/** Convierte errores Zod a un mapa campo → mensaje (primer error por campo). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
