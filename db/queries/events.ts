import "server-only";

import { getDb } from "@/db/client";
import { leadEvents, type NewLeadEvent } from "@/db/schema";

/** Inserta un evento del funnel. Nunca lanza: la analítica no debe romper nada. */
export async function recordEvent(event: NewLeadEvent): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    await db.insert(leadEvents).values(event);
    return true;
  } catch (error) {
    console.error("[events] no se pudo guardar el evento:", error);
    return false;
  }
}
