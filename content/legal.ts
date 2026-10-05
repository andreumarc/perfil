import { site } from "@/lib/site";

/**
 * Contenido tipado de las páginas legales (/legal, /politica-privacidad, /cookies).
 * Solo datos y helpers puros: sin JSX. Las páginas componen a partir de aquí.
 */

/**
 * Datos del titular del sitio (LSSI-CE, art. 10).
 * `nif` y `address` los debe completar el titular; mientras estén vacíos las
 * páginas muestran "Pendiente de indicar" mediante `legalValue()`.
 */
export const LEGAL_IDENTITY = {
  name: "Marc Andreu Guerao",
  activity:
    "Servicios de dirección y consultoría de operaciones para empresas multicentro (diagnóstico, mejora de EBITDA, integración post-adquisición y dirección de operaciones externa)",
  nif: "",
  address: "",
  city: "Barcelona",
  country: "España",
  email: site.contactEmail ?? "",
  /** Fecha de la última revisión de los textos legales (ISO). */
  lastUpdated: "2026-10-01",
} as const;

export const PENDING_LABEL = "Pendiente de indicar";

/** Devuelve el valor o la etiqueta de pendiente si está vacío. */
export function legalValue(value: string): string {
  return value.trim() ? value : PENDING_LABEL;
}

/** "2026-10-01" → "1 de octubre de 2026". */
export function formatLegalDate(iso: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** Plazos de conservación (meses). */
export const RETENTION = {
  leadsMonths: 24,
  eventsMonths: 24,
  consentCookieMonths: 6,
  visitorCookieMonths: 12,
} as const;

/** Datos que el usuario facilita en los formularios del sitio. */
export const FORM_DATA: readonly string[] = [
  "Nombre y apellidos",
  "Empresa o grupo",
  "Cargo",
  "Email corporativo",
  "Teléfono (opcional)",
  "Número de centros",
  "Facturación aproximada (opcional)",
  "Sector (opcional)",
  "Prioridad principal y mensaje",
  "Respuestas del Diagnóstico Multisite y su resultado (puntuación y nivel)",
  "Inputs de la Calculadora EBITDA cuando se solicita el análisis",
];

/** Datos técnicos que se recogen automáticamente. */
export const TECHNICAL_DATA: readonly string[] = [
  "Dirección IP anonimizada mediante hash con sal (no reversible); la IP original no se almacena",
  "User agent y tipo de dispositivo (móvil, tablet, escritorio)",
  "País aproximado, derivado de la IP en el borde de la red antes de anonimizarla",
  "Parámetros UTM, página de entrada y referrer",
  "Páginas vistas y eventos del embudo (clics en CTA, pasos del diagnóstico, uso de la calculadora)",
  "Identificador anónimo de visitante (solo con consentimiento de analítica)",
];

export type LegalBasisArticle = "6.1.a" | "6.1.f";

export interface Purpose {
  title: string;
  description: string;
  legalBasisArticle: LegalBasisArticle;
  legalBasis: string;
}

export const PURPOSES: readonly Purpose[] = [
  {
    title: "Responder a tu solicitud de contacto",
    description:
      "Leer tu mensaje, prepararte una primera lectura de tu situación y responderte por email o teléfono, incluida la propuesta de una sesión de 30 minutos si tiene sentido.",
    legalBasisArticle: "6.1.a",
    legalBasis: "Consentimiento, otorgado al marcar la casilla de privacidad y enviar el formulario.",
  },
  {
    title: "Enviarte el resultado del diagnóstico o del análisis",
    description:
      "Elaborar y remitir el resultado del Diagnóstico Multisite, la lectura de la Calculadora EBITDA o el documento que hayas solicitado.",
    legalBasisArticle: "6.1.a",
    legalBasis: "Consentimiento, otorgado al completar el formulario correspondiente.",
  },
  {
    title: "Seguimiento comercial B2B",
    description:
      "Contactar con directivos e inversores que han mostrado interés para proponer servicios relacionados con su solicitud. Comunicaciones personales y acotadas, sin secuencias automáticas. Puedes oponerte en cualquier momento.",
    legalBasisArticle: "6.1.f",
    legalBasis:
      "Interés legítimo en el desarrollo de la actividad profesional (considerando 47 RGPD y art. 19 LOPDGDD, datos de contacto de profesionales en el ámbito de su función).",
  },
  {
    title: "Medir y mejorar el embudo del sitio",
    description:
      "Analizar qué páginas se visitan, qué CTAs funcionan y en qué paso se abandona el diagnóstico, para mejorar el contenido y priorizar la respuesta a las solicitudes (lead scoring interno).",
    legalBasisArticle: "6.1.f",
    legalBasis:
      "Interés legítimo para la medición propia con datos anonimizados; consentimiento (art. 6.1.a y art. 22 LSSI-CE) para las cookies de analítica y marketing de terceros.",
  },
];

export interface Processor {
  name: string;
  role: string;
  location: string;
  requiresConsent: boolean;
  internationalTransfer: string;
}

export const PROCESSORS: readonly Processor[] = [
  {
    name: "Vercel Inc.",
    role: "Alojamiento del sitio, CDN, funciones de servidor y analítica agregada sin cookies (Vercel Analytics)",
    location: "Estados Unidos, con puntos de presencia en la Unión Europea",
    requiresConsent: false,
    internationalTransfer: "Cláusulas Contractuales Tipo (CCT) y certificación EU-US Data Privacy Framework",
  },
  {
    name: "Neon Inc.",
    role: "Base de datos PostgreSQL donde se guardan los leads y los eventos del embudo",
    location: "Región de la Unión Europea",
    requiresConsent: false,
    internationalTransfer: "Datos alojados en la UE; CCT para el soporte técnico prestado desde fuera de la UE",
  },
  {
    name: "Resend Inc.",
    role: "Envío de emails transaccionales (notificación de nueva solicitud, envío de resultados)",
    location: "Estados Unidos",
    requiresConsent: false,
    internationalTransfer: "Cláusulas Contractuales Tipo (CCT)",
  },
  {
    name: "Google Ireland Ltd. (Google Analytics 4)",
    role: "Analítica de uso del sitio con IP anonimizada",
    location: "Irlanda y Estados Unidos",
    requiresConsent: true,
    internationalTransfer: "CCT y certificación EU-US Data Privacy Framework",
  },
  {
    name: "Meta Platforms Ireland Ltd. (Meta Pixel)",
    role: "Medición de conversiones de campañas publicitarias en Meta",
    location: "Irlanda y Estados Unidos",
    requiresConsent: true,
    internationalTransfer: "CCT y certificación EU-US Data Privacy Framework",
  },
  {
    name: "LinkedIn Ireland Unlimited Company (Insight Tag)",
    role: "Medición de conversiones de campañas publicitarias en LinkedIn",
    location: "Irlanda y Estados Unidos",
    requiresConsent: true,
    internationalTransfer: "CCT y certificación EU-US Data Privacy Framework",
  },
];

export interface Right {
  name: string;
  description: string;
}

export const RIGHTS: readonly Right[] = [
  { name: "Acceso", description: "Saber qué datos tuyos se tratan y obtener una copia." },
  { name: "Rectificación", description: "Corregir datos inexactos o completar los incompletos." },
  { name: "Supresión", description: "Pedir que se eliminen tus datos cuando ya no sean necesarios o retires el consentimiento." },
  {
    name: "Oposición",
    description: "Oponerte al tratamiento basado en interés legítimo, en particular al seguimiento comercial.",
  },
  {
    name: "Limitación",
    description: "Pedir que los datos se conserven pero no se usen mientras se resuelve una reclamación.",
  },
  {
    name: "Portabilidad",
    description: "Recibir los datos que facilitaste en un formato estructurado y de uso común.",
  },
];

export type CookieCategory = "Necesaria" | "Técnica de sesión" | "Analítica" | "Marketing";

export interface CookieRow {
  name: string;
  provider: string;
  category: CookieCategory;
  purpose: string;
  duration: string;
  requiresConsent: boolean;
  storage: "cookie" | "sessionStorage" | "none";
}

export const COOKIES: readonly CookieRow[] = [
  {
    name: "mg_consent",
    provider: "Propia",
    category: "Necesaria",
    purpose: "Guarda tu decisión sobre cookies de analítica y marketing para no volver a preguntarte.",
    duration: `${RETENTION.consentCookieMonths} meses`,
    requiresConsent: false,
    storage: "cookie",
  },
  {
    name: "mg_admin",
    provider: "Propia",
    category: "Necesaria",
    purpose: "Sesión de acceso al área privada de administración. Solo se crea si el titular inicia sesión.",
    duration: "7 días",
    requiresConsent: false,
    storage: "cookie",
  },
  {
    name: "mg_vid",
    provider: "Propia",
    category: "Analítica",
    purpose: "Identificador anónimo de visitante para unir las visitas con la solicitud cuando conviertes.",
    duration: `${RETENTION.visitorCookieMonths} meses`,
    requiresConsent: true,
    storage: "cookie",
  },
  {
    name: "mg_attr · mg_sid",
    provider: "Propia (sessionStorage)",
    category: "Técnica de sesión",
    purpose:
      "Guardan los parámetros UTM, el referrer y un identificador de pestaña para atribuir el origen de la solicitud.",
    duration: "Sesión del navegador (se borran al cerrar la pestaña)",
    requiresConsent: false,
    storage: "sessionStorage",
  },
  {
    name: "_ga · _ga_* · _gid",
    provider: "Google Analytics 4",
    category: "Analítica",
    purpose: "Distinguen usuarios y sesiones para medir páginas vistas y eventos del embudo.",
    duration: "_ga y _ga_*: hasta 2 años · _gid: 24 horas",
    requiresConsent: true,
    storage: "cookie",
  },
  {
    name: "_fbp",
    provider: "Meta Platforms",
    category: "Marketing",
    purpose: "Mide la conversión de las campañas publicadas en Meta (Meta Pixel).",
    duration: "3 meses",
    requiresConsent: true,
    storage: "cookie",
  },
  {
    name: "li_sugr · bcookie · lidc · UserMatchHistory",
    provider: "LinkedIn",
    category: "Marketing",
    purpose: "Miden la conversión de las campañas publicadas en LinkedIn (Insight Tag).",
    duration: "Entre 1 día y 12 meses según la cookie",
    requiresConsent: true,
    storage: "cookie",
  },
  {
    name: "Vercel Analytics",
    provider: "Vercel",
    category: "Analítica",
    purpose: "Métricas de audiencia agregadas (páginas vistas, país, dispositivo) sin identificar al visitante.",
    duration: "No utiliza cookies ni almacenamiento en el dispositivo",
    requiresConsent: false,
    storage: "none",
  },
];

/** Autoridad de control. */
export const AEPD = {
  name: "Agencia Española de Protección de Datos",
  url: "https://www.aepd.es",
} as const;

/** Ayuda oficial de cada navegador para gestionar cookies. */
export const BROWSER_COOKIE_HELP: readonly { name: string; url: string }[] = [
  { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647?hl=es" },
  {
    name: "Mozilla Firefox",
    url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias",
  },
  { name: "Apple Safari", url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
  {
    name: "Microsoft Edge",
    url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
  },
];
