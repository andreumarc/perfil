"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { audit } from "@/lib/audit";
import { ForbiddenError, UnauthorizedError, requireRole, requireSession } from "@/lib/auth/guard";
import { verifyPassword } from "@/lib/auth/password";
import { createUser, findUserByEmail, updateUser } from "@/lib/auth/users";
import { changeOwnPasswordSchema, createUserSchema, updateUserSchema } from "@/lib/validation/admin";
import { eq } from "drizzle-orm";

export type UserActionState = { ok: true } | { ok: false; message: string };

function failure(error: unknown): UserActionState {
  if (error instanceof UnauthorizedError) return { ok: false, message: "Sesión caducada. Vuelve a iniciar sesión." };
  if (error instanceof ForbiddenError) return { ok: false, message: "Solo un administrador puede hacer esto." };
  if (error instanceof z.ZodError) return { ok: false, message: error.issues[0]?.message ?? "Datos no válidos." };
  console.error("[admin/users] acción fallida:", error instanceof Error ? error.message : error);
  return { ok: false, message: "No se ha podido guardar. Inténtalo de nuevo." };
}

export async function createUserAction(input: unknown): Promise<UserActionState> {
  try {
    const session = await requireRole("admin");
    const data = createUserSchema.parse(input);
    if (await findUserByEmail(data.email)) return { ok: false, message: "Ya existe un usuario con ese email." };
    const user = await createUser({ ...data, createdBy: session.userId });
    await audit(session, "user.create", "user", user.id, { email: user.email, role: user.role });
    revalidatePath("/admin/usuarios");
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function updateUserAction(input: unknown): Promise<UserActionState> {
  try {
    const session = await requireRole("admin");
    const data = updateUserSchema.parse(input);
    if (data.userId === session.userId && (data.isActive === false || (data.role && data.role !== "admin"))) {
      return { ok: false, message: "No puedes desactivarte ni quitarte el rol de administrador a ti mismo." };
    }
    const row = await updateUser(data.userId, { name: data.name, role: data.role, isActive: data.isActive, password: data.password });
    if (!row) return { ok: false, message: "Usuario no encontrado." };
    const { password: _p, ...diff } = data;
    void _p;
    await audit(session, "user.update", "user", data.userId, { ...diff, passwordChanged: Boolean(data.password) });
    revalidatePath("/admin/usuarios");
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}

export async function changeOwnPasswordAction(input: unknown): Promise<UserActionState> {
  try {
    const session = await requireSession();
    const data = changeOwnPasswordSchema.parse(input);
    const db = getDb();
    if (!db) return { ok: false, message: "Base de datos no configurada." };
    const row = await db.query.users.findFirst({ where: eq(users.id, session.userId) });
    if (!row || !(await verifyPassword(row.passwordHash, data.current))) return { ok: false, message: "La contraseña actual no es correcta." };
    await updateUser(session.userId, { password: data.next });
    await audit(session, "user.password", "user", session.userId);
    return { ok: true };
  } catch (error) {
    return failure(error);
  }
}
