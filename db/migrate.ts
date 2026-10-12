/**
 * Aplica las migraciones de drizzle/ con el driver HTTP de Neon (sin websockets).
 * Idempotente: registra cada fichero aplicado en __migrations. Uso: npm run db:migrate
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL no está definida");
  const sql = neon(url);
  await sql.query(`create table if not exists "__migrations" ("name" text primary key, "applied_at" timestamptz not null default now())`);
  const applied = new Set((await sql.query(`select name from "__migrations"`)).map((r) => (r as { name: string }).name));
  const dir = path.join(process.cwd(), "drizzle");
  const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    if (applied.has(file)) continue;
    const statements = readFileSync(path.join(dir, file), "utf8").split("--> statement-breakpoint").map((s) => s.trim()).filter(Boolean);
    for (const statement of statements) await sql.query(statement);
    await sql.query(`insert into "__migrations" ("name") values ($1)`, [file]);
    console.log(`aplicada ${file} (${statements.length} sentencias)`);
  }
  if (!files.some((f) => !applied.has(f))) console.log("Sin migraciones pendientes.");
}

main().catch((error) => {
  console.error("Migración fallida:", error instanceof Error ? error.message : error);
  process.exit(1);
});
