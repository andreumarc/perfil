/**
 * Siembra el contenido inicial desde la línea de comandos. Uso: npm run db:seed
 * (misma lógica que el botón del panel; ver lib/admin/seed.ts).
 */
import { seedContent } from "@/lib/admin/seed";

import { scriptDb } from "./seed-client";

seedContent(scriptDb())
  .then((summary) => console.log("Seed completado:", summary))
  .catch((error) => {
    console.error("Seed fallido:", error instanceof Error ? error.message : error);
    process.exit(1);
  });
