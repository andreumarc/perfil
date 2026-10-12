"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileTextIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { track } from "@/lib/analytics/track";
import { telHref, whatsappHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/validation/settings";

const HIDDEN_PREFIXES = ["/presupuesto", "/contacto", "/admin", "/privacidad/solicitud"];

/**
 * Barra fija inferior solo en móvil: Llamar · WhatsApp · Presupuesto.
 * Los botones de llamada/WhatsApp solo se muestran si hay número configurado.
 */
export function MobileActionBar({ company }: { company: SiteSettings["company"] }) {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const phoneHref = telHref(company.phone);
  const waHref = whatsappHref(company.whatsapp, company.whatsappMessage);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid auto-cols-fr grid-flow-col gap-2 border-t border-gray-200 bg-white/95 p-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      {phoneHref ? (
        <a
          href={phoneHref}
          onClick={() => track("phone_clicked", { location: "mobile_bar" })}
          className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-md border border-gray-200 text-xs font-semibold text-ink-900 active:bg-gray-100"
        >
          <PhoneIcon className="size-4 text-copper-500" aria-hidden />
          Llamar
        </a>
      ) : null}
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_clicked", { location: "mobile_bar" })}
          className="flex h-12 flex-col items-center justify-center gap-0.5 rounded-md border border-gray-200 text-xs font-semibold text-ink-900 active:bg-gray-100"
        >
          <MessageCircleIcon className="size-4 text-copper-500" aria-hidden />
          WhatsApp
        </a>
      ) : null}
      <Link
        href="/presupuesto"
        onClick={() => track("cta_clicked", { location: "mobile_bar" })}
        className="col-span-2 flex h-12 items-center justify-center gap-2 rounded-md bg-copper-500 text-sm font-semibold text-white shadow-lg shadow-copper-500/20 active:bg-copper-600"
      >
        <FileTextIcon className="size-4" aria-hidden />
        Pedir presupuesto
      </Link>
    </div>
  );
}
