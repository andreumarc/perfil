"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlusIcon, Loader2 } from "lucide-react";

import { createFollowUpAction, toggleFollowUpAction } from "@/actions/admin-leads";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FollowUpItem {
  id: string;
  title: string;
  dueAtLabel: string;
  overdue: boolean;
  done: boolean;
  assigneeName: string | null;
}

export function FollowUpsPanel({ leadId, items }: { leadId: string; items: FollowUpItem[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function create() {
    if (!title.trim() || !dueAt) {
      setError("Indica el título y la fecha.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await createFollowUpAction({ leadId, title: title.trim(), dueAt: new Date(dueAt) });
      if (res.ok) {
        setTitle("");
        setDueAt("");
        router.refresh();
      } else setError(res.message);
    });
  }

  function toggle(id: string, done: boolean) {
    startTransition(async () => {
      const res = await toggleFollowUpAction({ id, done });
      if (!res.ok) setError(res.message);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas de seguimiento</CardTitle>
        <CardDescription>Recordatorios con fecha: llamar, visitar, enviar presupuesto.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div>
            <Label htmlFor={`task-title-${leadId}`}>Tarea</Label>
            <Input id={`task-title-${leadId}`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Llamar para confirmar visita" maxLength={200} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor={`task-date-${leadId}`}>Fecha</Label>
            <Input id={`task-date-${leadId}`} type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} className="mt-1.5" />
          </div>
          <Button type="button" variant="dark" onClick={create} disabled={isPending} className="h-11">
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <CalendarPlusIcon aria-hidden />}
            Añadir
          </Button>
        </div>
        {error ? <p className="text-xs text-red-700" role="alert">{error}</p> : null}
        {items.length ? (
          <ul className="divide-y divide-gray-200">
            {items.map((t) => (
              <li key={t.id} className="flex items-start gap-3 py-3">
                <Checkbox id={`task-${t.id}`} checked={t.done} onCheckedChange={(v) => toggle(t.id, v === true)} className="mt-0.5" aria-label={`Marcar "${t.title}" como ${t.done ? "pendiente" : "hecha"}`} />
                <label htmlFor={`task-${t.id}`} className={cn("flex-1 cursor-pointer text-sm", t.done && "text-gray-400 line-through")}>
                  <span className="font-medium text-ink-900">{t.title}</span>
                  <span className={cn("tabular block text-xs", t.overdue && !t.done ? "font-medium text-red-700" : "text-gray-500")}>
                    {t.dueAtLabel}
                    {t.assigneeName ? ` · ${t.assigneeName}` : ""}
                    {t.overdue && !t.done ? " · vencida" : ""}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Sin tareas pendientes.</p>
        )}
      </CardContent>
    </Card>
  );
}
