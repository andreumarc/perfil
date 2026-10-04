"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { track } from "@/lib/analytics/track";
import { primaryCta } from "@/lib/site";

/** CTA fijo inferior solo en móvil. Oculto en el propio diagnóstico y en contacto. */
export function StickyCta() {
  const pathname = usePathname();
  const hidden =
    pathname.startsWith("/diagnostico") ||
    pathname.startsWith("/contacto") ||
    pathname.startsWith("/admin");
  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <Link
        href={primaryCta.href}
        onClick={() => track("cta_clicked", { location: "sticky_mobile" })}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-navy-900 text-base font-semibold text-white shadow-lg shadow-navy-900/20 active:bg-navy-800"
      >
        {primaryCta.label}
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}
