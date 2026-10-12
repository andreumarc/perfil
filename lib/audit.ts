import "server-only";

import { getDb } from "@/db/client";
import { auditLogs } from "@/db/schema";
import type { Session } from "@/lib/auth/guard";

/** Registra una acción del panel. Nunca lanza: la auditoría no debe romper la operación. */
export async function audit(
  session: Session | null,
  action: string,
  entity: string,
  entityId: string | null,
  diff: Record<string, unknown> = {},
  ipHash: string | null = null,
) {
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(auditLogs).values({
      userId: session?.userId ?? null,
      userEmail: session?.email ?? null,
      action,
      entity,
      entityId,
      diff,
      ipHash,
    });
  } catch (error) {
    console.error("[audit] no se pudo registrar:", error instanceof Error ? error.message : error);
  }
}
