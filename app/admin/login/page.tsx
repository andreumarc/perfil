import { Suspense } from "react";
import type { Metadata } from "next";
import { ShieldAlertIcon } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/layout/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isAdminConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acceso admin",
  robots: { index: false, follow: false },
};

function LoginFormSkeleton() {
  return (
    <div className="space-y-5" aria-hidden>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-11 w-full" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

function NotConfigured() {
  return (
    <Alert variant="warning">
      <ShieldAlertIcon />
      <AlertTitle>El acceso admin no está configurado</AlertTitle>
      <AlertDescription>
        <p>Define estas variables de entorno (en `.env.local` y en el proveedor de hosting) y reinicia la aplicación:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs">ADMIN_EMAIL</code> — email con el que
            iniciarás sesión.
          </li>
          <li>
            <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs">ADMIN_PASSWORD</code> — contraseña de al
            menos 8 caracteres.
          </li>
          <li>
            <code className="rounded bg-white/70 px-1 py-0.5 font-mono text-xs">AUTH_SECRET</code> — secreto aleatorio
            (mínimo 16 caracteres) para firmar la sesión.
          </li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}

export default function AdminLoginPage() {
  const configured = isAdminConfigured();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              <h1>Acceso al CRM</h1>
            </CardTitle>
            <CardDescription>Área privada. Introduce tus credenciales de administrador.</CardDescription>
          </CardHeader>
          <CardContent>
            {configured ? (
              <Suspense fallback={<LoginFormSkeleton />}>
                <LoginForm />
              </Suspense>
            ) : (
              <NotConfigured />
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500">
          Acceso restringido. La sesión caduca automáticamente a los 7 días.
        </p>
      </div>
    </main>
  );
}
