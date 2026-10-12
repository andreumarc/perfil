"use server";

import { after } from "next/server";

import { SERVICES } from "@/content/services";
import { SECTORS } from "@/content/sectors";
import { getDb } from "@/db/client";
import { createLead } from "@/db/queries/leads";
import { signAttachmentToken } from "@/lib/auth/attachment-token";
import { getSettings } from "@/lib/cms/settings";
import { isEmailConfigured, sendLeadConfirmation, sendNewLeadNotification } from "@/lib/email/send";
import { serverEnv } from "@/lib/env";
import { FORM_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { siteUrl } from "@/lib/seo";
import { isStorageConfigured } from "@/lib/storage/blob";
import { verifyTurnstile } from "@/lib/turnstile";
import { CONSENT_TEXT_VERSION, fieldErrors, isSuspiciousFillTime, leadSubmissionSchema } from "@/lib/validation/lead";

export type SubmitLeadState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; leadId: string | null; attachToken?: string };

/**
 * Server action común a todos los formularios de captación (presupuesto,
 * contacto, formularios contextuales de servicios y artículos).
 */
export async function submitLead(payload: unknown): Promise<SubmitLeadState> {
  const parsed = leadSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;

  // Anti-spam: honeypot (ya validado por el schema) + ventana de cumplimentación plausible.
  if (isSuspiciousFillTime(data.antiSpam.startedAt)) {
    return { status: "error", message: "No se ha podido procesar el envío. Inténtalo de nuevo." };
  }

  const meta = await getRequestMeta();
  const limit = await rateLimit(`lead:${meta.rateKey}`, FORM_RATE_LIMIT);
  if (!limit.ok) {
    return {
      status: "error",
      message: `Has alcanzado el límite de envíos. Vuelve a intentarlo en ${Math.max(1, Math.ceil(limit.retryAfterSeconds / 60))} minutos.`,
    };
  }

  // CAPTCHA opcional (solo si Turnstile está configurado en el servidor).
  const turnstile = await verifyTurnstile(data.antiSpam.turnstileToken, meta.ip);
  if (turnstile === false) {
    return { status: "error", message: "No hemos podido verificar que eres una persona. Recarga la página e inténtalo de nuevo." };
  }

  const settings = await getSettings();
  const hasDb = Boolean(getDb());
  const hasEmail = isEmailConfigured();
  const recipients = settings.notifications.leadEmails.length
    ? settings.notifications.leadEmails
    : serverEnv().notifyEmail
      ? [serverEnv().notifyEmail as string]
      : [];

  // Sin base de datos ni email configurados, la solicitud no llegaría a nadie:
  // se informa al usuario en lugar de fingir un envío correcto.
  if (!hasDb && !(hasEmail && recipients.length)) {
    console.error("[lead] solicitud recibida sin DATABASE_URL ni RESEND_API_KEY/NOTIFY_EMAIL configurados");
    const alt = [settings.company.phone ? `llámanos al ${settings.company.phone}` : "", settings.company.email ? `escríbenos a ${settings.company.email}` : ""]
      .filter(Boolean)
      .join(" o ");
    return {
      status: "error",
      message: `El formulario no está operativo en este momento. ${alt ? `Por favor, ${alt}.` : "Inténtalo de nuevo más tarde."}`,
    };
  }

  const l = data.lead;
  const service = l.serviceSlug ? SERVICES.find((s) => s.slug === l.serviceSlug) : undefined;
  const sector = l.sectorSlug ? SECTORS.find((s) => s.slug === l.sectorSlug) : undefined;
  const squareMeters = typeof l.squareMeters === "number" ? l.squareMeters : null;

  let leadId: string | null = null;
  let persisted = false;
  try {
    const lead = await createLead({
      lead: {
        name: l.name,
        email: l.email,
        phone: l.phone,
        locality: l.locality || null,
        postalCode: l.postalCode || null,
        propertyType: l.propertyType || null,
        serviceSlug: l.serviceSlug || null,
        sectorSlug: l.sectorSlug || null,
        squareMeters,
        budgetRange: l.budgetRange || null,
        timeline: l.timeline || null,
        message: l.message || null,
        context: data.context,
        formVariant: data.formVariant,
        articleSlug: data.articleSlug ?? null,
        source: data.source,
        sourcePage: data.sourcePage ?? data.attribution.landingPage ?? null,
        campaign: data.attribution.utmCampaign ?? null,
        utmSource: data.attribution.utmSource ?? null,
        utmMedium: data.attribution.utmMedium ?? null,
        utmCampaign: data.attribution.utmCampaign ?? null,
        utmContent: data.attribution.utmContent ?? null,
        utmTerm: data.attribution.utmTerm ?? null,
        referrer: data.attribution.referrer ?? null,
        privacyConsent: true,
        marketingConsent: l.marketingConsent,
        consentAt: new Date(),
        consentTextVersion: CONSENT_TEXT_VERSION,
        status: "NEW",
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,
        device: meta.device,
        country: meta.country,
        visitorId: data.visitorId ?? null,
        turnstileOk: turnstile === true ? true : null,
      },
      consent: { analytics: false, marketing: l.marketingConsent, version: 1, source: "lead_form" },
    });
    leadId = lead?.id ?? null;
    persisted = Boolean(lead);
  } catch (error) {
    console.error("[lead] error guardando la solicitud:", error instanceof Error ? error.message : error);
  }

  if (!persisted && !(hasEmail && recipients.length)) {
    return { status: "error", message: "No se ha podido registrar la solicitud. Inténtalo de nuevo en unos minutos." };
  }

  const brand = {
    name: settings.company.name,
    tagline: settings.company.tagline,
    siteUrl,
    phone: settings.company.phone || undefined,
    email: settings.company.email || undefined,
  };

  after(async () => {
    await sendNewLeadNotification(
      {
        leadId,
        name: l.name,
        email: l.email,
        phone: l.phone,
        locality: l.locality || null,
        postalCode: l.postalCode || null,
        propertyType: l.propertyType || null,
        serviceName: service?.name ?? null,
        sectorName: sector?.name ?? null,
        squareMeters,
        budgetRange: l.budgetRange || null,
        timeline: l.timeline || null,
        message: l.message || null,
        context: data.context,
        source: data.source,
        sourcePage: data.sourcePage ?? null,
        articleSlug: data.articleSlug ?? null,
        utmSource: data.attribution.utmSource ?? null,
        utmMedium: data.attribution.utmMedium ?? null,
        utmCampaign: data.attribution.utmCampaign ?? null,
        attachmentCount: data.attachmentCount,
        marketingConsent: l.marketingConsent,
      },
      brand,
      recipients,
    );
    await sendLeadConfirmation(l.email, { name: l.name, serviceName: service?.name ?? null }, brand, recipients[0]);
  });

  const attachToken = leadId && data.attachmentCount > 0 && isStorageConfigured("private") ? await signAttachmentToken(leadId) : null;
  return { status: "success", leadId, ...(attachToken ? { attachToken } : {}) };
}
