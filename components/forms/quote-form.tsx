import { LeadForm, type LeadFormProps } from "@/components/forms/lead-form";
import { getServices, getSectors } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { SERVICE_GROUPS } from "@/content/services";
import { publicEnv } from "@/lib/env";
import { whatsappHref } from "@/lib/phone";

type Props = Omit<LeadFormProps, "services" | "sectors" | "whatsappHref" | "turnstileSiteKey">;

/** Wrapper de servidor: carga opciones (servicios, sectores) y ajustes y renderiza el formulario cliente. */
export async function QuoteForm(props: Props) {
  const [services, sectors, settings] = await Promise.all([getServices(), getSectors(), getSettings()]);
  const groupName = (slug: string) => SERVICE_GROUPS.find((g) => g.slug === slug)?.name ?? slug;
  return (
    <LeadForm
      {...props}
      services={services.map((s) => ({ slug: s.slug, name: s.name, groupSlug: s.groupSlug, groupName: groupName(s.groupSlug) }))}
      sectors={sectors.map((s) => ({ slug: s.slug, name: s.name }))}
      whatsappHref={whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage)}
      turnstileSiteKey={publicEnv.turnstileSiteKey}
    />
  );
}
