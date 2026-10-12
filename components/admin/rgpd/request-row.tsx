"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { updateDataRequestAction } from "@/actions/admin-rgpd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DATA_REQUEST_STATUSES, DATA_REQUEST_TYPE_LABELS, type DataRequestStatus, type DataRequestType } from "@/types/lead";

const STATUS_LABELS: Record<DataRequestStatus, string> = { new: "Nueva", in_progress: "En curso", closed: "Cerrada" };
const STATUS_VARIANT: Record<DataRequestStatus, "copper" | "warning" | "success"> = { new: "copper", in_progress: "warning", closed: "success" };

export interface DataRequestItem {
  id: string;
  type: DataRequestType;
  name: string;
  email: string;
  message: string | null;
  status: DataRequestStatus;
  resolutionNote: string | null;
  createdLabel: string;
  deadlineLabel: string;
  overdue: boolean;
  handlerName: string | null;
}

export function DataRequestCard({ item }: { item: DataRequestItem }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<DataRequestStatus>(item.status);
  const [note, setNote] = React.useState(item.resolutionNote ?? "");
  const [message, setMessage] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const dirty = status !== item.status || note !== (item.resolutionNote ?? "");

  const save = () =>
    startTransition(async () => {
      const res = await updateDataRequestAction({ id: item.id, status, resolutionNote: note });
      setMessage(res.ok ? "Guardado." : res.message);
      if (res.ok) router.refresh();
    });

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink-900">{DATA_REQUEST_TYPE_LABELS[item.type]}</p>
          <p className="mt-0.5 text-sm text-gray-600">
            {item.name} · <a href={`mailto:${item.email}`} className="text-copper-600 hover:underline">{item.email}</a>
          </p>
          <p className="tabular mt-1 text-xs text-gray-500">
            Recibida el {item.createdLabel} · plazo legal hasta {item.deadlineLabel}
            {item.overdue && item.status !== "closed" ? <span className="ml-2 font-semibold text-destructive">Plazo vencido</span> : null}
            {item.handlerName ? ` · gestiona ${item.handlerName}` : ""}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[item.status]}>{STATUS_LABELS[item.status]}</Badge>
      </div>
      {item.message ? <p className="mt-3 rounded-md bg-gray-50 p-3 text-sm whitespace-pre-wrap text-ink-900">{item.message}</p> : null}
      <div className="mt-4 grid gap-3 md:grid-cols-[12rem_1fr_auto] md:items-start">
        <Select value={status} onValueChange={(v) => setStatus(v as DataRequestStatus)}>
          <SelectTrigger aria-label="Estado"><SelectValue /></SelectTrigger>
          <SelectContent>
            {DATA_REQUEST_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
          </SelectContent>
        </Select>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Nota de resolución (qué se hizo, cuándo se respondió)" aria-label="Nota de resolución" />
        <Button type="button" variant="dark" size="sm" onClick={save} disabled={!dirty || pending}>Guardar</Button>
      </div>
      {message ? <p className="mt-2 text-xs text-gray-600" role="status">{message}</p> : null}
    </article>
  );
}
