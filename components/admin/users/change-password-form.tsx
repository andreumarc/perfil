"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { changeOwnPasswordAction } from "@/actions/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePasswordForm() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [message, setMessage] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = React.useTransition();

  return (
    <form
      className="max-w-md space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        startTransition(async () => {
          const res = await changeOwnPasswordAction({ current, next, confirm });
          if (res.ok) {
            setCurrent(""); setNext(""); setConfirm("");
            setMessage({ ok: true, text: "Contraseña actualizada. Las demás sesiones se han cerrado." });
          } else setMessage({ ok: false, text: res.message });
        });
      }}
    >
      <div className="space-y-1.5"><Label htmlFor="pw-current">Contraseña actual</Label><Input id="pw-current" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required autoComplete="current-password" /></div>
      <div className="space-y-1.5"><Label htmlFor="pw-next">Nueva contraseña (mín. 12, con mayúsculas o números)</Label><Input id="pw-next" type="password" value={next} onChange={(e) => setNext(e.target.value)} required minLength={12} autoComplete="new-password" /></div>
      <div className="space-y-1.5"><Label htmlFor="pw-confirm">Repite la nueva contraseña</Label><Input id="pw-confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={12} autoComplete="new-password" /></div>
      {message ? <p className={`text-sm ${message.ok ? "text-emerald-700" : "text-red-700"}`} role="status">{message.text}</p> : null}
      <Button type="submit" variant="dark" disabled={isPending}>{isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}Cambiar contraseña</Button>
    </form>
  );
}
