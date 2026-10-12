"use server";

import { addAttachment } from "@/db/queries/leads";
import { verifyAttachmentToken } from "@/lib/auth/attachment-token";
import { FORM_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { isStorageConfigured, uploadFile } from "@/lib/storage/blob";
import { slugify } from "@/lib/utils";
import { ATTACHMENT_ALLOWED_TYPES, ATTACHMENT_MAX_FILES, ATTACHMENT_MAX_FILE_BYTES, ATTACHMENT_MAX_TOTAL_BYTES } from "@/lib/validation/lead";

export type AttachFilesState = { ok: true; count: number } | { ok: false; message: string };

/**
 * Sube los adjuntos (fotos, planos, PDF) al store privado y los asocia a la
 * solicitud. Requiere el token efímero devuelto por submitLead.
 */
export async function attachFilesAction(formData: FormData): Promise<AttachFilesState> {
  const token = String(formData.get("token") ?? "");
  const leadId = token ? await verifyAttachmentToken(token) : null;
  if (!leadId) return { ok: false, message: "No se han podido adjuntar los archivos (sesión caducada)." };
  if (!isStorageConfigured("private")) return { ok: false, message: "Los adjuntos no están disponibles en este momento." };

  const meta = await getRequestMeta();
  const limit = await rateLimit(`attach:${meta.rateKey}`, FORM_RATE_LIMIT);
  if (!limit.ok) return { ok: false, message: "Has alcanzado el límite de envíos." };

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0).slice(0, ATTACHMENT_MAX_FILES);
  if (!files.length) return { ok: true, count: 0 };
  const total = files.reduce((acc, f) => acc + f.size, 0);
  if (total > ATTACHMENT_MAX_TOTAL_BYTES) return { ok: false, message: "Los archivos superan 4 MB en total." };

  let count = 0;
  for (const file of files) {
    if (!(ATTACHMENT_ALLOWED_TYPES as readonly string[]).includes(file.type) || file.size > ATTACHMENT_MAX_FILE_BYTES) continue;
    const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase().slice(0, 6) : "";
    const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 60) || "adjunto";
    const pathname = `leads/${leadId}/${Date.now().toString(36)}-${base}${ext}`;
    try {
      const { pathname: storageKey } = await uploadFile("private", pathname, await file.arrayBuffer(), file.type);
      await addAttachment({ leadId, storageKey, filename: file.name.slice(0, 255), mime: file.type, sizeBytes: file.size });
      count += 1;
    } catch (error) {
      console.error("[attach] error subiendo adjunto:", error instanceof Error ? error.message : error);
    }
  }
  return count ? { ok: true, count } : { ok: false, message: "No se ha podido subir ningún archivo (formato o tamaño no admitidos)." };
}
