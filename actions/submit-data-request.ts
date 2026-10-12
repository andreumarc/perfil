"use server";

import { after } from "next/server";

import { getDb } from "@/db/client";
import { dataRequests } from "@/db/schema";
import { getSettings } from "@/lib/cms/settings";
import { isEmailConfigured, sendDataRequestNotification } from "@/lib/email/send";
import { serverEnv } from "@/lib/env";
import { FORM_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { siteUrl } from "@/lib/seo";
import { dataRequestSubmissionSchema } from "@/lib/validation/data-request";
import { fieldErrors, isSuspiciousFillTime } from "@/lib/validation/lead";

export type SubmitDataRequestState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success" };

/** Registra una solicitud de derechos RGPD y avisa al responsable. */
export async function submitDataRequest(payload: unknown): Promise<SubmitDataRequestState> {
  const parsed = dataRequestSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };
  }
  const { request, antiSpam } = parsed.data;
  if (isSuspiciousFillTime(antiSpam.startedAt)) {
    return { status: "error", message: "No se ha podido procesar el envío. Inténtalo de nuevo." };
  }

  const meta = await getRequestMeta();
  const limit = await rateLimit(`data-request:${meta.rateKey}`, FORM_RATE_LIMIT);
  if (!limit.ok) {
    return { status: "error", message: `Has alcanzado el límite de envíos. Vuelve a intentarlo en ${Math.max(1, Math.ceil(limit.retryAfterSeconds / 60))} minutos.` };
  }

  const settings = await getSettings();
  const recipients = settings.notifications.leadEmails.length
    ? settings.notifications.leadEmails
    : serverEnv().notifyEmail
      ? [serverEnv().notifyEmail as string]
      : [];
  const db = getDb();
  const hasEmail = isEmailConfigured() && recipients.length > 0;

  if (!db && !hasEmail) {
    const alt = settings.legal.email && !settings.legal.email.includes("[POR CONFIRMAR") ? settings.legal.email : settings.company.email;
    return {
      status: "error",
      message: `El formulario no está operativo en este momento. ${alt ? `Escríbenos a ${alt}.` : "Inténtalo de nuevo más tarde."}`,
    };
  }

  let saved = false;
  if (db) {
    try {
      await db.insert(dataRequests).values({
        type: request.type,
        name: request.name,
        email: request.email,
        message: request.message || null,
        ipHash: meta.ipHash,
      });
      saved = true;
    } catch (error) {
      console.error("[rgpd] error guardando la solicitud:", error instanceof Error ? error.message : error);
    }
  }
  if (!saved && !hasEmail) {
    return { status: "error", message: "No se ha podido registrar la solicitud. Inténtalo de nuevo en unos minutos." };
  }

  if (hasEmail) {
    after(async () => {
      await sendDataRequestNotification(
        { type: request.type, name: request.name, email: request.email, message: request.message || null },
        { name: settings.company.name, siteUrl },
        recipients,
      );
    });
  }

  return { status: "success" };
}
