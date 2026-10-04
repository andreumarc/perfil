"use server";

import { revalidatePath } from "next/cache";

import {
  addLeadNote as addLeadNoteQuery,
  deleteLeadNote as deleteLeadNoteQuery,
  updateLeadNotes as updateLeadNotesQuery,
  updateLeadStatus as updateLeadStatusQuery,
} from "@/db/queries/leads";
import { getAdminSession } from "@/lib/auth";
import { addLeadNoteSchema, updateLeadNotesSchema, updateLeadStatusSchema } from "@/lib/validation/admin";
import { z } from "zod";

export type AdminActionState = { ok: true } | { ok: false; message: string };

async function requireSession() {
  const session = await getAdminSession();
  if (!session) throw new Error("No autorizado");
  return session;
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
    return { ok: false, message: error instanceof Error ? error.message : "Error" };
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
    return { ok: false, message: error instanceof Error ? error.message : "Error" };
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
    return { ok: false, message: error instanceof Error ? error.message : "Error" };
  }
}

export async function deleteLeadNoteAction(input: unknown): Promise<AdminActionState> {
  try {
    await requireSession();
    const data = z.object({ noteId: z.uuid(), leadId: z.uuid() }).parse(input);
    await deleteLeadNoteQuery(data.noteId);
    revalidatePath(`/admin/leads/${data.leadId}`);
    return { ok: true };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Error" };
  }
}
