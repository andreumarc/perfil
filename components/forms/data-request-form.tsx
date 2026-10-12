"use client";

import * as React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CheckCircle2Icon, CircleAlertIcon, LoaderCircleIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { submitDataRequest, type SubmitDataRequestState } from "@/actions/submit-data-request";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { dataRequestSchema, type DataRequestInput, type DataRequestValues } from "@/lib/validation/data-request";
import { DATA_REQUEST_TYPES, DATA_REQUEST_TYPE_LABELS } from "@/types/lead";

import { Field, describedBy } from "./field";

export function DataRequestForm() {
  const form = useForm<DataRequestInput, unknown, DataRequestValues>({
    resolver: zodResolver(dataRequestSchema),
    mode: "onTouched",
    defaultValues: { type: undefined, name: "", email: "", message: "", privacyConsent: undefined as unknown as true },
  });
  const [website, setWebsite] = React.useState("");
  const [startedAt] = React.useState(() => Date.now());
  const [state, setState] = React.useState<SubmitDataRequestState>({ status: "idle" });
  const [pending, startTransition] = React.useTransition();
  const { register, handleSubmit, control, setError, formState } = form;
  const errors = formState.errors;

  const onSubmit = handleSubmit((values) => {
    setState({ status: "idle" });
    startTransition(async () => {
      const result = await submitDataRequest({ request: values, antiSpam: { website, startedAt } });
      if (result.status === "error" && result.fieldErrors) {
        for (const [key, message] of Object.entries(result.fieldErrors)) {
          const field = key.replace(/^request\./, "") as keyof DataRequestInput;
          if (field in values) setError(field, { type: "server", message });
        }
      }
      setState(result);
    });
  });

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-olive-100 bg-white p-6 md:p-8" role="status" aria-live="polite">
        <CheckCircle2Icon className="size-10 text-olive-500" aria-hidden />
        <h2 className="font-display mt-4 text-2xl text-ink-900">Solicitud registrada</h2>
        <p className="mt-3 text-gray-600">
          Hemos recibido tu solicitud. Te responderemos en el plazo legal (un mes, ampliable en casos complejos) a la dirección de email indicada. Si necesitamos verificar tu identidad, te lo pediremos por ese mismo medio.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>No se ha podido enviar la solicitud</AlertTitle>
          <AlertDescription>
            <p>{state.message}</p>
          </AlertDescription>
        </Alert>
      ) : null}

      <Field id="dr-type" label="Tipo de solicitud" error={errors.type?.message}>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger id="dr-type" className="w-full" aria-invalid={Boolean(errors.type)}>
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {DATA_REQUEST_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {DATA_REQUEST_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      <Field id="dr-name" label="Nombre y apellidos" error={errors.name?.message}>
        <Input id="dr-name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("dr-name", errors.name?.message)} {...register("name")} />
      </Field>
      <Field id="dr-email" label="Email con el que nos contactaste" error={errors.email?.message} hint="Usaremos este email para verificar tu identidad y responderte.">
        <Input id="dr-email" type="email" inputMode="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("dr-email", errors.email?.message, "Usaremos este email para verificar tu identidad y responderte.")} {...register("email")} />
      </Field>
      <Field id="dr-message" label="Detalles de la solicitud" optional error={errors.message?.message}>
        <Textarea id="dr-message" rows={4} maxLength={2000} placeholder="Indica qué datos quieres consultar, corregir o eliminar." {...register("message")} />
      </Field>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="dr-website">No rellenes este campo</label>
        <input id="dr-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <Controller
        control={control}
        name="privacyConsent"
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox id="dr-privacy" checked={field.value === true} onCheckedChange={(v) => field.onChange(v === true)} aria-invalid={Boolean(errors.privacyConsent)} aria-describedby={errors.privacyConsent ? "dr-privacy-error" : undefined} className="mt-0.5" />
            <div>
              <label htmlFor="dr-privacy" className="text-sm text-gray-700">
                He leído la{" "}
                <Link href="/politica-privacidad" className="underline underline-offset-4 hover:text-ink-900" target="_blank">
                  política de privacidad
                </Link>{" "}
                y acepto que se traten mis datos para gestionar esta solicitud.
              </label>
              {errors.privacyConsent ? (
                <p id="dr-privacy-error" role="alert" className="mt-1 text-xs font-medium text-destructive">
                  {errors.privacyConsent.message}
                </p>
              ) : null}
            </div>
          </div>
        )}
      />

      <div>
        <Button type="submit" size="xl" className="w-full" disabled={pending} aria-busy={pending}>
          {pending ? <LoaderCircleIcon className="animate-spin" aria-hidden /> : null}
          {pending ? "Enviando…" : "Enviar solicitud"}
          {!pending ? <ArrowRightIcon aria-hidden /> : null}
        </Button>
      </div>
    </form>
  );
}
