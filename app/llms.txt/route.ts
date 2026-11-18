import { BLOG_CATEGORIES } from "@/content/blog";
import { SERVICE_GROUPS } from "@/content/services";
import { CALCULATORS } from "@/lib/calculators/definitions";
import { getArticles } from "@/lib/cms/articles";
import { getSectors, getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { getZones } from "@/lib/cms/zones";
import { formatPhone } from "@/lib/phone";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 300;

/**
 * /llms.txt: índice en Markdown pensado para asistentes y buscadores con IA
 * (ChatGPT, Claude, Perplexity…). Describe la empresa en una frase, enlaza las
 * páginas clave con una línea de contexto y se regenera con el contenido.
 */
export async function GET() {
  const [s, services, sectors, zones, articles] = await Promise.all([getSettings(), getServices(), getSectors(), getZones(), getArticles()]);
  const c = s.company;
  const line = (path: string, title: string, note?: string) => `- [${title}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;
  const contact = [c.phone ? `Teléfono y WhatsApp ${formatPhone(c.phone)}` : "", c.email ? `email ${c.email}` : "", c.address ? `oficina en ${c.address}, ${c.city}` : c.city ? `oficina en ${c.city}` : "", c.hours ? `horario ${c.hours.toLowerCase()}` : ""].filter(Boolean).join(", ");
  const zoneNames = zones.filter((z) => !["cataluna", "espana"].includes(z.slug)).map((z) => z.name);

  const out = [
    `# ${c.name}`,
    "",
    `> ${c.legalName || c.name} es una empresa de reformas integrales e instalaciones para viviendas y negocios con oficina en ${c.city || "L'Hospitalet de Llobregat"} (Barcelona). Trabaja en toda España y, sobre todo, en toda Cataluña: ${zoneNames.join(", ")}. Reforma pisos, casas, locales comerciales, oficinas, gimnasios, restaurantes, clínicas y naves, y coordina las instalaciones (electricidad, fontanería, climatización, aerotermia, gas, ventilación, protección contra incendios), que ejecutan y certifican profesionales habilitados. Presupuesto por partidas sin compromiso, con visita previa.`,
    "",
    `Contacto: ${contact}.`,
    "",
    "Datos clave: precios orientativos sin IVA (reforma integral de piso entre 450 y 1.300 euros por metro cuadrado según calidades; baño completo desde 4.500 euros; cocina desde 5.000 euros), un único responsable de obra, presupuesto cerrado por partidas, calendario por fases y gestión de licencias y comunicaciones previas con el ayuntamiento.",
    "",
    "## Páginas principales",
    line("/", "Inicio", "qué hacemos y cómo trabajamos"),
    line("/presupuesto", "Pedir presupuesto", "formulario de solicitud de presupuesto sin compromiso"),
    line("/empresa", "Empresa", "quiénes somos, compromisos y zonas"),
    line("/contacto", "Contacto", "teléfono, WhatsApp, email y oficina"),
    line("/calculadoras", "Calculadoras de precios", "estimaciones orientativas por tipo de reforma"),
    "",
    "## Servicios",
    ...SERVICE_GROUPS.flatMap((g) => [`### ${g.name}`, ...services.filter((x) => x.groupSlug === g.slug).map((x) => line(`/servicios/${x.slug}`, x.name, x.summary))]),
    "",
    "## Sectores",
    ...sectors.map((x) => line(`/sectores/${x.slug}`, x.name, x.summary)),
    "",
    "## Zonas de actuación (una página por municipio)",
    ...zones.map((z) => line(`/zonas/${z.slug}`, z.name, z.summary)),
    "",
    "## Calculadoras",
    ...CALCULATORS.map((k) => line(`/calculadoras/${k.id}`, k.name, k.description)),
    "",
    "## Blog (guías de precios, permisos y reformas)",
    ...BLOG_CATEGORIES.filter((cat) => articles.some((a) => a.categorySlug === cat.slug)).flatMap((cat) => [`### ${cat.name}`, ...articles.filter((a) => a.categorySlug === cat.slug).map((a) => line(`/blog/${a.slug}`, a.title, a.excerpt))]),
    "",
    "## Legal",
    line("/aviso-legal", "Aviso legal"),
    line("/politica-privacidad", "Política de privacidad"),
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
  ].join("\n");

  return new Response(out, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=300, s-maxage=300" } });
}
