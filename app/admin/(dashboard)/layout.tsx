import { redirect } from "next/navigation";

import { AdminMobileNav } from "@/components/admin/mobile-nav";
import { Sidebar } from "@/components/admin/sidebar";
import { getAdminSession } from "@/lib/auth";

/**
 * Shell del CRM: sidebar fija en desktop, barra superior con Sheet en móvil.
 * proxy.ts ya redirige sin cookie válida; esta comprobación es la segunda línea.
 */
export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden border-r border-gray-200 bg-white md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col">
        <Sidebar email={session.email} />
      </aside>

      <div className="flex min-h-dvh w-full min-w-0 flex-1 flex-col md:pl-64">
        <AdminMobileNav email={session.email} />
        <main id="contenido" className="flex-1 p-5 md:p-8">
          <div className="mx-auto w-full max-w-7xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
