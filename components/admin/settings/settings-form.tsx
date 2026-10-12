"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, PlusIcon, SaveIcon, XIcon } from "lucide-react";

import { saveSettingsAction } from "@/actions/admin-settings";
import { MarkdownField } from "@/components/admin/content/markdown-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CALCULATORS } from "@/lib/calculators/definitions";
import { COMMITMENT_ICONS, type SiteSettings } from "@/lib/validation/settings";

type Option = { value: string; label: string };

const ICON_LABELS: Record<string, string> = {
  advice: "Asesoramiento",
  management: "Gestión",
  deadline: "Plazos",
  quality: "Calidad",
  team: "Equipo",
  installations: "Instalaciones",
  shield: "Garantía",
  design: "Diseño",
};

/* ---------- controles básicos ---------- */

function Text({ id, label, value, onChange, hint, error, type = "text" }: { id: string; label: string; value: string; onChange: (v: string) => void; hint?: string; error?: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} />
      {hint && !error ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {error ? <p role="alert" className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

function Area({ id, label, value, onChange, hint, error, rows = 3 }: { id: string; label: string; value: string; onChange: (v: string) => void; hint?: string; error?: string; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={rows} aria-invalid={Boolean(error)} />
      {hint && !error ? <p className="text-xs text-gray-500">{hint}</p> : null}
      {error ? <p role="alert" className="text-xs font-medium text-destructive">{error}</p> : null}
    </div>
  );
}

function Lines({ id, label, value, onChange, hint, error }: { id: string; label: string; value: string[]; onChange: (v: string[]) => void; hint?: string; error?: string }) {
  return (
    <Area id={id} label={label} value={value.join("\n")} onChange={(v) => onChange(v.split("\n").map((s) => s.trim()).filter(Boolean))} hint={hint ?? "Una por línea."} error={error} rows={4} />
  );
}

function Toggle({ id, label, checked, onChange, hint }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-gray-200 p-3">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <div>
        <label htmlFor={id} className="cursor-pointer text-sm text-ink-900">{label}</label>
        {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
      </div>
    </div>
  );
}

function Repeater<T extends object>({ label, items, empty, onChange, render, max }: { label: string; items: T[]; empty: T; onChange: (v: T[]) => void; render: (item: T, update: (n: T) => void, index: number) => React.ReactNode; max?: number }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-ink-900">{label}</legend>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 rounded-md border border-gray-200 p-3">
          <div className="flex-1 space-y-2">{render(item, (n) => onChange(items.map((x, j) => (j === i ? n : x))), i)}</div>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Eliminar" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <XIcon aria-hidden />
          </Button>
        </div>
      ))}
      {!max || items.length < max ? (
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, empty])}>
          <PlusIcon aria-hidden /> Añadir
        </Button>
      ) : null}
    </fieldset>
  );
}

/* ---------- formulario ---------- */

export function SettingsForm({ initial, mediaOptions }: { initial: SiteSettings; mediaOptions: Option[] }) {
  const router = useRouter();
  const [s, setS] = React.useState<SiteSettings>(initial);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [message, setMessage] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = React.useTransition();

  const patch = <K extends keyof SiteSettings>(key: K, value: Partial<SiteSettings[K]>) =>
    setS((prev) => ({ ...prev, [key]: Array.isArray(value) ? value : { ...(prev[key] as object), ...(value as object) } }));
  const E = (path: string) => errors[path];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});
    startTransition(async () => {
      const res = await saveSettingsAction(s);
      if (res.ok) {
        setMessage({ ok: true, text: "Ajustes guardados. La web pública se actualiza en unos segundos." });
        router.refresh();
      } else {
        setMessage({ ok: false, text: res.message });
        if (res.fieldErrors) setErrors(res.fieldErrors);
      }
    });
  };

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={submit} className="space-y-6">
      {message ? (
        <Alert variant={message.ok ? "default" : "destructive"}>
          <AlertTitle>{message.ok ? "Correcto" : "No se ha guardado"}</AlertTitle>
          <AlertDescription>
            {message.text}
            {errorCount ? ` ${errorCount} campo(s) con error: ${Object.keys(errors).slice(0, 5).join(", ")}.` : ""}
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="empresa">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {[
            ["empresa", "Empresa"],
            ["portada", "Portada"],
            ["textos", "Textos"],
            ["menus", "Menús"],
            ["seo", "SEO e integraciones"],
            ["calculadoras", "Calculadoras"],
            ["legal", "Legal"],
          ].map(([v, l]) => (
            <TabsTrigger key={v} value={v}>{l}</TabsTrigger>
          ))}
        </TabsList>

        {/* Empresa */}
        <TabsContent value="empresa" className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Datos de la empresa</h2>
            <p className="mt-1 text-sm text-gray-600">Teléfono y WhatsApp vacíos ocultan sus botones en la web. Solo datos confirmados.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Text id="c-name" label="Nombre comercial" value={s.company.name} onChange={(v) => patch("company", { name: v })} error={E("company.name")} />
              <Text id="c-tagline" label="Eslogan corto" value={s.company.tagline} onChange={(v) => patch("company", { tagline: v })} />
              <Text id="c-legal" label="Razón social" value={s.company.legalName} onChange={(v) => patch("company", { legalName: v })} />
              <Text id="c-nif" label="NIF" value={s.company.nif} onChange={(v) => patch("company", { nif: v })} />
              <Text id="c-address" label="Dirección" value={s.company.address} onChange={(v) => patch("company", { address: v })} />
              <Text id="c-cp" label="Código postal" value={s.company.postalCode} onChange={(v) => patch("company", { postalCode: v })} />
              <Text id="c-city" label="Ciudad" value={s.company.city} onChange={(v) => patch("company", { city: v })} />
              <Text id="c-prov" label="Provincia" value={s.company.province} onChange={(v) => patch("company", { province: v })} />
              <Text id="c-phone" label="Teléfono" value={s.company.phone} onChange={(v) => patch("company", { phone: v })} hint="Formato libre; se normaliza para tel:." />
              <Text id="c-wa" label="WhatsApp" value={s.company.whatsapp} onChange={(v) => patch("company", { whatsapp: v })} />
              <Text id="c-email" label="Email" value={s.company.email} onChange={(v) => patch("company", { email: v })} error={E("company.email")} type="email" />
              <Text id="c-hours" label="Horario" value={s.company.hours} onChange={(v) => patch("company", { hours: v })} />
              <div className="md:col-span-2">
                <Area id="c-wamsg" label="Mensaje inicial de WhatsApp" value={s.company.whatsappMessage} onChange={(v) => patch("company", { whatsappMessage: v })} rows={2} />
              </div>
              <Lines id="c-zones" label="Zonas de actuación" value={s.company.zones} onChange={(v) => patch("company", { zones: v })} />
              <div className="space-y-4">
                {(Object.keys(s.company.socials) as (keyof SiteSettings["company"]["socials"])[]).map((k) => (
                  <Text key={k} id={`c-soc-${k}`} label={k.charAt(0).toUpperCase() + k.slice(1)} value={s.company.socials[k]} onChange={(v) => patch("company", { socials: { ...s.company.socials, [k]: v } })} error={E(`company.socials.${k}`)} />
                ))}
              </div>
            </div>
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Avisos de solicitudes</h2>
            <div className="mt-5">
              <Lines id="n-emails" label="Emails que reciben cada nueva solicitud" value={s.notifications.leadEmails} onChange={(v) => patch("notifications", { leadEmails: v })} error={E("notifications.leadEmails")} hint="Uno por línea. Si está vacío se usa la variable NOTIFY_EMAIL." />
            </div>
          </section>
        </TabsContent>

        {/* Portada */}
        <TabsContent value="portada" className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Cartel superior (mensajes en movimiento)</h2>
            <div className="mt-5 space-y-4">
              <Toggle id="t-enabled" label="Mostrar el cartel" checked={s.ticker.enabled} onChange={(v) => patch("ticker", { enabled: v })} />
              <Lines id="t-msgs" label="Mensajes" value={s.ticker.messages} onChange={(v) => patch("ticker", { messages: v })} />
            </div>
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Hero de la portada</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Text id="h-eyebrow" label="Antetítulo" value={s.hero.eyebrow} onChange={(v) => patch("hero", { eyebrow: v })} />
              <Text id="h-alt" label="Texto alternativo de la imagen" value={s.hero.imageAlt} onChange={(v) => patch("hero", { imageAlt: v })} />
              <Text id="h-before" label="Titular: antes de la palabra destacada" value={s.hero.titleBefore} onChange={(v) => patch("hero", { titleBefore: v })} />
              <Text id="h-high" label="Palabra destacada" value={s.hero.titleHighlight} onChange={(v) => patch("hero", { titleHighlight: v })} />
              <Text id="h-after" label="Titular: después" value={s.hero.titleAfter} onChange={(v) => patch("hero", { titleAfter: v })} />
              <div className="space-y-1.5">
                <Label htmlFor="h-img">Imagen</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input id="h-img" value={s.hero.imagePath} onChange={(v) => patch("hero", { imagePath: v.target.value })} className="flex-1" />
                  {mediaOptions.length ? (
                    <Select value={mediaOptions.some((m) => m.value === s.hero.imagePath) ? s.hero.imagePath : "__none__"} onValueChange={(v) => patch("hero", { imagePath: v === "__none__" ? "" : v })}>
                      <SelectTrigger className="sm:w-56" aria-label="Biblioteca de medios"><SelectValue placeholder="Biblioteca" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Sin imagen</SelectItem>
                        {mediaOptions.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : null}
                </div>
              </div>
              <div className="md:col-span-2">
                <Area id="h-sub" label="Subtítulo" value={s.hero.subtitle} onChange={(v) => patch("hero", { subtitle: v })} rows={2} />
              </div>
              <Text id="h-cta1" label="Botón principal" value={s.hero.primaryCtaLabel} onChange={(v) => patch("hero", { primaryCtaLabel: v })} error={E("hero.primaryCtaLabel")} />
              <Text id="h-cta2" label="Botón secundario (si no hay WhatsApp)" value={s.hero.secondaryCtaLabel} onChange={(v) => patch("hero", { secondaryCtaLabel: v })} />
            </div>
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <Repeater
              label="Compromisos (máx. 6)"
              items={s.commitments}
              empty={{ icon: "quality" as const, title: "", description: "" }}
              max={6}
              onChange={(v) => setS((p) => ({ ...p, commitments: v as SiteSettings["commitments"] }))}
              render={(item, update) => (
                <div className="grid gap-2 sm:grid-cols-[10rem_1fr]">
                  <Select value={item.icon} onValueChange={(v) => update({ ...item, icon: v as typeof item.icon })}>
                    <SelectTrigger aria-label="Icono"><SelectValue /></SelectTrigger>
                    <SelectContent>{COMMITMENT_ICONS.map((i) => <SelectItem key={i} value={i}>{ICON_LABELS[i] ?? i}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} placeholder="Título" aria-label="Título" />
                  <Textarea className="sm:col-span-2" value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} placeholder="Descripción" rows={2} aria-label="Descripción" />
                </div>
              )}
            />
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <p className="mb-3 text-sm text-gray-600">Las cifras solo se muestran si marcas «verificada» y tienen valor. No inventes datos.</p>
            <Repeater
              label="Cifras verificadas (máx. 4)"
              items={s.verifiedStats}
              empty={{ value: "", suffix: "", label: "", verified: false }}
              max={4}
              onChange={(v) => setS((p) => ({ ...p, verifiedStats: v }))}
              render={(item, update) => (
                <div className="grid gap-2 sm:grid-cols-[6rem_5rem_1fr_auto] sm:items-center">
                  <Input value={item.value} onChange={(e) => update({ ...item, value: e.target.value })} placeholder="Valor" aria-label="Valor" />
                  <Input value={item.suffix} onChange={(e) => update({ ...item, suffix: e.target.value })} placeholder="Sufijo" aria-label="Sufijo" />
                  <Input value={item.label} onChange={(e) => update({ ...item, label: e.target.value })} placeholder="Etiqueta" aria-label="Etiqueta" />
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={item.verified} onCheckedChange={(v) => update({ ...item, verified: v === true })} /> Verificada</label>
                </div>
              )}
            />
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <Repeater
              label="Proceso de trabajo (pasos)"
              items={s.process}
              empty={{ title: "", description: "" }}
              max={8}
              onChange={(v) => setS((p) => ({ ...p, process: v }))}
              render={(item, update) => (
                <>
                  <Input value={item.title} onChange={(e) => update({ ...item, title: e.target.value })} placeholder="Título" aria-label="Título" />
                  <Textarea value={item.description} onChange={(e) => update({ ...item, description: e.target.value })} placeholder="Descripción" rows={2} aria-label="Descripción" />
                </>
              )}
            />
          </section>
        </TabsContent>

        {/* Textos */}
        <TabsContent value="textos" className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Página Empresa</h2>
            <div className="mt-5 space-y-4">
              <Text id="a-title" label="Título" value={s.about.title} onChange={(v) => patch("about", { title: v })} />
              <Area id="a-intro" label="Introducción" value={s.about.intro} onChange={(v) => patch("about", { intro: v })} />
              <div className="space-y-1.5">
                <Label htmlFor="a-body">Cuerpo (Markdown)</Label>
                <MarkdownField id="a-body" value={s.about.body} onChange={(v) => patch("about", { body: v })} rows={12} />
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Menús */}
        <TabsContent value="menus" className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <Repeater
              label="Menú principal (máx. 8)"
              items={s.menus.main}
              empty={{ label: "", href: "/" }}
              max={8}
              onChange={(v) => patch("menus", { main: v })}
              render={(item, update) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input value={item.label} onChange={(e) => update({ ...item, label: e.target.value })} placeholder="Texto" aria-label="Texto" />
                  <Input value={item.href} onChange={(e) => update({ ...item, href: e.target.value })} placeholder="/ruta" aria-label="Ruta" className="font-mono text-[13px]" />
                </div>
              )}
            />
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <Repeater
              label="Columnas del pie (máx. 4)"
              items={s.menus.footer}
              empty={{ title: "", items: [] }}
              max={4}
              onChange={(v) => patch("menus", { footer: v })}
              render={(col, update) => (
                <div className="space-y-3">
                  <Input value={col.title} onChange={(e) => update({ ...col, title: e.target.value })} placeholder="Título de la columna" aria-label="Título de la columna" />
                  <Repeater
                    label="Enlaces"
                    items={col.items}
                    empty={{ label: "", href: "/" }}
                    max={10}
                    onChange={(items) => update({ ...col, items })}
                    render={(item, u2) => (
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input value={item.label} onChange={(e) => u2({ ...item, label: e.target.value })} placeholder="Texto" aria-label="Texto" />
                        <Input value={item.href} onChange={(e) => u2({ ...item, href: e.target.value })} placeholder="/ruta" aria-label="Ruta" className="font-mono text-[13px]" />
                      </div>
                    )}
                  />
                </div>
              )}
            />
          </section>
        </TabsContent>

        {/* SEO e integraciones */}
        <TabsContent value="seo" className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">SEO por defecto</h2>
            <div className="mt-5 space-y-4">
              <Text id="s-title" label="Título por defecto" value={s.seo.defaultTitle} onChange={(v) => patch("seo", { defaultTitle: v })} error={E("seo.defaultTitle")} />
              <Area id="s-desc" label="Descripción por defecto" value={s.seo.defaultDescription} onChange={(v) => patch("seo", { defaultDescription: v })} error={E("seo.defaultDescription")} />
              <Lines id="s-kw" label="Palabras clave" value={s.seo.keywords} onChange={(v) => patch("seo", { keywords: v })} />
            </div>
          </section>
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Integraciones</h2>
            <p className="mt-1 text-sm text-gray-600">Los scripts solo se cargan tras el consentimiento de cookies.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Text id="i-gtm" label="Google Tag Manager (GTM-XXXXXXX)" value={s.integrations.gtmId} onChange={(v) => patch("integrations", { gtmId: v })} error={E("integrations.gtmId")} />
              <Text id="i-ga4" label="Google Analytics 4 (G-XXXXXXXXXX)" value={s.integrations.ga4Id} onChange={(v) => patch("integrations", { ga4Id: v })} error={E("integrations.ga4Id")} hint="Si hay GTM, GA4 se configura dentro de GTM." />
              <Text id="i-meta" label="Meta Pixel ID" value={s.integrations.metaPixelId} onChange={(v) => patch("integrations", { metaPixelId: v })} error={E("integrations.metaPixelId")} />
              <Text id="i-gsc" label="Verificación de Search Console" value={s.integrations.gscVerification} onChange={(v) => patch("integrations", { gscVerification: v })} error={E("integrations.gscVerification")} />
              <Text id="i-gbp" label="URL de Google Business Profile" value={s.integrations.gbpUrl} onChange={(v) => patch("integrations", { gbpUrl: v })} error={E("integrations.gbpUrl")} />
              <Text id="i-maps" label="URL de Google Maps" value={s.integrations.mapsUrl} onChange={(v) => patch("integrations", { mapsUrl: v })} error={E("integrations.mapsUrl")} />
            </div>
          </section>
        </TabsContent>

        {/* Calculadoras */}
        <TabsContent value="calculadoras" className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Calculadoras de captación</h2>
            <div className="mt-5 space-y-4">
              <Toggle id="k-enabled" label="Calculadoras activas" checked={s.calculators.enabled} onChange={(v) => patch("calculators", { enabled: v })} hint="Desactivarlas oculta /calculadoras (los enlaces del menú deben retirarse a mano)." />
              <Area id="k-disc" label="Aviso legal de las calculadoras" value={s.calculators.disclaimer} onChange={(v) => patch("calculators", { disclaimer: v })} />
            </div>
          </section>
          {CALCULATORS.map((c) => (
            <section key={c.id} className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="text-base font-semibold text-ink-900">{c.name}</h3>
              <p className="mt-1 text-sm text-gray-600">Rangos en euros por unidad, sin IVA.</p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.12em] text-gray-500">
                      <th className="py-2 pr-3">Partida</th>
                      <th className="py-2 pr-3">Unidad</th>
                      <th className="py-2 pr-3">Mín.</th>
                      <th className="py-2">Máx.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.rates.map((r) => {
                      const current = s.calculators.rates[c.id]?.[r.key] ?? { min: r.min, max: r.max };
                      const setRate = (next: { min: number; max: number }) =>
                        patch("calculators", { rates: { ...s.calculators.rates, [c.id]: { ...(s.calculators.rates[c.id] ?? {}), [r.key]: next } } });
                      return (
                        <tr key={r.key} className="border-t border-gray-100">
                          <td className="py-2 pr-3 text-ink-900">{r.label}</td>
                          <td className="py-2 pr-3 text-gray-500">{r.unit}</td>
                          <td className="py-2 pr-3"><Input type="number" min={0} value={current.min} onChange={(e) => setRate({ ...current, min: Number(e.target.value) })} className="h-8 w-28" aria-label={`Mínimo ${r.label}`} /></td>
                          <td className="py-2"><Input type="number" min={0} value={current.max} onChange={(e) => setRate({ ...current, max: Number(e.target.value) })} className="h-8 w-28" aria-label={`Máximo ${r.label}`} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </TabsContent>

        {/* Legal */}
        <TabsContent value="legal" className="space-y-6">
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="text-base font-semibold text-ink-900">Responsable del tratamiento</h2>
            <p className="mt-1 text-sm text-gray-600">Sustituyen los marcadores de los textos legales. Deja «[POR CONFIRMAR: …]» mientras no esté confirmado.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Text id="l-name" label="Razón social" value={s.legal.responsibleName} onChange={(v) => patch("legal", { responsibleName: v })} />
              <Text id="l-nif" label="NIF" value={s.legal.nif} onChange={(v) => patch("legal", { nif: v })} />
              <Text id="l-addr" label="Dirección" value={s.legal.address} onChange={(v) => patch("legal", { address: v })} />
              <Text id="l-email" label="Email de contacto" value={s.legal.email} onChange={(v) => patch("legal", { email: v })} />
              <Text id="l-reg" label="Datos registrales" value={s.legal.registry} onChange={(v) => patch("legal", { registry: v })} />
              <Text id="l-date" label="Última actualización (AAAA-MM-DD)" value={s.legal.lastUpdated} onChange={(v) => patch("legal", { lastUpdated: v })} />
            </div>
          </section>
          {(Object.keys(s.legalDocs) as (keyof SiteSettings["legalDocs"])[]).map((k) => (
            <section key={k} className="rounded-lg border border-gray-200 bg-white p-5">
              <Text id={`ld-${k}-title`} label="Título" value={s.legalDocs[k].title} onChange={(v) => patch("legalDocs", { [k]: { ...s.legalDocs[k], title: v } } as Partial<SiteSettings["legalDocs"]>)} error={E(`legalDocs.${k}.title`)} />
              <div className="mt-4 space-y-1.5">
                <Label htmlFor={`ld-${k}-body`}>Texto (Markdown con marcadores {"{{responsibleName}}"}, {"{{nif}}"}, {"{{address}}"}, {"{{email}}"}, {"{{registry}}"}, {"{{companyName}}"}, {"{{siteUrl}}"})</Label>
                <MarkdownField id={`ld-${k}-body`} value={s.legalDocs[k].body} onChange={(v) => patch("legalDocs", { [k]: { ...s.legalDocs[k], body: v } } as Partial<SiteSettings["legalDocs"]>)} rows={16} />
              </div>
            </section>
          ))}
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 z-10 -mx-5 flex items-center gap-3 border-t border-gray-200 bg-white/95 px-5 py-3 backdrop-blur md:-mx-8 md:px-8">
        <Button type="submit" variant="dark" disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" aria-hidden /> : <SaveIcon aria-hidden />}
          Guardar ajustes
        </Button>
        <p className="text-xs text-gray-500">Se guardan todas las pestañas a la vez.</p>
      </div>
    </form>
  );
}
