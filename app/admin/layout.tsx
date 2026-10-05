import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · CRM",
  robots: { index: false, follow: false },
};

/**
 * Layout raíz del área privada. El root layout ya incluye CookieBanner y
 * AnalyticsProvider; aquí solo se fija el fondo neutro del panel.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh flex-1 bg-gray-50">{children}</div>;
}
