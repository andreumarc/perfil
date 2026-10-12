"use server";

import { z } from "zod";

import { RESOURCES } from "@/lib/admin/resource-meta";
import { SlugConflictError, deleteRow, insertRow, parseValues, setRowStatus, updateRow } from "@/lib/admin/resources";
import { revalidateAdmin, revalidateSite } from "@/lib/admin/revalidate";
import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole } from "@/lib/auth/guard";
import { fieldErrors } from "@/lib/validation/lead";
import { RESOURCE_KEYS, type ResourceKey } from "@/lib/validation/content";
import { CONTENT_STATUSES } from "@/types/lead";

export type ContentActionState = { ok: true; id: string } | { ok: false; message: string; fieldErrors?: Record<string, string> };

const keySchema = z.enum(RESOURCE_KEYS as [ResourceKey, ...ResourceKey[]]);
const saveSchema = z.object({ key: keySchema, id: z.uuid().nullable(), values: z.record(z.string(), z.unknown()) });
const idSchema = z.object({ key: keySchema, id: z.uuid() });
const statusSchema = idSchema.extend({ status: z.enum(CONTENT_STATUSES) });

function failure(error: unknown): ContentActionState {
  if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada. Vuelve a iniciar sesión." };
  if (error instanceof ForbiddenError) return { ok: false, message: "No tienes permisos para esta acción." };
  if (error instanceof SlugConflictError) return { ok: false, message: error.message, fieldErrors: { slug: error.message } };
  if (error instanceof z.ZodError) return { ok: false, message: "Revisa los campos marcados.", fieldErrors: fieldErrors(error) };
  console.error("[admin/content] acción fallida:", error instanceof Error ? error.message : error);
  return { ok: false, message: "No se ha podido guardar. Inténtalo de nuevo." };
}

function refresh(key: ResourceKey, id?: string) {
  revalidateSite();
  revalidateAdmin([`/admin/${RESOURCES[key].path}`, ...(id ? [`/admin/${RESOURCES[key].path}/${id}`] : [])]);
}

/** Crea o actualiza un elemento de contenido. Editores y administradores. */
export async function saveResourceAction(input: unknown): Promise<ContentActionState> {
  try {
    const session = await requireRole("editor");
    const { key, id, values } = saveSchema.parse(input);
    const data = parseValues(key, values);
    if (id) {
      const ok = await updateRow(key, id, data);
      if (!ok) return { ok: false, message: "Elemento no encontrado." };
      await audit(session, `${key}.update`, key, id, { slug: data.slug ?? null, status: data.status ?? null });
      refresh(key, id);
      return { ok: true, id };
    }
    const newId = await insertRow(key, data);
    await audit(session, `${key}.create`, key, newId, { slug: data.slug ?? null });
    refresh(key, newId);
    return { ok: true, id: newId };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteResourceAction(input: unknown): Promise<ContentActionState> {
  try {
    const session = await requireRole("editor");
    const { key, id } = idSchema.parse(input);
    const ok = await deleteRow(key, id);
    if (!ok) return { ok: false, message: "Elemento no encontrado." };
    await audit(session, `${key}.delete`, key, id);
    refresh(key);
    return { ok: true, id };
  } catch (error) {
    return failure(error);
  }
}

export async function setResourceStatusAction(input: unknown): Promise<ContentActionState> {
  try {
    const session = await requireRole("editor");
    const { key, id, status } = statusSchema.parse(input);
    const ok = await setRowStatus(key, id, status);
    if (!ok) return { ok: false, message: "No se puede cambiar el estado de este elemento." };
    await audit(session, `${key}.status`, key, id, { status });
    refresh(key, id);
    return { ok: true, id };
  } catch (error) {
    return failure(error);
  }
}
