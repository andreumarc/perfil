import "server-only";

import { revalidateTag, unstable_cache, updateTag } from "next/cache";

/**
 * Caché de datos compartida entre páginas para las lecturas de contenido.
 *
 * Sin ella, cada regeneración de cada página (150 páginas, rastreadores a todas
 * horas) descargaba de Neon todos los servicios, zonas y artículos con sus
 * textos completos: en noviembre de 2026 agotó la cuota de transferencia del
 * plan gratuito y tumbó el panel. Con la caché, cada tabla se lee una vez por
 * hora como máximo, y los cambios desde el panel la invalidan al instante
 * (`invalidateCms()` desde `revalidateSite()`).
 */
export const CMS_TAG = "cms";
export const CMS_TTL_SECONDS = 3600;

type AsyncFn<A extends unknown[], R> = (...args: A) => Promise<R>;

/** Envuelve una lectura de BD en la caché de datos de Next (clave estable + etiqueta `cms`). */
export function cmsCache<A extends unknown[], R>(key: string, fn: AsyncFn<A, R>): AsyncFn<A, R> {
  return unstable_cache(fn, [CMS_TAG, key], { tags: [CMS_TAG], revalidate: CMS_TTL_SECONDS });
}

/** Invalida toda la caché de contenido. Desde una acción de servidor expira al instante; fuera, marca como obsoleta. */
export function invalidateCms() {
  try {
    updateTag(CMS_TAG);
  } catch {
    revalidateTag(CMS_TAG, "max");
  }
}
