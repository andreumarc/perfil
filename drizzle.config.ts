import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // drizzle-kit generate no necesita conexión; migrate/push/studio sí.
    url: process.env.DATABASE_URL ?? "postgresql://localhost:5432/perfil",
  },
  strict: true,
  verbose: true,
});
