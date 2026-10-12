/**
 * Exporta páginas del sitio ya construido (next start) como HTML estático
 * autocontenido para revisión: CSS y fuentes inline, imágenes copiadas,
 * scripts eliminados y enlaces internos reescritos entre las páginas exportadas.
 *
 * Uso: node scripts/export-preview.mjs <baseUrl> <outDir> ruta1 ruta2 …
 * Ej.:  node scripts/export-preview.mjs http://localhost:3000 ./preview / /presupuesto /contacto
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const [base, outDir, ...routes] = process.argv.slice(2);
if (!base || !outDir || routes.length === 0) {
  console.error("Uso: node scripts/export-preview.mjs <baseUrl> <outDir> ruta1 ruta2 …");
  process.exit(1);
}
mkdirSync(path.join(outDir, "images"), { recursive: true });

const fileFor = (route) => (route === "/" ? "index.html" : `${route.replace(/^\//, "").replace(/\//g, "_")}.html`);
const exported = new Map(routes.map((r) => [r, fileFor(r)]));

const cssCache = new Map();
async function inlineCss(href) {
  if (!cssCache.has(href)) {
    const res = await fetch(new URL(href, base));
    let css = await res.text();
    // Fuentes locales → data URI (los artefactos solo cargan hojas de estilo externas desde Google Fonts).
    const fontRefs = [...css.matchAll(/url\((["']?)(\/_next\/static\/media\/[^)"']+\.woff2)\1\)/g)];
    for (const m of fontRefs) {
      const fontRes = await fetch(new URL(m[2], base));
      const buf = Buffer.from(await fontRes.arrayBuffer());
      css = css.split(m[0]).join(`url(data:font/woff2;base64,${buf.toString("base64")})`);
    }
    cssCache.set(href, css);
  }
  return cssCache.get(href);
}

const copiedImages = new Set();
function localImage(src) {
  // /_next/image?url=%2Fimages%2Fx.webp&w=… → images/x.webp ; /images/x.webp → images/x.webp
  let p = src;
  const m = /^\/_next\/image\?url=([^&]+)/.exec(src);
  if (m) p = decodeURIComponent(m[1]);
  if (!p.startsWith("/images/")) return null;
  const rel = p.replace(/^\/images\//, "");
  const from = path.join(process.cwd(), "public", "images", rel);
  const to = path.join(outDir, "images", rel);
  if (!copiedImages.has(rel) && existsSync(from)) {
    mkdirSync(path.dirname(to), { recursive: true });
    copyFileSync(from, to);
    copiedImages.add(rel);
  }
  return `images/${rel}`;
}

const NOTE = `<div style="position:sticky;top:0;z-index:100;background:#17191d;color:#fff;font:600 12px/1.4 system-ui,sans-serif;letter-spacing:.04em;text-align:center;padding:8px 12px">VISTA PREVIA ESTÁTICA PARA REVISIÓN · los formularios y el menú móvil no son funcionales en esta copia · las imágenes son ilustrativas</div>`;

for (const route of routes) {
  const res = await fetch(new URL(route, base));
  let html = await res.text();

  // CSS inline
  const links = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g)];
  let styles = "";
  for (const l of links) {
    styles += `<style>${await inlineCss(l[1])}</style>\n`;
    html = html.replace(l[0], "");
  }
  // Otros <link> de Next (preload, modulepreload) y scripts
  html = html.replace(/<link[^>]+(preload|modulepreload|prefetch)[^>]*>/g, "");
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>/g, "");

  // Imágenes: quitar srcset/sizes de next/image y apuntar a la copia local
  html = html.replace(/<img\b([^>]*)>/g, (tag, attrs) => {
    let a = attrs.replace(/\s(srcset|sizes)="[^"]*"/g, "");
    a = a.replace(/\ssrc="([^"]+)"/, (m, src) => {
      const local = localImage(src);
      return local ? ` src="${local}"` : m;
    });
    return `<img${a}>`;
  });

  // Enlaces internos: a páginas exportadas → fichero; resto → ancla con aviso
  html = html.replace(/\shref="(\/[^"#?]*)([#?][^"]*)?"/g, (m, p, rest = "") => {
    if (exported.has(p)) return ` href="${exported.get(p)}${rest.startsWith("#") ? rest : ""}"`;
    if (p.startsWith("/images/")) return m;
    return ` href="#" data-pendiente="${p}" title="Página pendiente de exportar: ${p}"`;
  });

  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "Vista previa";
  const bodyMatch = /<body[^>]*>([\s\S]*)<\/body>/.exec(html);
  const bodyClass = /<body[^>]*class="([^"]*)"/.exec(html)?.[1] ?? "";
  const htmlClass = /<html[^>]*class="([^"]*)"/.exec(html)?.[1] ?? "";
  const body = bodyMatch ? bodyMatch[1] : html;

  const guard = `<script>document.addEventListener('submit',e=>{e.preventDefault();alert('Formulario de muestra: en la web real envía la solicitud al CRM.');});document.addEventListener('click',e=>{const a=e.target.closest('a[data-pendiente]');if(a){e.preventDefault();}});</script>`;

  const out = `<!doctype html>
<html lang="es" class="${htmlClass}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
${styles}
<style>html{background:#faf8f5} [data-reveal],[style*="opacity:0;transform:translateY"]{opacity:1!important;transform:none!important}</style>
</head>
<body class="${bodyClass}">
${NOTE}
${body}
${guard}
</body>
</html>`;
  writeFileSync(path.join(outDir, fileFor(route)), out);
  console.log("exportado", route, "→", fileFor(route), `${Math.round(out.length / 1024)} KB`);
}
console.log("imágenes copiadas:", copiedImages.size);
