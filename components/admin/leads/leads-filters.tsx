"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { LeadsFilter } from "@/lib/validation/admin";
import { LEAD_SOURCES, LEAD_SOURCE_LABELS, LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/types/lead";

const ALL = "ALL";
const SEARCH_DEBOUNCE_MS = 300;

type FilterKey = "q" | "status" | "source" | "service" | "assigned" | "from" | "to";

export interface FilterOptions {
  services: { slug: string; name: string }[];
  users: { id: string; name: string }[];
}

/** Barra de filtros: la fuente de verdad vive en la URL. */
export function LeadsFilters({ filter, options }: { filter: LeadsFilter; options: FilterOptions }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlQ = filter.q ?? "";
  const [q, setQ] = useState(urlQ);
  const [pushedQ, setPushedQ] = useState(urlQ);
  const [seenUrlQ, setSeenUrlQ] = useState(urlQ);
  if (urlQ !== seenUrlQ) {
    setSeenUrlQ(urlQ);
    if (urlQ !== pushedQ) {
      setQ(urlQ);
      setPushedQ(urlQ);
    }
  }

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function navigate(changes: Partial<Record<FilterKey, string | undefined>>, mode: "replace" | "push") {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined || value === "" || value === ALL) next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    const qs = next.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      if (mode === "replace") router.replace(href, { scroll: false });
      else router.push(href, { scroll: false });
    });
  }

  function onSearchChange(value: string) {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const trimmed = value.trim();
      setPushedQ(trimmed);
      navigate({ q: trimmed }, "replace");
    }, SEARCH_DEBOUNCE_MS);
  }

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-3 transition-opacity md:p-4", isPending && "opacity-70")} aria-busy={isPending}>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-3">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input type="search" inputMode="search" value={q} onChange={(e) => onSearchChange(e.target.value)} placeholder="Nombre, email, teléfono o localidad" aria-label="Buscar solicitudes" maxLength={120} className="h-10 pr-9 pl-9 md:text-sm" />
          {q ? (
            <button type="button" onClick={() => { setQ(""); setPushedQ(""); navigate({ q: undefined }, "replace"); }} aria-label="Borrar búsqueda" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-gray-400 hover:text-ink-900">
              <X className="size-4" />
            </button>
          ) : isPending ? (
            <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-gray-400" />
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:col-span-9 lg:grid-cols-6">
          <Select value={filter.status ?? ALL} onValueChange={(v) => navigate({ status: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por estado"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los estados</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{LEAD_STATUS_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filter.source ?? ALL} onValueChange={(v) => navigate({ source: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por origen"><SelectValue placeholder="Origen" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los orígenes</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>{LEAD_SOURCE_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filter.service || ALL} onValueChange={(v) => navigate({ service: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por servicio"><SelectValue placeholder="Servicio" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los servicios</SelectItem>
              {options.services.map((s) => (
                <SelectItem key={s.slug} value={s.slug}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filter.assigned ?? ALL} onValueChange={(v) => navigate({ assigned: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por asignado"><SelectValue placeholder="Asignado a" /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Cualquier responsable</SelectItem>
              <SelectItem value="none">Sin asignar</SelectItem>
              {options.users.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={filter.from ?? ""} onChange={(e) => navigate({ from: e.target.value }, "push")} aria-label="Desde" className="h-10 md:text-sm" />
          <Input type="date" value={filter.to ?? ""} onChange={(e) => navigate({ to: e.target.value }, "push")} aria-label="Hasta" className="h-10 md:text-sm" />
        </div>
      </div>
    </div>
  );
}
