import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Etiqueta que identifica imágenes generadas o de recurso: nunca se presentan como obra real. */
export function IllustrativeBadge({ className, label = "Proyecto tipo" }: { className?: string; label?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur", className)}>
      <ImageIcon className="size-3" aria-hidden />
      {label}
    </span>
  );
}
