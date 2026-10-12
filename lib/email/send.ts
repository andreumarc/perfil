import "server-only";

import { serverEnv } from "@/lib/env";

import { getResend } from "./client";
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
