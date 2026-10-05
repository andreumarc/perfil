import { publicEnv } from "@/lib/env";

/**
 * Configuración global del sitio: identidad, mensajes y navegación.
 * Fuente única de verdad para header, footer, SEO y CTAs.
 */
export const site = {
  name: "Marc Andreu Guerao",
  shortName: "Marc Andreu",
  brand: "Multisite Performance",
  role: "Director de Operaciones · Especialista en empresas multicentro",
  tagline: "Más control. Más EBITDA. Una sola forma de operar.",
  description:
    "Ayudo a CEOs, inversores y grupos multicentro a detectar dónde se pierde rentabilidad, mejorar EBITDA, estandarizar operaciones e integrar nuevos centros.",
  valueProposition:
    "Convierto redes de centros en operaciones más rentables, medibles y escalables.",
  location: "Barcelona, España",
  locale: "es_ES",
  language: "es",
  url: publicEnv.siteUrl,
  bookingUrl: publicEnv.bookingUrl,
  linkedinUrl: publicEnv.linkedinUrl,
  contactEmail: publicEnv.contactEmail,
  keywords: [
    "director operaciones multicentro",
    "consultor operaciones multicentro",
    "consultor EBITDA",
    "mejorar EBITDA empresa",
    "P&L por centro",
    "rentabilidad por centro",
    "gestión multicentro",
    "integración post adquisición",
    "post merger integration",
    "buy and build operations",
    "operational due diligence",
    "fractional COO España",
    "fractional COO Barcelona",
    "consultor healthcare",
    "gestión clínicas dentales",
    "gestión clínicas veterinarias",
  ],
} as const;

/** CTA principal del funnel. */
export const primaryCta = {
  label: "Hacer diagnóstico gratuito",
  shortLabel: "Diagnóstico gratuito",
  href: "/diagnostico",
} as const;

export const secondaryCta = {
  label: "Ver cómo trabajo",
  href: "/#metodologia",
} as const;

/** Enlace de reunión: Calendly si está configurado, si no, formulario de contacto con interés "sesión". */
export const meetingHref = site.bookingUrl ?? "/contacto?interes=sesion";
export const meetingIsExternal = Boolean(site.bookingUrl);

/**
 * Texto único del CTA de reunión. Con Calendly el usuario "reserva"; sin él,
 * "solicita" (aterriza en el formulario), para no prometer un calendario que no existe.
 */
export const meetingCta = {
  label: meetingIsExternal ? "Reservar sesión de 30 min" : "Solicitar sesión de 30 min",
  longLabel: meetingIsExternal
    ? "Reservar una sesión estratégica de 30 minutos"
    : "Solicitar una sesión estratégica de 30 minutos",
} as const;

export const mainNav = [
  { label: "Servicios", href: "/servicios" },
  { label: "Private Equity", href: "/private-equity" },
  { label: "Healthcare", href: "/healthcare" },
  { label: "Casos", href: "/casos" },
  { label: "Insights", href: "/insights" },
  { label: "Sobre mí", href: "/sobre-mi" },
] as const;

export const footerNav = {
  servicios: [
    { label: "Multisite Performance Audit", href: "/servicios/multisite-performance-audit" },
    { label: "EBITDA Improvement Sprint", href: "/servicios/ebitda-improvement" },
    { label: "Integration 100", href: "/servicios/integration-100" },
    { label: "Fractional COO", href: "/servicios/fractional-coo" },
  ],
  sectores: [
    { label: "Private Equity", href: "/private-equity" },
    { label: "Healthcare", href: "/healthcare" },
    { label: "Empresas multicentro", href: "/multisite" },
    { label: "Casos de intervención", href: "/casos" },
  ],
  recursos: [
    { label: "Diagnóstico Multisite", href: "/diagnostico" },
    { label: "Calculadora EBITDA", href: "/calculadora-ebitda" },
    { label: "Insights", href: "/insights" },
    { label: "Sobre mí", href: "/sobre-mi" },
    { label: "Contacto", href: "/contacto" },
  ],
  legal: [
    { label: "Aviso legal", href: "/legal" },
    { label: "Política de privacidad", href: "/politica-privacidad" },
    { label: "Política de cookies", href: "/cookies" },
  ],
} as const;

export const sectors = [
  "Healthcare",
  "Dental",
  "Veterinaria",
  "Retail",
  "Fitness",
  "Servicios",
  "Private Equity",
] as const;

/** Credenciales profesionales verificables (no resultados económicos inventados). */
export const credentials = [
  { value: "25", suffix: "", label: "centros dirigidos en red" },
  { value: "35", suffix: " M€", label: "de P&L gestionado" },
  { value: "250", suffix: "", label: "personas en equipos dirigidos" },
  { value: "4", suffix: "", label: "sectores: healthcare, dental, veterinaria y retail" },
] as const;
