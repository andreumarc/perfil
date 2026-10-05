"use client";

import { useEffect } from "react";

import { track } from "@/lib/analytics/track";

/** Registra `service_viewed` al montar la página de un servicio. */
export function ServiceViewTracker({ slug, name }: { slug: string; name: string }) {
  useEffect(() => {
    track("service_viewed", { slug, service: name });
  }, [slug, name]);
  return null;
}
