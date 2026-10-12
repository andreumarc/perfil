import type { AuthorContent, BlogCategoryContent } from "./types";

export const BLOG_CATEGORIES: BlogCategoryContent[] = [
  { slug: "reformas-viviendas", name: "Reformas de viviendas", description: "Pisos, casas y rehabilitaciones: cómo planificar, qué incluye y qué esperar.", order: 1 },
  { slug: "reformas-comerciales", name: "Reformas comerciales", description: "Locales, oficinas y negocios: adecuación, imagen y apertura a tiempo.", order: 2 },
  { slug: "instalaciones", name: "Instalaciones", description: "Electricidad, fontanería, telecomunicaciones y oficios.", order: 3 },
  { slug: "climatizacion", name: "Climatización", description: "Aire acondicionado, calefacción, aerotermia y ventilación.", order: 4 },
  { slug: "banos-cocinas", name: "Baños y cocinas", description: "Las dos reformas más frecuentes, explicadas partida a partida.", order: 5 },
  { slug: "gimnasios", name: "Gimnasios", description: "Pavimentos, vestuarios, ventilación y electricidad para centros deportivos.", order: 6 },
  { slug: "restaurantes", name: "Restaurantes", description: "Cocina, extracción, gas, sala y normativa de hostelería.", order: 7 },
  { slug: "clinicas", name: "Clínicas", description: "Clínicas dentales y centros médicos: distribución, instalaciones y autorización.", order: 8 },
  { slug: "normativa", name: "Normativa", description: "CTE, RITE, REBT y lo que exigen a tu reforma.", order: 9 },
  { slug: "costes", name: "Costes", description: "Precios orientativos, partidas y cómo leer un presupuesto.", order: 10 },
  { slug: "eficiencia-energetica", name: "Eficiencia energética", description: "Aislamiento, ventanas, climatización eficiente y ayudas.", order: 11 },
  { slug: "licencias", name: "Licencias", description: "Permisos de obra y de actividad: cuándo hacen falta y cómo se tramitan.", order: 12 },
  { slug: "mantenimiento", name: "Mantenimiento", description: "Cuidar instalaciones y acabados para que duren.", order: 13 },
];

export const AUTHORS: AuthorContent[] = [
  {
    slug: "equipo-tecnico",
    name: "Equipo técnico",
    role: "Redacción técnica del equipo de obra e instalaciones",
    bio: "Artículos redactados por el equipo técnico de la empresa a partir de la práctica diaria en reformas e instalaciones. Se revisan periódicamente; la fecha de revisión aparece en cada artículo.",
  },
];

export function getCategory(slug: string) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

/**
 * Plan editorial: títulos adicionales con intención de búsqueda (no son páginas).
 * Visible en el panel como lista de temas pendientes.
 */
export const EDITORIAL_PLAN: { title: string; keyword: string; categorySlug: string }[] = [
  { title: "Reforma de un piso para alquilar: qué merece la pena y qué no", keyword: "reformar piso para alquilar", categorySlug: "reformas-viviendas" },
  { title: "Cambiar bañera por ducha: precio, plazos y opciones", keyword: "cambiar bañera por ducha precio", categorySlug: "banos-cocinas" },
  { title: "Cuánto cuesta pintar un piso: precio por m² y por estancias", keyword: "cuánto cuesta pintar un piso", categorySlug: "costes" },
  { title: "Tabiques de pladur: precio por m², tipos y cuándo usarlos", keyword: "precio pladur m2", categorySlug: "instalaciones" },
  { title: "Suelo laminado, vinilo o porcelánico: cuál elegir para tu reforma", keyword: "qué suelo poner en una reforma", categorySlug: "reformas-viviendas" },
  { title: "Licencia de actividad para un local: pasos, documentación y plazos", keyword: "licencia de actividad local", categorySlug: "licencias" },
  { title: "Reformar una peluquería o centro de estética: instalaciones y presupuesto", keyword: "reforma peluquería precio", categorySlug: "reformas-comerciales" },
  { title: "Reforma de una nave industrial: oficinas, instalaciones y PCI", keyword: "reforma nave industrial", categorySlug: "reformas-comerciales" },
  { title: "Mantenimiento del aire acondicionado: qué revisar y cada cuánto", keyword: "mantenimiento aire acondicionado", categorySlug: "mantenimiento" },
  { title: "Humedades en casa: tipos, causas y cómo se reparan", keyword: "reparar humedades", categorySlug: "mantenimiento" },
];
