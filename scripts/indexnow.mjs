/**
 * Envía todas las URLs del sitemap publicado a IndexNow (Bing, Yandex, Seznam, Naver…).
 * Uso: SITE_URL=https://reformasmardari.com node scripts/indexnow.mjs
 * Lo ejecuta la CI tras cada despliegue; también sirve a mano.
 */
import { readdirSync } from "node:fs";

const site = (process.env.SITE_URL ?? "").trim().replace(/\/$/, "");
if (!site) {
  console.error("Falta SITE_URL (p. ej. https://reformasmardari.com).");
  process.exit(1);
}

const key = readdirSync(new URL("../public/", import.meta.url))
  .find((name) => /^[a-f0-9]{32}\.txt$/.test(name))
  ?.replace(/\.txt$/, "");
if (!key) {
  console.error("No hay fichero de clave IndexNow en public/ (<clave>.txt).");
  process.exit(1);
}

const sitemapRes = await fetch(`${site}/sitemap.xml`, { headers: { "User-Agent": "reformas-indexnow/1.0" } });
if (!sitemapRes.ok) {
  console.error(`No se pudo leer ${site}/sitemap.xml (HTTP ${sitemapRes.status}).`);
  process.exit(1);
}
const urls = [...(await sitemapRes.text()).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
if (!urls.length) {
  console.error("El sitemap no contiene URLs.");
  process.exit(1);
}

// El dominio canónico es el de las URLs del sitemap (puede diferir de SITE_URL mientras se cambia de dominio).
const host = new URL(urls[0]).host;
const list = [...new Set(urls.filter((u) => new URL(u).host === host))].slice(0, 10_000);
const keyLocation = `https://${host}/${key}.txt`;

const keyRes = await fetch(keyLocation);
if (!keyRes.ok || (await keyRes.text()).trim() !== key) {
  console.error(`La clave no se sirve en ${keyLocation} (HTTP ${keyRes.status}). ¿Está desplegada la última versión?`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: list }),
});
console.log(`IndexNow: ${list.length} URLs de ${host} → HTTP ${res.status}`);
if (!res.ok) {
  console.error((await res.text()).slice(0, 500));
  process.exit(1);
}
