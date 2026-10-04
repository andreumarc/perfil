import type { Metadata, Viewport } from "next";

import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { CookieBanner } from "@/components/analytics/cookie-banner";
import { site } from "@/lib/site";

import { inter, sourceSerif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Especialista en rendimiento de empresas multicentro`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [...site.keywords],
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: `${site.name} · ${site.brand}`,
    title: `${site.name} | Especialista en rendimiento de empresas multicentro`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.brand}`,
    description: site.description,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#0a1a33",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="min-h-dvh flex flex-col">
        {children}
        <CookieBanner />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
