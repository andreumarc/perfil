"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getConsent, saveConsent, type ConsentState } from "@/lib/analytics/consent";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/analytics/keys";
import { track } from "@/lib/analytics/track";

function recordConsent(state: ConsentState) {
  const body = JSON.stringify({ analytics: state.analytics, marketing: state.marketing, version: state.version });
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon("/api/consent", blob)) return;
    }
    void fetch("/api/consent", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch {
    /* el consentimiento sigue guardado en la cookie */
  }
}

/**
 * Banner de consentimiento de cookies (RGPD / LSSI-CE).
 * Aceptar y Rechazar al mismo nivel. Configuración granular (analítica, marketing).
 * Ningún script no esencial se carga antes de la decisión del usuario.
 */
export function CookieBanner() {
  const [visible, setVisible] = React.useState(false);
  const [configuring, setConfiguring] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);

  React.useEffect(() => {
    const id = window.setTimeout(() => setVisible(getConsent() === null), 600);
    const open = () => {
      const current = getConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setConfiguring(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    };
  }, []);

  const decide = (a: boolean, m: boolean) => {
    const state = saveConsent({ analytics: a, marketing: m });
    setVisible(false);
    setConfiguring(false);
    recordConsent(state);
    track("consent_updated", { analytics: a, marketing: m }, { persist: false });
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-5 shadow-2xl shadow-ink-900/15 md:inset-x-auto md:right-6 md:bottom-6 md:left-auto md:max-w-md"
    >
      <p id="cookie-title" className="text-sm font-semibold text-ink-900">
        Uso de cookies
      </p>
      <p id="cookie-desc" className="mt-2 text-sm leading-relaxed text-gray-600">
        Usamos cookies propias necesarias para que la web funcione y, solo si lo aceptas, cookies de analítica y
        marketing para medir visitas y campañas. Rechazar es tan fácil como aceptar y puedes cambiar tu decisión
        cuando quieras desde la{" "}
        <Link href="/politica-cookies" className="underline underline-offset-4 hover:text-ink-900">
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
              <p className="mt-1 text-xs text-gray-500">Seguridad, sesión y preferencias de consentimiento. Siempre activas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="c-analytics" checked={analytics} onCheckedChange={(v) => setAnalytics(v === true)} className="mt-0.5" />
            <div>
              <Label htmlFor="c-analytics">Analítica</Label>
              <p className="mt-1 text-xs text-gray-500">Google Analytics / Tag Manager e identificador de visitante para medir el uso de la web.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="c-marketing" checked={marketing} onCheckedChange={(v) => setMarketing(v === true)} className="mt-0.5" />
            <div>
              <Label htmlFor="c-marketing">Marketing</Label>
              <p className="mt-1 text-xs text-gray-500">Píxeles publicitarios (Meta, Google Ads) para medir campañas.</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {configuring ? (
          <Button size="sm" variant="outline" onClick={() => decide(analytics, marketing)}>
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

/** Botón para reabrir la configuración (política de cookies y footer). */
export function OpenCookieSettingsButton({ className, children = "Preferencias de cookies" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}>
      {children}
    </button>
  );
}
