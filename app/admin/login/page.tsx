import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/layout/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDb } from "@/db/client";
import { isAuthConfigured } from "@/lib/auth/session";
import { countUsers } from "@/lib/auth/users";
import { getSettings } from "@/lib/cms/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Acceso al panel", robots: { index: false, follow: false } };

function LoginFormSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export default async function AdminLoginPage() {
  const settings = await getSettings();
  const configured = isAuthConfigured() && Boolean(getDb());
  const total = configured ? await countUsers() : null;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Logo name={settings.company.name} tagline="Panel de administración" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <h1>Acceso al panel</h1>
            </CardTitle>
            <CardDescription>Área privada para gestionar solicitudes, contenidos y ajustes.</CardDescription>
          </CardHeader>
          <CardContent>
            {!configured ? (
              <Alert variant="warning">
                <ShieldAlertIcon />
                <AlertTitle>El panel no está configurado</AlertTitle>
                <AlertDescription>
                  <p>Define <code className="font-mono text-xs">DATABASE_URL</code> y <code className="font-mono text-xs">AUTH_SECRET</code> (mínimo 32 caracteres) en las variables de entorno y aplica las migraciones.</p>
                </AlertDescription>
              </Alert>
            ) : total === 0 ? (
              <Alert>
                <ShieldAlertIcon />
                <AlertTitle>Todavía no hay usuarios</AlertTitle>
                <AlertDescription>
                  <p>
                    Crea el primer administrador en{" "}
                    <Link href="/admin/setup" className="underline underline-offset-4">
                      /admin/setup
                    </Link>{" "}
                    con el token <code className="font-mono text-xs">ADMIN_SETUP_TOKEN</code>.
                  </p>
                </AlertDescription>
              </Alert>
            ) : (
              <Suspense fallback={<LoginFormSkeleton />}>
                <LoginForm />
              </Suspense>
            )}
          </CardContent>
        </Card>
        <p className="text-center text-xs text-gray-500">Acceso restringido. La sesión caduca automáticamente a los 7 días.</p>
      </div>
    </main>
  );
}
