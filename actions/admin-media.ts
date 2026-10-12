"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { requireDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { revalidateAdmin, revalidateSite } from "@/lib/admin/revalidate";
import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole } from "@/lib/auth/guard";
import { deleteFile, isStorageConfigured, uploadFile } from "@/lib/storage/blob";
import { slugify } from "@/lib/utils";
import { MEDIA_KINDS } from "@/types/lead";

export type MediaActionState = { ok: true; message?: string } | { ok: false; message: string };

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"]);
const MAX_BYTES = 4 * 1024 * 1024;

function failure(error: unknown): MediaActionState {
  if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada." };
  if (error instanceof ForbiddenError) return { ok: false, message: "Sin permisos." };
  if (error instanceof z.ZodError) return { ok: false, message: "Datos no válidos." };
  console.error("[admin/media] error:", error instanceof Error ? error.message : error);
  return { ok: false, message: "No se ha podido completar la operación." };
}

/** Sube una o varias imágenes al store público y las registra en media_assets. */
export async function uploadMediaAction(formData: FormData): Promise<MediaActionState> {
  try {
    const session = await requireRole("editor");
    if (!isStorageConfigured("public")) return { ok: false, message: "Falta BLOB_READ_WRITE_TOKEN: configura Vercel Blob para subir imágenes." };
    const kind = z.enum(MEDIA_KINDS).parse(formData.get("kind") ?? "illustrative");
    const alt = z.string().trim().max(300).parse(formData.get("alt") ?? "");
    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) return { ok: false, message: "Selecciona al menos una imagen." };
    const db = requireDb();
    let uploaded = 0;
    for (const file of files) {
      if (!ALLOWED.has(file.type)) return { ok: false, message: `Formato no admitido: ${file.name}. Usa JPG, PNG, WebP, AVIF o SVG.` };
      if (file.size > MAX_BYTES) return { ok: false, message: `${file.name} supera 4 MB. Redúcela antes de subirla.` };
      const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
      const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
      const pathname = `media/${Date.now().toString(36)}-${base}${ext}`;
      const { url, pathname: storageKey } = await uploadFile("public", pathname, await file.arrayBuffer(), file.type);
      await db.insert(mediaAssets).values({ storageKey, url, filename: file.name, mime: file.type, sizeBytes: file.size, alt, kind, uploadedBy: session.userId });
      uploaded += 1;
    }
    await audit(session, "media.upload", "media_assets", null, { count: uploaded, kind });
    revalidateAdmin(["/admin/medios"]);
    return { ok: true, message: `${uploaded} imagen(es) subida(s).` };
  } catch (error) {
    return failure(error);
  }
}

const updateSchema = z.object({ id: z.uuid(), alt: z.string().trim().max(300), kind: z.enum(MEDIA_KINDS) });

export async function updateMediaAction(input: unknown): Promise<MediaActionState> {
  try {
    const session = await requireRole("editor");
    const data = updateSchema.parse(input);
    const db = requireDb();
    await db.update(mediaAssets).set({ alt: data.alt, kind: data.kind }).where(eq(mediaAssets.id, data.id));
    await audit(session, "media.update", "media_assets", data.id, { kind: data.kind });
    revalidateSite();
    revalidateAdmin(["/admin/medios"]);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function deleteMediaAction(input: unknown): Promise<MediaActionState> {
  try {
    const session = await requireRole("editor");
    const { id } = z.object({ id: z.uuid() }).parse(input);
    const db = requireDb();
    const [row] = await db.delete(mediaAssets).where(eq(mediaAssets.id, id)).returning({ url: mediaAssets.url });
    if (!row) return { ok: false, message: "Imagen no encontrada." };
    try {
      await deleteFile("public", row.url);
    } catch (error) {
      console.error("[admin/media] no se pudo borrar el blob:", error instanceof Error ? error.message : error);
    }
    await audit(session, "media.delete", "media_assets", id);
    revalidateSite();
    revalidateAdmin(["/admin/medios"]);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}
