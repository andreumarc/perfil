import type { SiteSettings } from "@/lib/validation/settings";

/**
 * Configuración por defecto del sitio. Todo es editable desde /admin/ajustes;
 * estos valores se usan en desarrollo sin base de datos y como semilla inicial.
 *
 * No contiene datos de empresa reales: nombre, teléfono, dirección y NIF son
 * marcadores hasta que el administrador los confirme.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  company: {
    name: "Nombre Empresa",
    tagline: "Reformas e instalaciones",
    legalName: "",
    nif: "",
    address: "",
    postalCode: "",
    city: "Barcelona",
    province: "Barcelona",
    phone: "",
    whatsapp: "",
    whatsappMessage: "Hola, me gustaría pedir presupuesto para una reforma.",
    email: "",
    hours: "Lunes a viernes, de 9:00 a 19:00",
    zones: ["Barcelona", "Igualada", "Anoia", "Toda Cataluña", "Toda España"],
    socials: { instagram: "", facebook: "", linkedin: "", youtube: "", tiktok: "" },
  },
  ticker: {
    enabled: true,
    messages: [
      "Reformas integrales e instalaciones",
      "Presupuesto detallado sin compromiso",
      "Toda Cataluña y toda España",
      "Instalaciones certificadas por profesionales habilitados",
      "Un único interlocutor durante toda la obra",
    ],
  },
  hero: {
    eyebrow: "Reformas integrales e instalaciones",
    titleBefore: "Espacios que",
    titleHighlight: "inspiran",
    titleAfter: "nuevas historias",
    subtitle:
      "Reformas de viviendas, locales y todo tipo de negocios. Diseño, ejecución e instalaciones con un equipo profesional que se encarga de todo.",
    imagePath: "/images/ilustrativas/hero-villa-piscina.webp",
    imageAlt: "Vivienda moderna con terraza y piscina al atardecer, imagen ilustrativa",
    primaryCtaLabel: "Pedir presupuesto sin compromiso",
    secondaryCtaLabel: "Ver proyectos",
  },
  commitments: [
    { icon: "advice", title: "Asesoramiento personalizado", description: "Visitamos, escuchamos y proponemos la solución que encaja con tu espacio y tu presupuesto." },
    { icon: "management", title: "Gestión integral del proyecto", description: "Un único interlocutor coordina diseño, licencias, gremios e instalaciones." },
    { icon: "deadline", title: "Planificación y plazos", description: "Calendario de obra por fases y seguimiento semanal del avance." },
    { icon: "quality", title: "Compromiso de calidad", description: "Materiales de marcas reconocidas, acabados revisados y garantía legal de obra." },
  ],
  verifiedStats: [
    { value: "", suffix: "", label: "Proyectos realizados", verified: false },
    { value: "", suffix: "", label: "Años de experiencia", verified: false },
    { value: "", suffix: "", label: "Gremios coordinados", verified: false },
    { value: "", suffix: "", label: "Clientes que repiten", verified: false },
  ],
  process: [
    { title: "Contacto y primera visita", description: "Nos cuentas qué necesitas, visitamos el espacio y tomamos medidas y fotos." },
    { title: "Propuesta y presupuesto", description: "Presupuesto detallado por partidas, sin sorpresas, con plazos y alternativas de materiales." },
    { title: "Proyecto y licencias", description: "Diseño, distribución y tramitación de licencias cuando el tipo de obra lo requiere." },
    { title: "Ejecución por fases", description: "Obra planificada con un responsable en obra y seguimiento del avance." },
    { title: "Entrega y garantía", description: "Revisión final contigo, documentación de las instalaciones y garantía legal." },
  ],
  about: {
    title: "Un equipo que se encarga de todo",
    intro:
      "Coordinamos diseño, obra e instalaciones para que tu reforma avance con un único interlocutor, un calendario claro y un presupuesto cerrado por partidas.",
    body: `## Cómo trabajamos

Cada proyecto empieza con una visita y una conversación: qué quieres conseguir, qué presupuesto manejas y qué plazos necesitas. A partir de ahí preparamos una propuesta detallada por partidas.

Durante la obra, un responsable coordina a todos los gremios (albañilería, electricidad, fontanería, climatización, carpintería, pintura…) y te informa del avance. Al terminar, revisamos contigo cada acabado y te entregamos la documentación de las instalaciones.

## Qué puedes esperar

- Presupuesto cerrado por partidas y plazos acordados por escrito.
- Un único interlocutor durante todo el proyecto.
- Instalaciones ejecutadas por profesionales habilitados cuando la normativa lo exige.
- Garantía legal de obra conforme a la Ley de Ordenación de la Edificación.

*Los datos corporativos, el equipo y las referencias se completan desde el panel de administración.*`,
  },
  seo: {
    defaultTitle: "Reformas integrales e instalaciones para viviendas y negocios",
    defaultDescription:
      "Empresa de reformas integrales e instalaciones en toda Cataluña y toda España, con base en Barcelona, Igualada y Anoia. Viviendas, locales, oficinas, gimnasios, restaurantes y clínicas. Presupuesto sin compromiso.",
    keywords: [
      "reformas integrales",
      "empresa de reformas",
      "reforma de pisos",
      "reforma de locales comerciales",
      "reforma de oficinas",
      "reforma de gimnasios",
      "reforma de restaurantes",
      "reforma de clínicas",
      "instalaciones eléctricas",
      "fontanería",
      "climatización",
      "aerotermia",
      "reformas Barcelona",
      "reformas Igualada",
      "reformas Anoia",
      "reformas Cataluña",
      "empresa de reformas España",
    ],
  },
  integrations: {
    gtmId: "",
    ga4Id: "",
    metaPixelId: "",
    gscVerification: "",
    gbpUrl: "",
    mapsUrl: "",
  },
  notifications: {
    leadEmails: [],
  },
  menus: {
    main: [
      { label: "Servicios", href: "/servicios" },
      { label: "Sectores", href: "/sectores" },
      { label: "Proyectos", href: "/proyectos" },
      { label: "Empresa", href: "/empresa" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contacto" },
    ],
    footer: [
      {
        title: "Reformas",
        items: [
          { label: "Reformas integrales de viviendas", href: "/servicios/reformas-integrales-viviendas" },
          { label: "Reformas de cocinas", href: "/servicios/reformas-cocinas" },
          { label: "Reformas de baños", href: "/servicios/reformas-banos" },
          { label: "Locales comerciales y oficinas", href: "/servicios/reformas-locales-comerciales" },
          { label: "Gimnasios y centros deportivos", href: "/servicios/reformas-gimnasios" },
          { label: "Restaurantes, bares y cafeterías", href: "/servicios/reformas-restaurantes" },
        ],
      },
      {
        title: "Instalaciones",
        items: [
          { label: "Electricidad", href: "/servicios/instalaciones-electricas" },
          { label: "Fontanería y saneamiento", href: "/servicios/fontaneria-saneamiento" },
          { label: "Climatización y aire acondicionado", href: "/servicios/climatizacion-aire-acondicionado" },
          { label: "Calefacción y aerotermia", href: "/servicios/calefaccion-aerotermia" },
          { label: "Domótica y telecomunicaciones", href: "/servicios/domotica-telecomunicaciones" },
          { label: "Protección contra incendios", href: "/servicios/proteccion-contra-incendios" },
        ],
      },
      {
        title: "Empresa",
        items: [
          { label: "Quiénes somos", href: "/empresa" },
          { label: "Proyectos", href: "/proyectos" },
          { label: "Zonas de actuación", href: "/zonas" },
          { label: "Blog", href: "/blog" },
          { label: "Pedir presupuesto", href: "/presupuesto" },
          { label: "Contacto", href: "/contacto" },
        ],
      },
      {
        title: "Legal",
        items: [
          { label: "Aviso legal", href: "/aviso-legal" },
          { label: "Política de privacidad", href: "/politica-privacidad" },
          { label: "Política de cookies", href: "/politica-cookies" },
          { label: "Términos de uso", href: "/terminos" },
          { label: "Ejercer derechos RGPD", href: "/privacidad/solicitud" },
        ],
      },
    ],
  },
  legal: {
    responsibleName: "[POR CONFIRMAR: razón social]",
    nif: "[POR CONFIRMAR: NIF]",
    address: "[POR CONFIRMAR: dirección completa]",
    email: "[POR CONFIRMAR: email de contacto]",
    registry: "[POR CONFIRMAR: datos registrales]",
    lastUpdated: "2026-10-12",
  },
};
