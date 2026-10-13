import { z } from "zod";

import { ACTIVITY_TYPES, LEAD_SOURCES, LEAD_STATUSES, USER_ROLES } from "@/types/lead";

export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const updateLeadStatusSchema = z.object({ leadId: z.uuid(), status: leadStatusSchema });

export const assignLeadSchema = z.object({ leadId: z.uuid(), userId: z.uuid().nullable() });

export const addActivitySchema = z.object({
  leadId: z.uuid(),
  type: z.enum(ACTIVITY_TYPES).default("note"),
  note: z.string().trim().min(1, { error: "La nota no puede estar vacía" }).max(4000),
});

export const updateInternalNotesSchema = z.object({ leadId: z.uuid(), notes: z.string().trim().max(8000) });

export const createFollowUpSchema = z.object({
  leadId: z.uuid(),
  title: z.string().trim().min(2).max(200),
  dueAt: z.coerce.date(),
  assignedTo: z.uuid().nullable().optional(),
});

/** Dominio interno para cuentas con nombre de usuario (sin email): «reformas» → reformas@reformas.local. */
export const LOCAL_LOGIN_DOMAIN = "reformas.local";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .transform((value) => (value.includes("@") ? value : `${value}@${LOCAL_LOGIN_DOMAIN}`))
    .pipe(z.email({ error: "Email o usuario no válido" })),
  password: z.string().min(1, { error: "Introduce la contraseña" }).max(200),
});

export const passwordSchema = z
  .string()
  .min(12, { error: "Mínimo 12 caracteres" })
  .max(200)
  .refine((v) => /[a-z]/.test(v) && /[A-Z0-9]/.test(v), { error: "Combina minúsculas con mayúsculas o números" });

export const setupSchema = z.object({
  token: z.string().min(1, { error: "Token obligatorio" }).max(200),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Email no válido" })),
  password: passwordSchema,
});

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Email no válido" })),
  role: z.enum(USER_ROLES),
  password: passwordSchema,
});

export const updateUserSchema = z.object({
  userId: z.uuid(),
  name: z.string().trim().min(2).max(120).optional(),
  role: z.enum(USER_ROLES).optional(),
  isActive: z.boolean().optional(),
  password: passwordSchema.optional(),
});

export const changeOwnPasswordSchema = z
  .object({ current: z.string().min(1), next: passwordSchema, confirm: z.string() })
  .refine((v) => v.next === v.confirm, { error: "Las contraseñas no coinciden", path: ["confirm"] });

const isoDate = z
  .string()
  .trim()
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)), { error: "Fecha no válida" });

export const leadsFilterSchema = z.object({
  q: z.string().trim().max(120).optional(),
  status: z.enum([...LEAD_STATUSES, "ALL"]).optional(),
  source: z.enum([...LEAD_SOURCES, "ALL"]).optional(),
  service: z.string().trim().max(120).optional(),
  article: z.string().trim().max(160).optional(),
  assigned: z.string().trim().max(40).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  sort: z.enum(["createdAt", "name", "status", "source", "nextFollowUpAt"]).default("createdAt"),
  dir: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(100).default(25),
});

export type LeadsFilter = z.infer<typeof leadsFilterSchema>;
