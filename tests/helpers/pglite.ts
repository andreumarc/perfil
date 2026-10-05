import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "@/db/schema";

const MIGRATION_PATH = fileURLToPath(new URL("../../drizzle/0000_init.sql", import.meta.url));

/** Divide la migración generada por drizzle-kit en sentencias ejecutables. */
export function loadMigrationStatements(): string[] {
  const sqlText = readFileSync(MIGRATION_PATH, "utf8");
  return sqlText
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Base de datos Postgres en memoria (PGlite) con el esquema real aplicado
 * desde drizzle/0000_init.sql y un cliente Drizzle tipado con el schema.
 */
export async function createTestDb() {
  const client = new PGlite();
  await client.waitReady;
  for (const statement of loadMigrationStatements()) {
    await client.exec(statement);
  }
  const db = drizzle({ client, schema });
  return { client, db };
}

export type TestDb = Awaited<ReturnType<typeof createTestDb>>["db"];
export type TestClient = Awaited<ReturnType<typeof createTestDb>>["client"];
