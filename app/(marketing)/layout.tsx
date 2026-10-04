import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StickyCta } from "@/components/layout/sticky-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationJsonLd, personJsonLd, websiteJsonLd } from "@/lib/seo";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-navy-900 focus:px-3 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyCta />
      <JsonLd data={[personJsonLd(), organizationJsonLd(), websiteJsonLd()]} />
    </>
  );
}
