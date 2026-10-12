import { SECTOR_BODIES } from "./sector-bodies";
import type { SectorContent } from "./types";

const IMG = (name: string) => `/images/ilustrativas/${name}.webp`;

type Partial = Omit<SectorContent, "body" | "order" | "status"> & { body?: string; status?: SectorContent["status"] };

const RAW: Partial[] = [
  {
    slug: "viviendas",
    name: "Viviendas",
    headline: "Reformas de viviendas: pisos, casas y rehabilitaciones",
    summary: "Reformas integrales y parciales para quien compra, hereda, alquila o simplemente quiere vivir mejor en su casa.",
    serviceSlugs: ["reformas-integrales-viviendas", "reformas-cocinas", "reformas-banos", "instalaciones-electricas", "fontaneria-saneamiento", "calefaccion-aerotermia"],
    faqs: [{ question: "¿Hacéis reformas pequeñas?", answer: "Sí: cocinas, baños, instalaciones o cambios de suelo. Presupuestamos cualquier reforma a partir de una visita." }],
    imagePath: IMG("reformas-integrales-viviendas"),
  },
  {
    slug: "pisos",
    name: "Pisos y apartamentos",
    headline: "Reformas de pisos en edificios plurifamiliares",
    summary: "Reformas de pisos con gestión de comunidad, escombros y horarios, pensadas para molestar lo mínimo.",
    serviceSlugs: ["reformas-pisos", "reformas-integrales-viviendas", "reformas-cocinas", "reformas-banos", "pladur-albanileria"],
    faqs: [],
    imagePath: IMG("reformas-integrales-viviendas"),
  },
  {
    slug: "casas",
    name: "Casas y chalets",
    headline: "Reformas de casas unifamiliares, chalets y masías",
    summary: "Reformas integrales, ampliaciones, cubiertas, fachadas y eficiencia energética en viviendas unifamiliares.",
    serviceSlugs: ["reformas-casas", "rehabilitacion-fachadas", "calefaccion-aerotermia", "techos-aislamientos", "carpinteria"],
    faqs: [],
    imagePath: IMG("hero-villa-piscina"),
  },
  {
    slug: "comunidades-propietarios",
    name: "Comunidades de propietarios",
    headline: "Obras y rehabilitación para comunidades de propietarios",
    summary: "Fachadas, cubiertas, portales, instalaciones comunitarias y accesibilidad, con presupuestos comparables y certificaciones de obra.",
    serviceSlugs: ["reformas-comunidades", "rehabilitacion-fachadas", "rehabilitacion-edificios", "fontaneria-saneamiento", "instalaciones-electricas"],
    faqs: [],
    imagePath: IMG("pladur-albanileria"),
  },
  {
    slug: "locales-comerciales",
    name: "Locales comerciales",
    headline: "Reformas de locales comerciales y tiendas",
    summary: "Adecuación de locales para abrir a tiempo: imagen, instalaciones, accesibilidad y licencia de actividad.",
    serviceSlugs: ["reformas-locales-comerciales", "adecuacion-locales", "iluminacion", "climatizacion-aire-acondicionado", "licencias-direccion-tecnica"],
    faqs: [],
    imagePath: IMG("reformas-locales-comerciales"),
  },
  {
    slug: "oficinas",
    name: "Oficinas",
    headline: "Reformas de oficinas y espacios de trabajo",
    summary: "Mamparas, salas, cableado, climatización y acústica, con obra por fases para no parar la actividad.",
    serviceSlugs: ["reformas-oficinas", "domotica-telecomunicaciones", "climatizacion-aire-acondicionado", "iluminacion", "pladur-albanileria"],
    faqs: [],
    imagePath: IMG("pladur-albanileria"),
  },
  {
    slug: "gimnasios",
    name: "Gimnasios",
    headline: "Reformas de gimnasios, boxes y estudios de entrenamiento",
    summary: "Pavimentos técnicos, vestuarios, ventilación y climatización dimensionadas al aforo, electricidad para maquinaria y acústica.",
    serviceSlugs: ["reformas-gimnasios", "ventilacion-extraccion", "climatizacion-aire-acondicionado", "agua-caliente-sanitaria", "suelos-pavimentos", "techos-aislamientos"],
    faqs: [],
    imagePath: IMG("reformas-gimnasios"),
  },
  {
    slug: "restaurantes",
    name: "Restaurantes",
    headline: "Reformas de restaurantes",
    summary: "Cocina profesional, extracción, gas con instalador habilitado, sala, barra, aseos y acústica.",
    serviceSlugs: ["reformas-restaurantes", "ventilacion-extraccion", "instalaciones-gas", "instalaciones-electricas", "climatizacion-aire-acondicionado"],
    faqs: [],
    imagePath: IMG("reformas-restaurantes"),
  },
  {
    slug: "bares-cafeterias",
    name: "Bares y cafeterías",
    headline: "Reformas de bares y cafeterías",
    summary: "Barras, zonas de elaboración, extracción, aseos accesibles e imagen de local para abrir con licencia.",
    serviceSlugs: ["reformas-restaurantes", "adecuacion-locales", "ventilacion-extraccion", "iluminacion", "licencias-direccion-tecnica"],
    faqs: [],
    imagePath: IMG("reformas-restaurantes"),
  },
  {
    slug: "hoteles",
    name: "Hoteles y alojamientos",
    headline: "Reformas de hoteles, hostales y apartamentos turísticos",
    summary: "Habitaciones y baños en serie, zonas comunes e instalaciones, planificadas por plantas para mantener la ocupación.",
    serviceSlugs: ["reformas-hoteles", "reformas-banos", "climatizacion-aire-acondicionado", "agua-caliente-sanitaria", "proteccion-contra-incendios"],
    faqs: [],
    imagePath: IMG("reformas-restaurantes"),
  },
  {
    slug: "clinicas-dentales",
    name: "Clínicas dentales",
    headline: "Reformas de clínicas dentales",
    summary: "Gabinetes, esterilización, instalaciones para sillones y compresores, climatización y requisitos de autorización sanitaria.",
    serviceSlugs: ["reformas-clinicas", "instalaciones-electricas", "fontaneria-saneamiento", "climatizacion-aire-acondicionado", "licencias-direccion-tecnica"],
    faqs: [],
    imagePath: IMG("reformas-clinicas"),
  },
  {
    slug: "clinicas-medicas",
    name: "Clínicas y centros médicos",
    headline: "Reformas de centros médicos, fisioterapia y consultas",
    summary: "Consultas, salas de tratamiento, accesibilidad, ventilación y acabados fáciles de limpiar, coordinados con la autorización sanitaria.",
    serviceSlugs: ["reformas-clinicas", "ventilacion-extraccion", "climatizacion-aire-acondicionado", "suelos-pavimentos", "iluminacion"],
    faqs: [],
    imagePath: IMG("reformas-clinicas"),
  },
  {
    slug: "centros-deportivos",
    name: "Centros deportivos",
    headline: "Reformas de centros deportivos y clubes",
    summary: "Vestuarios, duchas, salas polivalentes, pavimentos deportivos, ventilación y ACS de alto caudal.",
    serviceSlugs: ["reformas-gimnasios", "agua-caliente-sanitaria", "ventilacion-extraccion", "suelos-pavimentos", "pladur-albanileria"],
    faqs: [],
    imagePath: IMG("reformas-gimnasios"),
  },
  {
    slug: "naves-industriales",
    name: "Naves industriales",
    headline: "Reformas y adecuación de naves industriales",
    summary: "Pavimentos, oficinas anexas, electricidad de potencia, iluminación, PCI con empresa habilitada y cerramientos.",
    serviceSlugs: ["reformas-naves-industriales", "instalaciones-electricas", "proteccion-contra-incendios", "cerrajeria", "iluminacion"],
    faqs: [],
    imagePath: IMG("reformas-naves-industriales"),
  },
  {
    slug: "otros-negocios",
    name: "Otros negocios",
    headline: "Academias, peluquerías, talleres, coworkings y otros negocios",
    summary: "Adecuación de locales para cualquier actividad, con la documentación para la licencia de apertura.",
    serviceSlugs: ["adecuacion-locales", "reformas-locales-comerciales", "instalaciones-electricas", "climatizacion-aire-acondicionado", "licencias-direccion-tecnica"],
    faqs: [],
    imagePath: IMG("suelos-carpinteria"),
  },
];

export const SECTORS: SectorContent[] = RAW.map((s, index) => ({
  ...s,
  body: s.body ?? SECTOR_BODIES[s.slug]?.body ?? "",
  faqs: s.faqs.length ? s.faqs : (SECTOR_BODIES[s.slug]?.faqs ?? []),
  order: index + 1,
  status: s.status ?? "published",
}));
export const SECTOR_SLUGS = SECTORS.map((s) => s.slug);
export function getSectorContent(slug: string): SectorContent | undefined {
  return SECTORS.find((s) => s.slug === slug);
}
