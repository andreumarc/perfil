"use client";

import * as React from "react";
import { MenuIcon } from "lucide-react";

import { Sidebar } from "@/components/admin/sidebar";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/** Barra superior del admin en móvil: logo + botón que abre la navegación en un Sheet. */
export function AdminMobileNav({ email }: { email: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
      <Logo />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir navegación del admin">
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] max-w-xs gap-0 p-0">
          <SheetTitle className="sr-only">Navegación del admin</SheetTitle>
          <SheetDescription className="sr-only">Secciones del CRM y cierre de sesión.</SheetDescription>
          <Sidebar email={email} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
