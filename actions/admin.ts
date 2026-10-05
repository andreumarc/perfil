"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  addLeadNote as addLeadNoteQuery,
  deleteLead as deleteLeadQuery,
  deleteLeadNote as deleteLeadNoteQuery,
  updateLeadNotes as updateLeadNotesQuery,
  updateLeadStatus as updateLeadStatusQuery,
} from "@/db/queries/leads";
import { getAdminSession } from "@/lib/auth";
import { addLeadNoteSchema, updateLeadNotesSchema, updateLeadStatusSchema } from "@/lib/validation/admin";

export type AdminActionState = { ok: true } | { ok: false; message: string };

class UnauthorizedError extends Error {}

async function requireSession() {
  const session = await getAdminSession();
  if (!session) throw new UnauthorizedError("No autorizado");
  return session;
}

/** Mensaje seguro para el cliente: no filtra detalles de la base de datos. */
function failure(error: unknown): AdminActionState {
  if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada. Vuelve a iniciar sesión." };
  if (error instanceof z.ZodError) return { ok: false, message: "Datos no válidos." };
  console.error("[admin] acción fallida:", error);
  return { ok: false, message: "No se ha podido guardar. Inténtalo de nuevo." };
}

export async function updateLeadStatusAction(input: unknown): Promise<AdminActionState> {
  try {
    await requireSession();
    const data = updateLeadStatusSchema.parse(input);
    const row = await updateLeadStatusQuery(data.leadId, data.status);
    if (!row) return { ok: false, message: "Lead no encontrado" };
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${data.leadId}`);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function addLeadNoteAction(input: unknown): Promise<AdminActionState> {
  try {
    const session = await requireSession();
    const data = addLeadNoteSchema.parse(input);
    await addLeadNoteQuery(data.leadId, data.note, session.email);
    revalidatePath(`/admin/leads/${data.leadId}`);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function updateLeadNotesAction(input: unknown): Promise<AdminActionState> {
  try {
    await requireSession();
    const data = updateLeadNotesSchema.parse(input);
    await updateLeadNotesQuery(data.leadId, data.notes);
    revalidatePath(`/admin/leads/${data.leadId}`);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteLeadNoteAction(input: unknown): Promise<AdminActionState> {
  try {
    await requireSession();
    const data = z.object({ noteId: z.uuid(), leadId: z.uuid() }).parse(input);
    await deleteLeadNoteQuery(data.noteId, data.leadId);
    revalidatePath(`/admin/leads/${data.leadId}`);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/** Borra definitivamente un lead (derecho de supresión) y vuelve al listado. */
export async function deleteLeadAction(input: unknown): Promise<AdminActionState> {
  let leadId: string;
  try {
    await requireSession();
    leadId = z.object({ leadId: z.uuid() }).parse(input).leadId;
    const deleted = await deleteLeadQuery(leadId);
    if (!deleted) return { ok: false, message: "Lead no encontrado" };
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
  } catch (error) {
    return failure(error);
  }
  redirect("/admin/leads?deleted=1");
}
