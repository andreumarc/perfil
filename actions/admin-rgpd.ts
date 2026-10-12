"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireDb } from "@/db/client";
import { dataRequests } from "@/db/schema";
import { revalidateAdmin } from "@/lib/admin/revalidate";
import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole } from "@/lib/auth/guard";
import { DATA_REQUEST_STATUSES } from "@/types/lead";

export type RgpdActionState = { ok: true } | { ok: false; message: string };

const schema = z.object({ id: z.uuid(), status: z.enum(DATA_REQUEST_STATUSES), resolutionNote: z.string().trim().max(4000).optional() });

/** Cambia el estado de una solicitud de derechos (solo administradores). */
export async function updateDataRequestAction(input: unknown): Promise<RgpdActionState> {
  try {
    const session = await requireRole("admin");
    const data = schema.parse(input);
    const db = requireDb();
    await db
      .update(dataRequests)
      .set({
        status: data.status,
        handledBy: session.userId,
        resolutionNote: data.resolutionNote ?? null,
        closedAt: data.status === "closed" ? new Date() : null,
      })
      .where(eq(dataRequests.id, data.id));
    await audit(session, "data_request.status", "data_request", data.id, { status: data.status });
    revalidateAdmin(["/admin/rgpd"]);
    return { ok: true };
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada." };
    if (error instanceof ForbiddenError) return { ok: false, message: "Solo administradores." };
    if (error instanceof z.ZodError) return { ok: false, message: "Datos no válidos." };
    console.error("[admin/rgpd] error:", error instanceof Error ? error.message : error);
    return { ok: false, message: "No se ha podido guardar." };
  }
}
