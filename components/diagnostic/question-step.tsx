"use client";

import * as React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Question } from "@/lib/diagnostic/questions";
import { cn } from "@/lib/utils";

interface QuestionStepProps {
  question: Question;
  /** Índice de la pregunta (0-based). */
  index: number;
  total: number;
  value?: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  /** Texto discreto bajo el contador (p. ej. "Hemos recuperado tus respuestas"). */
  notice?: string;
}

/**
 * Una pregunta por pantalla: barra de progreso, enunciado, opciones como
 * botones grandes y navegación. Teclado: 1-9 (0 para la décima opción)
 * selecciona, Enter avanza si hay respuesta, flecha izquierda retrocede.
 */
export function QuestionStep({ question, index, total, value, onSelect, onBack, onNext, notice }: QuestionStepProps) {
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const headingId = `diag-q-${question.id}-title`;
  const helpId = question.help ? `diag-q-${question.id}-help` : undefined;
  const twoColumns = question.options.length > 6;

  React.useEffect(() => {
    // Lleva el foco al enunciado al cambiar de pregunta (lectores de pantalla).
    headingRef.current?.focus({ preventScroll: true });
  }, [question.id]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target as HTMLElement;

    if (/^[0-9]$/.test(event.key)) {
      const n = event.key === "0" ? 10 : Number(event.key);
      const option = question.options[n - 1];
      if (option) {
        event.preventDefault();
        onSelect(option.value);
      }
      return;
    }
    if (event.key === "Enter") {
      // Los botones ya gestionan Enter de forma nativa (click): evita el doble avance.
      if (target.tagName === "BUTTON") return;
      if (value) {
        event.preventDefault();
        onNext();
      }
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onBack();
    }
  };

  return (
    <div className="animate-fade-up" onKeyDown={handleKeyDown}>
      <Progress value={(index / total) * 100} aria-label="Progreso del diagnóstico" />
      <div className="mt-3 flex items-center justify-between gap-4">
        <p aria-live="polite" className="tabular text-sm font-medium text-gray-500">
          Pregunta {index + 1} de {total}
        </p>
        {notice ? <p className="text-xs text-gray-500">{notice}</p> : null}
      </div>

      <h2
        id={headingId}
        ref={headingRef}
        tabIndex={-1}
        className="font-display mt-6 text-2xl leading-tight text-navy-900 outline-none md:text-3xl"
      >
        {question.title}
      </h2>
      {question.help ? (
        <p id={helpId} className="mt-3 text-base text-gray-600">
          {question.help}
        </p>
      ) : null}

      <div
        role="radiogroup"
        aria-labelledby={headingId}
        aria-describedby={helpId}
        className={cn("mt-8 grid gap-3", twoColumns && "sm:grid-cols-2")}
      >
        {question.options.map((option, i) => {
          const selected = option.value === value;
          const n = i + 1;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(option.value)}
              className={cn(
                "flex min-h-14 w-full items-center gap-4 rounded-md border px-4 py-3 text-left text-base transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-navy-900/60 focus-visible:ring-offset-2",
                selected
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-gray-200 bg-white text-navy-900 hover:border-navy-300 hover:bg-navy-50",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "tabular flex size-8 shrink-0 items-center justify-center rounded-sm border text-sm font-semibold",
                  selected ? "border-white/30 text-white" : "border-gray-300 text-gray-500",
                )}
              >
                {n === 10 ? 0 : n}
              </span>
              <span className="sr-only">Opción {n}:</span>
              <span className="leading-snug">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="ghost" size="lg" onClick={onBack} className="w-full sm:w-auto">
          <ArrowLeftIcon />
          Atrás
        </Button>
        {value ? (
          <Button type="button" size="lg" onClick={onNext} className="w-full sm:w-auto">
            {index + 1 === total ? "Ver mi resultado" : "Siguiente"}
            <ArrowRightIcon />
          </Button>
        ) : (
          <p className="hidden text-sm text-gray-500 sm:block">Selecciona una opción para continuar.</p>
        )}
      </div>
    </div>
  );
}
