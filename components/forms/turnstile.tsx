"use client";

import * as React from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

/** Widget de Cloudflare Turnstile (solo se monta si hay clave pública configurada). */
export function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const idRef = React.useRef<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (!ready || !ref.current || !window.turnstile || idRef.current) return;
    idRef.current = window.turnstile.render(ref.current, {
      sitekey: siteKey,
      language: "es",
      callback: (token: string) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    return () => {
      if (idRef.current && window.turnstile) window.turnstile.remove(idRef.current);
      idRef.current = null;
    };
  }, [ready, siteKey, onToken]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => setReady(true)} />
      <div ref={ref} className="min-h-16" />
    </>
  );
}
