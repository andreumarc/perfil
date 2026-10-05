"use server";

import { after } from "next/server";

import { createLead } from "@/db/queries/leads";
import { sendNewLeadNotification } from "@/lib/email/send";
import { scoreLead } from "@/lib/lead-scoring";
import { FORM_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { contactSubmissionSchema, fieldErrors, isSuspiciousFillTime } from "@/lib/validation/lead";

export type SubmitContactState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  /** `priority` es un indicador opaco para adaptar el copy; el score interno no se expone. */
  | { status: "success"; leadId: string | null; priority: "high" | "standard" };

const CONSENT_TEXT_VERSION = "2026-10-01";

/** Server action del formulario de contacto (y de la calculadora EBITDA). */
export async function submitContact(payload: unknown): Promise<SubmitContactState> {
  const parsed = contactSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }
  const data = parsed.data;

  // Anti-spam: honeypot (ya validado por el schema) + ventana de cumplimentación plausible.
  if (isSuspiciousFillTime(data.antiSpam.startedAt)) {
    return { status: "error", message: "No se ha podido procesar el envío. Inténtalo de nuevo." };
  }

  const meta = await getRequestMeta();
  const limit = await rateLimit(`contact:${meta.rateKey}`, FORM_RATE_LIMIT);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Has alcanzado el límite de envíos. Vuelve a intentarlo en ${Math.ceil(limit.retryAfterSeconds / 60)} minutos.`,
    };
  }

  const c = data.contact;
  const score = scoreLead({
    numberLocations: c.numberLocations,
    companyRevenue: c.companyRevenue ?? null,
    jobTitle: c.jobTitle,
    sector: c.sector ?? null,
    mainProblem: c.mainProblem,
  });

  const contextNote = data.context
    ? Object.entries(data.context)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(" · ")
    : null;

  let leadId: string | null = null;
  try {
    const lead = await createLead({
      lead: {
        firstName: c.firstName,
        lastName: c.lastName,
        company: c.company,
        jobTitle: c.jobTitle,
        email: c.email,
        phone: c.phone || null,
        sector: c.sector ?? null,
        companyRevenue: c.companyRevenue ?? null,
        numberLocations: c.numberLocations,
        mainProblem: c.mainProblem,
        score: score.score,
        leadLevel: score.level,
        isHot: score.isHot,
        status: "NEW",
        source: data.source,
        message: c.message,
        notes: contextNote ? `Contexto calculadora → ${contextNote}` : null,
        utmSource: data.attribution.utmSource ?? null,
        utmMedium: data.attribution.utmMedium ?? null,
        utmCampaign: data.attribution.utmCampaign ?? null,
        utmContent: data.attribution.utmContent ?? null,
        utmTerm: data.attribution.utmTerm ?? null,
        referrer: data.attribution.referrer ?? null,
        landingPage: data.attribution.landingPage ?? null,
        gdprConsent: true,
        consentAt: new Date(),
        consentTextVersion: CONSENT_TEXT_VERSION,
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,
        device: meta.device,
        country: meta.country,
        visitorId: data.visitorId ?? null,
      },
    });
    leadId = lead?.id ?? null;
  } catch (error) {
    console.error("[contact] error guardando el lead:", error);
  }

  after(async () => {
    await sendNewLeadNotification({
      leadId: leadId ?? "sin-id",
      firstName: c.firstName,
      lastName: c.lastName,
      company: c.company,
      jobTitle: c.jobTitle,
      email: c.email,
      phone: c.phone || null,
      numberLocations: c.numberLocations,
      companyRevenue: c.companyRevenue ?? null,
      sector: c.sector ?? null,
      mainProblem: c.mainProblem,
      score: score.score,
      leadLevel: score.level,
      isHot: score.isHot,
      source: data.source,
      utmSource: data.attribution.utmSource ?? null,
      utmMedium: data.attribution.utmMedium ?? null,
      utmCampaign: data.attribution.utmCampaign ?? null,
      message: [c.message, contextNote].filter(Boolean).join("\n\n"),
    });
  });

  return { status: "success", leadId, priority: score.isHot ? "high" : "standard" };
}
