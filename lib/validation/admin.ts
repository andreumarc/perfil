import { z } from "zod";

import { LEAD_STATUSES } from "@/types/lead";

export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const updateLeadStatusSchema = z.object({
  leadId: z.uuid(),
  status: leadStatusSchema,
});

export const addLeadNoteSchema = z.object({
  leadId: z.uuid(),
  note: z.string().trim().min(1, { error: "La nota no puede estar vacía" }).max(4000),
});

export const updateLeadNotesSchema = z.object({
  leadId: z.uuid(),
  notes: z.string().trim().max(8000),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Email no válido" })),
  password: z.string().min(1, { error: "Introduce la contraseña" }).max(200),
});

export const leadsFilterSchema = z.object({
  q: z.string().trim().max(120).optional(),
  status: z.enum([...LEAD_STATUSES, "ALL"]).optional(),
  level: z.enum(["low", "medium", "high", "strategic", "ALL"]).optional(),
  source: z.string().trim().max(60).optional(),
  sector: z.string().trim().max(60).optional(),
  hot: z.enum(["1", "0"]).optional(),
  sort: z
    .enum(["createdAt", "score", "company", "status", "numberLocations", "companyRevenue"])
    .default("createdAt"),
  dir: z.enum(["asc", "desc"]).default("desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(100).default(25),
});

export type LeadsFilter = z.infer<typeof leadsFilterSchema>;
