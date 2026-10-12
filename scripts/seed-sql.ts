/**
 * Genera el contenido inicial como SQL (INSERT … ON CONFLICT DO NOTHING) para
 * ejecutarlo donde no hay acceso directo a la base de datos (consola SQL de
 * Neon, MCP, psql en otra máquina). Ejecuta seedContent() sobre PGlite con el
 * esquema real (drizzle/0000_init.sql) y vuelca las tablas de contenido.
 *
 * Salida en <directorio-salida>:
 *   seed.sql                 todas las sentencias
 *   stmt-NN-<tabla>.sql      una sentencia por fichero (≤ 24 KB, para poder leerlos por terminal)
 *   checks.sql               consulta que devuelve un hash por tabla
 *   hashes.json              el mismo hash calculado sobre PGlite (para comparar)
 *
 * Uso: npm run db:seed:sql <directorio-salida>   (o npx tsx scripts/seed-sql.ts <directorio-salida>)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import { seedContent, type SeedDb } from "@/lib/admin/seed";
import { createTestDb } from "@/tests/helpers/pglite";

/** Orden de inserción: las tablas referenciadas van antes (articles.author_id → authors.id). */
const TABLES = ["blog_categories", "authors", "services", "sectors", "projects", "articles", "local_areas", "faqs", "site_settings"] as const;

/** Clave de ordenación estable por tabla para el hash de verificación. */
const ORDER_KEY: Record<(typeof TABLES)[number], string> = {
  blog_categories: "slug",
  authors: "slug",
  services: "slug",
  sectors: "slug",
  projects: "slug",
  articles: "slug",
  local_areas: "slug",
  faqs: 'scope, scope_slug, "order", question',
  site_settings: "id",
};

type Column = { column_name: string; data_type: string; udt_name: string };

const MAX_STATEMENT_BYTES = 24_000;

function quote(text: string): string {
  return `'${text.replace(/'/g, "''")}'`;
}

function literal(value: unknown, col: Column): string {
  if (value === null || value === undefined) return "NULL";
  switch (col.data_type) {
    case "jsonb":
    case "json":
      return `${quote(JSON.stringify(value))}::${col.data_type}`;
    case "timestamp with time zone":
    case "timestamp without time zone":
    case "date":
      return quote(value instanceof Date ? value.toISOString() : String(value));
    case "boolean":
      return value ? "true" : "false";
    case "integer":
    case "smallint":
    case "bigint":
    case "numeric":
    case "real":
    case "double precision":
      return String(value);
    case "ARRAY":
      return `ARRAY[${(value as unknown[]).map((v) => quote(String(v))).join(",")}]::${col.udt_name.replace(/^_/, "")}[]`;
    default:
      return quote(String(value));
  }
}

function checkQuery(table: string): string {
  return `select '${table}' as "table", count(*)::int as rows, md5(coalesce(string_agg(md5(t::text), ',' order by ${ORDER_KEY[table as (typeof TABLES)[number]]}), '')) as hash from "${table}" t`;
}

async function main() {
  const outDir = process.argv[2];
  if (!outDir) {
    console.error("Uso: npx tsx scripts/seed-sql.ts <directorio-salida>");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });

  const { client, db } = await createTestDb();
  const summary = await seedContent(db as unknown as SeedDb);
  console.log("seed en PGlite:", summary);

  const statements: { table: string; sql: string }[] = [];
  for (const table of TABLES) {
    const cols = (
      await client.query<Column>(
        "select column_name, data_type, udt_name from information_schema.columns where table_schema = 'public' and table_name = $1 order by ordinal_position",
        [table],
      )
    ).rows;
    const rows = (await client.query<Record<string, unknown>>(`select * from "${table}" order by ${ORDER_KEY[table]}`)).rows;
    const head = `INSERT INTO "${table}" (${cols.map((c) => `"${c.column_name}"`).join(", ")}) VALUES\n`;
    const tail = "\nON CONFLICT DO NOTHING;";
    let chunk: string[] = [];
    let size = 0;
    const flush = () => {
      if (!chunk.length) return;
      statements.push({ table, sql: head + chunk.join(",\n") + tail });
      chunk = [];
      size = 0;
    };
    for (const row of rows) {
      const tuple = `(${cols.map((c) => literal(row[c.column_name], c)).join(", ")})`;
      if (size + tuple.length > MAX_STATEMENT_BYTES) flush();
      chunk.push(tuple);
      size += tuple.length;
    }
    flush();
    console.log(`${table}: ${rows.length} filas`);
  }

  const hashes: Record<string, { rows: number; hash: string }> = {};
  for (const table of TABLES) {
    const [row] = (await client.query<{ table: string; rows: number; hash: string }>(checkQuery(table))).rows;
    if (row) hashes[table] = { rows: row.rows, hash: row.hash };
  }
  await client.close();

  statements.forEach((s, i) => writeFileSync(path.join(outDir, `stmt-${String(i + 1).padStart(2, "0")}-${s.table}.sql`), `${s.sql}\n`));
  writeFileSync(path.join(outDir, "seed.sql"), `${statements.map((s) => s.sql).join("\n\n")}\n`);
  writeFileSync(path.join(outDir, "checks.sql"), `${TABLES.map(checkQuery).join("\nunion all\n")};\n`);
  writeFileSync(path.join(outDir, "hashes.json"), `${JSON.stringify(hashes, null, 2)}\n`);
  const total = statements.reduce((n, s) => n + s.sql.length, 0);
  console.log(`sentencias: ${statements.length}; total ${Math.round(total / 1024)} KB → ${outDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
