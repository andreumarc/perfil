import { FloatingCta } from "@/components/layout/floating-cta";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { Ticker } from "@/components/layout/ticker";
import { JsonLd } from "@/components/seo/json-ld";
import { getSettings } from "@/lib/cms/settings";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Las páginas públicas son estáticas con regeneración incremental cada 5 minutos. */
export const revalidate = 300;

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
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
      <Footer settings={settings} />
      <FloatingCta />
      <MobileActionBar company={settings.company} />
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(settings)]} />
    </>
  );
}
