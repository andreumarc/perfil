/**
 * Catálogo de eventos del funnel. Fuente única para cliente, API y dashboard.
 */
export const EVENT_TYPES = [
  "page_view",
  "lead_created",
  "quote_form_started",
  "contact_clicked",
  "phone_clicked",
  "whatsapp_clicked",
  "email_clicked",
  "cta_clicked",
  "service_viewed",
  "project_viewed",
  "article_viewed",
  "consent_updated",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/** Eventos que, además de enviarse a GTM/GA4/Meta, se guardan en Neon. */
export const PERSISTED_EVENTS: ReadonlySet<EventType> = new Set<EventType>([
  "page_view",
  "lead_created",
  "quote_form_started",
  "contact_clicked",
  "phone_clicked",
  "whatsapp_clicked",
  "email_clicked",
  "cta_clicked",
  "service_viewed",
  "project_viewed",
  "consent_updated",
]);

export const EVENT_LABELS: Record<EventType, string> = {
  page_view: "Página vista",
  lead_created: "Solicitud enviada",
  quote_form_started: "Formulario iniciado",
  contact_clicked: "Clic en contacto",
  phone_clicked: "Clic en llamar",
  whatsapp_clicked: "Clic en WhatsApp",
  email_clicked: "Clic en email",
  cta_clicked: "Clic en CTA",
  service_viewed: "Servicio visto",
  project_viewed: "Proyecto visto",
  article_viewed: "Artículo visto",
  consent_updated: "Consentimiento actualizado",
};

export type EventProps = Record<string, string | number | boolean | null | undefined>;
