import { QuoteFormLazy } from "@/components/forms/quote-form-lazy";
import { QuotePopup } from "@/components/forms/quote-popup";
import { FloatingCta } from "@/components/layout/floating-cta";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { Ticker } from "@/components/layout/ticker";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { JsonLd } from "@/components/seo/json-ld";
import { getServices } from "@/lib/cms/services";
import { getSettings } from "@/lib/cms/settings";
import { getZones } from "@/lib/cms/zones";
import { formatPhone, telHref, whatsappHref } from "@/lib/phone";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Las páginas públicas son estáticas con regeneración incremental cada 5 minutos. */
export const revalidate = 300;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [settings, zones, services] = await Promise.all([getSettings(), getZones(), getServices()]);
  const wa = whatsappHref(settings.company.whatsapp, settings.company.whatsappMessage);
  // Municipios con página propia (sin las zonas genéricas "toda Cataluña" / "toda España").
  const localZones = zones.filter((z) => !["cataluna", "espana"].includes(z.slug));
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink-900 focus:px-3 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      {settings.ticker.enabled ? <Ticker messages={settings.ticker.messages} /> : null}
      <Header settings={settings} />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} zones={localZones.slice(0, 14)} />
      <FloatingCta />
      <WhatsAppButton href={wa} />
      <MobileActionBar company={settings.company} />
      <QuotePopup whatsappHref={wa} phoneHref={telHref(settings.company.phone)} phoneLabel={formatPhone(settings.company.phone)} email={settings.company.email}>
        <QuoteFormLazy layout="compact" source="presupuesto" variant="general" submitLabel="Pedir presupuesto" />
      </QuotePopup>
      <JsonLd data={[organizationJsonLd(settings, localZones.map((z) => z.name), services.map((x) => ({ name: x.name, slug: x.slug, summary: x.summary }))), websiteJsonLd(settings)]} />
    </>
  );
}
