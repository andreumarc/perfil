"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CopyIcon, Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";

import { deleteMediaAction, updateMediaAction, uploadMediaAction } from "@/actions/admin-media";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEDIA_KINDS, MEDIA_KIND_LABELS, type MediaKind } from "@/types/lead";

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  alt: string;
  kind: MediaKind;
  sizeLabel: string;
  createdLabel: string;
}

export function MediaManager({ items, canUpload }: { items: MediaItem[]; canUpload: boolean }) {
  const router = useRouter();
  const [message, setMessage] = React.useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = React.useTransition();
  const [kind, setKind] = React.useState<MediaKind>("illustrative");
  const [alt, setAlt] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  const upload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("kind", kind);
    fd.set("alt", alt);
    setMessage(null);
    startTransition(async () => {
      const res = await uploadMediaAction(fd);
      setMessage({ ok: res.ok, text: res.ok ? (res.message ?? "Subido.") : res.message });
      if (res.ok) {
        form.reset();
        setAlt("");
        router.refresh();
      }
    });
  };

  const patch = (id: string, data: { alt: string; kind: MediaKind }) =>
    startTransition(async () => {
      const res = await updateMediaAction({ id, ...data });
      if (!res.ok) setMessage({ ok: false, text: res.message });
      else router.refresh();
    });

  const remove = (id: string) =>
    startTransition(async () => {
      const res = await deleteMediaAction({ id });
      setMessage({ ok: res.ok, text: res.ok ? "Imagen eliminada." : res.message });
      if (res.ok) router.refresh();
    });

  const copy = (url: string) => {
    navigator.clipboard?.writeText(url).then(() => setMessage({ ok: true, text: "URL copiada." })).catch(() => setMessage({ ok: false, text: "No se pudo copiar la URL." }));
  };

  return (
    <div className="space-y-6">
      {message ? (
        <Alert variant={message.ok ? "default" : "destructive"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      ) : null}

      <form onSubmit={upload} className="grid gap-4 rounded-lg border border-gray-200 bg-white p-5 md:grid-cols-[1fr_12rem_1fr_auto] md:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="m-files">Imágenes (JPG, PNG, WebP, AVIF, SVG; máx. 4 MB cada una)</Label>
          <Input id="m-files" ref={fileRef} type="file" name="files" accept="image/*" multiple required disabled={!canUpload} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-kind">Tipo</Label>
          <Select value={kind} onValueChange={(v) => setKind(v as MediaKind)}>
            <SelectTrigger id="m-kind"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MEDIA_KINDS.map((k) => <SelectItem key={k} value={k}>{MEDIA_KIND_LABELS[k]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="m-alt">Texto alternativo (opcional)</Label>
          <Input id="m-alt" value={alt} onChange={(e) => setAlt(e.target.value)} maxLength={300} />
        </div>
        <Button type="submit" variant="dark" disabled={pending || !canUpload}>
          {pending ? <Loader2Icon className="animate-spin" aria-hidden /> : <UploadIcon aria-hidden />}
          Subir
        </Button>
        {!canUpload ? (
          <p className="text-xs text-gray-500 md:col-span-4">La subida requiere Vercel Blob (variable BLOB_READ_WRITE_TOKEN). Mientras tanto puedes usar rutas de /public/images en los campos de imagen.</p>
        ) : (
          <p className="text-xs text-gray-500 md:col-span-4">Marca como «ilustrativa» cualquier imagen generada o de recurso: la web la etiqueta y nunca la presenta como obra real.</p>
        )}
      </form>

      {items.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="relative aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="space-y-2 p-3 text-sm">
                <p className="truncate font-medium text-ink-900" title={m.filename}>{m.filename}</p>
                <p className="tabular text-xs text-gray-500">{m.sizeLabel} · {m.createdLabel}</p>
                <MediaRowEditor item={m} onSave={(data) => patch(m.id, data)} disabled={pending} />
                <div className="flex gap-1.5">
                  <Button type="button" size="sm" variant="outline" onClick={() => copy(m.url)}><CopyIcon aria-hidden /> Copiar URL</Button>
                  <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => remove(m.id)} disabled={pending} aria-label="Eliminar imagen"><Trash2Icon aria-hidden /></Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">Todavía no hay imágenes en la biblioteca.</p>
      )}
    </div>
  );
}

function MediaRowEditor({ item, onSave, disabled }: { item: MediaItem; onSave: (d: { alt: string; kind: MediaKind }) => void; disabled: boolean }) {
  const [alt, setAlt] = React.useState(item.alt);
  const [kind, setKind] = React.useState<MediaKind>(item.kind);
  const dirty = alt !== item.alt || kind !== item.kind;
  return (
    <div className="space-y-2">
      <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Texto alternativo" aria-label="Texto alternativo" className="h-8" />
      <div className="flex gap-1.5">
        <Select value={kind} onValueChange={(v) => setKind(v as MediaKind)}>
          <SelectTrigger size="sm" aria-label="Tipo de imagen"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MEDIA_KINDS.map((k) => <SelectItem key={k} value={k}>{MEDIA_KIND_LABELS[k]}</SelectItem>)}
          </SelectContent>
        </Select>
        {dirty ? <Button type="button" size="sm" variant="dark" onClick={() => onSave({ alt, kind })} disabled={disabled}>Guardar</Button> : null}
      </div>
    </div>
  );
}
