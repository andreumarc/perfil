import { redirect } from "next/navigation";

import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { Sidebar } from "@/components/admin/sidebar";
import { getSession } from "@/lib/auth/guard";
import { getSettings } from "@/lib/cms/settings";

export const dynamic = "force-dynamic";

/**
 * Shell del panel: sidebar fija en desktop, barra superior con Sheet en móvil.
 * proxy.ts ya redirige sin cookie válida; aquí se comprueba además en BD que
 * el usuario existe, está activo y no ha invalidado la sesión.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const settings = await getSettings();
  const user = { name: session.name, email: session.email, role: session.role };

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden border-r border-gray-200 bg-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col">
        <Sidebar user={user} companyName={settings.company.name} />
      </aside>
      <div className="flex min-h-dvh w-full min-w-0 flex-1 flex-col md:pl-64">
        <AdminMobileNav user={user} companyName={settings.company.name} />
        <main id="contenido" className="flex-1 p-5 md:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
