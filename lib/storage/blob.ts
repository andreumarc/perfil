import "server-only";

import { del, put } from "@vercel/blob";

import { serverEnv } from "@/lib/env";

export type StoreKind = "public" | "private";

function tokenFor(kind: StoreKind): string | undefined {
  const env = serverEnv();
  return kind === "public" ? env.blobToken : env.blobPrivateToken;
}

export function isStorageConfigured(kind: StoreKind): boolean {
  return Boolean(tokenFor(kind));
}

/** Sube un fichero a Vercel Blob (store público para medios, privado para adjuntos). */
export async function uploadFile(kind: StoreKind, pathname: string, body: ArrayBuffer | Blob, contentType: string): Promise<{ url: string; pathname: string }> {
  const token = tokenFor(kind);
  if (!token) throw new Error(`Almacenamiento ${kind} no configurado`);
  const result = await put(pathname, body, { access: kind, token, contentType, addRandomSuffix: false });
  return { url: result.url, pathname: result.pathname };
}

export async function deleteFile(kind: StoreKind, urlOrPathname: string): Promise<void> {
  const token = tokenFor(kind);
  if (!token) return;
  await del(urlOrPathname, { token });
}
