/** Utilidades puras de IndexNow (sin dependencias de servidor, para poder probarlas). */

/** Límite de URLs por petición según el protocolo. */
export const INDEXNOW_MAX_URLS = 10_000;

/** Deja solo URLs absolutas http(s) del dominio indicado, sin duplicados y dentro del límite. */
export function filterIndexNowUrls(urls: string[], host: string): string[] {
  const seen = new Set<string>();
  for (const raw of urls) {
    try {
      const url = new URL(raw);
      if (url.host === host && (url.protocol === "https:" || url.protocol === "http:")) seen.add(url.toString());
    } catch {
      /* no es una URL absoluta */
    }
  }
  return [...seen].slice(0, INDEXNOW_MAX_URLS);
}

/** Los dominios locales o de desarrollo no se envían a los buscadores. */
export function isIndexNowHost(host: string): boolean {
  if (!host) return false;
  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:\d+)?$/i.test(host)) return false;
  return !host.endsWith(".local") && !host.endsWith(".test");
}

/** Extrae las URLs de un sitemap XML (etiquetas loc). */
export function parseSitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}
