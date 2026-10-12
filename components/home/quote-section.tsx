import { CheckIcon } from "lucide-react";

import { QuoteForm } from "@/components/forms/quote-form";
import { Section } from "@/components/layout/section";

const POINTS = [
  "Visita y presupuesto sin compromiso",
  "Presupuesto detallado por partidas",
  "Un único interlocutor durante la obra",
  "Instalaciones certificadas por profesionales habilitados",
];

export function QuoteSection() {
  return (
    <Section tone="muted" id="presupuesto">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="eyebrow">Presupuesto</p>
          <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">Cuéntanos tu proyecto en dos minutos</h2>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Rellena el formulario corto y te llamamos para concretar detalles. Si lo prefieres, usa el{" "}
            <a href="/presupuesto" className="underline underline-offset-4 hover:text-ink-900">
              formulario completo
            </a>{" "}
            para darnos más información desde el principio.
          </p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-copper-500" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.06)] md:p-8">
          <QuoteForm layout="compact" source="presupuesto" variant="general" submitLabel="Pedir presupuesto" />
        </div>
      </div>
    </Section>
  );
}
