import "server-only";

import { serverEnv } from "@/lib/env";
import { meetingHref } from "@/lib/site";
import { site } from "@/lib/site";

import { getResend } from "./client";
import {
  diagnosticResultEmail,
  diagnosticResultSubject,
  newLeadEmail,
  newLeadSubject,
  type DiagnosticResultEmailInput,
  type NewLeadEmailInput,
} from "./templates";

interface SendResult {
  sent: boolean;
  id?: string;
  reason?: string;
}

async function send(to: string, subject: string, html: string, replyTo?: string): Promise<SendResult> {
  const resend = getResend();
  if (!resend) return { sent: false, reason: "resend_not_configured" };
  const { emailFrom } = serverEnv();
  try {
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error("[email] error enviando:", error);
      return { sent: false, reason: error.message };
    }
    return { sent: true, id: data?.id };
  } catch (error) {
    console.error("[email] excepción enviando:", error);
    return { sent: false, reason: error instanceof Error ? error.message : "unknown" };
  }
}

/** Notificación interna de nuevo lead al administrador. Nunca lanza. */
export async function sendNewLeadNotification(input: NewLeadEmailInput): Promise<SendResult> {
  const { adminEmail } = serverEnv();
  if (!adminEmail) return { sent: false, reason: "admin_email_not_configured" };
  return send(adminEmail, newLeadSubject(input), newLeadEmail(input), input.email);
}

/** Resumen del diagnóstico al lead. Nunca lanza. */
export async function sendDiagnosticResultToLead(
  to: string,
  input: Omit<DiagnosticResultEmailInput, "bookingUrl" | "resultUrl"> & { resultToken: string },
): Promise<SendResult> {
  const bookingUrl = meetingHref.startsWith("http") ? meetingHref : `${site.url}${meetingHref}`;
  const resultUrl = `${site.url}/diagnostico/resultado/${input.resultToken}`;
  const full: DiagnosticResultEmailInput = { ...input, bookingUrl, resultUrl };
  // Las respuestas del lead llegan directamente a la bandeja del administrador.
  const replyTo = serverEnv().adminEmail;
  return send(to, diagnosticResultSubject(full), diagnosticResultEmail(full), replyTo);
}
