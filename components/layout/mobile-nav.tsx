"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { track } from "@/lib/analytics/track";
import { formatPhone, telHref, whatsappHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/validation/settings";

export function MobileNav({ company, menus }: { company: SiteSettings["company"]; menus: SiteSettings["menus"] }) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  const phoneHref = telHref(company.phone);
  const waHref = whatsappHref(company.whatsapp, company.whatsappMessage);
  const services = menus.footer[0]?.items ?? [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto p-0">
        <SheetHeader className="border-b border-gray-200">
          <SheetTitle className="font-display text-ink-900 uppercase">{company.name}</SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.14em]">{company.tagline}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Menú móvil" className="flex flex-col px-3 py-2">
          {menus.main.map((item) => (
            <Link key={item.href} href={item.href} onClick={close} className="rounded-md px-3 py-3 text-base font-medium text-ink-900 hover:bg-gray-100">
              {item.label}
            </Link>
          ))}
          {services.length ? (
            <div className="mt-2 border-t border-gray-200 pt-2">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Servicios destacados</p>
              {services.map((item) => (
                <Link key={item.href} href={item.href} onClick={close} className="block rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </nav>
        <SheetFooter className="border-t border-gray-200">
          <Button asChild size="lg" className="w-full">
            <Link
              href="/presupuesto"
              onClick={() => {
                track("cta_clicked", { location: "mobile_menu" });
                close();
              }}
            >
              Pedir presupuesto sin compromiso
            </Link>
          </Button>
          {waHref ? (
            <Button asChild variant="outline" size="lg" className="w-full">
              <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_clicked", { location: "mobile_menu" })}>
                <MessageCircleIcon aria-hidden />
                Habla con nosotros por WhatsApp
              </a>
            </Button>
          ) : null}
          {phoneHref ? (
            <Button asChild variant="ghost" size="lg" className="w-full">
              <a href={phoneHref} onClick={() => track("phone_clicked", { location: "mobile_menu" })}>
                <PhoneIcon aria-hidden />
                {formatPhone(company.phone)}
              </a>
            </Button>
          ) : null}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
