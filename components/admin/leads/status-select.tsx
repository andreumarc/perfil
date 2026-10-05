"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { AlertCircle, Check, Loader2 } from "lucide-react";

import { updateLeadStatusAction } from "@/actions/admin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadStatus } from "@/types/lead";

const FEEDBACK_MS = 3000;

type Feedback = { type: "ok"; message: string } | { type: "error"; message: string } | null;

/** Selector de status del lead: guarda en servidor al cambiar y confirma visualmente. */
export function StatusSelect({
  leadId,
  status,
  className,
}: {
  leadId: string;
  status: LeadStatus;
  className?: string;
}) {
  const [value, setValue] = useState<LeadStatus>(status);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isPending, startTransition] = useTransition();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  function scheduleHide() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setFeedback(null), FEEDBACK_MS);
  }

  function onChange(next: string) {
    if (!LEAD_STATUSES.includes(next as LeadStatus)) return;
    const nextStatus = next as LeadStatus;
    const previous = value;
    setValue(nextStatus);
    setFeedback(null);
    startTransition(async () => {
      const res = await updateLeadStatusAction({ leadId, status: nextStatus });
      if (res.ok) {
        setFeedback({ type: "ok", message: "Guardado" });
        scheduleHide();
      } else {
        setValue(previous);
        setFeedback({ type: "error", message: res.message || "No se pudo guardar" });
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={`status-${leadId}`} className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
        Status
      </label>
      <div className="flex items-center gap-3">
        <Select value={value} onValueChange={onChange} disabled={isPending}>
          <SelectTrigger id={`status-${leadId}`} className="w-full min-w-44 sm:w-48" aria-label="Status del lead">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {LEAD_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="flex min-w-24 items-center gap-1.5 text-xs" role="status" aria-live="polite">
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin text-gray-400" aria-hidden />
              <span className="text-gray-500">Guardando…</span>
            </>
          ) : feedback?.type === "ok" ? (
            <>
              <Check className="size-3.5 text-emerald-600" aria-hidden />
              <span className="text-emerald-700">{feedback.message}</span>
            </>
          ) : feedback?.type === "error" ? (
            <>
              <AlertCircle className="size-3.5 text-red-600" aria-hidden />
              <span className="text-red-700">{feedback.message}</span>
            </>
          ) : null}
        </span>
      </div>
    </div>
  );
}
