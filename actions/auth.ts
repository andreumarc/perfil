"use server";

import { redirect } from "next/navigation";

import { audit } from "@/lib/audit";
import { verifyPassword } from "@/lib/auth/password";
import { clearSessionCookie, createSessionCookie, isAuthConfigured } from "@/lib/auth/session";
import { countUsers, createUser, findUserByEmail, touchLastLogin } from "@/lib/auth/users";
import { getDb } from "@/db/client";
import { serverEnv } from "@/lib/env";
import { LOGIN_GLOBAL_RATE_LIMIT, LOGIN_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { loginSchema, setupSchema } from "@/lib/validation/admin";
import { safeEqual } from "@/lib/auth/compare";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: "El acceso al panel no está configurado: define AUTH_SECRET (mínimo 32 caracteres)." };
  }
  if (!getDb()) {
    return { error: "El panel necesita una base de datos (DATABASE_URL) para iniciar sesión." };
  }

  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: "Introduce un email y una contraseña válidos." };

  const meta = await getRequestMeta();
  const [perIp, global] = await Promise.all([
    rateLimit(`login:${meta.rateKey}`, LOGIN_RATE_LIMIT),
    rateLimit("login:global", LOGIN_GLOBAL_RATE_LIMIT),
  ]);
  if (!perIp.ok || !global.ok) {
    const wait = Math.max(perIp.retryAfterSeconds, global.retryAfterSeconds);
    return { error: `Demasiados intentos. Espera ${Math.max(1, Math.ceil(wait / 60))} minutos.` };
  }

  const user = await findUserByEmail(parsed.data.email);
  // Verificación aunque el usuario no exista para no revelar su existencia por tiempo de respuesta.
  const ok = user ? await verifyPassword(user.passwordHash, parsed.data.password) : await verifyPassword("$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", parsed.data.password);
  if (!user || !ok || !user.isActive) {
    console.warn(`[auth] intento de login fallido (${meta.rateKey.slice(0, 8)})`);
    await audit(null, "login_failed", "user", null, {}, meta.ipHash);
    return { error: "Credenciales incorrectas." };
  }

  const created = await createSessionCookie({ userId: user.id, email: user.email, name: user.name, role: user.role, sv: user.sessionVersion });
  if (!created) return { error: "No se ha podido crear la sesión (AUTH_SECRET inválido)." };
  await touchLastLogin(user.id);
  await audit({ userId: user.id, email: user.email, name: user.name, role: user.role }, "login", "user", user.id, {}, meta.ipHash);

  const next = formData.get("next");
  const target = typeof next === "string" && next.startsWith("/admin") && !next.includes("//") ? next : "/admin";
  redirect(target);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

export type SetupState = { error?: string } | undefined;

/**
 * Crea el primer administrador. Solo funciona si no existe ningún usuario y el
 * token coincide con ADMIN_SETUP_TOKEN. Después, la ruta deja de estar disponible.
 */
export async function setupAction(_prev: SetupState, formData: FormData): Promise<SetupState> {
  if (!isAuthConfigured() || !getDb()) {
    return { error: "Configura DATABASE_URL y AUTH_SECRET antes de crear el primer administrador." };
  }
  const expected = serverEnv().adminSetupToken;
  if (!expected || expected.length < 16) {
    return { error: "Define ADMIN_SETUP_TOKEN (mínimo 16 caracteres) en las variables de entorno." };
  }
  const total = await countUsers();
  if (total === null || total > 0) return { error: "Ya existe un usuario: el alta inicial está cerrada." };

  const parsed = setupSchema.safeParse({
    token: formData.get("token"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first ? `${String(first.path[0] ?? "")}: ${first.message}` : "Datos no válidos." };
  }

  const meta = await getRequestMeta();
  const limit = await rateLimit(`setup:${meta.rateKey}`, LOGIN_RATE_LIMIT);
  if (!limit.ok) return { error: "Demasiados intentos. Espera unos minutos." };
  if (!safeEqual(parsed.data.token, expected)) {
    await audit(null, "setup_failed", "user", null, {}, meta.ipHash);
    return { error: "Token de configuración incorrecto." };
  }

  const user = await createUser({ email: parsed.data.email, name: parsed.data.name, password: parsed.data.password, role: "admin", createdBy: null });
  await audit({ userId: user.id, email: user.email, name: user.name, role: "admin" }, "setup_admin", "user", user.id, {}, meta.ipHash);
  await createSessionCookie({ userId: user.id, email: user.email, name: user.name, role: user.role, sv: user.sessionVersion });
  redirect("/admin");
}
