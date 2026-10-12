import type { Metadata, Viewport } from "next";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { CookieBanner } from "@/components/analytics/cookie-banner";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Preloader } from "@/components/motion/preloader";
import { getSettings } from "@/lib/cms/settings";
import { siteUrl } from "@/lib/seo";

import { inter, manrope } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = `${s.company.name} | ${s.seo.defaultTitle}`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: title, template: `%s | ${s.company.name}` },
    description: s.seo.defaultDescription,
    applicationName: s.company.name,
    keywords: s.seo.keywords,
    formatDetection: { email: false, address: false, telephone: false },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: siteUrl,
      siteName: s.company.name,
      title,
      description: s.seo.defaultDescription,
    },
    twitter: { card: "summary_large_image", title, description: s.seo.defaultDescription },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    ...(s.integrations.gscVerification ? { verification: { google: s.integrations.gscVerification } } : {}),
  };
}

export const viewport: Viewport = {
  themeColor: "#17191d",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <html lang="es" className={`${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <MotionProvider>
          {children}
          <Preloader />
        </MotionProvider>
        <CookieBanner />
        <AnalyticsProvider
          ids={{ gtmId: s.integrations.gtmId, ga4Id: s.integrations.ga4Id, metaPixelId: s.integrations.metaPixelId }}
        />
      </body>
    </html>
  );
}
