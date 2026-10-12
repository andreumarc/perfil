"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

import { captureAttribution } from "@/lib/analytics/attribution";
import { trackPageView } from "@/lib/analytics/track";
import { useConsent } from "@/lib/analytics/use-consent";

export interface AnalyticsIds {
  gtmId?: string;
  ga4Id?: string;
  metaPixelId?: string;
}

const GTM_RE = /^GTM-[A-Z0-9]{4,10}$/;
const GA4_RE = /^G-[A-Z0-9]{4,20}$/;
const PIXEL_RE = /^\d{6,20}$/;

function safeId(value: string | undefined, re: RegExp): string | undefined {
  const v = value?.trim();
  return v && re.test(v) ? v : undefined;
}

/**
 * Carga condicional de scripts de terceros según consentimiento y seguimiento
 * de page views. Los IDs vienen de la configuración del panel (validados en
 * servidor y revalidados aquí antes de interpolarlos en scripts inline).
 *
 * - Con GTM: se carga el contenedor (tras consentimiento de analítica o
 *   marketing) con Consent Mode v2; GA4 debe ir dentro del contenedor.
 * - Sin GTM: gtag.js directo con GA4 (solo analítica) y Meta Pixel (solo marketing).
 */
export function AnalyticsProvider({ ids }: { ids: AnalyticsIds }) {
  const consent = useConsent();
  const pathname = usePathname();

  const gtmId = safeId(ids.gtmId, GTM_RE);
  const ga4Id = safeId(ids.ga4Id, GA4_RE);
  const metaPixelId = safeId(ids.metaPixelId, PIXEL_RE);

  const analyticsOk = consent?.analytics ?? false;
  const marketingOk = consent?.marketing ?? false;

  // Consent Mode v2: actualizar señales al cambiar el consentimiento.
  React.useEffect(() => {
    if (typeof window === "undefined" || !consent) return;
    const update = {
      ad_storage: marketingOk ? "granted" : "denied",
      ad_user_data: marketingOk ? "granted" : "denied",
      ad_personalization: marketingOk ? "granted" : "denied",
      analytics_storage: analyticsOk ? "granted" : "denied",
    };
    if (typeof window.gtag === "function") window.gtag("consent", "update", update);
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: "consent_update", analytics: analyticsOk, marketing: marketingOk });
    }
  }, [consent, analyticsOk, marketingOk]);

  // El panel privado nunca carga analítica de terceros (URLs con ids de leads).
  if (pathname.startsWith("/admin")) return null;

  const consentDefaults = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
gtag('consent', 'update', { ad_storage: '${marketingOk ? "granted" : "denied"}', ad_user_data: '${marketingOk ? "granted" : "denied"}', ad_personalization: '${marketingOk ? "granted" : "denied"}', analytics_storage: '${analyticsOk ? "granted" : "denied"}' });`;

  return (
    <>
      <React.Suspense fallback={null}>
        <PageViewTracker />
      </React.Suspense>
      {process.env.NEXT_PUBLIC_VERCEL_ENV ? <VercelAnalytics /> : null}

      {gtmId && (analyticsOk || marketingOk) ? (
        <>
          <Script id="gtm-consent" strategy="afterInteractive">
            {consentDefaults}
          </Script>
          <Script id="gtm-src" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        </>
      ) : null}

      {!gtmId && analyticsOk && ga4Id ? (
        <>
          <Script id="ga4-src" src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`${consentDefaults}
gtag('js', new Date());
gtag('config', '${ga4Id}', { anonymize_ip: true, send_page_view: false });`}
          </Script>
        </>
      ) : null}

      {!gtmId && marketingOk && metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}
    </>
  );
}

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = React.useRef<string | null>(null);

  React.useEffect(() => {
    captureAttribution();
    const key = `${pathname}?${searchParams.toString()}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;
    if (pathname.startsWith("/admin")) return;
    trackPageView(pathname);
  }, [pathname, searchParams]);

  return null;
}
