import { z } from "zod";

import { DATA_REQUEST_TYPES } from "@/types/lead";

import { antiSpamSchema, emailSchema, identityText, optionalText, privacyConsentSchema } from "./lead";

/** Solicitud de ejercicio de derechos RGPD (acceso, rectificación, supresión, otros). */
export const dataRequestSchema = z.object({
  type: z.enum(DATA_REQUEST_TYPES, { error: "Selecciona el tipo de solicitud" }),
  name: identityText(160),
  email: emailSchema,
  message: optionalText(2000),
  privacyConsent: privacyConsentSchema,
});

export type DataRequestInput = z.input<typeof dataRequestSchema>;
export type DataRequestValues = z.infer<typeof dataRequestSchema>;

export const dataRequestSubmissionSchema = z.object({
  request: dataRequestSchema,
  antiSpam: antiSpamSchema,
});
