"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { DatabaseZapIcon, Loader2Icon } from "lucide-react";

import { seedContentAction } from "@/actions/admin-seed";
import { Button } from "@/components/ui/button";

/** Botón "Cargar contenido inicial": idempotente, no crea solicitudes ni pisa ediciones. */
export function SeedButton() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [message, setMessage] = React.useState<string | null>(null);
  const [confirm, setConfirm] = React.useState(false);
  const run = () =>
    startTransition(async () => {
      const res = await seedContentAction();
      setConfirm(false);
      setMessage(res.ok ? `Contenido cargado: ${Object.entries(res.summary).map(([k, v]) => `${k} ${v}`).join(", ")}.` : res.message);
      if (res.ok) router.refresh();
    });
  return (
    <div className="flex flex-wrap items-center gap-3">
      {confirm ? (
        <>
          <span className="text-sm text-gray-600">Se añaden o actualizan servicios, sectores, proyectos tipo, artículos (borrador), FAQs y zonas. No se tocan solicitudes ni ajustes ya guardados.</span>
          <Button type="button" variant="dark" size="sm" onClick={run} disabled={pending}>
            {pending ? <Loader2Icon className="animate-spin" aria-hidden /> : <DatabaseZapIcon aria-hidden />}
            Confirmar carga
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setConfirm(false)}>Cancelar</Button>
        </>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={() => setConfirm(true)}>
          <DatabaseZapIcon aria-hidden />
          Cargar contenido inicial
        </Button>
      )}
      {message ? <p className="w-full text-sm text-gray-600" role="status">{message}</p> : null}
    </div>
  );
}
