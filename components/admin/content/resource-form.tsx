"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLinkIcon, Loader2Icon, PlusIcon, SaveIcon, Trash2Icon, XIcon } from "lucide-react";

import { deleteResourceAction, saveResourceAction } from "@/actions/admin-content";
import { MarkdownField } from "@/components/admin/content/markdown-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FieldDef, ResourceMeta } from "@/lib/admin/resource-meta";
import { cn, slugify } from "@/lib/utils";

export type Option = { value: string; label: string };
export type OptionSets = Record<string, Option[]>;

const NONE = "__none__";

interface Props {
  meta: ResourceMeta;
  id: string | null;
  initial: Record<string, unknown>;
  optionSets: OptionSets;
  mediaOptions: Option[];
  backHref: string;
  publicUrl?: string;
}

function str(v: unknown): string {
  return v === null || v === undefined ? "" : String(v);
}
function arr<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/** Formulario genérico de contenido: renderiza los campos declarados en resource-meta. */
export function ResourceForm({ meta, id, initial, optionSets, mediaOptions, backHref, publicUrl }: Props) {
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, unknown>>(initial);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [message, setMessage] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [pending, startTransition] = React.useTransition();
  const slugTouched = React.useRef(Boolean(id));

  const set = (name: string, value: unknown) => setValues((prev) => ({ ...prev, [name]: value }));

  const onTitleChange = (field: FieldDef, value: string) => {
    set(field.name, value);
    if (!slugTouched.current && meta.slugField && field.name === meta.titleField) set(meta.slugField, slugify(value));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});
    startTransition(async () => {
      const res = await saveResourceAction({ key: meta.key, id, values });
      if (res.ok) {
        setMessage({ ok: true, text: "Guardado. La web pública se actualiza en unos segundos." });
        if (!id) router.replace(`/admin/${meta.path}/${res.id}`);
        else router.refresh();
      } else {
        setMessage({ ok: false, text: res.message });
        if (res.fieldErrors) setErrors(res.fieldErrors);
      }
    });
  };

  const remove = () => {
    if (!id) return;
    startTransition(async () => {
      const res = await deleteResourceAction({ key: meta.key, id });
      if (res.ok) router.push(backHref);
      else setMessage({ ok: false, text: res.message });
    });
  };

  const sections = Array.from(new Set(meta.fields.map((f) => f.section)));

  return (
    <form onSubmit={submit} className="space-y-8">
      {message ? (
        <Alert variant={message.ok ? "default" : "destructive"}>
          <AlertTitle>{message.ok ? "Correcto" : "No se ha guardado"}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      ) : null}

      {sections.map((section) => (
        <section key={section} className="rounded-lg border border-gray-200 bg-white p-5 md:p-6">
          <h2 className="text-base font-semibold text-ink-900">{section}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {meta.fields
              .filter((f) => f.section === section)
              .map((field) => (
                <div key={field.name} className={cn(field.width === "half" ? "" : "md:col-span-2")}>
                  <FieldControl
                    field={field}
                    value={values[field.name]}
                    error={errors[field.name]}
                    optionSets={optionSets}
                    mediaOptions={mediaOptions}
                    onChange={(v) => {
                      if (field.kind === "slug") slugTouched.current = true;
                      if (field.name === meta.titleField && typeof v === "string") onTitleChange(field, v);
                      else set(field.name, v);
                    }}
                  />
                </div>
              ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 z-10 -mx-5 flex flex-wrap items-center gap-3 border-t border-gray-200 bg-white/95 px-5 py-3 backdrop-blur md:-mx-8 md:px-8">
        <Button type="submit" variant="dark" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" aria-hidden /> : <SaveIcon aria-hidden />}
          {id ? "Guardar cambios" : `Crear ${meta.singular.toLowerCase()}`}
        </Button>
        <Button asChild type="button" variant="ghost">
          <Link href={backHref}>Volver al listado</Link>
        </Button>
        {publicUrl ? (
          <Button asChild type="button" variant="link">
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              Ver en el sitio <ExternalLinkIcon aria-hidden />
            </a>
          </Button>
        ) : null}
        {id ? (
          <div className="ml-auto flex items-center gap-2">
            {confirmDelete ? (
              <>
                <span className="text-sm text-gray-600">¿Eliminar definitivamente?</span>
                <Button type="button" variant="destructive" size="sm" onClick={remove} disabled={pending}>
                  Sí, eliminar
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2Icon aria-hidden />
                Eliminar
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </form>
  );
}

function FieldControl({
  field,
  value,
  error,
  optionSets,
  mediaOptions,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  error?: string;
  optionSets: OptionSets;
  mediaOptions: Option[];
  onChange: (v: unknown) => void;
}) {
  const id = `rf-${field.name}`;
  const label = (
    <Label htmlFor={id} className="text-sm font-medium text-ink-900">
      {field.label}
    </Label>
  );
  const help = (
    <>
      {field.hint && !error ? <p className="text-xs text-gray-500">{field.hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </>
  );

  switch (field.kind) {
    case "boolean":
      return (
        <div className="flex items-start gap-3 rounded-md border border-gray-200 p-3">
          <Checkbox id={id} checked={value === true} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
          <div>
            <label htmlFor={id} className="cursor-pointer text-sm text-ink-900">
              {field.label}
            </label>
            {help}
          </div>
        </div>
      );
    case "textarea":
      return (
        <div className="space-y-1.5">
          {label}
          <Textarea id={id} value={str(value)} onChange={(e) => onChange(e.target.value)} rows={4} aria-invalid={Boolean(error)} />
          {help}
        </div>
      );
    case "markdown":
      return (
        <div className="space-y-1.5">
          {label}
          <MarkdownField id={id} value={str(value)} onChange={onChange} />
          {help}
        </div>
      );
    case "number":
      return (
        <div className="space-y-1.5">
          {label}
          <Input id={id} type="number" inputMode="numeric" value={str(value)} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} aria-invalid={Boolean(error)} />
          {help}
        </div>
      );
    case "date":
    case "datetime":
      return (
        <div className="space-y-1.5">
          {label}
          <Input id={id} type={field.kind === "date" ? "date" : "datetime-local"} value={str(value)} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} />
          {help}
        </div>
      );
    case "select": {
      const options = typeof field.options === "string" ? (optionSets[field.options] ?? []) : (field.options ?? []);
      const current = str(value);
      return (
        <div className="space-y-1.5">
          {label}
          <Select value={current === "" ? NONE : current} onValueChange={(v) => onChange(v === NONE ? "" : v)}>
            <SelectTrigger id={id} className="w-full" aria-invalid={Boolean(error)}>
              <SelectValue placeholder="Selecciona" />
            </SelectTrigger>
            <SelectContent>
              {field.optional ? <SelectItem value={NONE}>Sin valor</SelectItem> : null}
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {help}
        </div>
      );
    }
    case "list":
      return (
        <div className="space-y-1.5">
          {label}
          <Textarea
            id={id}
            value={arr<string>(value).join("\n")}
            onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            rows={5}
            aria-invalid={Boolean(error)}
          />
          {help}
        </div>
      );
    case "steps":
      return (
        <RepeaterField
          label={field.label}
          hint={field.hint}
          error={error}
          items={arr<{ title: string; description: string }>(value)}
          empty={{ title: "", description: "" }}
          onChange={onChange}
          render={(item, update) => (
            <>
              <Input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} placeholder="Título del paso" aria-label="Título del paso" />
              <Textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} placeholder="Descripción" rows={2} aria-label="Descripción del paso" />
            </>
          )}
        />
      );
    case "faqs":
      return (
        <RepeaterField
          label={field.label}
          hint={field.hint}
          error={error}
          items={arr<{ question: string; answer: string }>(value)}
          empty={{ question: "", answer: "" }}
          onChange={onChange}
          render={(item, update) => (
            <>
              <Input value={item.question} onChange={(e) => update({ ...item, question: e.target.value })} placeholder="Pregunta" aria-label="Pregunta" />
              <Textarea value={item.answer} onChange={(e) => update({ ...item, answer: e.target.value })} placeholder="Respuesta (2-4 frases)" rows={3} aria-label="Respuesta" />
            </>
          )}
        />
      );
    case "sources":
      return (
        <RepeaterField
          label={field.label}
          hint={field.hint}
          error={error}
          items={arr<{ title: string; url: string }>(value)}
          empty={{ title: "", url: "" }}
          onChange={onChange}
          render={(item, update) => (
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} placeholder="Título de la fuente" aria-label="Título de la fuente" />
              <Input value={item.url} onChange={(e) => update({ ...item, url: e.target.value })} placeholder="https://…" inputMode="url" aria-label="URL de la fuente" />
            </div>
          )}
        />
      );
    case "image": {
      const current = str(value);
      return (
        <div className="space-y-1.5">
          {label}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input id={id} value={current} onChange={(e) => onChange(e.target.value)} placeholder="/images/… o URL" className="flex-1" aria-invalid={Boolean(error)} />
            {mediaOptions.length ? (
              <Select value={mediaOptions.some((m) => m.value === current) ? current : NONE} onValueChange={(v) => onChange(v === NONE ? "" : v)}>
                <SelectTrigger className="sm:w-64" aria-label="Elegir de la biblioteca de medios">
                  <SelectValue placeholder="Biblioteca de medios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Sin imagen</SelectItem>
                  {mediaOptions.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current} alt="" className="mt-2 h-28 w-auto rounded-md border border-gray-200 object-cover" />
          ) : null}
          {help}
        </div>
      );
    }
    default:
      return (
        <div className="space-y-1.5">
          {label}
          <Input id={id} value={str(value)} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} aria-invalid={Boolean(error)} className={field.kind === "slug" ? "font-mono text-[13px]" : undefined} />
          {help}
        </div>
      );
  }
}

function RepeaterField<T extends object>({
  label,
  hint,
  error,
  items,
  empty,
  onChange,
  render,
}: {
  label: string;
  hint?: string;
  error?: string;
  items: T[];
  empty: T;
  onChange: (v: T[]) => void;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-ink-900">{label}</legend>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 rounded-md border border-gray-200 p-3">
          <div className="flex-1 space-y-2">{render(item, (next) => onChange(items.map((x, j) => (j === i ? next : x))))}</div>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Eliminar elemento" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <XIcon aria-hidden />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, empty])}>
        <PlusIcon aria-hidden />
        Añadir
      </Button>
      {hint && !error ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
