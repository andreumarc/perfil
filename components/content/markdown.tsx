import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { slugify } from "@/lib/utils";

/** Texto plano de un nodo React (para ids de encabezados). */
export function nodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

const components: Components = {
  h2: ({ children }) => {
    const text = nodeText(children);
    return (
      <h2 id={slugify(text)} className="scroll-mt-28">
        {children}
      </h2>
    );
  },
  h3: ({ children }) => {
    const text = nodeText(children);
    return (
      <h3 id={slugify(text)} className="scroll-mt-28">
        {children}
      </h3>
    );
  },
  a: ({ href, children }) => {
    const url = href ?? "#";
    if (url.startsWith("/")) return <Link href={url}>{children}</Link>;
    const external = /^https?:\/\//.test(url);
    return (
      <a href={url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-md border border-gray-200">
      <table className="my-0! min-w-full">{children}</table>
    </div>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" decoding="async" className="h-auto w-full" />
  ),
};

/**
 * Render seguro de Markdown (GFM: tablas, listas de tareas). react-markdown no
 * interpreta HTML crudo, así que el contenido del panel no puede inyectar scripts.
 */
export function Markdown({ content, className = "prose-site" }: { content: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Extrae H2/H3 del markdown para construir el índice navegable. */
export function extractToc(markdown: string): TocEntry[] {
  const out: TocEntry[] = [];
  let inCode = false;
  for (const line of markdown.split("\n")) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const text = m[2].replace(/[*_`[\]]/g, "").replace(/\(.*?\)/g, "").trim();
    out.push({ id: slugify(text), text, level: m[1].length === 2 ? 2 : 3 });
  }
  return out;
}
