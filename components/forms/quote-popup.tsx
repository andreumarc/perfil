"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { WhatsAppIcon } from "@/components/layout/whatsapp-button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LEAD_CREATED_EVENT, QUOTE_POPUP_STORAGE_KEY } from "@/lib/analytics/keys";
import { track } from "@/lib/analytics/track";
import { useConsent } from "@/lib/analytics/use-consent";
import { QUOTE_POPUP_DELAY_MS, QUOTE_POPUP_SCROLL_RATIO, canShowQuotePopup, parseQuotePopupState, type QuotePopupState } from "@/lib/quote-popup";

function readState(): QuotePopupState {
  try {
    return parseQuotePopupState(window.localStorage.getItem(QUOTE_POPUP_STORAGE_KEY));
  } catch {
    return {};
  }
}

function writeState(patch: Partial<QuotePopupState>) {
  try {
    window.localStorage.setItem(QUOTE_POPUP_STORAGE_KEY, JSON.stringify({ ...readState(), ...patch }));
  } catch {
    /* sin almacenamiento (modo privado): el pop-up solo se controla en memoria */
  }
}

type Trigger = "time" | "scroll" | "exit";

/**
 * Pop-up de solicitud de presupuesto. Se abre una sola vez por visitante y semana,
 * cuando ya ha decidido sobre las cookies y, además, lleva 20 s en la página, ha leído
 * más de la mitad o (en escritorio) va a abandonarla. No aparece en las páginas de
 * formulario, legales ni en el panel, y nunca a quien ya ha enviado una solicitud.
 * `children` es el formulario compacto de presupuesto (componente de servidor).
 */
export function QuotePopup({ whatsappHref, children }: { whatsappHref: string | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const consent = useConsent();
  const [open, setOpen] = React.useState(false);
  const converted = React.useRef(false);

  // Cualquier formulario del sitio que registre una solicitud desactiva el pop-up.
  React.useEffect(() => {
    const onLead = () => {
      converted.current = true;
      writeState({ converted: true });
    };
    window.addEventListener(LEAD_CREATED_EVENT, onLead);
    return () => window.removeEventListener(LEAD_CREATED_EVENT, onLead);
  }, []);

  React.useEffect(() => {
    if (!consent || open) return;
    if (!canShowQuotePopup(readState(), Date.now(), pathname)) return;

    let fired = false;
    let timer = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= QUOTE_POPUP_SCROLL_RATIO) fire("scroll");
    };
    const onMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget && event.clientY <= 0) fire("exit");
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
    };
    const show = (trigger: Trigger) => {
      writeState({ shownAt: Date.now() });
      setOpen(true);
      track("popup_shown", { trigger, path: pathname });
    };
    function fire(trigger: Trigger) {
      if (fired) return;
      fired = true;
      cleanup();
      if (document.visibilityState === "visible") {
        show(trigger);
        return;
      }
      // Pestaña en segundo plano: esperar a que el visitante vuelva.
      const onVisible = () => {
        if (document.visibilityState !== "visible") return;
        document.removeEventListener("visibilitychange", onVisible);
        show(trigger);
      };
      document.addEventListener("visibilitychange", onVisible);
    }

    timer = window.setTimeout(() => fire("time"), QUOTE_POPUP_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onMouseOut);
    return cleanup;
  }, [consent, open, pathname]);

  const close = () => {
    setOpen(false);
    writeState({ shownAt: Date.now() });
    track("popup_closed", { converted: converted.current, path: pathname }, { persist: false });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? setOpen(true) : close())}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="text-left">
          <p className="eyebrow">Presupuesto sin compromiso</p>
          <DialogTitle className="font-display text-2xl leading-tight md:text-3xl">¿Estás pensando en reformar?</DialogTitle>
          <DialogDescription className="text-gray-600">
            Cuéntanos qué quieres reformar y te llamamos para concretar una visita. Sin coste y sin compromiso.
          </DialogDescription>
        </DialogHeader>
        {children}
        {whatsappHref ? (
          <p className="text-center text-sm text-gray-600">
            ¿Prefieres escribirnos?{" "}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_clicked", { location: "popup" })}
              className="inline-flex items-center gap-1.5 font-semibold text-ink-900 underline underline-offset-4 hover:text-copper-600"
            >
              <WhatsAppIcon className="size-4 text-[#25d366]" />
              Hablar por WhatsApp
            </a>
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
