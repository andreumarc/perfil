import "server-only";

import { asc, count, eq, sql } from "drizzle-orm";

import { getDb, requireDb } from "@/db/client";
import { users, type User } from "@/db/schema";
import type { UserRole } from "@/types/lead";

import { hashPassword } from "./password";

export async function countUsers(): Promise<number | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db.select({ value: count() }).from(users);
    return Number(rows[0]?.value ?? 0);
  } catch {
    return null;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = requireDb();
  const row = await db.query.users.findFirst({ where: sql`lower(${users.email}) = ${email.toLowerCase()}` });
  return row ?? null;
}

export async function createUser(input: { email: string; name: string; password: string; role: UserRole; createdBy: string | null }): Promise<User> {
  const db = requireDb();
  const passwordHash = await hashPassword(input.password);
  const [row] = await db
    .insert(users)
    .values({ email: input.email.toLowerCase(), name: input.name, passwordHash, role: input.role, createdBy: input.createdBy })
    .returning();
  return row;
}

export async function listUsers() {
  const db = requireDb();
  return db
    .select({ id: users.id, email: users.email, name: users.name, role: users.role, isActive: users.isActive, lastLoginAt: users.lastLoginAt, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.createdAt));
}

export async function updateUser(id: string, patch: { name?: string; role?: UserRole; isActive?: boolean; password?: string }) {
  const db = requireDb();
  const set: Partial<typeof users.$inferInsert> = { updatedAt: new Date() };
  if (patch.name !== undefined) set.name = patch.name;
  if (patch.role !== undefined) set.role = patch.role;
  if (patch.isActive !== undefined) set.isActive = patch.isActive;
  if (patch.password !== undefined) set.passwordHash = await hashPassword(patch.password);
  // Cambiar contraseña o desactivar invalida todas las sesiones del usuario.
  if (patch.password !== undefined || patch.isActive === false) set.sessionVersion = sql`${users.sessionVersion} + 1`;
  const [row] = await db.update(users).set(set).where(eq(users.id, id)).returning();
  return row ?? null;
}

export async function touchLastLogin(id: string) {
  const db = requireDb();
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id));
}
