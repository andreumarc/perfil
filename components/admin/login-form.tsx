"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { CircleAlertIcon } from "lucide-react";

import { loginAction, type LoginState } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Devuelve el destino post-login solo si es una ruta interna del admin. */
function safeNext(value: string | null): string {
  if (!value) return "/admin";
  if (!value.startsWith("/admin") || value.includes("//")) return "/admin";
  return value;
}

export function LoginForm() {
  const [state, formAction, pending] = React.useActionState<LoginState, FormData>(loginAction, undefined);
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  return (
    <form action={formAction} className="space-y-5" noValidate={false}>
      <input type="hidden" name="next" value={next} />

      {state?.error ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>No se ha podido iniciar sesión</AlertTitle>
          <AlertDescription>
            <p>{state.error}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          placeholder="tu@empresa.com"
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="admin-password">Contraseña</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending} aria-busy={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
