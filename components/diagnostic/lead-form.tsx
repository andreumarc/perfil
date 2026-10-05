"use client";

import * as React from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, ArrowLeftIcon, ArrowRightIcon, Loader2Icon } from "lucide-react";

import { submitDiagnostic, type SubmitDiagnosticState } from "@/actions/submit-diagnostic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAttribution, getVisitorId, track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { leadFormSchema, type LeadFormInput, type LeadFormValues } from "@/lib/validation/lead";
import { COMPANY_REVENUE, JOB_TITLES, NUMBER_LOCATIONS, SECTORS } from "@/types/lead";

export type DiagnosticSource = "diagnostic" | "linkedin";
export type DiagnosticSuccess = Extract<SubmitDiagnosticState, { status: "success" }>;

type FieldName = keyof LeadFormInput;
const FIELD_NAMES: FieldName[] = [
  "firstName",
  "lastName",
  "company",
  "jobTitle",
  "email",
  "phone",
  "numberLocations",
  "companyRevenue",
  "sector",
  "gdprConsent",
];

function isFieldName(value: string): value is FieldName {
  return (FIELD_NAMES as string[]).includes(value);
}

/** Devuelve `value` solo si es una opción válida de la lista (precarga segura). */
function pick<T extends readonly { value: string }[]>(list: T, value?: string): T[number]["value"] | undefined {
  return value && list.some((item) => item.value === value) ? (value as T[number]["value"]) : undefined;
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? <span className="font-normal text-gray-500">(opcional)</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface LeadFormProps {
  answers: Record<string, string>;
  source: DiagnosticSource;
  /** Puntuación global ya calculada: se muestra como anticipo del resultado. */
  previewScore?: number;
  /** Momento en que el usuario empezó el diagnóstico (anti-spam). */
  startedAt: number | null;
  /** Valores previos si el usuario reintenta tras un error. */
  initialValues?: Partial<LeadFormInput>;
  onSuccess: (state: DiagnosticSuccess, values: LeadFormValues) => void;
  onFatalError: (message: string, values: Partial<LeadFormInput>) => void;
  onBack: () => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

/**
 * Último paso del diagnóstico: captura del lead. Precarga centros, facturación
 * y sector desde las respuestas de perfil y envía todo a la server action.
 */
export function LeadForm({
  answers,
  source,
  previewScore,
  startedAt,
  initialValues,
  onSuccess,
  onFatalError,
  onBack,
  onSubmittingChange,
}: LeadFormProps) {
  const [website, setWebsite] = React.useState("");
  const [formError, setFormError] = React.useState<string | null>(null);
  /** Marca de tiempo del formulario (anti-spam) si el wizard no la proporciona. */
  const mountedAt = React.useRef<number | undefined>(undefined);

  const form = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      ...initialValues,
      numberLocations: initialValues?.numberLocations ?? pick(NUMBER_LOCATIONS, answers.q1),
      companyRevenue: initialValues?.companyRevenue ?? pick(COMPANY_REVENUE, answers.q13),
      sector: initialValues?.sector ?? pick(SECTORS, answers.q14),
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = form;

  React.useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const onSubmit = async (values: LeadFormValues) => {
    setFormError(null);
    onSubmittingChange?.(true);
    try {
      const response = await submitDiagnostic({
        lead: values,
        answers,
        attribution: getAttribution(),
        antiSpam: { website, startedAt: startedAt ?? mountedAt.current },
        visitorId: getVisitorId(),
        source,
      });

      if (response.status === "success") {
        track(
          "diagnostic_completed",
          { totalScore: response.result.totalScore, level: response.result.level, leadId: response.leadId ?? undefined },
          { persist: false },
        );
        track("lead_created", { source, leadId: response.leadId ?? undefined }, { persist: false });
        onSuccess(response, values);
        return;
      }

      if (response.status === "error") {
        const entries = Object.entries(response.fieldErrors ?? {});
        if (entries.length === 0) {
          onFatalError(response.message, getValues());
          return;
        }
        let unmapped = false;
        for (const [path, message] of entries) {
          const name = path.replace(/^lead\./, "");
          if (isFieldName(name)) setError(name, { type: "server", message });
          else unmapped = true;
        }
        setFormError(
          unmapped
            ? "Hay respuestas del diagnóstico que no se han podido validar. Vuelve a las preguntas y revísalas."
            : response.message,
        );
      }
    } catch {
      onFatalError("No se ha podido conectar. Comprueba tu conexión e inténtalo de nuevo.", getValues());
    } finally {
      onSubmittingChange?.(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <p className="eyebrow">Último paso</p>
      <h2 className="font-display mt-3 text-2xl leading-tight text-navy-900 md:text-3xl">
        {typeof previewScore === "number" ? (
          <>
            Tu red puntúa <span className="tabular whitespace-nowrap">{previewScore}/100</span>. ¿A quién envío el
            detalle?
          </>
        ) : (
          "¿A quién envío el diagnóstico?"
        )}
      </h2>
      <p className="mt-3 text-base text-gray-600">
        Al instante: los cinco bloques, tres problemas, tres acciones y el formato de intervención que encaja. Y una
        copia por email.
      </p>

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate className="mt-8 space-y-6">
        {/* Honeypot: fuera de pantalla, nunca visible ni enfocable. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="diag-website">Sitio web</label>
          <input
            id="diag-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="diag-firstName" error={errors.firstName?.message}>
            <Input
              id="diag-firstName"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "diag-firstName-error" : undefined}
              {...register("firstName")}
            />
          </Field>
          <Field label="Apellidos" htmlFor="diag-lastName" error={errors.lastName?.message}>
            <Input
              id="diag-lastName"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "diag-lastName-error" : undefined}
              {...register("lastName")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Empresa o grupo" htmlFor="diag-company" error={errors.company?.message}>
            <Input
              id="diag-company"
              autoComplete="organization"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "diag-company-error" : undefined}
              {...register("company")}
            />
          </Field>
          <Field label="Cargo" htmlFor="diag-jobTitle" error={errors.jobTitle?.message}>
            <Controller
              control={control}
              name="jobTitle"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger id="diag-jobTitle" aria-invalid={Boolean(errors.jobTitle)} onBlur={field.onBlur}>
                    <SelectValue placeholder="Selecciona tu cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_TITLES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email corporativo" htmlFor="diag-email" error={errors.email?.message}>
            <Input
              id="diag-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nombre@tuempresa.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "diag-email-error" : undefined}
              {...register("email")}
            />
          </Field>
          <Field label="Teléfono" htmlFor="diag-phone" optional error={errors.phone?.message}>
            <Input
              id="diag-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "diag-phone-error" : undefined}
              {...register("phone")}
            />
          </Field>
        </div>

        <fieldset className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <legend className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
            Tu red (puedes corregirlo)
          </legend>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Centros" htmlFor="diag-numberLocations" error={errors.numberLocations?.message}>
              <Controller
                control={control}
                name="numberLocations"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                    <SelectTrigger id="diag-numberLocations" size="sm" aria-invalid={Boolean(errors.numberLocations)}>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {NUMBER_LOCATIONS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Facturación anual" htmlFor="diag-companyRevenue" error={errors.companyRevenue?.message}>
              <Controller
                control={control}
                name="companyRevenue"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                    <SelectTrigger id="diag-companyRevenue" size="sm" aria-invalid={Boolean(errors.companyRevenue)}>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_REVENUE.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field label="Sector" htmlFor="diag-sector" error={errors.sector?.message}>
              <Controller
                control={control}
                name="sector"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                    <SelectTrigger id="diag-sector" size="sm" aria-invalid={Boolean(errors.sector)}>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
        </fieldset>

        <div className="space-y-2">
          <Controller
            control={control}
            name="gdprConsent"
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="diag-gdprConsent"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(errors.gdprConsent)}
                  aria-describedby={errors.gdprConsent ? "diag-gdprConsent-error" : undefined}
                  className="mt-0.5"
                />
                <Label htmlFor="diag-gdprConsent" className="items-start text-sm leading-snug font-normal text-gray-700">
                  <span>
                    He leído y acepto la{" "}
                    <Link
                      href="/politica-privacidad"
                      className="underline underline-offset-4 hover:text-navy-900"
                      target="_blank"
                    >
                      política de privacidad
                    </Link>
                    . Mis datos se usarán para enviarme el resultado y, si lo solicito, concertar una sesión.
                  </span>
                </Label>
              </div>
            )}
          />
          {errors.gdprConsent?.message ? (
            <p id="diag-gdprConsent-error" role="alert" className="text-sm text-destructive">
              {errors.gdprConsent.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Revisa el formulario</AlertTitle>
            <AlertDescription>
              <p>{formError}</p>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-4">
          <Button type="submit" size="xl" className="w-full" disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
            {isSubmitting ? "Calculando tu diagnóstico" : "Ver mi diagnóstico"}
            {!isSubmitting ? <ArrowRightIcon /> : null}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Sin secuencias comerciales. Solo el resultado y, si lo pides, una conversación de 30 minutos.
          </p>
        </div>
      </form>

      <div className="mt-6 border-t border-gray-200 pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeftIcon />
          Volver a las preguntas
        </Button>
      </div>
    </div>
  );
}
