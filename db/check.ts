/**
 * Comprueba la conexión con Neon y lista las tablas.
 * Uso: npm run db:check
 */
import "dotenv/config";

import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ DATABASE_URL no definida. Copia .env.example a .env y rellénala.");
  process.exit(1);
}

async function main() {
  const sql = neon(url!);
  const start = Date.now();
  const [version] = await sql`select version()`;
  const latency = Date.now() - start;
  console.log(`✓ Conexión correcta (${latency} ms)`);
  console.log(`  ${String(version.version).split(",")[0]}`);

  const tables = await sql`
    select table_name, (xpath('/row/c/text()', query_to_xml('select count(*) as c from public.' || quote_ident(table_name), false, true, '')))[1]::text::int as rows
    from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name`;

  if (tables.length === 0) {
    console.log("  Sin tablas: ejecuta `npm run db:migrate`.");
    return;
  }
  console.log("  Tablas:");
  for (const t of tables) console.log(`   - ${t.table_name} (${t.rows} filas)`);
}

main().catch((error) => {
  console.error("✗ Error de conexión:", error instanceof Error ? error.message : error);
  process.exit(1);
});
