/**
 * Genera los índices de contenido a partir de los ficheros escritos por el
 * equipo editorial (uno por artículo, servicio, sector, zona y texto legal).
 * Uso: node scripts/generate-content-index.mjs
 */
import { readdirSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const header = "// Fichero generado por scripts/generate-content-index.mjs — no editar a mano.\n";

function list(dir, ext = ".ts") {
  const full = path.join(root, "content", dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((f) => f.endsWith(ext) && f !== "index.ts")
    .sort();
}

function ident(file, i) {
  return `m${i}_${file.replace(/\.ts$/, "").replace(/[^a-zA-Z0-9]/g, "_")}`;
}

// Artículos
const articles = list("articles");
mkdirSync(path.join(root, "content", "articles"), { recursive: true });
writeFileSync(
  path.join(root, "content", "articles", "index.ts"),
  `${header}import type { ArticleContent } from "@/content/types";
${articles.map((f, i) => `import { article as ${ident(f, i)} } from "./${f.replace(/\.ts$/, "")}";`).join("\n")}

export const ARTICLES: ArticleContent[] = [${articles.map((f, i) => ident(f, i)).join(", ")}];
`,
);

// Cuerpos de servicios y sectores
for (const [dir, name] of [["service-bodies", "SERVICE_BODIES"], ["sector-bodies", "SECTOR_BODIES"]]) {
  const files = list(dir);
  mkdirSync(path.join(root, "content", dir), { recursive: true });
  const isSector = dir === "sector-bodies";
  writeFileSync(
    path.join(root, "content", dir, "index.ts"),
    `${header}${files.map((f, i) => `import * as ${ident(f, i)} from "./${f.replace(/\.ts$/, "")}";`).join("\n")}

export const ${name}: Record<string, { body: string${isSector ? "; faqs?: { question: string; answer: string }[]" : ""} }> = {
${files.map((f, i) => `  "${f.replace(/\.ts$/, "")}": ${ident(f, i)},`).join("\n")}
};
`,
  );
}

// Zonas
const zones = list("zones");
mkdirSync(path.join(root, "content", "zones"), { recursive: true });
writeFileSync(
  path.join(root, "content", "zones", "index.ts"),
  `${header}import type { LocalAreaContent } from "@/content/types";
${zones.map((f, i) => `import { zone as ${ident(f, i)} } from "./${f.replace(/\.ts$/, "")}";`).join("\n")}

const ALL_ZONES: LocalAreaContent[] = [${zones.map((f, i) => ident(f, i)).join(", ")}];

export const LOCAL_AREAS: LocalAreaContent[] = [...ALL_ZONES].sort((a, b) => a.order - b.order);
`,
);

// Legales
const legal = list("legal");
mkdirSync(path.join(root, "content", "legal"), { recursive: true });
writeFileSync(
  path.join(root, "content", "legal", "index.ts"),
  `${header}${legal.map((f, i) => `import * as ${ident(f, i)} from "./${f.replace(/\.ts$/, "")}";`).join("\n")}

export const LEGAL_DOCS: Record<string, { title: string; updatedAt: string; body: string }> = {
${legal.map((f, i) => `  "${f.replace(/\.ts$/, "")}": ${ident(f, i)},`).join("\n")}
};
`,
);

console.log(`índices generados: ${articles.length} artículos, ${list("service-bodies").length} servicios, ${list("sector-bodies").length} sectores, ${zones.length} zonas, ${legal.length} legales`);
