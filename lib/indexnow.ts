import "server-only";

import { filterIndexNowUrls, isIndexNowHost } from "@/lib/indexnow-urls";
import { siteUrl } from "@/lib/seo";

/**
 * IndexNow: aviso inmediato a Bing, Yandex, Seznam, Naver y otros buscadores
 * compatibles de que una URL ha cambiado. Google no participa en el protocolo
 * (usa Search Console). La clave es pública por diseño y debe servirse como
 * texto plano en /<clave>.txt, por eso vive en public/.
 */
export const INDEXNOW_KEY = "baf88c4cfc9b76ed02819eb949f01de5";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submitted: number;
  message: string;
}

const STATUS_MESSAGES: Record<number, string> = {
  200: "URLs enviadas correctamente.",
  202: "URLs recibidas; la clave se validará en breve.",
  400: "Petición no válida.",
  403: "Clave no válida: comprueba que el fichero de la clave se sirve en el dominio.",
  422: "Las URLs no pertenecen al dominio o la clave no coincide.",
  429: "Demasiadas peticiones: vuelve a intentarlo más tarde.",
};

/** Envía URLs a IndexNow. Nunca lanza: devuelve el resultado para registrarlo o mostrarlo. */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const host = new URL(siteUrl).host;
  if (!isIndexNowHost(host)) return { ok: false, status: 0, submitted: 0, message: `El dominio ${host} es local: no se envía nada.` };
  const list = filterIndexNowUrls(urls, host);
  if (!list.length) return { ok: false, status: 0, submitted: 0, message: "No hay URLs del dominio actual que enviar." };
  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`, urlList: list }),
      cache: "no-store",
    });
    return { ok: res.ok, status: res.status, submitted: list.length, message: STATUS_MESSAGES[res.status] ?? `Respuesta ${res.status} de IndexNow.` };
  } catch (error) {
    return { ok: false, status: 0, submitted: 0, message: error instanceof Error ? error.message : "Error de red al contactar con IndexNow." };
  }
}
