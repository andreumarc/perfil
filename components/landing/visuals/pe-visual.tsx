import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Mockup de un cuadro de seguimiento de integración (plan 100 días) tal como lo
 * vería el equipo de inversión. Decorativo (aria-hidden), solo escritorio.
 * Datos ficticios de seguimiento operativo; no son resultados de ningún cliente.
 */
const MILESTONES = [
  { day: 30, title: "Control", status: "done" },
  { day: 60, title: "Integración", status: "done" },
  { day: 100, title: "Captura de valor", status: "active" },
] as const;

const CURRENT_DAY = 74;

const SYNERGIES = [
  { label: "Conseguidas", value: 4, className: "bg-navy-900" },
  { label: "En curso", value: 8, className: "bg-navy-400" },
  { label: "Pendientes", value: 2, className: "bg-gray-300" },
] as const;

const SYNERGIES_TOTAL = SYNERGIES.reduce((sum, s) => sum + s.value, 0);

export function PeVisual({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="rounded-lg border border-white/10 bg-white p-6 text-navy-900 shadow-[0_28px_70px_-32px_rgba(0,0,0,0.6)] md:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Reporting al fondo</p>
            <p className="font-display mt-2 text-2xl text-navy-900">Add-on · plan de integración 100 días</p>
          </div>
          <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
            Ejemplo ilustrativo
          </span>
        </div>

        {/* Hitos */}
        <ol className="mt-6 grid grid-cols-3 gap-3">
          {MILESTONES.map((m) => {
            const done = m.status === "done";
            return (
              <li key={m.day} className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5">
                <p className="tabular text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Día {m.day}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                  {done ? <CheckIcon className="size-3.5 text-signal" /> : <span className="size-2 rounded-full bg-signal" />}
                  {m.title}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Progreso */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Avance del plan</span>
            <span className="tabular font-medium text-navy-900">Día {CURRENT_DAY} de 100</span>
          </div>
          <div className="relative mt-2 h-2 rounded-full bg-gray-100">
            <span className="absolute inset-y-0 left-0 rounded-full bg-navy-900" style={{ width: `${CURRENT_DAY}%` }} />
            <span className="absolute inset-y-[-3px] w-px bg-gray-300" style={{ left: "30%" }} />
            <span className="absolute inset-y-[-3px] w-px bg-gray-300" style={{ left: "60%" }} />
          </div>
        </div>

        {/* Indicadores */}
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-200 pt-5">
          <div>
            <dt className="text-xs text-gray-500">P&amp;L con criterios del grupo</dt>
            <dd className="tabular mt-1 text-xl font-semibold text-navy-900">
              11 <span className="text-sm font-normal text-gray-500">/ 11 centros</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Perfiles clave retenidos</dt>
            <dd className="tabular mt-1 text-xl font-semibold text-navy-900">
              9 <span className="text-sm font-normal text-gray-500">/ 9</span>
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Sinergias identificadas</span>
            <span className="tabular font-medium text-navy-900">{SYNERGIES_TOTAL}</span>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-gray-100">
            {SYNERGIES.map((s) => (
              <span key={s.label} className={s.className} style={{ width: `${(s.value / SYNERGIES_TOTAL) * 100}%` }} />
            ))}
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
            {SYNERGIES.map((s) => (
              <li key={s.label} className="flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", s.className)} />
                {s.label} <span className="tabular font-medium text-navy-900">{s.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
