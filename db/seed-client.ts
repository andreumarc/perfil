import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

config({ path: [".env.local", ".env"], quiet: true });

/** Cliente para scripts (seed, check): sin `server-only`, lee .env.local. */
export function scriptDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL no está definida (.env.local).");
    process.exit(1);
  }
  return drizzle({ client: neon(url), schema });
}

export { schema };
