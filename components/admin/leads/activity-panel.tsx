"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, Trash2 } from "lucide-react";

import { addActivityAction, deleteActivityAction, updateInternalNotesAction } from "@/actions/admin-leads";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ACTIVITY_TYPE_LABELS, LEAD_STATUS_LABELS, type ActivityType, type LeadStatus } from "@/types/lead";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  payload: Record<string, unknown>;
  userName: string | null;
  createdAtLabel: string;
}

type Feedback = { type: "ok" | "error"; message: string } | null;

function FeedbackText({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  const ok = feedback.type === "ok";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${ok ? "text-emerald-700" : "text-red-700"}`} role="status" aria-live="polite">
      {ok ? <Check className="size-3.5" aria-hidden /> : <AlertCircle className="size-3.5" aria-hidden />}
      {feedback.message}
    </span>
  );
}

const MANUAL_TYPES: ActivityType[] = ["note", "call", "visit", "email_sent", "quote"];

function describe(item: ActivityItem): string {
  const p = item.payload;
  if (item.type === "status_change") {
    const from = LEAD_STATUS_LABELS[p.from as LeadStatus] ?? String(p.from ?? "");
    const to = LEAD_STATUS_LABELS[p.to as LeadStatus] ?? String(p.to ?? "");
    return `Estado: ${from} → ${to}`;
  }
  if (item.type === "assignment") return p.assignedTo ? "Solicitud asignada" : "Solicitud sin asignar";
  if (item.type === "system") return p.event === "created" ? "Solicitud recibida desde la web" : "Evento del sistema";
  return typeof p.note === "string" ? p.note : "";
}

export function ActivityPanel({ leadId, activities, internalNotes }: { leadId: string; activities: ActivityItem[]; internalNotes: string | null }) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [type, setType] = useState<ActivityType>("note");
  const [draftFeedback, setDraftFeedback] = useState<Feedback>(null);
  const [isAdding, startAdding] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();
  const savedInternal = internalNotes ?? "";
  const [internal, setInternal] = useState(savedInternal);
  const [internalFeedback, setInternalFeedback] = useState<Feedback>(null);
  const [isSaving, startSaving] = useTransition();
  const internalDirty = internal.trim() !== savedInternal.trim();

  function add() {
    const note = draft.trim();
    if (!note) {
      setDraftFeedback({ type: "error", message: "Escribe la nota antes de añadirla." });
      return;
    }
    setDraftFeedback(null);
    startAdding(async () => {
      const res = await addActivityAction({ leadId, type, note });
      if (res.ok) {
        setDraft("");
        setDraftFeedback({ type: "ok", message: "Añadido" });
        router.refresh();
      } else setDraftFeedback({ type: "error", message: res.message });
    });
  }

  function remove(id: string) {
    setDeletingId(id);
    startDeleting(async () => {
      const res = await deleteActivityAction({ activityId: id, leadId });
      if (!res.ok) setDraftFeedback({ type: "error", message: res.message });
      setDeletingId(null);
      router.refresh();
    });
  }

  function saveInternal() {
    setInternalFeedback(null);
    startSaving(async () => {
      const res = await updateInternalNotesAction({ leadId, notes: internal.trim() });
      if (res.ok) {
        setInternalFeedback({ type: "ok", message: "Guardado" });
        router.refresh();
      } else setInternalFeedback({ type: "error", message: res.message });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seguimiento</CardTitle>
        <CardDescription>Llamadas, visitas, presupuestos enviados y notas. Todo queda en el historial.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="sm:w-44">
              <Label htmlFor={`activity-type-${leadId}`}>Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as ActivityType)}>
                <SelectTrigger id={`activity-type-${leadId}`} className="mt-1.5 w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MANUAL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{ACTIVITY_TYPE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor={`note-${leadId}`}>Detalle</Label>
              <Textarea id={`note-${leadId}`} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ej.: Llamada de 10 min. Quiere visita el martes por la tarde." maxLength={4000} disabled={isAdding} className="mt-1.5 min-h-20" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FeedbackText feedback={draftFeedback} />
            <Button type="button" onClick={add} disabled={isAdding || !draft.trim()} size="sm" variant="dark" className="ml-auto">
              {isAdding ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Añadir al historial
            </Button>
          </div>
        </div>

        {activities.length ? (
          <ol className="space-y-3">
            {activities.map((a) => {
              const busy = isDeleting && deletingId === a.id;
              const manual = MANUAL_TYPES.includes(a.type);
              return (
                <li key={a.id} className="rounded-md border border-gray-200 bg-gray-50/60 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 text-xs text-gray-500">
                      <span className="font-semibold text-ink-900">{ACTIVITY_TYPE_LABELS[a.type]}</span>
                      <span className="tabular"> · {a.createdAtLabel}</span>
                      {a.userName ? <span> · {a.userName}</span> : null}
                    </div>
                    {manual ? (
                      <button type="button" onClick={() => remove(a.id)} disabled={busy} aria-label="Eliminar entrada" className="shrink-0 rounded-sm p-1 text-gray-400 transition-colors hover:text-red-700 disabled:opacity-50">
                        {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
                      </button>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm whitespace-pre-wrap text-ink-900">{describe(a)}</p>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-sm text-gray-500">Todavía no hay actividad registrada.</p>
        )}

        <Separator />

        <div className="space-y-3">
          <div>
            <Label htmlFor={`internal-${leadId}`}>Notas internas</Label>
            <p className="mt-1 text-xs text-gray-500">Campo único que se exporta en el CSV: contexto, acuerdos, condiciones.</p>
          </div>
          <Textarea id={`internal-${leadId}`} value={internal} onChange={(e) => setInternal(e.target.value)} maxLength={8000} disabled={isSaving} placeholder="Sin notas internas." className="min-h-24" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FeedbackText feedback={internalFeedback} />
            <Button type="button" variant="outline" size="sm" onClick={saveInternal} disabled={isSaving || !internalDirty} className="ml-auto">
              {isSaving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Guardar notas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
