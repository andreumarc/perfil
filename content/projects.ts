import type { ProjectContent } from "./types";

const IMG = (name: string) => `/images/ilustrativas/${name}.webp`;

/**
 * Proyectos tipo. Son ejemplos de alcance y proceso (isIllustrative = true, no son obras ejecutadas):
 * NO son obras ejecutadas. Se marcan como tales en la web hasta que el
 * administrador los sustituya por proyectos reales con fotografías propias.
 */
export const PROJECTS: ProjectContent[] = [
  {
    slug: "proyecto-tipo-reforma-integral-piso-90m2",
    title: "Reforma integral de piso de 90 m²",
    serviceSlug: "reformas-integrales-viviendas",
    sectorSlug: "pisos",
    locality: "Barcelona (ejemplo)",
    summary: "Ejemplo de alcance para una reforma integral de un piso de tres habitaciones: nueva distribución abierta, instalaciones completas, cocina y dos baños.",
    scope: `- Demolición de tabiquería interior y retirada de instalaciones antiguas
- Nueva distribución con cocina abierta al salón
- Instalación eléctrica completa con boletín
- Fontanería y desagües nuevos en cocina y baños
- Climatización por conductos y preinstalación de aerotermia
- Dos baños completos con ducha a ras de suelo
- Pavimento laminado AC5 y carpintería interior lacada
- Pintura, iluminación LED y limpieza final`,
    body: "",
    coverImagePath: IMG("reformas-integrales-viviendas"),
    isIllustrative: true,
    hasVerifiedBeforeAfter: false,
    order: 1,
    status: "published",
  },
  {
    slug: "proyecto-tipo-cocina-abierta",
    title: "Cocina abierta con isla",
    serviceSlug: "reformas-cocinas",
    sectorSlug: "viviendas",
    locality: "Igualada (ejemplo)",
    summary: "Ejemplo de alcance para abrir una cocina al salón con isla central, nueva instalación eléctrica y extracción.",
    scope: `- Derribo de tabique no estructural y refuerzo de dintel
- Circuitos eléctricos independientes para horno, placa y lavavajillas
- Toma de agua y desagüe en isla
- Campana extractora con salida a fachada
- Mobiliario a medida, encimera de porcelánico e iluminación bajo mueble`,
    body: "",
    coverImagePath: IMG("reformas-cocinas"),
    isIllustrative: true,
    hasVerifiedBeforeAfter: false,
    order: 2,
    status: "published",
  },
  {
    slug: "proyecto-tipo-bano-completo",
    title: "Baño completo con ducha a ras de suelo",
    serviceSlug: "reformas-banos",
    sectorSlug: "viviendas",
    locality: "Anoia (ejemplo)",
    summary: "Ejemplo de alcance para un baño de 5 m²: cambio de bañera por ducha, instalaciones nuevas y acabados de gran formato.",
    scope: `- Retirada de bañera y sanitarios antiguos
- Fontanería y desagües nuevos
- Plato de ducha a ras de suelo con mampara fija
- Porcelánico gran formato en paredes y suelo antideslizante
- Mueble suspendido, espejo retroiluminado y extracción`,
    body: "",
    coverImagePath: IMG("reformas-banos"),
    isIllustrative: true,
    hasVerifiedBeforeAfter: false,
    order: 3,
    status: "published",
  },
  {
    slug: "proyecto-tipo-local-comercial-120m2",
    title: "Adecuación de local comercial de 120 m²",
    serviceSlug: "reformas-locales-comerciales",
    sectorSlug: "locales-comerciales",
    locality: "Barcelona (ejemplo)",
    summary: "Ejemplo de alcance para adecuar un local en bruto como tienda: escaparate, instalaciones, climatización, aseo accesible y licencia de actividad.",
    scope: `- Solera, falso techo y tabiquería de almacén y aseo accesible
- Instalación eléctrica trifásica con boletín e iluminación comercial
- Climatización por conductos
- Escaparate, rótulo y cierre (coordinación)
- Documentación técnica para la licencia de actividad`,
    body: "",
    coverImagePath: IMG("reformas-locales-comerciales"),
    isIllustrative: true,
    hasVerifiedBeforeAfter: false,
    order: 4,
    status: "published",
  },
  {
    slug: "proyecto-tipo-gimnasio-400m2",
    title: "Gimnasio de 400 m² con vestuarios",
    serviceSlug: "reformas-gimnasios",
    sectorSlug: "gimnasios",
    locality: "Barcelona (ejemplo)",
    summary: "Ejemplo de alcance para un gimnasio con sala de peso libre, sala dirigida y vestuarios con ACS de alto caudal.",
    scope: `- Pavimento de caucho en zona de peso libre y vinilo técnico en salas
- Vestuarios con 8 duchas, acumulación de ACS y recirculación
- Ventilación con recuperación de calor dimensionada al aforo
- Climatización por conductos y electricidad para maquinaria
- Aislamiento acústico de techo y paredes medianeras`,
    body: "",
    coverImagePath: IMG("reformas-gimnasios"),
    isIllustrative: true,
    hasVerifiedBeforeAfter: false,
    order: 5,
    status: "published",
  },
  {
    slug: "proyecto-tipo-restaurante-150m2",
    title: "Restaurante de 150 m² con cocina abierta",
    serviceSlug: "reformas-restaurantes",
    sectorSlug: "restaurantes",
    locality: "Igualada (ejemplo)",
    summary: "Ejemplo de alcance para un restaurante: cocina profesional, extracción hasta cubierta, sala, barra y aseos.",
    scope: `- Cocina con suelo antideslizante, paredes lavables y zona de lavado
- Campana y conducto de extracción hasta cubierta con aportación de aire
- Instalación de gas por instalador habilitado y electricidad trifásica
- Sala, barra con cámaras e instalaciones, aseos accesibles
- Aislamiento acústico y documentación para la licencia`,
    body: "",
    coverImagePath: IMG("reformas-restaurantes"),
    isIllustrative: true,
    hasVerifiedBeforeAfter: false,
    order: 6,
    status: "published",
  },
];

export function getProjectContent(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
