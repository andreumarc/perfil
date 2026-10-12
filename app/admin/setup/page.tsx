import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SetupForm } from "@/components/admin/setup-form";
import { Logo } from "@/components/layout/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDb } from "@/db/client";
import { isAuthConfigured } from "@/lib/auth/session";
import { countUsers } from "@/lib/auth/users";
import { getSettings } from "@/lib/cms/settings";
import { serverEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Configuración inicial", robots: { index: false, follow: false } };

/**
 * Alta del primer administrador. Solo existe mientras no haya usuarios y haya
 * ADMIN_SETUP_TOKEN configurado; en cualquier otro caso responde 404.
 */
export default async function AdminSetupPage() {
  if (!isAuthConfigured() || !getDb() || !serverEnv().adminSetupToken) notFound();
  const total = await countUsers();
  if (total === null || total > 0) notFound();
  const settings = await getSettings();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo name={settings.company.name} tagline="Configuración inicial" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <h1>Crear el primer administrador</h1>
            </CardTitle>
            <CardDescription>
              Introduce el token de configuración definido en las variables de entorno y los datos de la cuenta. Esta página
              desaparece en cuanto exista un usuario.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetupForm />
          </CardContent>
        </Card>
        <p className="text-center text-xs text-gray-500">Después de crear la cuenta, elimina ADMIN_SETUP_TOKEN del entorno.</p>
      </div>
    </main>
  );
}
