import "server-only";

import { revalidatePath } from "next/cache";

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
}

export function revalidateAdmin(paths: string[] = []) {
  revalidatePath("/admin", "layout");
  for (const p of paths) revalidatePath(p);
}
