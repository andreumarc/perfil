/**
 * Rastrea el sitio (desde el sitemap y los enlaces internos) y comprueba que
 * ninguna página ni CTA devuelve 404/500. Uso: BASE_URL=http://localhost:3100 npm run check:links
 */
const base = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/+$/, "");
const MAX_PAGES = Number(process.env.MAX_PAGES ?? 400);

async function fetchText(url: string): Promise<{ status: number; text: string }> {
  const res = await fetch(url, { redirect: "manual", headers: { "user-agent": "check-links" } });
  return { status: res.status, text: res.ok ? await res.text() : "" };
}

function extractLinks(html: string): string[] {
  const out = new Set<string>();
  for (const m of html.matchAll(/href="([^"#?]+)(?:[?#][^"]*)?"/g)) {
    const href = m[1];
    if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next") && !href.startsWith("/api/") && !href.startsWith("/admin")) out.add(href);
  }
  return [...out];
}

async function main() {
  const queue: string[] = ["/"];
  const seen = new Set<string>();
  const broken: { url: string; status: number; from: string }[] = [];
  const sitemap = await fetchText(`${base}/sitemap.xml`);
  if (sitemap.status !== 200) broken.push({ url: "/sitemap.xml", status: sitemap.status, from: "-" });
  for (const m of sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      queue.push(new URL(m[1]).pathname);
    } catch {
      /* ignore */
    }
  }
  const from = new Map<string, string>();
  while (queue.length && seen.size < MAX_PAGES) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const { status, text } = await fetchText(`${base}${path}`);
    if (status >= 400) broken.push({ url: path, status, from: from.get(path) ?? "sitemap" });
    for (const link of extractLinks(text)) {
      if (!seen.has(link)) {
        if (!from.has(link)) from.set(link, path);
        queue.push(link);
      }
    }
  }
  console.log(`Comprobadas ${seen.size} rutas.`);
  if (broken.length) {
    console.error("Enlaces rotos:");
    for (const b of broken) console.error(`  ${b.status} ${b.url} (desde ${b.from})`);
    process.exit(1);
  }
  console.log("Sin enlaces rotos.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
