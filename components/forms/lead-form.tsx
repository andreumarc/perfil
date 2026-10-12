"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CheckCircle2Icon, CircleAlertIcon, LoaderCircleIcon, MessageCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { submitLead, type SubmitLeadState } from "@/actions/submit-lead";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAttribution } from "@/lib/analytics/attribution";
import { track } from "@/lib/analytics/track";
import { getVisitorId } from "@/lib/analytics/visitor";
import { leadFormSchema, type FormVariantValue, type LeadFormInput, type LeadFormValues } from "@/lib/validation/lead";
import { BUDGET_RANGES, PROPERTY_TYPES, TIMELINES, type LeadSource } from "@/types/lead";

import { Field, describedBy } from "./field";
import { useLeadExtra } from "./lead-extra-context";
import { Turnstile } from "./turnstile";

export interface ServiceOption {
  slug: string;
  name: string;
  groupSlug: string;
  groupName: string;
}
export interface SectorOption {
  slug: string;
  name: string;
}

export interface LeadFormProps {
  variant?: FormVariantValue;
  source: LeadSource;
  /** `compact` = formulario corto (home, laterales). */
  layout?: "full" | "compact";
  services: ServiceOption[];
  sectors: SectorOption[];
  defaultServiceSlug?: string;
  defaultSectorSlug?: string;
  articleSlug?: string;
  /** Para el texto de contacto alternativo tras un error del servidor. */
  whatsappHref?: string | null;
  turnstileSiteKey?: string;
  submitLabel?: string;
  /** Texto introductorio sobre el formulario. */
  intro?: string;
  className?: string;
}

const PREMISES_STATES = [
  { value: "bruto", label: "En bruto / sin acondicionar" },
  { value: "reformar", label: "Acondicionado pero hay que reformar" },
  { value: "buen_estado", label: "En buen estado, cambios puntuales" },
] as const;

const INSTALLATION_OPTIONS = ["Electricidad", "Fontanería", "Climatización", "Ventilación", "Aerotermia", "Iluminación", "Telecomunicaciones", "PCI"] as const;

function groupedServices(services: ServiceOption[]) {
  const groups = new Map<string, { name: string; items: ServiceOption[] }>();
  for (const s of services) {
    const g = groups.get(s.groupSlug) ?? { name: s.groupName, items: [] };
    g.items.push(s);
    groups.set(s.groupSlug, g);
  }
  return [...groups.values()];
}

export function LeadForm({
  variant = "general",
  source,
  layout = "full",
  services,
  sectors,
  defaultServiceSlug = "",
  defaultSectorSlug = "",
  articleSlug,
  whatsappHref,
  turnstileSiteKey,
  submitLabel = "Pedir presupuesto sin compromiso",
  intro,
  className,
}: LeadFormProps) {
  const compact = layout === "compact";
  const extra = useLeadExtra();
  const isBusiness = variant === "local" || variant === "gimnasio" || variant === "restaurante" || variant === "clinica";

  const form = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      locality: "",
      postalCode: "",
      propertyType: isBusiness ? "local" : "",
      serviceSlug: defaultServiceSlug,
      sectorSlug: defaultSectorSlug,
      squareMeters: "",
      budgetRange: "",
      timeline: "",
      message: "",
      privacyConsent: undefined as unknown as true,
      marketingConsent: false,
    },
  });

  // Campos contextuales fuera de RHF (opcionales, saneados en servidor).
  const [activity, setActivity] = React.useState("");
  const [premisesState, setPremisesState] = React.useState<string>("");
  const [installations, setInstallations] = React.useState<string[]>([]);
  const [kitchenType, setKitchenType] = React.useState("");
  const [extraction, setExtraction] = React.useState<string>("");
  const [systemType, setSystemType] = React.useState("");
  const [interventionType, setInterventionType] = React.useState("");

  const [website, setWebsite] = React.useState(""); // honeypot
  // Marca de tiempo de inicio: no se renderiza, así que el valor del cliente no provoca desajustes de hidratación.
  const [startedAt] = React.useState(() => Date.now());
  const [turnstileToken, setTurnstileToken] = React.useState("");
  const [state, setState] = React.useState<SubmitLeadState>({ status: "idle" });
  const [pending, startTransition] = React.useTransition();
  const startedTracked = React.useRef(false);

  const onFirstInteraction = () => {
    if (startedTracked.current) return;
    startedTracked.current = true;
    track("quote_form_started", { source, variant, articleSlug: articleSlug ?? null, calculator: extra?.context?.calculator ?? null });
  };

  const { register, handleSubmit, control, setError, formState } = form;
  const errors = formState.errors;

  const onSubmit = handleSubmit((values) => {
    setState({ status: "idle" });
    startTransition(async () => {
      const result = await submitLead({
        lead: { ...values, squareMeters: values.squareMeters || extra?.squareMeters || values.squareMeters },
        context: {
          activity: activity || undefined,
          premisesState: premisesState || undefined,
          installations: installations.length ? installations : undefined,
          kitchenType: kitchenType || undefined,
          extraction: extraction || undefined,
          systemType: systemType || undefined,
          interventionType: interventionType || undefined,
          ...(extra?.context ?? {}),
        },
        attribution: getAttribution(),
        antiSpam: { website, startedAt, turnstileToken: turnstileToken || undefined },
        visitorId: getVisitorId(),
        source,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : undefined,
        formVariant: variant,
        articleSlug,
        attachmentCount: 0,
      });
      if (result.status === "error" && result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          const field = key.replace(/^lead\./, "") as keyof LeadFormInput;
          if (field in values) setError(field, { type: "server", message });
        }
      }
      if (result.status === "success") {
        track("lead_created", { source, variant, leadId: result.leadId ?? undefined, articleSlug: articleSlug ?? null, calculator: extra?.context?.calculator ?? null }, { persist: false });
      }
      setState(result);
    });
  });

  if (state.status === "success") {
    return (
      <div className={className} role="status" aria-live="polite">
        <div className="rounded-lg border border-olive-100 bg-white p-6 md:p-8">
          <CheckCircle2Icon className="size-10 text-olive-500" aria-hidden />
          <h3 className="font-display mt-4 text-2xl text-ink-900">Solicitud recibida</h3>
          <p className="mt-3 text-gray-600">
            Gracias. Revisaremos tu solicitud y te contactaremos para concretar detalles y, si procede, concertar una
            visita. Si nos has dejado tu email, te hemos enviado una confirmación.
          </p>
          <ol className="mt-5 space-y-2 text-sm text-gray-700">
            <li className="flex gap-3"><span className="tabular font-semibold text-copper-600">1.</span> Te llamamos o escribimos para entender el proyecto.</li>
            <li className="flex gap-3"><span className="tabular font-semibold text-copper-600">2.</span> Visitamos el espacio y tomamos medidas.</li>
            <li className="flex gap-3"><span className="tabular font-semibold text-copper-600">3.</span> Preparamos un presupuesto detallado por partidas.</li>
          </ol>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {whatsappHref ? (
              <Button asChild variant="outline" size="lg">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_clicked", { location: "form_success" })}>
                  <MessageCircleIcon aria-hidden />
                  Hablar por WhatsApp
                </a>
              </Button>
            ) : null}
            <Button asChild variant="ghost" size="lg">
              <Link href="/proyectos">Ver proyectos</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const serviceGroups = groupedServices(services);

  return (
    <form onSubmit={onSubmit} noValidate className={className} onFocusCapture={onFirstInteraction}>
      {intro ? <p className="mb-5 text-sm text-gray-600">{intro}</p> : null}

      {state.status === "error" ? (
        <Alert variant="destructive" className="mb-5">
          <CircleAlertIcon />
          <AlertTitle>No se ha podido enviar la solicitud</AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className={compact ? "grid gap-4" : "grid gap-5 sm:grid-cols-2"}>
        <Field id="lf-name" label="Nombre y apellidos" error={errors.name?.message}>
          <Input id="lf-name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("lf-name", errors.name?.message)} {...register("name")} />
        </Field>
        <Field id="lf-phone" label="Teléfono" error={errors.phone?.message} hint={compact ? undefined : "Te llamamos en horario comercial."}>
          <Input id="lf-phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("lf-phone", errors.phone?.message, compact ? undefined : "Te llamamos en horario comercial.")} {...register("phone")} />
        </Field>
        <Field id="lf-email" label="Email" error={errors.email?.message} className={compact ? undefined : "sm:col-span-2"}>
          <Input id="lf-email" type="email" inputMode="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("lf-email", errors.email?.message)} {...register("email")} />
        </Field>

        {!compact ? (
          <>
            <Field id="lf-locality" label="Localidad" error={errors.locality?.message}>
              <Input id="lf-locality" autoComplete="address-level2" placeholder="Barcelona, Igualada…" {...register("locality")} />
            </Field>
            <Field id="lf-postal" label="Código postal" optional error={errors.postalCode?.message}>
              <Input id="lf-postal" inputMode="numeric" autoComplete="postal-code" maxLength={5} aria-invalid={Boolean(errors.postalCode)} aria-describedby={describedBy("lf-postal", errors.postalCode?.message)} {...register("postalCode")} />
            </Field>
            <Field id="lf-property" label="Tipo de inmueble" error={errors.propertyType?.message}>
              <Controller
                control={control}
                name="propertyType"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger id="lf-property" className="w-full" aria-invalid={Boolean(errors.propertyType)}>
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </>
        ) : null}

        <Field id="lf-service" label={compact ? "¿Qué necesitas?" : "Tipo de reforma o instalación"} error={errors.serviceSlug?.message} className={compact ? undefined : undefined}>
          <Controller
            control={control}
            name="serviceSlug"
            render={({ field }) => (
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <SelectTrigger id="lf-service" className="w-full" aria-invalid={Boolean(errors.serviceSlug)}>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {serviceGroups.map((g) => (
                    <SelectGroup key={g.name}>
                      <SelectLabel>{g.name}</SelectLabel>
                      {g.items.map((s) => (
                        <SelectItem key={s.slug} value={s.slug}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        {!compact && isBusiness ? (
          <Field id="lf-sector" label="Tipo de negocio" error={errors.sectorSlug?.message}>
            <Controller
              control={control}
              name="sectorSlug"
              render={({ field }) => (
                <Select value={field.value ?? ""} onValueChange={field.onChange}>
                  <SelectTrigger id="lf-sector" className="w-full">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((s) => (
                      <SelectItem key={s.slug} value={s.slug}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        ) : null}

        {/* Campos contextuales por variante */}
        {!compact && variant === "vivienda" ? (
          <Field id="lf-intervention" label="Tipo de intervención" optional>
            <Select value={interventionType} onValueChange={setInterventionType}>
              <SelectTrigger id="lf-intervention" className="w-full"><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {["Reforma integral", "Cocina", "Baño", "Varias estancias", "Instalaciones", "Fachada o cubierta"].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {!compact && (variant === "local" || variant === "clinica") ? (
          <Field id="lf-activity" label="Actividad del negocio" optional>
            <Input id="lf-activity" value={activity} onChange={(e) => setActivity(e.target.value)} maxLength={120} placeholder="Tienda de ropa, clínica dental, academia…" />
          </Field>
        ) : null}
        {!compact && (variant === "local" || variant === "gimnasio" || variant === "clinica") ? (
          <Field id="lf-premises" label="Estado actual del local" optional>
            <Select value={premisesState} onValueChange={setPremisesState}>
              <SelectTrigger id="lf-premises" className="w-full"><SelectValue placeholder="Selecciona" /></SelectTrigger>
              <SelectContent>
                {PREMISES_STATES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {!compact && variant === "restaurante" ? (
          <>
            <Field id="lf-kitchen" label="Tipo de cocina" optional>
              <Input id="lf-kitchen" value={kitchenType} onChange={(e) => setKitchenType(e.target.value)} maxLength={60} placeholder="Cocina de gas, eléctrica, obrador…" />
            </Field>
            <Field id="lf-extraction" label="¿Necesitas extracción de humos?" optional>
              <Select value={extraction} onValueChange={setExtraction}>
                <SelectTrigger id="lf-extraction" className="w-full"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="no_se">No lo sé</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        ) : null}
        {!compact && variant === "instalaciones" ? (
          <Field id="lf-system" label="Tipo de sistema o instalación" optional>
            <Input id="lf-system" value={systemType} onChange={(e) => setSystemType(e.target.value)} maxLength={80} placeholder="Aerotermia, conductos, cuadro eléctrico…" />
          </Field>
        ) : null}
        {!compact && (variant === "gimnasio" || variant === "local" || variant === "restaurante" || variant === "clinica") ? (
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium text-ink-900">
              Instalaciones que necesitas <span className="font-normal text-gray-500">(opcional)</span>
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {INSTALLATION_OPTIONS.map((opt) => {
                const checked = installations.includes(opt);
                return (
                  <label key={opt} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${checked ? "border-copper-500 bg-copper-50 text-copper-700" : "border-gray-300 text-gray-700"}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={(e) => setInstallations((prev) => (e.target.checked ? [...prev, opt] : prev.filter((i) => i !== opt)))}
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {!compact ? (
          <>
            <Field id="lf-m2" label="Metros cuadrados aproximados" optional error={errors.squareMeters?.message}>
              <Input id="lf-m2" type="number" inputMode="numeric" min={1} max={100000} aria-invalid={Boolean(errors.squareMeters)} aria-describedby={describedBy("lf-m2", errors.squareMeters?.message)} {...register("squareMeters")} />
            </Field>
            <Field id="lf-budget" label="Presupuesto orientativo" optional>
              <Controller
                control={control}
                name="budgetRange"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger id="lf-budget" className="w-full"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>
                      {BUDGET_RANGES.map((b) => (
                        <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
            <Field id="lf-timeline" label="¿Cuándo quieres empezar?" optional>
              <Controller
                control={control}
                name="timeline"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger id="lf-timeline" className="w-full"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                    <SelectContent>
                      {TIMELINES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </>
        ) : null}

        <Field id="lf-message" label={compact ? "Cuéntanos brevemente tu proyecto" : "Descripción del proyecto"} optional error={errors.message?.message} className={compact ? undefined : "sm:col-span-2"}>
          <Textarea id="lf-message" rows={compact ? 3 : 5} maxLength={3000} placeholder="Qué quieres reformar, estado actual, plazos…" {...register("message")} />
        </Field>

        {/* Honeypot: invisible para personas, los bots lo rellenan. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
          <label htmlFor="lf-website">No rellenes este campo</label>
          <input id="lf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <div className={compact ? "space-y-3" : "space-y-3 sm:col-span-2"}>
          <Controller
            control={control}
            name="privacyConsent"
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox id="lf-privacy" checked={field.value === true} onCheckedChange={(v) => field.onChange(v === true)} aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={errors.privacyConsent ? "lf-privacy-error" : undefined} className="mt-0.5" />
                <div>
                  <label htmlFor="lf-privacy" className="text-sm text-gray-700">
                    He leído y acepto la{" "}
                    <Link href="/politica-privacidad" className="underline underline-offset-4 hover:text-ink-900" target="_blank">
                      política de privacidad
                    </Link>{" "}
                    para que se gestione mi solicitud de presupuesto.
                  </label>
                  {errors.privacyConsent ? (
                    <p id="lf-privacy-error" role="alert" className="mt-1 text-xs font-medium text-destructive">
                      {errors.privacyConsent.message}
                    </p>
                  ) : null}
                </div>
              </div>
            )}
          />
          <Controller
            control={control}
            name="marketingConsent"
            render={({ field }) => (
              <div className="flex items-start gap-3">
                <Checkbox id="lf-marketing" checked={field.value === true} onCheckedChange={(v) => field.onChange(v === true)} className="mt-0.5" />
                <label htmlFor="lf-marketing" className="text-sm text-gray-600">
                  Quiero recibir ocasionalmente consejos y novedades sobre reformas por email (opcional).
                </label>
              </div>
            )}
          />
        </div>

        {turnstileSiteKey ? (
          <div className={compact ? undefined : "sm:col-span-2"}>
            <Turnstile siteKey={turnstileSiteKey} onToken={setTurnstileToken} />
          </div>
        ) : null}

        <div className={compact ? undefined : "sm:col-span-2"}>
          <Button type="submit" size="xl" className="w-full" disabled={pending} aria-busy={pending}>
            {pending ? <LoaderCircleIcon className="animate-spin" aria-hidden /> : null}
            {pending ? "Enviando…" : submitLabel}
            {!pending ? <ArrowRightIcon aria-hidden /> : null}
          </Button>
          <p className="mt-3 text-xs text-gray-500">Sin compromiso. Solo usamos tus datos para preparar el presupuesto.</p>
        </div>
      </div>
    </form>
  );
}
