"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { track } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

const HIDDEN_PREFIXES = ["/presupuesto", "/contacto", "/admin", "/privacidad/solicitud"];

/** CTA flotante de escritorio: aparece tras hacer scroll, oculto en páginas de formulario. */
export function FloatingCta() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className={cn(
        "fixed right-6 bottom-6 z-30 hidden transition-all duration-300 md:block",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <Link
        href="/presupuesto"
        onClick={() => track("cta_clicked", { location: "floating" })}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-copper-500 px-6 text-sm font-semibold text-white shadow-lg shadow-copper-500/30 transition-colors hover:bg-copper-600"
      >
        Presupuesto sin compromiso
        <ArrowRightIcon className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
