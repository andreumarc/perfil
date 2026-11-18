import "server-only";

import type { LeadFormProps } from "@/components/forms/lead-form";
import { SERVICE_GROUPS } from "@/content/services";
import { getServices, getSectors } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { publicEnv } from "@/lib/env";
import { whatsappHref } from "@/lib/phone";
import { isStorageConfigured } from "@/lib/storage/blob";

export type QuoteFormProps = Omit<LeadFormProps, "services" | "sectors" | "whatsappHref" | "turnstileSiteKey" | "attachmentsEnabled">;

/** Opciones y ajustes que necesita el formulario de presupuesto (servicios, sectores, WhatsApp, Turnstile, adjuntos). */
export async function getQuoteFormProps(): Promise<Pick<LeadFormProps, "services" | "sectors" | "whatsappHref" | "turnstileSiteKey" | "attachmentsEnabled">> {
  const [services, sectors, settings] = await Promise.all([getServices(), getSectors(), getSettings()]);
  const groupName = (slug: string) => SERVICE_GROUPS.find((g) => g.slug === slug)?.name ?? slug;
  return {
    services: services.map((s) => ({ slug: s.slug, name: s.name, groupSlug: s.groupSlug, groupName: groupName(s.groupSlug) })),
    sectors: sectors.map((s) => ({ slug: s.slug, name: s.name })),
    whatsappHref: whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage),
    turnstileSiteKey: publicEnv.turnstileSiteKey,
    attachmentsEnabled: isStorageConfigured("private"),
  };
}
