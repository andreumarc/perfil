"use server";

import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole } from "@/lib/auth/guard";
import { submitToIndexNow, type IndexNowResult } from "@/lib/indexnow";
import { getSiteUrls } from "@/lib/sitemap";

/** Envía todas las URLs del sitemap a IndexNow (Bing, Yandex, Seznam, Naver…). Solo administradores. */
export async function submitIndexNowAction(): Promise<IndexNowResult> {
  try {
    const session = await requireRole("admin");
    const urls = await getSiteUrls();
    const result = await submitToIndexNow(urls);
    await audit(session, "seo.indexnow", "site", null, { status: result.status, submitted: result.submitted, ok: result.ok });
    return result;
  } catch (error) {
    if (error instanceof UnauthorizedError) return { ok: false, status: 0, submitted: 0, message: "Sesión caducada. Vuelve a iniciar sesión." };
    if (error instanceof ForbiddenError) return { ok: false, status: 0, submitted: 0, message: "Solo los administradores pueden enviar URLs a los buscadores." };
    console.error("[admin/seo] error en IndexNow:", error instanceof Error ? error.message : error);
    return { ok: false, status: 0, submitted: 0, message: "No se han podido enviar las URLs." };
  }
}
