"use client";

import * as React from "react";
import { animate, useReducedMotion } from "motion/react";
import { ArrowDownIcon, InfoIcon } from "lucide-react";

import { Field, describedBy } from "@/components/forms/field";
import { LeadExtraProvider, type LeadExtra } from "@/components/forms/lead-extra-context";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { track } from "@/lib/analytics/track";
import {
  CALCULATORS,
  defaultInputs,
  describeInputs,
  getCalculator,
  sanitizeInputs,
  type CalculatorId,
  type InputDefinition,
  type InputValue,
  type Inputs,
  type Rates,
} from "@/lib/calculators/definitions";
import { formatEuro } from "@/lib/utils";

/** Cifra en euros que se anima entre el valor anterior y el nuevo (sin estado React: escribe en el DOM). */
function AnimatedEuro({ value, className }: { value: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const previous = React.useRef(value);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const el = ref.current;
    const from = previous.current;
    previous.current = value;
    if (!el) return;
    if (reduce || from === value) {
      el.textContent = formatEuro(value);
      return;
    }
    const controls = animate(from, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = formatEuro(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce]);

  return (
    <span ref={ref} className={className}>
      {formatEuro(value)}
    </span>
  );
}

function isVisible(input: InputDefinition, inputs: Inputs) {
  return !input.showWhen || input.showWhen.values.includes(inputs[input.showWhen.key]);
}

interface CalculatorFormProps {
  id: CalculatorId;
  rates: Rates;
  disclaimer: string;
  /** Formulario de presupuesto (componente de servidor) que recibe el contexto del cálculo. */
  children: React.ReactNode;
}

/**
 * Calculadora interactiva: entradas a la izquierda, estimación en vivo a la
 * derecha y, debajo, el formulario de presupuesto precargado con el cálculo.
 */
export function CalculatorForm({ id, rates, disclaimer, children }: CalculatorFormProps) {
  const def = getCalculator(id) ?? CALCULATORS[0];
  const [inputs, setInputs] = React.useState<Inputs>(() => defaultInputs(def));
  const used = React.useRef(false);

  const clean = React.useMemo(() => sanitizeInputs(def, inputs), [def, inputs]);
  const estimate = React.useMemo(() => def.compute(clean, rates), [def, clean, rates]);
  const summary = React.useMemo(() => describeInputs(def, clean), [def, clean]);
  const squareMeters = typeof clean.m2 === "number" && clean.m2 > 0 ? Math.round(clean.m2) : undefined;
  const extra = React.useMemo<LeadExtra>(
    () => ({
      context: { calculator: def.id, calculatorInputs: summary, estimateMin: estimate.min, estimateMax: estimate.max },
      squareMeters,
    }),
    [def.id, summary, estimate.min, estimate.max, squareMeters],
  );

  const update = (key: string, value: InputValue) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    if (!used.current) {
      used.current = true;
      track("calculator_used", { calculator: def.id });
    }
  };

  const onCta = () => {
    track("cta_clicked", { location: "calculator_result", calculator: def.id, estimateMin: estimate.min, estimateMax: estimate.max });
  };

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="rounded-lg border border-gray-200 bg-white p-5 md:p-7">
          <h2 className="font-display text-2xl text-ink-900">Datos de tu proyecto</h2>
          <p className="mt-2 text-sm text-gray-600">Ajusta los valores: la estimación se actualiza al instante.</p>
          <div className="mt-6 grid gap-5">
            {def.inputs.filter((input) => isVisible(input, inputs)).map((input) => {
              const fid = `calc-${def.id}-${input.key}`;
              if (input.kind === "boolean") {
                return (
                  <div key={input.key} className="flex items-start gap-3 rounded-md border border-gray-200 bg-gray-50/60 p-3">
                    <Checkbox id={fid} checked={inputs[input.key] === true} onCheckedChange={(v) => update(input.key, v === true)} className="mt-0.5" />
                    <label htmlFor={fid} className="cursor-pointer text-sm text-ink-900">
                      {input.label}
                    </label>
                  </div>
                );
              }
              if (input.kind === "select") {
                return (
                  <Field key={input.key} id={fid} label={input.label} hint={input.hint}>
                    <Select value={String(inputs[input.key] ?? "")} onValueChange={(v) => update(input.key, v)}>
                      <SelectTrigger id={fid} className="w-full" aria-describedby={describedBy(fid, undefined, input.hint)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {input.options?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                );
              }
              return (
                <Field key={input.key} id={fid} label={input.label} hint={input.hint}>
                  <div className="relative">
                    <Input
                      id={fid}
                      type="number"
                      inputMode="decimal"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={String(inputs[input.key] ?? "")}
                      onChange={(e) => update(input.key, e.target.value)}
                      aria-describedby={describedBy(fid, undefined, input.hint)}
                      className={input.unit ? "pr-12" : undefined}
                    />
                    {input.unit ? (
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500" aria-hidden>
                        {input.unit}
                      </span>
                    ) : null}
                  </div>
                </Field>
              );
            })}
          </div>
        </div>

        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-lg bg-ink-900 p-6 text-white shadow-[0_20px_50px_rgba(23,25,29,0.25)] md:p-8">
            <p className="eyebrow text-copper-300">Estimación orientativa</p>
            <p className="mt-3 text-sm text-ink-200">{def.shortName} · precios sin IVA</p>
            <p className="font-display tabular mt-2 text-[1.75rem] leading-tight sm:text-3xl md:text-4xl" aria-hidden>
              <AnimatedEuro value={estimate.min} /> <span className="text-ink-300">–</span> <AnimatedEuro value={estimate.max} />
            </p>
            <p className="sr-only" aria-live="polite">
              Estimación entre {formatEuro(estimate.min)} y {formatEuro(estimate.max)} sin IVA.
            </p>

            {estimate.lines.length ? (
              <ul className="mt-6 divide-y divide-white/10 border-y border-white/10 text-sm">
                {estimate.lines.map((l) => (
                  <li key={l.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <span className="text-ink-100">{l.label}</span>
                    <span className="tabular whitespace-nowrap text-white">
                      {formatEuro(l.min)} – {formatEuro(l.max)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-ink-200">Introduce los datos para ver la estimación por partidas.</p>
            )}

            <ul className="mt-5 space-y-1.5 text-xs leading-relaxed text-ink-300">
              {estimate.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <InfoIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                  <span>{n}</span>
                </li>
              ))}
            </ul>

            <Button asChild size="xl" className="mt-6 w-full">
              <a href="#presupuesto-calculadora" onClick={onCta}>
                Pedir presupuesto con estos datos
                <ArrowDownIcon aria-hidden />
              </a>
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-ink-300">{disclaimer}</p>
          </div>
        </aside>
      </div>

      <section id="presupuesto-calculadora" className="mt-14 scroll-mt-24 md:mt-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <div>
            <p className="eyebrow">Siguiente paso</p>
            <h2 className="font-display mt-3 text-3xl text-ink-900 md:text-4xl">Convierte la estimación en un presupuesto real</h2>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              Déjanos tus datos y recibirás un presupuesto detallado por partidas tras una visita sin compromiso. Enviaremos contigo el resumen del cálculo:
            </p>
            <dl className="mt-5 rounded-md border border-gray-200 bg-white p-4 text-sm">
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                <dt className="text-gray-500">Calculadora</dt>
                <dd className="font-medium text-ink-900">{def.shortName}</dd>
              </div>
              <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:justify-between">
                <dt className="text-gray-500">Estimación</dt>
                <dd className="tabular font-medium text-ink-900">
                  {formatEuro(estimate.min)} – {formatEuro(estimate.max)} sin IVA
                </dd>
              </div>
              <div className="mt-2">
                <dt className="text-gray-500">Datos</dt>
                <dd className="mt-1 text-ink-900">{summary}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-[0_8px_30px_rgba(23,25,29,0.06)] md:p-8">
            <LeadExtraProvider value={extra}>{children}</LeadExtraProvider>
          </div>
        </div>
      </section>
    </div>
  );
}
