"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  CalendarCheckIcon,
  CheckCircle2Icon,
  Loader2Icon,
  TargetIcon,
} from "lucide-react";

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
import { meetingHref, meetingIsExternal } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues,
} from "@/lib/validation/lead";
import { COMPANY_REVENUE, JOB_TITLES, MAIN_PROBLEMS, NUMBER_LOCATIONS, SECTORS } from "@/types/lead";

import { resolveInterest } from "./interest";

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

/** Prefijo de los ids del DOM para no colisionar con otros formularios. */
const ID = "contact";

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

/**
 * Formulario de contacto directo. Lee `?interes=` para mostrar el servicio de
 * interés y preseleccionar la prioridad (y el sector en Private Equity).
 * Debe renderizarse dentro de <Suspense> porque usa `useSearchParams`.
 */
export function ContactForm({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const interest = React.useMemo(() => resolveInterest(searchParams.get("interes")), [searchParams]);

  const [state, setState] = React.useState<SubmitContactState>({ status: "idle" });
  const [website, setWebsite] = React.useState("");
  /** Marca de tiempo de renderizado (anti-spam): se fija en un efecto, nunca durante el render. */
  const startedAt = React.useRef<number | undefined>(undefined);
  const successHeadingRef = React.useRef<HTMLHeadingElement>(null);

  const form = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      message: "",
      mainProblem: interest?.mainProblem,
      sector: interest?.sector,
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
  }, []);

  React.useEffect(() => {
    if (state.status !== "success") return;
    const heading = successHeadingRef.current;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state.status]);

  const onSubmit = async (values: ContactFormValues) => {
    const response = await submitContact({
      contact: values,
      attribution: getAttribution(),
      antiSpam: { website, startedAt: startedAt.current },
      visitorId: getVisitorId(),
      source: "contact",
      context: interest ? { interes: interest.slug } : undefined,
    });

    if (response.status === "error") {
      for (const [path, message] of Object.entries(response.fieldErrors ?? {})) {
        const name = path.replace(/^contact\./, "");
        if (isFieldName(name)) setError(name, { type: "server", message });
      }
    } else if (response.status === "success") {
      track("lead_created", { source: "contact", leadId: response.leadId ?? undefined }, { persist: false });
    }
    setState(response);
  };

  if (state.status === "success") {
    return (
      <div className={cn("py-4 md:py-8", className)}>
        <div className="mx-auto max-w-xl text-center">
          <CheckCircle2Icon className="mx-auto size-10 text-signal" aria-hidden />
          <h2
            ref={successHeadingRef}
            tabIndex={-1}
            className="font-display mt-5 text-3xl text-navy-900 outline-none md:text-4xl"
          >
            Mensaje recibido.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Te respondo en menos de 48 h con una primera lectura de tu situación.
          </p>

          {meetingIsExternal ? (
            <Button asChild size="xl" className="mt-8 w-full sm:w-auto">
              <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location: "contact_success" }}>
                <CalendarCheckIcon />
                Reservar ya una sesión de 30 min
              </TrackedLink>
            </Button>
          ) : (
            <p className="mt-8 rounded-md border border-navy-100 bg-navy-50 px-5 py-4 text-sm leading-relaxed text-navy-900">
              Si quieres adelantar la conversación, te propongo dos franjas horarias en mi respuesta.
            </p>
          )}

          <p className="mt-6 text-sm text-gray-600">
            <TrackedLink
              href="/diagnostico"
              event="cta_clicked"
              props={{ location: "contact_success" }}
              className="inline-flex min-h-11 items-center gap-1.5 font-medium text-navy-900 underline-offset-4 hover:underline"
            >
              Mientras tanto, haz el diagnóstico gratuito de 3 minutos
              <ArrowRightIcon className="size-4" aria-hidden />
            </TrackedLink>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="max-w-xl">
        {interest ? (
          <p className="flex items-center gap-2 text-sm font-medium text-navy-900">
            <TargetIcon className="size-4 text-signal" aria-hidden />
            <span>
              <span className="text-gray-500">Interés:</span> {interest.label}
            </span>
          </p>
        ) : null}
        <h2 className={cn("font-display text-2xl text-navy-900 md:text-3xl", interest && "mt-3")}>
          Escríbeme
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Dos líneas bastan. Lo que tarde en leerlo es lo que tardarás en tener una primera respuesta.
        </p>
      </div>

      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate className="mt-8 space-y-6">
        {/* Honeypot: fuera de pantalla, nunca visible ni enfocable. */}
        <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor={`${ID}-website`}>Sitio web</label>
          <input
            id={`${ID}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" htmlFor={`${ID}-firstName`} error={errors.firstName?.message}>
            <Input
              id={`${ID}-firstName`}
              autoComplete="given-name"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? `${ID}-firstName-error` : undefined}
              {...register("firstName")}
            />
          </Field>
          <Field label="Apellidos" htmlFor={`${ID}-lastName`} error={errors.lastName?.message}>
            <Input
              id={`${ID}-lastName`}
              autoComplete="family-name"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? `${ID}-lastName-error` : undefined}
              {...register("lastName")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Empresa o grupo" htmlFor={`${ID}-company`} error={errors.company?.message}>
            <Input
              id={`${ID}-company`}
              autoComplete="organization"
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? `${ID}-company-error` : undefined}
              {...register("company")}
            />
          </Field>
          <Field label="Cargo" htmlFor={`${ID}-jobTitle`} error={errors.jobTitle?.message}>
            <Controller
              control={control}
              name="jobTitle"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger
                    id={`${ID}-jobTitle`}
                    aria-invalid={Boolean(errors.jobTitle)}
                    aria-describedby={errors.jobTitle ? `${ID}-jobTitle-error` : undefined}
                    onBlur={field.onBlur}
                  >
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
          <Field label="Email corporativo" htmlFor={`${ID}-email`} error={errors.email?.message}>
            <Input
              id={`${ID}-email`}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="nombre@tuempresa.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${ID}-email-error` : undefined}
              {...register("email")}
            />
          </Field>
          <Field label="Teléfono" htmlFor={`${ID}-phone`} optional error={errors.phone?.message}>
            <Input
              id={`${ID}-phone`}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${ID}-phone-error` : undefined}
              {...register("phone")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Número de centros"
            htmlFor={`${ID}-numberLocations`}
            error={errors.numberLocations?.message}
          >
            <Controller
              control={control}
              name="numberLocations"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger
                    id={`${ID}-numberLocations`}
                    aria-invalid={Boolean(errors.numberLocations)}
                    aria-describedby={errors.numberLocations ? `${ID}-numberLocations-error` : undefined}
                    onBlur={field.onBlur}
                  >
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
          <Field
            label="Facturación anual"
            htmlFor={`${ID}-companyRevenue`}
            optional
            error={errors.companyRevenue?.message}
          >
            <Controller
              control={control}
              name="companyRevenue"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger
                    id={`${ID}-companyRevenue`}
                    aria-invalid={Boolean(errors.companyRevenue)}
                    aria-describedby={errors.companyRevenue ? `${ID}-companyRevenue-error` : undefined}
                    onBlur={field.onBlur}
                  >
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
          <Field label="Sector" htmlFor={`${ID}-sector`} optional error={errors.sector?.message}>
            <Controller
              control={control}
              name="sector"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger
                    id={`${ID}-sector`}
                    aria-invalid={Boolean(errors.sector)}
                    aria-describedby={errors.sector ? `${ID}-sector-error` : undefined}
                    onBlur={field.onBlur}
                  >
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
          <Field label="Prioridad principal" htmlFor={`${ID}-mainProblem`} error={errors.mainProblem?.message}>
            <Controller
              control={control}
              name="mainProblem"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange} name={field.name}>
                  <SelectTrigger
                    id={`${ID}-mainProblem`}
                    aria-invalid={Boolean(errors.mainProblem)}
                    aria-describedby={errors.mainProblem ? `${ID}-mainProblem-error` : undefined}
                    onBlur={field.onBlur}
                  >
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

        <Field label="Mensaje" htmlFor={`${ID}-message`} error={errors.message?.message}>
          <Textarea
            id={`${ID}-message`}
            rows={5}
            placeholder="Número de centros, sector y qué decisión tienes pendiente. Dos líneas bastan."
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${ID}-message-error` : undefined}
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
                  id={`${ID}-gdprConsent`}
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  onBlur={field.onBlur}
                  aria-invalid={Boolean(errors.gdprConsent)}
                  aria-describedby={errors.gdprConsent ? `${ID}-gdprConsent-error` : undefined}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={`${ID}-gdprConsent`}
                  className="items-start text-sm leading-snug font-normal text-gray-700"
                >
                  <span>
                    He leído y acepto la{" "}
                    <Link
                      href="/politica-privacidad"
                      className="underline underline-offset-4 hover:text-navy-900"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      política de privacidad
                    </Link>
                    . Usaré tus datos únicamente para responder a esta solicitud y, si lo autorizas, para un
                    seguimiento comercial B2B.
                  </span>
                </Label>
              </div>
            )}
          />
          {errors.gdprConsent?.message ? (
            <p id={`${ID}-gdprConsent-error`} role="alert" className="text-sm text-destructive">
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
            {isSubmitting ? (
              <>
                <Loader2Icon className="animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                Descubrir oportunidades
                <ArrowRightIcon />
              </>
            )}
          </Button>
          <p className="text-sm text-gray-500">Respuesta personal en menos de 48 h. Sin secuencias automáticas.</p>
        </div>
      </form>
    </div>
  );
}
