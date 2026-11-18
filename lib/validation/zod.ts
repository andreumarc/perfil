import { config } from "zod";

/**
 * Punto único de importación de Zod (`import * as z from "@/lib/validation/zod"`).
 *
 * - `jitless`: evita que Zod compile los esquemas con `new Function`, que la CSP
 *   bloquea (sin `unsafe-eval`) y dejaba un aviso de seguridad en el navegador.
 *   Se ejecuta antes de construir cualquier esquema porque todos los módulos
 *   importan Zod desde aquí.
 * - Importación por espacio de nombres (no `import { z }`): así el empaquetador
 *   descarta lo que no se usa (p. ej. los idiomas de Zod, ~60 KB comprimidos
 *   que antes llegaban al navegador en cada página con formulario).
 */
config({ jitless: true });

export * from "zod";
