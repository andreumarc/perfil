import "server-only";

import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { submitToIndexNow } from "@/lib/indexnow";
import { getSiteUrls } from "@/lib/sitemap";

/**
 * Invalida todo el sitio público tras un cambio de contenido o ajustes.
 * Invalidar por rutas concretas es fácil de olvidar (un servicio aparece en la
 * home, el listado, el sitemap, el footer…); invalidar el layout es seguro y
 * la regeneración ocurre en la siguiente petición.
 */
export function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/rss.xml");
  scheduleIndexNow();
}

export function revalidateAdmin(paths: string[] = []) {
  revalidatePath("/admin", "layout");
  for (const p of paths) revalidatePath(p);
}

/** Tras responder, avisa a los buscadores compatibles con IndexNow de que el contenido ha cambiado. */
function scheduleIndexNow() {
  try {
    after(async () => {
      try {
        const result = await submitToIndexNow(await getSiteUrls());
        if (!result.ok) console.warn("[indexnow]", result.status, result.message);
      } catch (error) {
        console.warn("[indexnow] error:", error instanceof Error ? error.message : error);
      }
    });
  } catch {
    /* Fuera de una petición (scripts): no hay envío. */
  }
}
