import "server-only";

import { Resend } from "resend";

import { serverEnv } from "@/lib/env";

let client: Resend | null | undefined;

/** Cliente Resend o null si no está configurado. Nunca lanza. */
export function getResend(): Resend | null {
  if (client !== undefined) return client;
  const { resendApiKey } = serverEnv();
  client = resendApiKey ? new Resend(resendApiKey) : null;
  if (!client) console.info("[email] RESEND_API_KEY no configurada: emails desactivados.");
  return client;
}
