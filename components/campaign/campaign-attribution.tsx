"use client";

import * as React from "react";

import { setDefaultAttribution } from "@/lib/analytics";

/**
 * Fija la atribución por defecto de una landing de campaña (LinkedIn) sin
 * sobrescribir UTMs reales si el visitante llega con ellas. No renderiza nada.
 */
export function CampaignAttribution({ campaign }: { campaign: string }) {
  React.useEffect(() => {
    setDefaultAttribution({ utmSource: "linkedin", utmMedium: "social", utmCampaign: campaign });
  }, [campaign]);
  return null;
}
