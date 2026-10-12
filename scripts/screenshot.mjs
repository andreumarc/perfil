/**
 * Capturas de pantalla del sitio en escritorio y móvil (QA visual).
 * Uso: node scripts/screenshot.mjs [baseUrl] ruta1 ruta2 …   (por defecto http://localhost:3000)
 * Salida: ./screenshots/<ruta>-<viewport>.png
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const base = args[0]?.startsWith("http") ? args.shift() : "http://localhost:3000";
const out = process.env.SHOT_DIR ?? "./screenshots";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
for (const [name, width, height] of [["desktop", 1440, 900], ["mobile", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  for (const path of args.length ? args : ["/"]) {
    const res = await page.goto(`${base}${path}`, { waitUntil: "load", timeout: 60000 });
    const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "_");
    await page.screenshot({ path: `${out}/${slug}-${name}.png`, fullPage: true });
    console.log(name, path, res?.status());
  }
  await page.close();
}
await browser.close();
