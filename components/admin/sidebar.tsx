"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenIcon,
  BriefcaseIcon,
  CalendarCheckIcon,
  ExternalLinkIcon,
  HelpCircleIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LayersIcon,
  LogOutIcon,
  MapPinIcon,
  ScrollTextIcon,
  SettingsIcon,
  ShieldIcon,
  UserCogIcon,
  UsersIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/lead";

interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  adminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: readonly NavGroup[] = [
  {
    title: "CRM",
    items: [
      { label: "Resumen", href: "/admin", icon: LayoutDashboardIcon, exact: true },
      { label: "Solicitudes", href: "/admin/leads", icon: UsersIcon },
      { label: "Tareas", href: "/admin/tareas", icon: CalendarCheckIcon },
    ],
  },
  {
    title: "Contenido",
    items: [
      { label: "Servicios", href: "/admin/servicios", icon: WrenchIcon },
      { label: "Sectores", href: "/admin/sectores", icon: LayersIcon },
      { label: "Proyectos", href: "/admin/proyectos", icon: BriefcaseIcon },
      { label: "Blog", href: "/admin/blog", icon: BookOpenIcon },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircleIcon },
      { label: "Zonas", href: "/admin/zonas", icon: MapPinIcon },
      { label: "Medios", href: "/admin/medios", icon: ImageIcon },
    ],
  },
  {
    title: "Administración",
    items: [
      { label: "Ajustes", href: "/admin/ajustes", icon: SettingsIcon, adminOnly: true },
      { label: "Usuarios", href: "/admin/usuarios", icon: UserCogIcon, adminOnly: true },
      { label: "RGPD", href: "/admin/rgpd", icon: ShieldIcon, adminOnly: true },
      { label: "Auditoría", href: "/admin/auditoria", icon: ScrollTextIcon, adminOnly: true },
    ],
  },
];

export function isNavItemActive(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function Sidebar({
  user,
  companyName,
  onNavigate,
  className,
}: {
  user: { name: string; email: string; role: UserRole };
  companyName: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-white", className)}>
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-5">
        <Logo href="/admin" name={companyName} tagline="Panel" />
      </div>

      <nav aria-label="Navegación del panel" className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((group) => {
          const items = group.items.filter((i) => !i.adminOnly || user.role === "admin");
          if (!items.length) return null;
          return (
            <div key={group.title} className="mb-5">
              <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">{group.title}</p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = isNavItemActive(pathname, item);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          active ? "bg-copper-50 text-ink-900" : "text-gray-600 hover:bg-gray-100 hover:text-ink-900",
                        )}
                      >
                        <Icon className={cn("size-4 shrink-0", active ? "text-copper-600" : "text-gray-400")} aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
        <div className="border-t border-gray-200 pt-4">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-ink-900">
            <ExternalLinkIcon className="size-4 shrink-0 text-gray-400" aria-hidden />
            Ver sitio público
          </a>
        </div>
      </nav>

      <div className="shrink-0 border-t border-gray-200 p-4">
        <Link href="/admin/cuenta" onClick={onNavigate} className="block rounded-md px-1 py-1 hover:bg-gray-100">
          <p className="truncate text-sm font-medium text-ink-900">{user.name}</p>
          <p className="truncate text-xs text-gray-500" title={user.email}>
            {user.email} · {user.role === "admin" ? "Administrador" : "Editor"}
          </p>
        </Link>
        <form action={logoutAction} className="mt-3">
          <Button type="submit" variant="outline" size="sm" className="w-full">
            <LogOutIcon aria-hidden />
            Cerrar sesión
          </Button>
        </form>
      </div>
    </div>
  );
}
