"use client";

import * as React from "react";
import { Loader2Icon, SendIcon } from "lucide-react";

import { submitIndexNowAction } from "@/actions/admin-seo";
import { Button } from "@/components/ui/button";

/** Botón «Avisar a los buscadores»: envía el sitemap completo a IndexNow. */
export function IndexNowButton() {
  const [pending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<string | null>(null);
  const run = () =>
    startTransition(async () => {
      const res = await submitIndexNowAction();
      setMessage(res.ok ? `${res.submitted} URLs enviadas. ${res.message}` : `No enviado${res.status ? ` (respuesta ${res.status})` : ""}: ${res.message}`);
    });
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button type="button" variant="outline" size="sm" onClick={run} disabled={pending}>
        {pending ? <Loader2Icon className="animate-spin" aria-hidden /> : <SendIcon aria-hidden />}
        Avisar a los buscadores ahora
      </Button>
      {message ? (
        <p className="w-full text-sm text-gray-600" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
