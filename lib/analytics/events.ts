/**
 * Catálogo de eventos del funnel. Fuente única para cliente, API y dashboard.
 */
export const EVENT_TYPES = [
  "page_view",
  "diagnostic_started",
  "diagnostic_step_completed",
  "diagnostic_completed",
  "lead_created",
  "contact_clicked",
  "email_clicked",
  "linkedin_clicked",
  "meeting_clicked",
  "service_viewed",
  "cta_clicked",
  "calculator_used",
  "consent_updated",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/**
 * Eventos que, además de enviarse a GA4/Meta/LinkedIn, se guardan en Neon.
 * `page_view` se guarda para poder calcular visitantes del funnel.
 */
export const PERSISTED_EVENTS: ReadonlySet<EventType> = new Set<EventType>([
  "page_view",
  "diagnostic_started",
  "diagnostic_completed",
  "lead_created",
  "contact_clicked",
  "email_clicked",
  "linkedin_clicked",
  "meeting_clicked",
  "service_viewed",
  "cta_clicked",
  "calculator_used",
  "consent_updated",
]);

export const EVENT_LABELS: Record<EventType, string> = {
  page_view: "Página vista",
  diagnostic_started: "Diagnóstico iniciado",
  diagnostic_step_completed: "Paso de diagnóstico",
  diagnostic_completed: "Diagnóstico completado",
  lead_created: "Lead creado",
  contact_clicked: "Clic en contacto",
  email_clicked: "Clic en email",
  linkedin_clicked: "Clic en LinkedIn",
  meeting_clicked: "Clic en reunión",
  service_viewed: "Servicio visto",
  cta_clicked: "Clic en CTA",
  calculator_used: "Calculadora usada",
  consent_updated: "Consentimiento actualizado",
};

export type EventProps = Record<string, string | number | boolean | null | undefined>;
