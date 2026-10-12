"use server";

import { requireDb } from "@/db/client";
import { revalidateAdmin, revalidateSite } from "@/lib/admin/revalidate";
import { seedContent } from "@/lib/admin/seed";
import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole } from "@/lib/auth/guard";

export type SeedActionState = { ok: true; summary: Record<string, number> } | { ok: false; message: string };

/** Carga el contenido inicial (servicios, sectores, proyectos tipo, blog, FAQs, zonas y ajustes) sin tocar solicitudes. */
export async function seedContentAction(): Promise<SeedActionState> {
  try {
    const session = await requireRole("admin");
    const summary = await seedContent(requireDb());
    await audit(session, "content.seed", "content", null, summary);
    revalidateSite();
    revalidateAdmin();
    return { ok: true, summary };
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada." };
    if (error instanceof ForbiddenError) return { ok: false, message: "Solo administradores." };
    console.error("[admin/seed] error:", error instanceof Error ? error.message : error);
    return { ok: false, message: "No se ha podido cargar el contenido inicial." };
  }
}
