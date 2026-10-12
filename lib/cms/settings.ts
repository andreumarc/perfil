import "server-only";

import { cache } from "react";

import { DEFAULT_SETTINGS } from "@/content/settings";
import { getDb } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { siteSettingsSchema, type SiteSettings } from "@/lib/validation/settings";

/** Fusión superficial por sección: lo guardado en BD pisa los defaults campo a campo. */
export function mergeSettings(stored: unknown): SiteSettings {
  if (!stored || typeof stored !== "object") return DEFAULT_SETTINGS;
  const s = stored as Record<string, unknown>;
  const merged: Record<string, unknown> = {};
  for (const [section, defaults] of Object.entries(DEFAULT_SETTINGS)) {
    const value = s[section];
    merged[section] =
      value && typeof value === "object" && !Array.isArray(value)
        ? { ...(defaults as object), ...(value as object) }
        : (value ?? defaults);
  }
  const parsed = siteSettingsSchema.safeParse(merged);
  if (parsed.success) return parsed.data;
  console.error("[settings] configuración en BD inválida, usando defaults:", parsed.error.issues.slice(0, 3));
  return DEFAULT_SETTINGS;
}

/**
 * Configuración del sitio. Lee la fila única de `site_settings`; sin base de
 * datos devuelve los valores por defecto de `content/settings.ts`.
 * `cache()` deduplica la lectura dentro de un mismo render (layout + página).
 */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = getDb();
  if (!db) return DEFAULT_SETTINGS;
  try {
    const row = await db.query.siteSettings.findFirst();
    return mergeSettings(row?.data);
  } catch (error) {
    console.error("[settings] error leyendo site_settings:", error);
    return DEFAULT_SETTINGS;
  }
});

export async function saveSettings(data: SiteSettings, updatedBy: string | null) {
  const db = getDb();
  if (!db) throw new Error("Base de datos no configurada");
  await db
    .insert(siteSettings)
    .values({ id: 1, data, updatedBy, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteSettings.id, set: { data, updatedBy, updatedAt: new Date() } });
}
