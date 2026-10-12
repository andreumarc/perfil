import "server-only";

import { serverEnv } from "@/lib/env";

import { getResend } from "./client";
import { escapeHtml, layout, row } from "./html";
import {
  leadConfirmationEmail,
  leadConfirmationSubject,
  newLeadEmail,
  newLeadSubject,
  type BrandInfo,
  type LeadConfirmationInput,
  type NewLeadEmailInput,
} from "./templates";

export interface SendResult {
  sent: boolean;
  id?: string;
  reason?: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(serverEnv().resendApiKey);
}

async function send(to: string | string[], subject: string, html: string, replyTo?: string): Promise<SendResult> {
  const resend = getResend();
  if (!resend) return { sent: false, reason: "resend_not_configured" };
  const { emailFrom } = serverEnv();
  try {
    const { data, error } = await resend.emails.send({ from: emailFrom, to, subject, html, ...(replyTo ? { replyTo } : {}) });
    if (error) {
      // Nunca se registran datos personales del destinatario en los logs.
      console.error("[email] error enviando:", error.name, error.message);
      return { sent: false, reason: error.message };
    }
    return { sent: true, id: data?.id };
  } catch (error) {
    console.error("[email] excepción enviando:", error instanceof Error ? error.message : "unknown");
    return { sent: false, reason: error instanceof Error ? error.message : "unknown" };
  }
}

/** Aviso interno de nueva solicitud. Nunca lanza. */
export async function sendNewLeadNotification(input: NewLeadEmailInput, brand: BrandInfo, recipients: string[]): Promise<SendResult> {
  const to = recipients.length ? recipients : serverEnv().notifyEmail ? [serverEnv().notifyEmail as string] : [];
  if (to.length === 0) return { sent: false, reason: "notify_email_not_configured" };
  return send(to, newLeadSubject(input), newLeadEmail(input, brand), input.email);
}

/** Confirmación al solicitante. Nunca lanza. */
export async function sendLeadConfirmation(to: string, input: LeadConfirmationInput, brand: BrandInfo, replyTo?: string): Promise<SendResult> {
  return send(to, leadConfirmationSubject(brand), leadConfirmationEmail(input, brand), replyTo);
}

export interface DataRequestEmailInput {
  type: string;
  name: string;
  email: string;
  message: string | null;
}

/** Aviso interno de una solicitud de derechos RGPD. Nunca lanza. */
export async function sendDataRequestNotification(input: DataRequestEmailInput, brand: { name: string; siteUrl: string }, recipients: string[]): Promise<SendResult> {
  const to = recipients.length ? recipients : serverEnv().notifyEmail ? [serverEnv().notifyEmail as string] : [];
  if (to.length === 0) return { sent: false, reason: "notify_email_not_configured" };
  const body = `
    <p>Se ha recibido una solicitud de ejercicio de derechos de protección de datos. El plazo legal de respuesta es de un mes.</p>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      ${row("Tipo", input.type)}
      ${row("Nombre", input.name)}
      ${row("Email", input.email)}
      ${row("Detalle", input.message ?? "")}
    </table>
    <p style="margin-top:16px">Gestiónala desde el panel: <a href="${escapeHtml(brand.siteUrl)}/admin/rgpd">${escapeHtml(brand.siteUrl)}/admin/rgpd</a></p>`;
  const html = layout({ title: "Nueva solicitud RGPD", brand: brand.name, tagline: "Protección de datos", body, footer: "Aviso automático del sitio web." });
  return send(to, `[RGPD] Nueva solicitud de ${input.type}`, html, input.email);
}
