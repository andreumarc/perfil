"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Loader2, Trash2 } from "lucide-react";

import { addLeadNoteAction, deleteLeadNoteAction, updateLeadNotesAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

/** Nota ya formateada en servidor (fecha legible) para evitar diferencias de zona horaria en cliente. */
export interface NoteItem {
  id: string;
  note: string;
  author: string | null;
  createdAtLabel: string;
}

type Feedback = { type: "ok" | "error"; message: string } | null;

function FeedbackText({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  const ok = feedback.type === "ok";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${ok ? "text-emerald-700" : "text-red-700"}`}
      role="status"
      aria-live="polite"
    >
      {ok ? <Check className="size-3.5" aria-hidden /> : <AlertCircle className="size-3.5" aria-hidden />}
      {feedback.message}
    </span>
  );
}

export function NotesPanel({
  leadId,
  notes,
  internalNotes,
}: {
  leadId: string;
  notes: NoteItem[];
  internalNotes: string | null;
}) {
  const router = useRouter();

  // Nueva nota (histórico)
  const [draft, setDraft] = useState("");
  const [draftFeedback, setDraftFeedback] = useState<Feedback>(null);
  const [isAdding, startAdding] = useTransition();

  // Eliminación de notas
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, startDeleting] = useTransition();

  // Notas internas del lead (campo único)
  const savedInternal = internalNotes ?? "";
  const [internal, setInternal] = useState(savedInternal);
  const [internalFeedback, setInternalFeedback] = useState<Feedback>(null);
  const [isSaving, startSaving] = useTransition();
  const internalDirty = internal.trim() !== savedInternal.trim();

  function addNote() {
    const note = draft.trim();
    if (!note) {
      setDraftFeedback({ type: "error", message: "Escribe la nota antes de añadirla." });
      return;
    }
    setDraftFeedback(null);
    startAdding(async () => {
      const res = await addLeadNoteAction({ leadId, note });
      if (res.ok) {
        setDraft("");
        setDraftFeedback({ type: "ok", message: "Nota añadida" });
        router.refresh();
      } else {
        setDraftFeedback({ type: "error", message: res.message || "No se pudo añadir la nota" });
      }
    });
  }

  function removeNote(noteId: string) {
    if (!window.confirm("¿Eliminar esta nota? Esta acción no se puede deshacer.")) return;
    setDeletingId(noteId);
    startDeleting(async () => {
      const res = await deleteLeadNoteAction({ noteId, leadId });
      if (!res.ok) {
        setDraftFeedback({ type: "error", message: res.message || "No se pudo eliminar la nota" });
      }
      setDeletingId(null);
      router.refresh();
    });
  }

  function saveInternal() {
    setInternalFeedback(null);
    startSaving(async () => {
      const res = await updateLeadNotesAction({ leadId, notes: internal.trim() });
      if (res.ok) {
        setInternalFeedback({ type: "ok", message: "Guardado" });
        router.refresh();
      } else {
        setInternalFeedback({ type: "error", message: res.message || "No se pudo guardar" });
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notas</CardTitle>
        <CardDescription>Seguimiento comercial: llamadas, reuniones, próximos pasos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor={`note-${leadId}`}>Nueva nota</Label>
          <Textarea
            id={`note-${leadId}`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ej.: Llamada de 20 min. Interesado en el audit; enviar propuesta antes del viernes."
            maxLength={4000}
            disabled={isAdding}
            className="min-h-20"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FeedbackText feedback={draftFeedback} />
            <Button type="button" onClick={addNote} disabled={isAdding || !draft.trim()} size="sm" className="ml-auto">
              {isAdding ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Añadir nota
            </Button>
          </div>
        </div>

        {notes.length > 0 ? (
          <ol className="space-y-3">
            {notes.map((n) => {
              const busy = isDeleting && deletingId === n.id;
              return (
                <li key={n.id} className="rounded-md border border-gray-200 bg-gray-50/60 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 text-xs text-gray-500">
                      <span className="tabular">{n.createdAtLabel}</span>
                      {n.author ? <span> · {n.author}</span> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNote(n.id)}
                      disabled={busy}
                      aria-label="Eliminar nota"
                      className="shrink-0 rounded-sm p-1 text-gray-400 transition-colors hover:text-red-700 disabled:opacity-50"
                    >
                      {busy ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden />
                      ) : (
                        <Trash2 className="size-4" aria-hidden />
                      )}
                    </button>
                  </div>
                  <p className="mt-1.5 text-sm whitespace-pre-wrap text-navy-900">{n.note}</p>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-sm text-gray-500">Todavía no hay notas de seguimiento.</p>
        )}

        <Separator />

        <div className="space-y-3">
          <div>
            <Label htmlFor={`internal-${leadId}`}>Notas internas del lead</Label>
            <p className="mt-1 text-xs text-gray-500">
              Campo único que se exporta en el CSV: contexto, acuerdos, condiciones.
            </p>
          </div>
          <Textarea
            id={`internal-${leadId}`}
            value={internal}
            onChange={(e) => setInternal(e.target.value)}
            maxLength={8000}
            disabled={isSaving}
            placeholder="Sin notas internas."
            className="min-h-24"
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FeedbackText feedback={internalFeedback} />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={saveInternal}
              disabled={isSaving || !internalDirty}
              className="ml-auto"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Guardar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
