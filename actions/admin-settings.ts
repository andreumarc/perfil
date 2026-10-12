"use server";

import { z } from "zod";

import { revalidateAdmin, revalidateSite } from "@/lib/admin/revalidate";
import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole } from "@/lib/auth/guard";
import { saveSettings } from "@/lib/cms/settings";
import { fieldErrors } from "@/lib/validation/lead";
import { siteSettingsSchema } from "@/lib/validation/settings";

export type SettingsActionState = { ok: true } | { ok: false; message: string; fieldErrors?: Record<string, string> };

/** Guarda toda la configuración del sitio (solo administradores). */
export async function saveSettingsAction(input: unknown): Promise<SettingsActionState> {
  try {
    const session = await requireRole("admin");
    const parsed = siteSettingsSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };
    await saveSettings(parsed.data, session.userId);
    await audit(session, "settings.update", "site_settings", "1", { sections: Object.keys(parsed.data) });
    revalidateSite();
    revalidateAdmin(["/admin/ajustes"]);
    return { ok: true };
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada. Vuelve a iniciar sesión." };
    if (error instanceof ForbiddenError) return { ok: false, message: "Solo los administradores pueden cambiar los ajustes." };
    if (error instanceof z.ZodError) return { ok: false, message: "Datos no válidos.", fieldErrors: fieldErrors(error) };
    console.error("[admin/settings] error guardando:", error instanceof Error ? error.message : error);
    return { ok: false, message: "No se han podido guardar los ajustes." };
  }
}
