import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { UserManager } from "@/components/admin/users/user-manager";
import { getDb } from "@/db/client";
import { getSession } from "@/lib/auth/guard";
import { listUsers } from "@/lib/auth/users";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Usuarios", robots: { index: false, follow: false } };

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");
  if (!getDb()) return <EmptyDb />;
  const users = await listUsers();
  return (
    <div className="space-y-6">
      <PageHeader title="Usuarios" description="Cuentas con acceso al panel. Cambiar la contraseña o desactivar una cuenta cierra sus sesiones abiertas." />
      <UserManager
        currentUserId={session.userId}
        users={users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, isActive: u.isActive, lastLoginLabel: u.lastLoginAt ? formatDateTime(u.lastLoginAt) : null }))}
      />
    </div>
  );
}
