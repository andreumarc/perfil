"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { assignLeadAction } from "@/actions/admin-leads";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NONE = "__none";

export function AssignSelect({ leadId, assignedTo, users }: { leadId: string; assignedTo: string | null; users: { id: string; name: string }[] }) {
  const router = useRouter();
  const [value, setValue] = useState(assignedTo ?? NONE);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    const previous = value;
    setValue(next);
    setError(null);
    startTransition(async () => {
      const res = await assignLeadAction({ leadId, userId: next === NONE ? null : next });
      if (!res.ok) {
        setValue(previous);
        setError(res.message);
      } else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`assign-${leadId}`} className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Responsable</label>
      <div className="flex items-center gap-3">
        <Select value={value} onValueChange={onChange} disabled={isPending}>
          <SelectTrigger id={`assign-${leadId}`} className="w-full min-w-44 sm:w-52" aria-label="Responsable de la solicitud"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Sin asignar</SelectItem>
            {users.map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isPending ? <Loader2 className="size-4 animate-spin text-gray-400" aria-hidden /> : null}
        {error ? <span className="text-xs text-red-700" role="alert">{error}</span> : null}
      </div>
    </div>
  );
}
