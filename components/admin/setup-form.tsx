"use client";

import * as React from "react";
import { CircleAlertIcon } from "lucide-react";

import { setupAction, type SetupState } from "@/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SetupForm() {
  const [state, formAction, pending] = React.useActionState<SetupState, FormData>(setupAction, undefined);
  return (
    <form action={formAction} className="space-y-5">
      {state?.error ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>No se ha podido crear el administrador</AlertTitle>
          <AlertDescription>
            <p>{state.error}</p>
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="setup-token">Token de configuración (ADMIN_SETUP_TOKEN)</Label>
        <Input id="setup-token" name="token" type="password" autoComplete="off" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="setup-name">Nombre</Label>
        <Input id="setup-name" name="name" autoComplete="name" required minLength={2} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="setup-email">Email</Label>
        <Input id="setup-email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="setup-password">Contraseña (mínimo 12 caracteres, con mayúsculas o números)</Label>
        <Input id="setup-password" name="password" type="password" autoComplete="new-password" required minLength={12} />
      </div>
      <Button type="submit" variant="dark" size="lg" className="w-full" disabled={pending} aria-busy={pending}>
        {pending ? "Creando…" : "Crear administrador"}
      </Button>
    </form>
  );
}
