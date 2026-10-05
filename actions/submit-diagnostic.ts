"use server";

import { after } from "next/server";

import { createLead, findRecentLeadByEmail, generateResultToken } from "@/db/queries/leads";
import { recordEvent } from "@/db/queries/events";
import { calculateDiagnostic, type DiagnosticResult } from "@/lib/diagnostic/calculate";
import { sendDiagnosticResultToLead, sendNewLeadNotification } from "@/lib/email/send";
import { serverEnv } from "@/lib/env";
import { scoreLead } from "@/lib/lead-scoring";
import { FORM_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { diagnosticSubmissionSchema, fieldErrors, isSuspiciousFillTime } from "@/lib/validation/lead";

export type SubmitDiagnosticState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | {
      status: "success";
      result: DiagnosticResult;
      leadId: string | null;
      resultToken: string | null;
      persisted: boolean;
      /** true si Resend está configurado y se ha encolado el email con el resultado. */
      emailQueued: boolean;
    };

const CONSENT_TEXT_VERSION = "2026-10-01";

/**
 * Server action: valida el envío del diagnóstico, calcula resultado y score,
 * persiste en Neon (si hay DB), notifica por email y devuelve el resultado.
 */
export async function submitDiagnostic(payload: unknown): Promise<SubmitDiagnosticState> {
  const parsed = diagnosticSubmissionSchema.safeParse(payload);
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
  const limit = await rateLimit(`diagnostic:${meta.rateKey}`, FORM_RATE_LIMIT);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Has alcanzado el límite de envíos. Vuelve a intentarlo en ${Math.ceil(limit.retryAfterSeconds / 60)} minutos.`,
    };
  }

  const result = calculateDiagnostic(data.answers);
  const score = scoreLead({
    numberLocations: data.lead.numberLocations,
    companyRevenue: data.lead.companyRevenue,
    jobTitle: data.lead.jobTitle,
    sector: data.lead.sector,
    mainProblem: result.profile.mainProblem,
    pain: result.pain,
  });

  const resultToken = generateResultToken();
  let leadId: string | null = null;
  let persisted = false;

  try {
    // Evita duplicados si el mismo email repite el diagnóstico en 24 h: se crea
    // un nuevo registro igualmente (histórico), pero se anota en metadata.
    const previous = await findRecentLeadByEmail(data.lead.email);

    const lead = await createLead({
      lead: {
        firstName: data.lead.firstName,
        lastName: data.lead.lastName,
        company: data.lead.company,
        jobTitle: data.lead.jobTitle,
        email: data.lead.email,
        phone: data.lead.phone || null,
        sector: data.lead.sector,
        companyRevenue: data.lead.companyRevenue,
        numberLocations: data.lead.numberLocations,
        mainProblem: result.profile.mainProblem ?? null,
        score: score.score,
        leadLevel: score.level,
        isHot: score.isHot,
        status: "NEW",
        source: data.source,
        notes: previous ? `Repite diagnóstico (lead previo ${previous.id}).` : null,
        utmSource: data.attribution.utmSource ?? null,
        utmMedium: data.attribution.utmMedium ?? null,
        utmCampaign: data.attribution.utmCampaign ?? null,
        utmContent: data.attribution.utmContent ?? null,
        utmTerm: data.attribution.utmTerm ?? null,
        referrer: data.attribution.referrer ?? null,
        landingPage: data.attribution.landingPage ?? null,
        resultToken,
        gdprConsent: true,
        consentAt: new Date(),
        consentTextVersion: CONSENT_TEXT_VERSION,
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,
        device: meta.device,
        country: meta.country,
        visitorId: data.visitorId ?? null,
      },
      answers: data.answers,
      result,
    });
    if (lead) {
      leadId = lead.id;
      persisted = true;
      await recordEvent({
        leadId: lead.id,
        visitorId: data.visitorId ?? null,
        eventType: "diagnostic_completed",
        page: "/diagnostico",
        metadata: { totalScore: result.totalScore, level: result.level },
      });
    }
  } catch (error) {
    // La persistencia nunca debe impedir que el usuario vea su resultado.
    console.error("[diagnostic] error guardando el lead:", error);
  }

  const emailInput = {
    leadId: leadId ?? "sin-id",
    firstName: data.lead.firstName,
    lastName: data.lead.lastName,
    company: data.lead.company,
    jobTitle: data.lead.jobTitle,
    email: data.lead.email,
    phone: data.lead.phone || null,
    numberLocations: data.lead.numberLocations,
    companyRevenue: data.lead.companyRevenue,
    sector: data.lead.sector,
    mainProblem: result.profile.mainProblem ?? null,
    score: score.score,
    leadLevel: score.level,
    isHot: score.isHot,
    source: data.source,
    utmSource: data.attribution.utmSource ?? null,
    utmMedium: data.attribution.utmMedium ?? null,
    utmCampaign: data.attribution.utmCampaign ?? null,
    diagnostic: result,
  };

  // El email al lead solo tiene sentido si el resultado quedó guardado (enlace permanente).
  const emailQueued = persisted && Boolean(serverEnv().resendApiKey);

  // Los emails se envían tras responder al usuario: no retrasan el resultado.
  after(async () => {
    await Promise.allSettled([
      sendNewLeadNotification(emailInput),
      emailQueued
        ? sendDiagnosticResultToLead(data.lead.email, {
            firstName: data.lead.firstName,
            company: data.lead.company,
            result,
            resultToken,
            recommendedServiceSlug: result.recommendations.recommendedService.slug,
          })
        : Promise.resolve(null),
    ]);
  });

  // El lead score es información comercial interna: no se devuelve al navegador.
  return {
    status: "success",
    result,
    leadId,
    resultToken: persisted ? resultToken : null,
    persisted,
    emailQueued,
  };
}
