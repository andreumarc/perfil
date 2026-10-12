"use client";

import * as React from "react";

import type { EventProps, EventType } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/track";

/** Registra un evento una vez al montar (vistas de servicio, proyecto, artículo). */
export function TrackView({ event, props }: { event: EventType; props?: EventProps }) {
  const sent = React.useRef(false);
  React.useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    track(event, props);
    // Solo al montar: el evento identifica la página, no depende de cambios posteriores de props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
