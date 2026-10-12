/**
 * Enumeraciones compartidas entre la base de datos (pgEnum), la validación (Zod)
 * y la interfaz. Fuente única de verdad: cambiar aquí implica nueva migración.
 */

export const USER_ROLES = ["admin", "editor"] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Editor",
};

export const LEAD_STATUSES = ["NEW", "CONTACTED", "VISIT_SCHEDULED", "QUOTE_SENT", "WON", "LOST"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  VISIT_SCHEDULED: "Visita concertada",
  QUOTE_SENT: "Presupuesto enviado",
  WON: "Ganado",
  LOST: "Perdido",
};

export const LEAD_SOURCES = [
  "presupuesto",
  "contacto",
  "servicio",
  "sector",
  "zona",
  "proyecto",
  "blog",
  "whatsapp",
  "telefono",
  "otro",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];
export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  presupuesto: "Formulario de presupuesto",
  contacto: "Formulario de contacto",
  servicio: "Página de servicio",
  sector: "Página de sector",
  zona: "Página de zona",
  proyecto: "Página de proyecto",
  blog: "Blog",
  whatsapp: "WhatsApp",
  telefono: "Teléfono",
  otro: "Otro",
};

export const PROPERTY_TYPES = [
  { value: "piso", label: "Piso o apartamento" },
  { value: "casa", label: "Casa unifamiliar o chalet" },
  { value: "local", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
  { value: "nave", label: "Nave industrial" },
  { value: "comunidad", label: "Comunidad de propietarios" },
  { value: "otro", label: "Otro" },
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];
export const PROPERTY_TYPE_VALUES = PROPERTY_TYPES.map((p) => p.value) as [PropertyType, ...PropertyType[]];

export const BUDGET_RANGES = [
  { value: "lt10k", label: "Menos de 10.000 €" },
  { value: "10k-25k", label: "10.000 – 25.000 €" },
  { value: "25k-50k", label: "25.000 – 50.000 €" },
  { value: "50k-100k", label: "50.000 – 100.000 €" },
  { value: "gt100k", label: "Más de 100.000 €" },
  { value: "no_se", label: "Todavía no lo sé" },
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number]["value"];
export const BUDGET_RANGE_VALUES = BUDGET_RANGES.map((b) => b.value) as [BudgetRange, ...BudgetRange[]];

export const TIMELINES = [
  { value: "inmediato", label: "Lo antes posible" },
  { value: "1-3m", label: "En 1 a 3 meses" },
  { value: "3-6m", label: "En 3 a 6 meses" },
  { value: "gt6m", label: "En más de 6 meses" },
  { value: "sin_fecha", label: "Sin fecha definida" },
] as const;
export type Timeline = (typeof TIMELINES)[number]["value"];
export const TIMELINE_VALUES = TIMELINES.map((t) => t.value) as [Timeline, ...Timeline[]];

export const CONTENT_STATUSES = ["draft", "published"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const MEDIA_KINDS = ["real", "illustrative"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const DATA_REQUEST_TYPES = ["access", "rectification", "erasure", "other"] as const;
export type DataRequestType = (typeof DATA_REQUEST_TYPES)[number];
export const DATA_REQUEST_TYPE_LABELS: Record<DataRequestType, string> = {
  access: "Acceso a mis datos",
  rectification: "Rectificación",
  erasure: "Supresión (derecho al olvido)",
  other: "Otra solicitud (oposición, portabilidad, limitación)",
};

export const DATA_REQUEST_STATUSES = ["new", "in_progress", "closed"] as const;
export type DataRequestStatus = (typeof DATA_REQUEST_STATUSES)[number];

export const ACTIVITY_TYPES = ["status_change", "note", "email_sent", "call", "visit", "quote", "assignment", "system"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  status_change: "Cambio de estado",
  note: "Nota",
  email_sent: "Email enviado",
  call: "Llamada",
  visit: "Visita",
  quote: "Presupuesto",
  assignment: "Asignación",
  system: "Sistema",
};

/** Atribución de marketing capturada en cliente. */
export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  landingPage?: string;
}

/** Devuelve la etiqueta de un valor dentro de una lista {value,label}; si no existe, el valor crudo. */
export function labelFor<T extends readonly { value: string; label: string }[]>(
  list: T,
  value: string | null | undefined,
): string {
  if (!value) return "—";
  return list.find((item) => item.value === value)?.label ?? value;
}
