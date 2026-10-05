"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { track } from "@/lib/analytics/track";
import { footerNav, mainNav, meetingCta, meetingHref, meetingIsExternal, primaryCta, site } from "@/lib/site";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
        <SheetHeader className="border-b border-gray-200">
          <SheetTitle className="text-navy-900">{site.name}</SheetTitle>
          <SheetDescription className="text-xs uppercase tracking-[0.14em]">{site.brand}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Menú móvil" className="flex flex-col px-3 py-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="rounded-md px-3 py-3 text-base font-medium text-navy-900 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 border-t border-gray-200 pt-2">
            <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
              Servicios
            </p>
            {footerNav.servicios.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="block rounded-md px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <Link
            href="/contacto"
            onClick={close}
            className="mt-2 rounded-md border-t border-gray-200 px-3 py-3 text-base font-medium text-navy-900 hover:bg-gray-100"
          >
            Contacto
          </Link>
        </nav>
        <SheetFooter className="border-t border-gray-200">
          <Button asChild size="lg" className="w-full">
            <Link
              href={primaryCta.href}
              onClick={() => {
                track("cta_clicked", { location: "mobile_menu" });
                close();
              }}
            >
              {primaryCta.label}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <a
              href={meetingHref}
              target={meetingIsExternal ? "_blank" : undefined}
              rel={meetingIsExternal ? "noopener noreferrer" : undefined}
              onClick={() => {
                track("meeting_clicked", { location: "mobile_menu" });
                close();
              }}
            >
              {meetingCta.label}
            </a>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
