import { describe, expect, it } from "vitest";

import { ARTICLES } from "@/content/articles";
import { BLOG_CATEGORIES } from "@/content/blog";
import { PROJECTS } from "@/content/projects";
import { SECTORS, SECTOR_SLUGS } from "@/content/sectors";
import { SERVICES, SERVICE_SLUGS } from "@/content/services";
import { DEFAULT_SETTINGS } from "@/content/settings";
import { LOCAL_AREAS } from "@/content/zones";
import { CALCULATOR_IDS } from "@/lib/calculators/definitions";
import { extractToc } from "@/components/content/markdown";
import { LEGAL_PAGES, hasPendingPlaceholders, renderLegalBody } from "@/lib/legal";
import { splitMarkdownAtHeading } from "@/lib/markdown-split";
import { articleFormSchema, serviceFormSchema, zoneFormSchema } from "@/lib/validation/content";

const INTERNAL = /\]\((\/[^)\s#?]+)/g;
const KNOWN_PREFIXES = ["/presupuesto", "/contacto", "/proyectos", "/empresa", "/zonas", "/blog", "/servicios", "/sectores", "/calculadoras", "/aviso-legal", "/politica-privacidad", "/politica-cookies", "/terminos", "/privacidad/solicitud"];

function internalLinks(markdown: string): string[] {
  return [...markdown.matchAll(INTERNAL)].map((m) => m[1]);
}

function isKnownRoute(path: string): boolean {
  if (path.startsWith("/servicios/")) return SERVICE_SLUGS.includes(path.split("/")[2]);
  if (path.startsWith("/sectores/")) return SECTOR_SLUGS.includes(path.split("/")[2]);
  if (path.startsWith("/calculadoras/")) return (CALCULATOR_IDS as readonly string[]).includes(path.split("/")[2]);
  if (path.startsWith("/zonas/")) return LOCAL_AREAS.some((z) => z.slug === path.split("/")[2]);
  if (path.startsWith("/blog/categoria/")) return BLOG_CATEGORIES.some((c) => c.slug === path.split("/")[3]);
  if (path.startsWith("/blog/")) return ARTICLES.some((a) => a.slug === path.split("/")[2]);
  return KNOWN_PREFIXES.includes(path);
}

describe("contenido editorial", () => {
  it("hay 20 artículos, todos en borrador y válidos para el panel", () => {
    expect(ARTICLES).toHaveLength(20);
    for (const a of ARTICLES) {
      expect(a.status, a.slug).toBe("draft");
      expect(BLOG_CATEGORIES.some((c) => c.slug === a.categorySlug), `${a.slug}: categoría`).toBe(true);
      expect(a.excerpt.length, `${a.slug}: excerpt`).toBeGreaterThanOrEqual(120);
      expect(a.metaTitle.length, `${a.slug}: metaTitle`).toBeLessThanOrEqual(70);
      expect(a.faqs.length, `${a.slug}: faqs`).toBeGreaterThanOrEqual(3);
      expect(a.body).not.toMatch(/^# /m);
      expect(a.body).not.toContain("${");
      expect(extractToc(a.body).filter((t) => t.level === 2).length, `${a.slug}: H2`).toBeGreaterThanOrEqual(5);
      for (const s of a.relatedServiceSlugs) expect(SERVICE_SLUGS, `${a.slug}: servicio ${s}`).toContain(s);
      const parsed = articleFormSchema.safeParse({ ...a, authorId: "", publishedAt: a.publishedAt ?? "", reviewedAt: a.reviewedAt ?? "", canonicalUrl: "", coverImagePath: a.coverImagePath ?? "" });
      expect(parsed.success, `${a.slug}: ${JSON.stringify(parsed.success ? null : parsed.error.issues.slice(0, 2))}`).toBe(true);
    }
  });

  it("no inventa datos de la empresa ni usa rayas largas o placeholders", () => {
    const texts = [...ARTICLES.map((a) => a.body), ...SERVICES.map((s) => s.body), ...SECTORS.map((s) => s.body), ...LOCAL_AREAS.map((z) => z.body)];
    for (const t of texts) {
      expect(t).not.toContain("—");
      expect(t).not.toMatch(/lorem ipsum|coming soon/i);
      expect(t).not.toMatch(/\bTODO\b/);
      expect(t).not.toMatch(/nuestros \d+ años|más de \d+ (proyectos|clientes|obras)/i);
    }
  });

  it("todos los enlaces internos del contenido apuntan a rutas existentes", () => {
    const bodies = [
      ...ARTICLES.map((a) => [a.slug, a.body] as const),
      ...SERVICES.map((s) => [s.slug, s.body] as const),
      ...SECTORS.map((s) => [s.slug, s.body] as const),
      ...LOCAL_AREAS.map((z) => [z.slug, z.body] as const),
      ...Object.values(DEFAULT_SETTINGS.legalDocs).map((d) => [d.title, d.body] as const),
    ];
    const bad: string[] = [];
    for (const [name, body] of bodies) for (const link of internalLinks(body)) if (!isKnownRoute(link)) bad.push(`${name} → ${link}`);
    expect(bad).toEqual([]);
  });

  it("servicios, sectores, zonas y proyectos referencian slugs existentes y validan", () => {
    for (const s of SERVICES) expect(serviceFormSchema.safeParse({ ...s, licenseNote: s.licenseNote ?? "", imagePath: s.imagePath ?? "", metaTitle: s.metaTitle ?? "", metaDescription: s.metaDescription ?? "" }).success, s.slug).toBe(true);
    for (const s of SECTORS) for (const slug of s.serviceSlugs) expect(SERVICE_SLUGS, `${s.slug} → ${slug}`).toContain(slug);
    for (const z of LOCAL_AREAS) {
      for (const slug of z.serviceSlugs) expect(SERVICE_SLUGS, `${z.slug} → ${slug}`).toContain(slug);
      expect(zoneFormSchema.safeParse({ ...z, metaTitle: z.metaTitle ?? "", metaDescription: z.metaDescription ?? "" }).success, z.slug).toBe(true);
    }
    for (const p of PROJECTS) {
      expect(p.isIllustrative, `${p.slug} debe ser ilustrativo hasta tener fotos reales`).toBe(true);
      if (p.serviceSlug) expect(SERVICE_SLUGS).toContain(p.serviceSlug);
    }
    expect(new Set(SERVICE_SLUGS).size).toBe(SERVICE_SLUGS.length);
  });

  it("los textos legales sustituyen marcadores y detectan datos pendientes", () => {
    for (const page of LEGAL_PAGES) {
      const doc = DEFAULT_SETTINGS.legalDocs[page.key];
      expect(doc.body.length, page.key).toBeGreaterThan(500);
      const rendered = renderLegalBody(DEFAULT_SETTINGS, doc.body);
      expect(rendered).not.toMatch(/\{\{\s*(responsibleName|nif|address|email|registry|companyName|siteUrl)\s*\}\}/);
      expect(hasPendingPlaceholders(rendered)).toBe(true);
    }
    const custom = { ...DEFAULT_SETTINGS, legal: { ...DEFAULT_SETTINGS.legal, responsibleName: "Reformas Ejemplo SL", nif: "B00000000", address: "Calle Uno 1, Igualada", email: "hola@example.com", registry: "Registro Mercantil de Barcelona" } };
    expect(renderLegalBody(custom, "Responsable: {{responsibleName}} ({{nif}})")).toBe("Responsable: Reformas Ejemplo SL (B00000000)");
  });

  it("divide el markdown antes del tercer H2 para insertar el CTA", () => {
    const md = "Intro\n\n## Uno\n\na\n\n## Dos\n\nb\n\n## Tres\n\nc";
    const [a, b] = splitMarkdownAtHeading(md, 3);
    expect(a).toContain("## Dos");
    expect(b.startsWith("## Tres")).toBe(true);
    expect(splitMarkdownAtHeading("## Solo\n\nx", 3)).toEqual(["## Solo\n\nx", ""]);
  });
});
