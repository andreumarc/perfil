/**
 * Se ejecuta antes de `next build` (npm "prebuild"). En Vercel, donde existe
 * DATABASE_URL, carga el contenido de código que falte en la base de datos
 * (zonas, FAQs de zona y artículos nuevos). En CI o en local sin base de datos
 * no hace nada. Un fallo aquí no detiene el despliegue: se avisa y se sigue.
 */
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[sync] sin DATABASE_URL: no se sincroniza contenido.");
  process.exit(0);
}
if (!process.env.VERCEL && !process.env.SYNC_CONTENT) {
  console.log("[sync] fuera de Vercel: define SYNC_CONTENT=1 para forzar la sincronización.");
  process.exit(0);
}
const result = spawnSync("npx", ["tsx", "scripts/sync-local-content.ts"], { stdio: "inherit", env: process.env, timeout: 180_000 });
if (result.status !== 0) console.warn("[sync] la sincronización de contenido ha fallado; el build continúa.");
process.exit(0);
