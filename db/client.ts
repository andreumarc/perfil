import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";

import { serverEnv } from "@/lib/env";

import * as schema from "./schema";

export type Database = NeonHttpDatabase<typeof schema>;

let cached: Database | null | undefined;

/**
 * Devuelve el cliente Drizzle sobre Neon (driver HTTP, ideal para serverless)
 * o `null` si DATABASE_URL no está configurada. Los llamadores deben tolerar
 * `null`: la web sigue funcionando (sin persistencia) en entornos sin DB.
 */
export function getDb(): Database | null {
  if (cached !== undefined) return cached;
  const url = serverEnv().databaseUrl;
  if (!url) {
    cached = null;
    if (process.env.NODE_ENV !== "test") {
      console.warn("[db] DATABASE_URL no configurada: la persistencia está desactivada.");
    }
    return cached;
  }
  const sql = neon(url);
  cached = drizzle({ client: sql, schema });
  return cached;
}

/** Lanza si la base de datos no está disponible. Para rutas admin. */
export function requireDb(): Database {
  const db = getDb();
  if (!db) throw new Error("Base de datos no configurada (DATABASE_URL).");
  return db;
}

export { schema };
