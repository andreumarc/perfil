"use server";

import { redirect } from "next/navigation";

import {
  clearSessionCookie,
  createSessionToken,
  isAdminConfigured,
  setSessionCookie,
  verifyCredentials,
} from "@/lib/auth";
import { LOGIN_GLOBAL_RATE_LIMIT, LOGIN_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { loginSchema } from "@/lib/validation/admin";

export type LoginState = { error?: string } | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return {
      error:
        "El acceso admin no está configurado. Define ADMIN_EMAIL, ADMIN_PASSWORD y AUTH_SECRET en las variables de entorno.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Introduce un email y una contraseña válidos." };

  const meta = await getRequestMeta();
  // Límite por IP y límite global: el segundo frena ataques distribuidos sin
  // bloquear al único administrador legítimo (50 intentos / 15 min en total).
  const [perIp, global] = await Promise.all([
    rateLimit(`login:${meta.rateKey}`, LOGIN_RATE_LIMIT),
    rateLimit("login:global", LOGIN_GLOBAL_RATE_LIMIT),
  ]);
  if (!perIp.ok || !global.ok) {
    const wait = Math.max(perIp.retryAfterSeconds, global.retryAfterSeconds);
    return { error: `Demasiados intentos. Espera ${Math.max(1, Math.ceil(wait / 60))} minutos.` };
  }

  if (!verifyCredentials(parsed.data.email, parsed.data.password)) {
    console.warn(`[auth] intento de login fallido (${meta.rateKey.slice(0, 8)})`);
    return { error: "Credenciales incorrectas." };
  }

  const token = await createSessionToken(parsed.data.email);
  if (!token) return { error: "No se ha podido crear la sesión (AUTH_SECRET inválido)." };
  await setSessionCookie(token);

  const next = formData.get("next");
  const target = typeof next === "string" && next.startsWith("/admin") && !next.includes("//") ? next : "/admin";
  redirect(target);
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
