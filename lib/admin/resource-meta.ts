import type { ResourceKey } from "@/lib/validation/content";

/**
 * Descripción declarativa (serializable) de cada recurso editable: campos del
 * formulario, columnas del listado y rutas. La usan las páginas y el
 * formulario genérico del panel; la parte de base de datos vive en resources.ts.
 */

export type FieldKind = "text" | "slug" | "textarea" | "markdown" | "number" | "boolean" | "select" | "list" | "steps" | "faqs" | "sources" | "image" | "date" | "datetime";

export type OptionSource = "services" | "sectors" | "categories" | "authors" | "groups" | "status" | "formVariants" | "faqScopes";

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  hint?: string;
  placeholder?: string;
  /** Opciones fijas o nombre de un conjunto resuelto por el servidor. */
  options?: { value: string; label: string }[] | OptionSource;
  /** Para selects opcionales: permite "sin valor". */
  optional?: boolean;
  width?: "full" | "half";
  section: string;
}

export interface ResourceMeta {
  key: ResourceKey;
  /** Segmento de ruta en el panel: /admin/<path>. */
  path: string;
  singular: string;
  plural: string;
  description: string;
  titleField: string;
  slugField?: string;
  /** Prefijo público para "Ver en el sitio" (se concatena el slug). */
  publicPrefix?: string;
  hasStatus: boolean;
  listColumns: { name: string; label: string }[];
  fields: FieldDef[];
  /** Recursos auxiliares enlazados desde el listado (p. ej. categorías y autores del blog). */
  related?: { label: string; path: string }[];
}

const seo = (section = "SEO"): FieldDef[] => [
  { name: "metaTitle", label: "Meta título", kind: "text", hint: "Hasta 60 caracteres recomendados. Vacío = título por defecto.", width: "half", section },
  { name: "metaDescription", label: "Meta descripción", kind: "textarea", hint: "120-155 caracteres recomendados.", width: "half", section },
];

const statusField = (section = "Publicación"): FieldDef => ({ name: "status", label: "Estado", kind: "select", options: "status", width: "half", section });
const orderField = (section = "Publicación"): FieldDef => ({ name: "order", label: "Orden", kind: "number", hint: "Menor número = aparece antes.", width: "half", section });

export const RESOURCES: Record<ResourceKey, ResourceMeta> = {
  services: {
    key: "services",
    path: "servicios",
    singular: "Servicio",
    plural: "Servicios",
    description: "Fichas de servicio: textos, características, proceso y SEO. Las FAQs de cada servicio se gestionan en FAQs (ámbito servicio).",
    titleField: "name",
    slugField: "slug",
    publicPrefix: "/servicios/",
    hasStatus: true,
    listColumns: [
      { name: "name", label: "Servicio" },
      { name: "groupSlug", label: "Grupo" },
      { name: "slug", label: "Slug" },
    ],
    fields: [
      { name: "name", label: "Nombre", kind: "text", width: "half", section: "Datos básicos" },
      { name: "shortName", label: "Nombre corto", kind: "text", hint: "Para tarjetas y menús.", width: "half", section: "Datos básicos" },
      { name: "slug", label: "Slug (URL)", kind: "slug", width: "half", section: "Datos básicos" },
      { name: "groupSlug", label: "Grupo", kind: "select", options: "groups", width: "half", section: "Datos básicos" },
      { name: "headline", label: "Titular", kind: "text", section: "Datos básicos" },
      { name: "summary", label: "Resumen", kind: "textarea", section: "Datos básicos" },
      { name: "imagePath", label: "Imagen", kind: "image", section: "Datos básicos" },
      { name: "features", label: "Qué incluye", kind: "list", hint: "Una línea por elemento.", width: "half", section: "Contenido" },
      { name: "forWhom", label: "Para quién", kind: "list", hint: "Una línea por elemento.", width: "half", section: "Contenido" },
      { name: "process", label: "Proceso (pasos)", kind: "steps", section: "Contenido" },
      { name: "body", label: "Cuerpo (Markdown)", kind: "markdown", section: "Contenido" },
      { name: "requiresLicensedPro", label: "Requiere profesional habilitado (muestra el aviso)", kind: "boolean", section: "Habilitaciones" },
      { name: "licenseNote", label: "Texto del aviso", kind: "textarea", hint: "Vacío = texto genérico.", section: "Habilitaciones" },
      statusField(),
      orderField(),
      ...seo(),
    ],
  },
  sectors: {
    key: "sectors",
    path: "sectores",
    singular: "Sector",
    plural: "Sectores",
    description: "Páginas por tipo de espacio o negocio. Sus FAQs se gestionan en FAQs (ámbito sector).",
    titleField: "name",
    slugField: "slug",
    publicPrefix: "/sectores/",
    hasStatus: true,
    listColumns: [
      { name: "name", label: "Sector" },
      { name: "slug", label: "Slug" },
    ],
    fields: [
      { name: "name", label: "Nombre", kind: "text", width: "half", section: "Datos básicos" },
      { name: "slug", label: "Slug (URL)", kind: "slug", width: "half", section: "Datos básicos" },
      { name: "headline", label: "Titular", kind: "text", section: "Datos básicos" },
      { name: "summary", label: "Resumen", kind: "textarea", section: "Datos básicos" },
      { name: "imagePath", label: "Imagen", kind: "image", section: "Datos básicos" },
      { name: "serviceSlugs", label: "Servicios relacionados (slugs)", kind: "list", hint: "Un slug por línea, en orden de importancia.", section: "Contenido" },
      { name: "body", label: "Cuerpo (Markdown)", kind: "markdown", section: "Contenido" },
      statusField(),
      orderField(),
      ...seo(),
    ],
  },
  projects: {
    key: "projects",
    path: "proyectos",
    singular: "Proyecto",
    plural: "Proyectos",
    description: "Proyectos tipo (ilustrativos) y proyectos reales. Marca como ilustrativo todo lo que no sea una obra ejecutada con fotos propias.",
    titleField: "title",
    slugField: "slug",
    publicPrefix: "/proyectos/",
    hasStatus: true,
    listColumns: [
      { name: "title", label: "Proyecto" },
      { name: "serviceSlug", label: "Servicio" },
      { name: "locality", label: "Localidad" },
    ],
    fields: [
      { name: "title", label: "Título", kind: "text", width: "half", section: "Datos básicos" },
      { name: "slug", label: "Slug (URL)", kind: "slug", width: "half", section: "Datos básicos" },
      { name: "serviceSlug", label: "Servicio", kind: "select", options: "services", optional: true, width: "half", section: "Datos básicos" },
      { name: "sectorSlug", label: "Sector", kind: "select", options: "sectors", optional: true, width: "half", section: "Datos básicos" },
      { name: "locality", label: "Localidad", kind: "text", hint: "Municipio o comarca; sin direcciones exactas.", width: "half", section: "Datos básicos" },
      { name: "coverImagePath", label: "Imagen de portada", kind: "image", width: "half", section: "Datos básicos" },
      { name: "summary", label: "Resumen", kind: "textarea", section: "Datos básicos" },
      { name: "scope", label: "Alcance (Markdown, lista de partidas)", kind: "markdown", section: "Contenido" },
      { name: "body", label: "Descripción (Markdown)", kind: "markdown", section: "Contenido" },
      { name: "isIllustrative", label: "Proyecto tipo con imágenes ilustrativas (no es obra ejecutada)", kind: "boolean", section: "Veracidad" },
      { name: "hasVerifiedBeforeAfter", label: "Tiene fotos reales de antes y después verificadas", kind: "boolean", section: "Veracidad" },
      statusField(),
      orderField(),
      ...seo(),
    ],
  },
  articles: {
    key: "articles",
    path: "blog",
    singular: "Artículo",
    plural: "Blog",
    description: "Artículos del blog: borradores, publicación programada, SEO, FAQs y fuentes. Las solicitudes generadas por cada artículo se muestran en el listado.",
    titleField: "title",
    slugField: "slug",
    publicPrefix: "/blog/",
    hasStatus: true,
    listColumns: [
      { name: "title", label: "Artículo" },
      { name: "categorySlug", label: "Categoría" },
      { name: "publishedAt", label: "Publicación" },
    ],
    related: [
      { label: "Categorías", path: "/admin/categorias" },
      { label: "Autores", path: "/admin/autores" },
    ],
    fields: [
      { name: "title", label: "Título (H1)", kind: "text", section: "Datos básicos" },
      { name: "slug", label: "Slug (URL)", kind: "slug", width: "half", section: "Datos básicos" },
      { name: "categorySlug", label: "Categoría", kind: "select", options: "categories", width: "half", section: "Datos básicos" },
      { name: "excerpt", label: "Entradilla", kind: "textarea", hint: "140-200 caracteres. Se usa en tarjetas y RSS.", section: "Datos básicos" },
      { name: "coverImagePath", label: "Imagen de cabecera", kind: "image", width: "half", section: "Datos básicos" },
      { name: "authorId", label: "Autor", kind: "select", options: "authors", optional: true, width: "half", section: "Datos básicos" },
      { name: "body", label: "Cuerpo (Markdown, sin H1; el índice se genera de los H2/H3)", kind: "markdown", section: "Contenido" },
      { name: "faqs", label: "Preguntas frecuentes", kind: "faqs", section: "Contenido" },
      { name: "sources", label: "Fuentes", kind: "sources", section: "Contenido" },
      { name: "formVariant", label: "Formulario contextual al final", kind: "select", options: "formVariants", width: "half", section: "Captación" },
      { name: "relatedServiceSlugs", label: "Servicios relacionados (slugs)", kind: "list", hint: "Un slug por línea. El primero se preselecciona en el formulario.", width: "half", section: "Captación" },
      statusField(),
      { name: "publishedAt", label: "Fecha de publicación", kind: "datetime", hint: "Con estado Publicado y fecha futura, el artículo se publica automáticamente en esa fecha.", width: "half", section: "Publicación" },
      { name: "reviewedAt", label: "Última revisión", kind: "date", width: "half", section: "Publicación" },
      { name: "readingMinutes", label: "Minutos de lectura", kind: "number", width: "half", section: "Publicación" },
      { name: "keywordPrimary", label: "Keyword principal", kind: "text", width: "half", section: "SEO" },
      { name: "keywordsSecondary", label: "Keywords secundarias", kind: "list", hint: "Una por línea.", width: "half", section: "SEO" },
      { name: "tags", label: "Etiquetas", kind: "list", hint: "Una por línea.", width: "half", section: "SEO" },
      { name: "canonicalUrl", label: "URL canónica (si se publicó antes en otro sitio)", kind: "text", section: "SEO" },
      ...seo(),
    ],
  },
  faqs: {
    key: "faqs",
    path: "faqs",
    singular: "FAQ",
    plural: "FAQs",
    description: "Preguntas frecuentes de la home (global), de cada servicio, sector o zona. Se publican con datos estructurados FAQPage.",
    titleField: "question",
    hasStatus: false,
    listColumns: [
      { name: "question", label: "Pregunta" },
      { name: "scope", label: "Ámbito" },
      { name: "scopeSlug", label: "Slug" },
    ],
    fields: [
      { name: "question", label: "Pregunta", kind: "text", section: "Contenido" },
      { name: "answer", label: "Respuesta", kind: "textarea", section: "Contenido" },
      { name: "scope", label: "Ámbito", kind: "select", options: "faqScopes", width: "half", section: "Ubicación" },
      { name: "scopeSlug", label: "Slug del servicio, sector o zona", kind: "text", hint: "Vacío para FAQs globales.", width: "half", section: "Ubicación" },
      orderField("Ubicación"),
    ],
  },
  zones: {
    key: "zones",
    path: "zonas",
    singular: "Zona",
    plural: "Zonas",
    description: "Páginas de zona de actuación (SEO local). Sus FAQs se gestionan en FAQs (ámbito zona).",
    titleField: "name",
    slugField: "slug",
    publicPrefix: "/zonas/",
    hasStatus: true,
    listColumns: [
      { name: "name", label: "Zona" },
      { name: "province", label: "Provincia" },
      { name: "slug", label: "Slug" },
    ],
    fields: [
      { name: "name", label: "Nombre", kind: "text", width: "half", section: "Datos básicos" },
      { name: "slug", label: "Slug (URL)", kind: "slug", width: "half", section: "Datos básicos" },
      { name: "province", label: "Provincia o ámbito", kind: "text", width: "half", section: "Datos básicos" },
      { name: "headline", label: "Titular", kind: "text", section: "Datos básicos" },
      { name: "summary", label: "Resumen", kind: "textarea", section: "Datos básicos" },
      { name: "serviceSlugs", label: "Servicios destacados (slugs)", kind: "list", hint: "Un slug por línea.", section: "Contenido" },
      { name: "body", label: "Cuerpo (Markdown)", kind: "markdown", section: "Contenido" },
      statusField(),
      orderField(),
      ...seo(),
    ],
  },
  categories: {
    key: "categories",
    path: "categorias",
    singular: "Categoría",
    plural: "Categorías del blog",
    description: "Categorías del blog. Cambiar un slug rompe las URLs antiguas de la categoría.",
    titleField: "name",
    slugField: "slug",
    publicPrefix: "/blog/categoria/",
    hasStatus: false,
    listColumns: [
      { name: "name", label: "Categoría" },
      { name: "slug", label: "Slug" },
      { name: "order", label: "Orden" },
    ],
    fields: [
      { name: "name", label: "Nombre", kind: "text", width: "half", section: "Datos" },
      { name: "slug", label: "Slug", kind: "slug", width: "half", section: "Datos" },
      { name: "description", label: "Descripción", kind: "textarea", section: "Datos" },
      orderField("Datos"),
    ],
  },
  authors: {
    key: "authors",
    path: "autores",
    singular: "Autor",
    plural: "Autores",
    description: "Autores del blog. Solo personas reales del equipo o un autor colectivo (Equipo técnico).",
    titleField: "name",
    slugField: "slug",
    hasStatus: false,
    listColumns: [
      { name: "name", label: "Autor" },
      { name: "role", label: "Cargo" },
      { name: "isActive", label: "Activo" },
    ],
    fields: [
      { name: "name", label: "Nombre", kind: "text", width: "half", section: "Datos" },
      { name: "slug", label: "Slug", kind: "slug", width: "half", section: "Datos" },
      { name: "role", label: "Cargo o rol", kind: "text", section: "Datos" },
      { name: "bio", label: "Biografía breve", kind: "textarea", section: "Datos" },
      { name: "avatarPath", label: "Foto (opcional)", kind: "image", section: "Datos" },
      { name: "isActive", label: "Activo", kind: "boolean", section: "Datos" },
    ],
  },
};

export function resourceByPath(path: string): ResourceMeta | undefined {
  return Object.values(RESOURCES).find((r) => r.path === path);
}

/** Valores por defecto del formulario a partir de la definición de campos. */
export function emptyValues(meta: ResourceMeta): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of meta.fields) {
    if (f.kind === "boolean") out[f.name] = f.name === "isIllustrative" || f.name === "isActive";
    else if (f.kind === "number") out[f.name] = f.name === "readingMinutes" ? 5 : 0;
    else if (f.kind === "list" || f.kind === "steps" || f.kind === "faqs" || f.kind === "sources") out[f.name] = [];
    else if (f.kind === "select" && f.name === "status") out[f.name] = "draft";
    else if (f.kind === "select" && f.name === "formVariant") out[f.name] = "general";
    else if (f.kind === "select" && f.name === "scope") out[f.name] = "global";
    else if (f.kind === "select" && f.name === "groupSlug") out[f.name] = "viviendas";
    else out[f.name] = "";
  }
  return out;
}
