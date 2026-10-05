"use client";

import * as React from "react";
import { Trash2Icon } from "lucide-react";

import { deleteLeadAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/** Borrado definitivo del lead con confirmación (derecho de supresión RGPD). */
export function DeleteLeadButton({ leadId, company }: { leadId: string; company: string }) {
  const [open, setOpen] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const confirm = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteLeadAction({ leadId });
      // En éxito la acción redirige al listado; aquí solo llega el error.
      if (result && !result.ok) setError(result.message);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-destructive">
          <Trash2Icon className="size-4" aria-hidden />
          Eliminar lead
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar definitivamente este lead</DialogTitle>
          <DialogDescription>
            Se borrarán los datos de contacto, las respuestas del diagnóstico, el resultado y las notas de{" "}
            <span className="font-medium text-navy-900">{company}</span>. Los eventos de analítica quedan
            anonimizados. Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={pending}>
            {pending ? "Eliminando…" : "Eliminar lead"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
