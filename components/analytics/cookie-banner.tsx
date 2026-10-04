"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getConsent, saveConsent } from "@/lib/analytics/consent";
import { track } from "@/lib/analytics/track";

/**
 * Banner de consentimiento de cookies (RGPD / LSSI).
 * Aceptar / Rechazar al mismo nivel. Configuración granular (analítica, marketing).
 */
export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [configuring, setConfiguring] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    // Se evalúa tras el montaje para no bloquear el render inicial.
    const id = window.setTimeout(() => setVisible(getConsent() === null), 600);
    const open = () => {
      setConfiguring(true);
      setVisible(true);
    };
    window.addEventListener("mg:open-cookie-settings", open);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("mg:open-cookie-settings", open);
    };
  }, []);

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setVisible(false);
    setConfiguring(false);
    track("consent_updated", { analytics: a, marketing: m });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-5 shadow-2xl shadow-navy-900/15 md:inset-x-auto md:right-6 md:bottom-6 md:left-auto md:max-w-md"
    >
      <p id="cookie-title" className="text-sm font-semibold text-navy-900">
        Uso de cookies
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        Utilizamos cookies propias necesarias para el funcionamiento del sitio y, solo si lo aceptas,
        cookies de analítica y marketing para medir el funnel y las campañas. Puedes cambiar tu decisión
        en cualquier momento desde la{" "}
        <Link href="/cookies" className="underline underline-offset-4 hover:text-navy-900">
          política de cookies
        </Link>
        .
      </p>

      {configuring ? (
        <div className="mt-4 space-y-3 rounded-md bg-gray-50 p-3">
          <div className="flex items-start gap-3">
            <Checkbox id="c-necessary" checked disabled className="mt-0.5" />
            <div>
              <Label htmlFor="c-necessary">Necesarias</Label>
              <p className="mt-1 text-xs text-gray-500">Sesión, seguridad y preferencias de consentimiento. Siempre activas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="c-analytics" checked={analytics} onCheckedChange={(v) => setAnalytics(v === true)} className="mt-0.5" />
            <div>
              <Label htmlFor="c-analytics">Analítica</Label>
              <p className="mt-1 text-xs text-gray-500">Google Analytics 4 e identificador de visitante para medir el funnel.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="c-marketing" checked={marketing} onCheckedChange={(v) => setMarketing(v === true)} className="mt-0.5" />
            <div>
              <Label htmlFor="c-marketing">Marketing</Label>
              <p className="mt-1 text-xs text-gray-500">Meta Pixel y LinkedIn Insight Tag para medir campañas.</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {configuring ? (
          <Button size="sm" onClick={() => decide(analytics, marketing)}>
            Guardar preferencias
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setConfiguring(true)}>
            Configurar
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => decide(false, false)}>
          Rechazar
        </Button>
        <Button size="sm" onClick={() => decide(true, true)}>
          Aceptar todas
        </Button>
      </div>
    </div>
  );
}

/** Botón para reabrir la configuración (en /cookies y footer). */
export function OpenCookieSettingsButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("mg:open-cookie-settings"))}
    >
      Configurar cookies
    </button>
  );
}
