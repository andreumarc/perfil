import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { ChangePasswordForm } from "@/components/admin/users/change-password-form";
import { getSession } from "@/lib/auth/guard";
import { USER_ROLE_LABELS } from "@/types/lead";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="space-y-6">
      <PageHeader title="Mi cuenta" description={`${session.name} · ${session.email} · ${USER_ROLE_LABELS[session.role]}`} />
      <SectionCard title="Cambiar contraseña" description="Al cambiarla se cierran todas las sesiones abiertas de tu cuenta.">
        <ChangePasswordForm />
      </SectionCard>
    </div>
  );
}
