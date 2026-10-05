"use client";

import * as React from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

import { captureAttribution } from "@/lib/analytics/attribution";
import { trackPageView } from "@/lib/analytics/track";
import { useConsent } from "@/lib/analytics/use-consent";
import { publicEnv } from "@/lib/env";

/**
 * Carga condicional de scripts de terceros según consentimiento y
 * seguimiento de page views (propio + GA4/Meta).
 */
export function AnalyticsProvider() {
  const consent = useConsent();
  const pathname = usePathname();

  // El CRM privado nunca carga analítica de terceros (URLs con ids de leads).
  if (pathname.startsWith("/admin")) return null;

  const analyticsOk = consent?.analytics ?? false;
  const marketingOk = consent?.marketing ?? false;

  return (
    <>
      <React.Suspense fallback={null}>
        <PageViewTracker />
      </React.Suspense>
      {/* El script de Vercel Analytics solo existe en despliegues de Vercel. */}
      {process.env.NEXT_PUBLIC_VERCEL_ENV ? <VercelAnalytics /> : null}

      {analyticsOk && publicEnv.gaId ? (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${publicEnv.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${publicEnv.gaId}', { anonymize_ip: true, send_page_view: false });`}
          </Script>
        </>
      ) : null}

      {marketingOk && publicEnv.metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${publicEnv.metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
      ) : null}

      {marketingOk && publicEnv.linkedinPartnerId ? (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`_linkedin_partner_id = "${publicEnv.linkedinPartnerId}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");
b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b,s);})(window.lintrk);`}
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
