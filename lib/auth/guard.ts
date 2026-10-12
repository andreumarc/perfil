import "server-only";

import { eq } from "drizzle-orm";
import { cache } from "react";

import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import type { UserRole } from "@/types/lead";

import { readSessionClaims } from "./session";

export interface Session {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export class UnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Sin permisos") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Sesión actual verificada contra la base de datos: el usuario debe existir,
 * estar activo y conservar la misma `sessionVersion` que la cookie (cambiar la
 * contraseña o desactivar el usuario invalida sesiones abiertas).
 * `cache()` deduplica la consulta dentro de un mismo render.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const claims = await readSessionClaims();
  if (!claims) return null;
  const db = getDb();
  if (!db) return null;
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, claims.userId),
      columns: { id: true, email: true, name: true, role: true, isActive: true, sessionVersion: true },
    });
    if (!user || !user.isActive || user.sessionVersion !== claims.sv) return null;
    return { userId: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    console.error("[auth] error verificando la sesión:", error instanceof Error ? error.message : error);
    return null;
  }
});

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}

/** Exige un rol mínimo: `admin` lo puede todo; `editor` solo lo marcado como editor. */
export async function requireRole(role: UserRole): Promise<Session> {
  const session = await requireSession();
  if (role === "admin" && session.role !== "admin") throw new ForbiddenError();
  return session;
}

export function can(session: Session | null, action: "manage_users" | "manage_settings" | "export_leads" | "delete_leads" | "edit_content" | "manage_leads" | "view_audit"): boolean {
  if (!session) return false;
  if (session.role === "admin") return true;
  return action === "edit_content" || action === "manage_leads";
}
