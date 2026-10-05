import { cn } from "@/lib/utils";

/**
 * Mockup de ranking de clínicas por ocupación de gabinete y conversión de primera
 * visita. Decorativo (aria-hidden), solo escritorio. Cifras ficticias.
 */
interface ClinicRow {
  name: string;
  /** Ocupación de gabinete en % (ficticia). */
  occupancy: number;
  /** Conversión de primera visita a tratamiento en % (ficticia). */
  conversion: number;
}

const CLINICS: readonly ClinicRow[] = [
  { name: "Clínica A", occupancy: 86, conversion: 68 },
  { name: "Clínica B", occupancy: 78, conversion: 61 },
  { name: "Clínica C", occupancy: 71, conversion: 57 },
  { name: "Clínica D", occupancy: 63, conversion: 52 },
  { name: "Clínica E", occupancy: 54, conversion: 44 },
  { name: "Clínica F", occupancy: 47, conversion: 39 },
];

const AVERAGE = Math.round(CLINICS.reduce((sum, c) => sum + c.occupancy, 0) / CLINICS.length);
const SPREAD = CLINICS[0].occupancy - CLINICS[CLINICS.length - 1].occupancy;

export function HealthcareVisual({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      <div className="absolute -inset-x-10 -inset-y-12 -z-10 rounded-[3rem] bg-navy-50/80 blur-3xl" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_28px_70px_-32px_rgba(10,26,51,0.4)] md:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Ranking de clínicas</p>
            <p className="font-display mt-2 text-2xl text-navy-900">Ocupación de gabinete · último trimestre</p>
          </div>
          <span className="shrink-0 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-500">
            Ejemplo ilustrativo
          </span>
        </div>

        <div className="mt-5 grid grid-cols-[1.25rem_5rem_1fr_3rem_4.5rem] items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
          <span />
          <span>Clínica</span>
          <span>Ocupación</span>
          <span className="text-right">%</span>
          <span className="text-right">Conv. 1ª visita</span>
        </div>

        <ol className="mt-3 space-y-3.5">
          {CLINICS.map((clinic, index) => {
            const low = clinic.occupancy < AVERAGE;
            return (
              <li key={clinic.name} className="grid grid-cols-[1.25rem_5rem_1fr_3rem_4.5rem] items-center gap-3 text-sm">
                <span className="tabular text-xs text-gray-400">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-medium text-navy-900">{clinic.name}</span>
                <div className="relative h-2.5 rounded-full bg-gray-100">
                  <span className="absolute inset-y-[-3px] w-px bg-gray-300" style={{ left: `${AVERAGE}%` }} />
                  <span
                    className={cn("absolute inset-y-0 left-0 rounded-full", low ? "bg-signal/70" : "bg-navy-900")}
                    style={{ width: `${clinic.occupancy}%` }}
                  />
                </div>
                <span className="tabular text-right font-medium text-navy-900">{clinic.occupancy}</span>
                <span className={cn("tabular text-right", low ? "text-gray-500" : "text-navy-900")}>{clinic.conversion}&nbsp;%</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-6 flex items-center justify-between gap-4 rounded-md bg-gray-50 px-4 py-3 text-sm">
          <p className="font-medium text-navy-900">
            Media de la red: <span className="tabular">{AVERAGE} %</span>
          </p>
          <p className="shrink-0 text-xs text-gray-500">
            {SPREAD} puntos entre la mejor y la peor clínica
          </p>
        </div>
      </div>
    </div>
  );
}
