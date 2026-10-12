"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  addActivity,
  assignLead,
  createFollowUp,
  deleteActivity,
  deleteLead as deleteLeadQuery,
  toggleFollowUp,
  updateInternalNotes,
  updateLeadStatus as updateLeadStatusQuery,
} from "@/db/queries/leads";
import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole, requireSession } from "@/lib/auth/guard";
import { addActivitySchema, assignLeadSchema, createFollowUpSchema, updateInternalNotesSchema, updateLeadStatusSchema } from "@/lib/validation/admin";

export type AdminActionState = { ok: true } | { ok: false; message: string };

/** Mensaje seguro para el cliente: no filtra detalles de la base de datos. */
function failure(error: unknown): AdminActionState {
  if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada. Vuelve a iniciar sesión." };
  if (error instanceof ForbiddenError) return { ok: false, message: "No tienes permisos para esta acción." };
  if (error instanceof z.ZodError) return { ok: false, message: "Datos no válidos." };
  console.error("[admin] acción fallida:", error instanceof Error ? error.message : error);
  return { ok: false, message: "No se ha podido guardar. Inténtalo de nuevo." };
}

function refreshLead(leadId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/leads");
  revalidatePath("/admin/tareas");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateLeadStatusAction(input: unknown): Promise<AdminActionState> {
  try {
    const session = await requireSession();
    const data = updateLeadStatusSchema.parse(input);
    const row = await updateLeadStatusQuery(data.leadId, data.status, session.userId);
    if (!row) return { ok: false, message: "Lead no encontrado" };
    await audit(session, "lead.status", "lead", data.leadId, { status: data.status });
    refreshLead(data.leadId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function assignLeadAction(input: unknown): Promise<AdminActionState> {
  try {
    const session = await requireSession();
    const data = assignLeadSchema.parse(input);
    const row = await assignLead(data.leadId, data.userId, session.userId);
    if (!row) return { ok: false, message: "Lead no encontrado" };
    await audit(session, "lead.assign", "lead", data.leadId, { assignedTo: data.userId });
    refreshLead(data.leadId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function addActivityAction(input: unknown): Promise<AdminActionState> {
  try {
    const session = await requireSession();
    const data = addActivitySchema.parse(input);
    await addActivity(data.leadId, session.userId, data.type, { note: data.note });
    refreshLead(data.leadId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteActivityAction(input: unknown): Promise<AdminActionState> {
  try {
    const session = await requireSession();
    const data = z.object({ activityId: z.uuid(), leadId: z.uuid() }).parse(input);
    await deleteActivity(data.activityId, data.leadId);
    await audit(session, "lead.activity.delete", "lead", data.leadId, { activityId: data.activityId });
    refreshLead(data.leadId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function updateInternalNotesAction(input: unknown): Promise<AdminActionState> {
  try {
    await requireSession();
    const data = updateInternalNotesSchema.parse(input);
    await updateInternalNotes(data.leadId, data.notes);
    refreshLead(data.leadId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function createFollowUpAction(input: unknown): Promise<AdminActionState> {
  try {
    const session = await requireSession();
    const data = createFollowUpSchema.parse(input);
    await createFollowUp({ leadId: data.leadId, title: data.title, dueAt: data.dueAt, assignedTo: data.assignedTo ?? session.userId, createdBy: session.userId });
    refreshLead(data.leadId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function toggleFollowUpAction(input: unknown): Promise<AdminActionState> {
  try {
    await requireSession();
    const data = z.object({ id: z.uuid(), done: z.boolean() }).parse(input);
    const row = await toggleFollowUp(data.id, data.done);
    if (!row) return { ok: false, message: "Tarea no encontrada" };
    refreshLead(row.leadId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

/** Borra definitivamente un lead (derecho de supresión). Solo administradores. */
export async function deleteLeadAction(input: unknown): Promise<AdminActionState> {
  let leadId: string;
  try {
    const session = await requireRole("admin");
    leadId = z.object({ leadId: z.uuid() }).parse(input).leadId;
    const deleted = await deleteLeadQuery(leadId);
    if (!deleted) return { ok: false, message: "Lead no encontrado" };
    await audit(session, "lead.delete", "lead", leadId);
    revalidatePath("/admin");
    revalidatePath("/admin/leads");
  } catch (error) {
    return failure(error);
  }
  redirect("/admin/leads?deleted=1");
}
