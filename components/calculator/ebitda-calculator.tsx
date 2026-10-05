"use client";

import * as React from "react";
import { CalculatorIcon } from "lucide-react";

import { CalculatorLeadForm } from "@/components/calculator/calculator-lead-form";
import { CalculatorResultPanel } from "@/components/calculator/calculator-result";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { track } from "@/lib/analytics";
import {
  DEFAULT_CALCULATOR_INPUT,
  evaluateCalculator,
  isSector,
  revenueBand,
  type CalculatorInput,
  type CalculatorResult,
} from "@/lib/ebitda-benchmark";
import { cn, formatEuro } from "@/lib/utils";
import { SECTORS, type Sector } from "@/types/lead";

type NumericKey = Exclude<keyof CalculatorInput, "sector">;
type FormValues = Record<NumericKey, string>;

interface FieldConfig {
  key: NumericKey;
  label: string;
  suffix: string;
  step: number;
  min: number;
  max?: number;
  hint?: string;
}

const FIELDS: FieldConfig[] = [
  { key: "revenue", label: "Facturación anual del grupo", suffix: "€", step: 50_000, min: 1, hint: "Ventas netas anuales de toda la red." },
  { key: "locations", label: "Número de centros", suffix: "centros", step: 1, min: 1 },
  { key: "ebitdaMarginPct", label: "Margen EBITDA", suffix: "% ventas", step: 0.5, min: 0, max: 100, hint: "EBITDA / facturación." },
  { key: "staffCostPct", label: "Coste de personal", suffix: "% ventas", step: 0.5, min: 0, max: 100, hint: "Salarios y cargas sociales / facturación." },
  { key: "purchasesPct", label: "Compras y consumibles", suffix: "% ventas", step: 0.5, min: 0, max: 100, hint: "Material, consumibles y subcontratación / facturación." },
  { key: "occupancyPct", label: "Ocupación / uso de capacidad", suffix: "%", step: 1, min: 0, max: 100, hint: "Horas o huecos ocupados sobre la capacidad disponible." },
];

function toFormValues(input: CalculatorInput): FormValues {
  return {
    revenue: String(input.revenue),
    locations: String(input.locations),
    ebitdaMarginPct: String(input.ebitdaMarginPct),
    staffCostPct: String(input.staffCostPct),
    purchasesPct: String(input.purchasesPct),
    occupancyPct: String(input.occupancyPct),
  };
}

function parseNumber(value: string): number {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function compactEuro(value: number) {
  if (value >= 1_000_000) {
    return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 }).format(value / 1_000_000)} M€`;
  }
  return formatEuro(value);
}

/**
 * EBITDA Opportunity Calculator: formulario de seis datos + sector, resultado
 * con benchmark por métrica y captura de lead opcional al final.
 */
export function EbitdaCalculator({ className }: { className?: string }) {
  const [values, setValues] = React.useState<FormValues>(() => toFormValues(DEFAULT_CALCULATOR_INPUT));
  const [sector, setSector] = React.useState<Sector>(DEFAULT_CALCULATOR_INPUT.sector);
  const [result, setResult] = React.useState<CalculatorResult | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [runs, setRuns] = React.useState(0);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const revenueValue = parseNumber(values.revenue);

  React.useEffect(() => {
    if (runs === 0) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [runs]);

  const handleChange = (key: NumericKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    setValues((prev) => ({ ...prev, [key]: next }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const input: CalculatorInput = {
      revenue: parseNumber(values.revenue),
      locations: parseNumber(values.locations),
      ebitdaMarginPct: parseNumber(values.ebitdaMarginPct),
      staffCostPct: parseNumber(values.staffCostPct),
      purchasesPct: parseNumber(values.purchasesPct),
      occupancyPct: parseNumber(values.occupancyPct),
      sector,
    };
    const evaluated = evaluateCalculator(input);
    setResult(evaluated);
    setRuns((n) => n + 1);
    track("calculator_used", {
      sector: evaluated.input.sector,
      locations: evaluated.input.locations,
      revenueBand: revenueBand(evaluated.input.revenue),
      opportunityLevel: evaluated.opportunityLevel,
    });
  };

  return (
    <div className={cn("space-y-8", className)}>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(10,26,51,0.25)] md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Tus datos</p>
            <h2 className="font-display text-2xl text-navy-900">Seis cifras de tu P&amp;L</h2>
            <p className="mt-2 text-sm text-gray-600">
              Usa los datos del último ejercicio cerrado o de los últimos doce meses. No se guardan hasta que decidas enviarlos.
            </p>
          </div>
          <CalculatorIcon className="hidden size-8 shrink-0 text-navy-200 sm:block" aria-hidden />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.map((field) => {
            const id = `calc-${field.key}`;
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={id}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={id}
                    name={field.key}
                    type="number"
                    inputMode="decimal"
                    required
                    step={field.step}
                    min={field.min}
                    max={field.max}
                    value={values[field.key]}
                    onChange={handleChange(field.key)}
                    className="tabular h-12 pr-20 text-lg md:text-lg"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm text-gray-500">
                    {field.suffix}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {field.key === "revenue" && revenueValue > 0 ? `${compactEuro(revenueValue)} · ` : null}
                  {field.hint}
                </p>
              </div>
            );
          })}

          <div className="space-y-2">
            <Label htmlFor="calc-sector-input">Sector</Label>
            <Select value={sector} onValueChange={(v) => isSector(v) && setSector(v)} name="sector">
              <SelectTrigger id="calc-sector-input" className="h-12 text-lg data-[size=default]:h-12 md:text-base">
                <SelectValue placeholder="Selecciona el sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">Determina los rangos de referencia que se aplican.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="xl" className="w-full sm:w-auto">
            Calcular benchmark
          </Button>
          <p className="text-sm text-gray-500">Resultado inmediato. Sin registro para ver el benchmark.</p>
        </div>
      </form>

      {result ? (
        <div ref={resultRef} className="scroll-mt-24 space-y-8">
          <CalculatorResultPanel result={result} formOpen={showForm} onAnalyze={() => setShowForm(true)} />
          {showForm ? <CalculatorLeadForm result={result} /> : null}
        </div>
      ) : null}
    </div>
  );
}
