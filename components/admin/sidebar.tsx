"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartColumnIcon,
  ClipboardListIcon,
  ExternalLinkIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Si es true, solo está activo cuando la ruta coincide exactamente. */
  exact?: boolean;
}

export const ADMIN_NAV: readonly AdminNavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboardIcon, exact: true },
  { label: "Leads", href: "/admin/leads", icon: UsersIcon },
  { label: "Analytics", href: "/admin/analytics", icon: ChartColumnIcon },
  { label: "Diagnósticos", href: "/admin/diagnosticos", icon: ClipboardListIcon },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

export function isNavItemActive(pathname: string, item: AdminNavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

/**
 * Barra lateral del CRM. Se usa fija en desktop y dentro de un Sheet en móvil
 * (en ese caso `onNavigate` cierra el panel al elegir una sección).
 */
export function Sidebar({
  email,
  onNavigate,
  className,
}: {
  email: string;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-white", className)}>
      <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-5">
        <Logo href="/admin" />
      </div>

      <nav aria-label="Navegación del admin" className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">CRM</p>
        <ul className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const active = isNavItemActive(pathname, item);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-navy-50 text-navy-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-navy-900",
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", active ? "text-navy-900" : "text-gray-400")} aria-hidden />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-navy-900"
          >
            <ExternalLinkIcon className="size-4 shrink-0 text-gray-400" aria-hidden />
            Ver sitio público
          </a>
        </div>
      </nav>

      <div className="shrink-0 border-t border-gray-200 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Sesión</p>
        <p className="mt-1 truncate text-sm text-navy-900" title={email}>
          {email}
        </p>
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
