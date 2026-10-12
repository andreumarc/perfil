import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { SeedButton } from "@/components/admin/settings/seed-button";
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
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-ink-900">Contenido inicial</h2>
        <p className="mt-1 mb-4 text-sm text-gray-600">Si el sitio está vacío (primer despliegue), carga aquí los servicios, sectores, proyectos tipo, artículos y textos de ejemplo. Equivale a ejecutar npm run db:seed.</p>
        <SeedButton />
      </section>
    </div>
  );
}
