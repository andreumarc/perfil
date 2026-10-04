"use client";

import { useSyncExternalStore } from "react";

import { CONSENT_EVENT, getConsent, parseConsent, type ConsentState } from "./consent";

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  return () => window.removeEventListener(CONSENT_EVENT, callback);
}

/** Snapshot serializado para que useSyncExternalStore detecte cambios por valor. */
function getSnapshot(): string {
  const consent = getConsent();
  return consent ? JSON.stringify(consent) : "";
}

function getServerSnapshot(): string {
  return "";
}

/**
 * Estado de consentimiento reactivo. Devuelve `null` hasta que el usuario decide
 * (y siempre `null` en servidor / primer render para evitar hydration mismatch).
 */
export function useConsent(): ConsentState | null {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return raw ? parseConsent(raw) : null;
}
