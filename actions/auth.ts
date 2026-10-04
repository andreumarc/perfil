"use server";

import { redirect } from "next/navigation";

import {
  clearSessionCookie,
  createSessionToken,
  isAdminConfigured,
  setSessionCookie,
  verifyCredentials,
} from "@/lib/auth";
import { LOGIN_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
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
  const limit = await rateLimit(`login:${meta.ipHash ?? "anon"}`, LOGIN_RATE_LIMIT);
  if (!limit.ok) {
    return { error: `Demasiados intentos. Espera ${Math.ceil(limit.retryAfterSeconds / 60)} minutos.` };
  }

  if (!verifyCredentials(parsed.data.email, parsed.data.password)) {
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
