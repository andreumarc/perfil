/** Comprueba la conexión y lista el número de filas por tabla. Uso: npm run db:check */
import { sql } from "drizzle-orm";

import { scriptDb } from "./seed-client";

async function main() {
  const db = scriptDb();
  const tables = ["users", "leads", "services", "sectors", "projects", "articles", "faqs", "local_areas", "media_assets", "site_settings", "consent_records", "audit_logs", "data_requests", "lead_events"];
  for (const t of tables) {
    const rows = await db.execute(sql.raw(`select count(*)::int as n from "${t}"`));
    const n = (rows.rows[0] as { n: number } | undefined)?.n ?? 0;
    console.log(`${t.padEnd(18)} ${n}`);
  }
}

main().catch((error) => {
  console.error("Conexión fallida:", error instanceof Error ? error.message : error);
  process.exit(1);
});
