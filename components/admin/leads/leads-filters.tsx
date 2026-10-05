"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Flame, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { LeadsFilter } from "@/lib/validation/admin";
import {
  LEAD_LEVELS,
  LEAD_LEVEL_LABELS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  SECTORS,
} from "@/types/lead";

const ALL = "ALL";
const SEARCH_DEBOUNCE_MS = 300;

type FilterKey = "q" | "status" | "level" | "source" | "sector" | "hot";

/**
 * Barra de filtros del CRM. Toda la fuente de verdad vive en la URL: cada
 * cambio actualiza los search params (conservando el resto) y resetea la página.
 */
export function LeadsFilters({ filter }: { filter: LeadsFilter }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlQ = filter.q ?? "";
  const [q, setQ] = useState(urlQ);
  // Último valor que este componente envió a la URL y último valor visto en la
  // URL: permiten sincronizar el input cuando los params cambian desde fuera
  // (p. ej. "Limpiar filtros") sin pisar lo que el usuario está escribiendo.
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

  function clearSearch() {
    if (timer.current) clearTimeout(timer.current);
    setQ("");
    setPushedQ("");
    navigate({ q: undefined }, "replace");
  }

  const hotActive = filter.hot === "1";

  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-3 transition-opacity md:p-4",
        isPending && "opacity-70",
      )}
      aria-busy={isPending}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="relative md:col-span-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            inputMode="search"
            value={q}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por empresa, contacto o email"
            aria-label="Buscar leads"
            maxLength={120}
            className="h-10 pl-9 pr-9 md:text-sm"
          />
          {q ? (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Borrar búsqueda"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-gray-400 hover:text-navy-900"
            >
              <X className="size-4" />
            </button>
          ) : isPending ? (
            <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-gray-400" />
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3 md:col-span-8 md:grid-cols-5">
          <Select value={filter.status ?? ALL} onValueChange={(v) => navigate({ status: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los status</SelectItem>
              {LEAD_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter.level ?? ALL} onValueChange={(v) => navigate({ level: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por nivel">
              <SelectValue placeholder="Nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los niveles</SelectItem>
              {LEAD_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>
                  {LEAD_LEVEL_LABELS[l]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter.sector || ALL} onValueChange={(v) => navigate({ sector: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por sector">
              <SelectValue placeholder="Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los sectores</SelectItem>
              {SECTORS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filter.source || ALL} onValueChange={(v) => navigate({ source: v }, "push")}>
            <SelectTrigger size="sm" className="h-10" aria-label="Filtrar por origen">
              <SelectValue placeholder="Origen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos los orígenes</SelectItem>
              {LEAD_SOURCES.map((s) => (
                <SelectItem key={s} value={s}>
                  {LEAD_SOURCE_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant={hotActive ? "default" : "outline"}
            size="sm"
            aria-pressed={hotActive}
            onClick={() => navigate({ hot: hotActive ? undefined : "1" }, "push")}
            className={cn("h-10 w-full", hotActive && "bg-red-600 hover:bg-red-700")}
          >
            <Flame className="size-4" />
            Solo HOT
          </Button>
        </div>
      </div>
    </div>
  );
}
