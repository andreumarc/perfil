import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { getDb } from "@/db/client";
import { loadMediaOptions } from "@/lib/admin/options";
import { getSession } from "@/lib/auth/guard";
import { getSettings } from "@/lib/cms/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ajustes", robots: { index: false, follow: false } };

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");
  if (!getDb()) return <EmptyDb />;
  const [settings, mediaOptions] = await Promise.all([getSettings(), loadMediaOptions()]);
  return (
    <div className="space-y-6">
      <PageHeader title="Ajustes del sitio" description="Datos de la empresa, portada, menús, SEO, integraciones, calculadoras y textos legales. Todo lo que ves en la web pública se edita aquí." />
      <SettingsForm initial={settings} mediaOptions={mediaOptions} />
    </div>
  );
}
