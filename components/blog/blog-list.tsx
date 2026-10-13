"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";

import { ArticleCard, type ArticleCardData } from "@/components/blog/article-card";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 9;

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Listado de artículos con búsqueda en cliente y paginación progresiva. */
export function BlogList({ articles, emptyMessage = "Todavía no hay artículos publicados en esta sección." }: { articles: ArticleCardData[]; emptyMessage?: string }) {
  const [query, setQuery] = React.useState("");
  const [limit, setLimit] = React.useState(PAGE_SIZE);
  const q = normalize(query.trim());
  const filtered = q ? articles.filter((a) => normalize(`${a.title} ${a.excerpt} ${a.categoryName}`).includes(q)) : articles;
  const visible = filtered.slice(0, limit);

  return (
    <div>
      <div className="relative max-w-md">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-500" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE_SIZE);
          }}
          placeholder="Buscar en el blog…"
          aria-label="Buscar artículos"
          className="pl-9"
        />
      </div>
      <p className="mt-3 text-xs text-gray-500" aria-live="polite">
        {filtered.length === articles.length ? `${articles.length} artículos` : `${filtered.length} de ${articles.length} artículos`}
      </p>

      {visible.length ? (
        // Cada tarjeta se revela por su cuenta: las que añade «Cargar más» se montan después de que el
        // grupo ya se haya animado y, dentro de un RevealGroup, se quedarían invisibles.
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.08}>
              <ArticleCard article={a} className="h-full" />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">{q ? "No hay artículos que coincidan con tu búsqueda." : emptyMessage}</p>
      )}

      {filtered.length > visible.length ? (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
            Cargar más artículos
          </Button>
        </div>
      ) : null}
    </div>
  );
}
