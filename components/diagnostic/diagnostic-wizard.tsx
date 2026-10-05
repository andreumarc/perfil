"use client";

import * as React from "react";
import { AlertCircleIcon, ArrowRightIcon, CheckIcon, RotateCcwIcon } from "lucide-react";

import { LeadForm, type DiagnosticSource, type DiagnosticSuccess } from "@/components/diagnostic/lead-form";
import { QuestionStep } from "@/components/diagnostic/question-step";
import { ResultView } from "@/components/diagnostic/result-view";
import { clearDraft, readDraft, writeDraft } from "@/components/diagnostic/storage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/diagnostic/questions";
import { cn } from "@/lib/utils";
import type { LeadFormInput, LeadFormValues } from "@/lib/validation/lead";

type Phase = "intro" | "questions" | "lead" | "result" | "error";

const AUTO_ADVANCE_MS = 250;

const INTRO_BULLETS = [
  "Puntuación 0-100 y nivel de madurez operativa en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad.",
  "3 problemas detectados, 3 oportunidades y 3 acciones prioritarias para tu red.",
  "Servicio recomendado según tu patrón de respuestas y copia por email.",
] as const;

const COMPACT_CHIPS = ["Puntuación 0-100 en 5 bloques", "3 acciones prioritarias", "Resultado inmediato"] as const;

interface DiagnosticWizardProps {
  source?: DiagnosticSource;
  /** Versión reducida para landings de campaña (menos texto en la intro). */
  compact?: boolean;
  className?: string;
}

/**
 * Diagnóstico Multisite interactivo: intro → 15 preguntas (una por pantalla)
 * → formulario de lead → resultado. Persiste el borrador en sessionStorage.
 */
export function DiagnosticWizard({ source = "diagnostic", compact = false, className }: DiagnosticWizardProps) {
  const [phase, setPhase] = React.useState<Phase>("intro");
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = React.useState<number | null>(null);
  const [restored, setRestored] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState<DiagnosticSuccess | null>(null);
  const [lead, setLead] = React.useState<LeadFormValues | null>(null);
  const [leadDraft, setLeadDraft] = React.useState<Partial<LeadFormInput> | undefined>(undefined);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const advanceTimer = React.useRef<number | null>(null);

  /* Retoma un borrador de la misma sesión (tras la hidratación, para no romper el SSR). */
  React.useEffect(() => {
    const id = window.setTimeout(() => {
      const draft = readDraft();
      if (!draft) return;
      const complete = QUESTIONS.every((q) => Boolean(draft.answers[q.id]));
      setAnswers(draft.answers);
      setStep(draft.step);
      setStartedAt(draft.startedAt);
      setRestored(true);
      setPhase(complete ? "lead" : "questions");
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  /* Persistencia del borrador mientras el usuario responde o rellena el formulario. */
  React.useEffect(() => {
    if (phase !== "questions" && phase !== "lead") return;
    writeDraft({ answers, step, startedAt });
  }, [answers, step, startedAt, phase]);

  /* Cancela el avance automático pendiente al desmontar. */
  React.useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  const clearAdvance = () => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  };

  const scrollToTop = (always = false) => {
    if (!always && window.innerWidth >= 1024) return;
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const start = () => {
    clearAdvance();
    setStartedAt(Date.now());
    setStep(0);
    setPhase("questions");
    track("diagnostic_started", { source });
    scrollToTop();
  };

  const goTo = (nextStep: number) => {
    if (nextStep >= TOTAL_QUESTIONS) {
      setPhase("lead");
    } else {
      setStep(nextStep);
    }
    scrollToTop();
  };

  const select = (value: string) => {
    const question = QUESTIONS[step];
    if (!question) return;
    setRestored(false);
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    track("diagnostic_step_completed", { step: step + 1, questionId: question.id });
    clearAdvance();
    advanceTimer.current = window.setTimeout(() => {
      advanceTimer.current = null;
      goTo(step + 1);
    }, AUTO_ADVANCE_MS);
  };

  const next = () => {
    clearAdvance();
    setRestored(false);
    goTo(step + 1);
  };

  const back = () => {
    clearAdvance();
    setRestored(false);
    if (step === 0) {
      setPhase("intro");
    } else {
      setStep(step - 1);
    }
    scrollToTop();
  };

  const backToQuestions = () => {
    setStep(TOTAL_QUESTIONS - 1);
    setPhase("questions");
    scrollToTop();
  };

  const handleSuccess = (state: DiagnosticSuccess, values: LeadFormValues) => {
    clearDraft();
    setSuccess(state);
    setLead(values);
    setLeadDraft(undefined);
    setPhase("result");
    scrollToTop(true);
  };

  const handleFatalError = (message: string, values: Partial<LeadFormInput>) => {
    setErrorMessage(message);
    setLeadDraft(values);
    setPhase("error");
    scrollToTop();
  };

  const retry = () => {
    setErrorMessage(null);
    setPhase("lead");
    scrollToTop();
  };

  const question = QUESTIONS[step];
  const isResult = phase === "result" && success !== null;

  return (
    <div
      ref={wrapperRef}
      id="diagnostico-wizard"
      tabIndex={-1}
      aria-busy={submitting}
      className={cn("scroll-mt-24 outline-none", className)}
    >
      <p aria-live="polite" className="sr-only">
        {submitting ? "Calculando tu diagnóstico" : ""}
      </p>

      {isResult ? (
        <ResultView
          result={success.result}
          score={success.score}
          firstName={lead?.firstName}
          company={lead?.company}
          email={lead?.email}
          resultToken={success.resultToken}
          persisted={success.persisted}
        />
      ) : (
        <div
          className={cn(
            "mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white shadow-[0_24px_60px_-30px_rgba(10,26,51,0.25)]",
            compact ? "p-5 md:p-8" : "p-6 md:p-10",
          )}
        >
          {phase === "intro" ? (
            <div className="animate-fade-up">
              {!compact ? <p className="eyebrow">Diagnóstico Multisite · gratuito</p> : null}
              <h2
                className={cn(
                  "font-display leading-tight text-navy-900",
                  compact ? "text-2xl md:text-3xl" : "mt-3 text-3xl md:text-4xl",
                )}
              >
                ¿Cuánto potencial de mejora tiene tu red de centros?
              </h2>
              <p className={cn("text-gray-600", compact ? "mt-3 text-base" : "mt-5 text-lg")}>
                Quince preguntas sobre P&amp;L, KPIs, procesos, equipos y capacidad de crecer. Respuesta inmediata,
                pensada para dirección general, operaciones, finanzas e inversores.
              </p>

              {compact ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {COMPACT_CHIPS.map((chip) => (
                    <li
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-navy-900"
                    >
                      <CheckIcon className="size-3.5 text-signal" aria-hidden />
                      {chip}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-6 space-y-3 text-gray-700">
                  {INTRO_BULLETS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" size="xl" onClick={start} className="w-full sm:w-auto">
                  Empezar el diagnóstico
                  <ArrowRightIcon />
                </Button>
                <p className="text-sm text-gray-500">15 preguntas · 3 minutos · sin registro hasta el final</p>
              </div>
            </div>
          ) : null}

          {phase === "questions" && question ? (
            <QuestionStep
              key={question.id}
              question={question}
              index={step}
              total={TOTAL_QUESTIONS}
              value={answers[question.id]}
              onSelect={select}
              onBack={back}
              onNext={next}
              notice={restored ? "Hemos recuperado tus respuestas" : undefined}
            />
          ) : null}

          {phase === "lead" ? (
            <LeadForm
              answers={answers}
              source={source}
              startedAt={startedAt}
              initialValues={leadDraft}
              onSuccess={handleSuccess}
              onFatalError={handleFatalError}
              onBack={backToQuestions}
              onSubmittingChange={setSubmitting}
            />
          ) : null}

          {phase === "error" ? (
            <div className="animate-fade-up space-y-6">
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>No se ha podido completar el diagnóstico</AlertTitle>
                <AlertDescription>
                  <p>{errorMessage ?? "Se ha producido un error inesperado."}</p>
                  <p>Tus respuestas y tus datos se han conservado: puedes volver a intentarlo.</p>
                </AlertDescription>
              </Alert>
              <Button type="button" size="lg" onClick={retry} className="w-full sm:w-auto">
                <RotateCcwIcon />
                Reintentar
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
