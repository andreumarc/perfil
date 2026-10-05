"use client";

import * as React from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, ArrowRightIcon, CalendarCheckIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";

import { submitContact, type SubmitContactState } from "@/actions/submit-contact";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAttribution, getVisitorId, track } from "@/lib/analytics";
import { locationsBand, revenueBand, type CalculatorResult } from "@/lib/ebitda-benchmark";
import { meetingCta, meetingHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues,
} from "@/lib/validation/lead";
import { COMPANY_REVENUE, JOB_TITLES, MAIN_PROBLEMS, NUMBER_LOCATIONS, SECTORS } from "@/types/lead";

const DEFAULT_MESSAGE = "Quiero analizar las oportunidades de EBITDA de mi red a partir del benchmark.";

type FieldName = keyof ContactFormInput;
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
  "mainProblem",
  "message",
  "gdprConsent",
];

function isFieldName(value: string): value is FieldName {
  return (FIELD_NAMES as string[]).includes(value);
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

interface CalculatorLeadFormProps {
  result: CalculatorResult;
  className?: string;
}

/**
 * Formulario de captura de lead tras el benchmark. Precarga centros, facturación
 * y sector desde la calculadora y envía el contexto numérico al CRM.
 */
export function CalculatorLeadForm({ result, className }: CalculatorLeadFormProps) {
  const [state, setState] = React.useState<SubmitContactState>({ status: "idle" });
  const [website, setWebsite] = React.useState("");
  /** Marca de tiempo de renderizado (anti-spam): se fija en un efecto, nunca durante el render. */
  const startedAt = React.useRef<number | undefined>(undefined);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  const form = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      numberLocations: locationsBand(result.input.locations),
      companyRevenue: revenueBand(result.input.revenue),
      sector: result.input.sector,
      mainProblem: "rentabilidad",
      message: DEFAULT_MESSAGE,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  React.useEffect(() => {
    startedAt.current = Date.now();
    headingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onSubmit = async (values: ContactFormValues) => {
    const response = await submitContact({
      contact: values,
      attribution: getAttribution(),
      antiSpam: { website, startedAt: startedAt.current },
      visitorId: getVisitorId(),
      source: "calculator",
      context: {
        revenue: result.input.revenue,
        locations: result.input.locations,
        ebitdaMarginPct: result.input.ebitdaMarginPct,
        staffCostPct: result.input.staffCostPct,
        purchasesPct: result.input.purchasesPct,
        occupancyPct: result.input.occupancyPct,
        sector: result.input.sector,
        ebitda: result.ebitda,
        opportunityLevel: result.opportunityLevel,
      },
    });

    if (response.status === "error") {
      for (const [path, message] of Object.entries(response.fieldErrors ?? {})) {
        const name = path.replace(/^contact\./, "");
        if (isFieldName(name)) setError(name, { type: "server", message });
      }
    } else if (response.status === "success") {
      track("lead_created", { source: "calculator", leadId: response.leadId ?? undefined }, { persist: false });
    }
    setState(response);
  };

  if (state.status === "success") {
    return (
      <div className={cn("rounded-lg border border-gray-200 bg-white p-6 md:p-10", className)}>
        <div className="mx-auto max-w-2xl text-center">
          <CheckCircle2Icon className="mx-auto size-10 text-signal" aria-hidden />
          <h3 className="font-display mt-4 text-3xl text-navy-900">Recibido.</h3>
          <p className="mt-3 text-lg text-gray-600">
            Te envío una primera lectura de tu benchmark en menos de 48 h.
            {state.priority === "high"
              ? " Por el perfil de tu red, te propongo que reservemos directamente 30 minutos para revisarla juntos."
              : " Si prefieres adelantarlo, reserva directamente 30 minutos y lo revisamos juntos."}
          </p>
          <Button asChild size="xl" className="mt-8 w-full sm:w-auto">
            <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: "calculator_success" }}>
              <CalendarCheckIcon />
              {meetingCta.label}
            </TrackedLink>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-6 md:p-10", className)}>
      <div className="max-w-2xl">
        <p className="eyebrow">Analizar oportunidades</p>
        <h3 ref={headingRef} className="font-display scroll-mt-28 text-2xl text-navy-900 md:text-3xl">
          Recibe una primera lectura de tu benchmark
        </h3>
        <p className="mt-3 text-gray-600">
          Reviso tus seis datos frente a lo que suelo ver en redes similares y te indico qué palanca
          atacar primero. Respuesta personal en menos de 48 h.
        </p>
      </div>

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate className="mt-8 space-y-6">
        {/* Honeypot: fuera de pantalla, nunca visible ni enfocable. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="calc-website">Sitio web</label>
          <input
            id="calc-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="calc-firstName" error={errors.firstName?.message}>
            <Input
              id="calc-firstName"
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "calc-firstName-error" : undefined}
              {...register("firstName")}
            />
          </Field>
          <Field label="Apellidos" htmlFor="calc-lastName" error={errors.lastName?.message}>
            <Input
              id="calc-lastName"
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? "calc-lastName-error" : undefined}
              {...register("lastName")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Empresa o grupo" htmlFor="calc-company" error={errors.company?.message}>
            <Input
              id="calc-company"
              autoComplete="organization"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "calc-company-error" : undefined}
              {...register("company")}
            />
          </Field>
          <Field label="Cargo" htmlFor="calc-jobTitle" error={errors.jobTitle?.message}>
            <Controller
              control={control}
              name="jobTitle"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger id="calc-jobTitle" aria-invalid={Boolean(errors.jobTitle)} onBlur={field.onBlur}>
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
          <Field label="Email corporativo" htmlFor="calc-email" error={errors.email?.message}>
            <Input
              id="calc-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nombre@tuempresa.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "calc-email-error" : undefined}
              {...register("email")}
            />
          </Field>
          <Field label="Teléfono" htmlFor="calc-phone" optional error={errors.phone?.message}>
            <Input
              id="calc-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "calc-phone-error" : undefined}
              {...register("phone")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Número de centros" htmlFor="calc-numberLocations" error={errors.numberLocations?.message}>
            <Controller
              control={control}
              name="numberLocations"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger id="calc-numberLocations" aria-invalid={Boolean(errors.numberLocations)}>
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
          <Field label="Facturación anual" htmlFor="calc-companyRevenue" error={errors.companyRevenue?.message}>
            <Controller
              control={control}
              name="companyRevenue"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger id="calc-companyRevenue" aria-invalid={Boolean(errors.companyRevenue)}>
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
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Sector" htmlFor="calc-sector" error={errors.sector?.message}>
            <Controller
              control={control}
              name="sector"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger id="calc-sector" aria-invalid={Boolean(errors.sector)}>
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
          <Field label="Prioridad principal" htmlFor="calc-mainProblem" error={errors.mainProblem?.message}>
            <Controller
              control={control}
              name="mainProblem"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger id="calc-mainProblem" aria-invalid={Boolean(errors.mainProblem)}>
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAIN_PROBLEMS.map((item) => (
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

        <Field label="¿Qué quieres analizar?" htmlFor="calc-message" error={errors.message?.message}>
          <Textarea
            id="calc-message"
            rows={3}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "calc-message-error" : undefined}
            {...register("message")}
          />
        </Field>

        <div className="space-y-2">
          <Controller
            control={control}
            name="gdprConsent"
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox
                  id="calc-gdprConsent"
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(errors.gdprConsent)}
                  aria-describedby={errors.gdprConsent ? "calc-gdprConsent-error" : undefined}
                  className="mt-0.5"
                />
                <Label htmlFor="calc-gdprConsent" className="items-start text-sm leading-snug font-normal text-gray-700">
                  <span>
                    He leído y acepto la{" "}
                    <Link href="/politica-privacidad" className="underline underline-offset-4 hover:text-navy-900" target="_blank">
                      política de privacidad
                    </Link>
                    . Mis datos se usarán únicamente para responder a esta solicitud.
                  </span>
                </Label>
              </div>
            )}
          />
          {errors.gdprConsent?.message ? (
            <p id="calc-gdprConsent-error" role="alert" className="text-sm text-destructive">
              {errors.gdprConsent.message}
            </p>
          ) : null}
        </div>

        {state.status === "error" ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>No se ha podido enviar</AlertTitle>
            <AlertDescription>
              <p>{state.message}</p>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="xl" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? <Loader2Icon className="animate-spin" /> : null}
            Analizar oportunidades
            {!isSubmitting ? <ArrowRightIcon /> : null}
          </Button>
          <p className="text-sm text-gray-500">Sin compromiso. Respuesta personal, no automatizada.</p>
        </div>
      </form>
    </div>
  );
}
