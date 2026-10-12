import { ShieldCheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Aviso de servicios que requieren profesional o empresa habilitados (gas, PCI, dirección técnica…). */
export function LicenseNotice({ note, className }: { note?: string; className?: string }) {
  return (
    <div className={cn("flex gap-4 rounded-lg border border-olive-100 bg-olive-100/40 p-5", className)} role="note">
      <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-olive-700" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-ink-900">Trabajo con profesional habilitado</p>
        <p className="mt-1 text-sm leading-relaxed text-gray-700">
          {note ??
            "Esta instalación la ejecuta y certifica un profesional o empresa habilitados conforme a la normativa vigente. Coordinamos la intervención dentro de la obra y te entregamos la documentación al finalizar."}
        </p>
      </div>
    </div>
  );
}
