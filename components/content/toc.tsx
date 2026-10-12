"use client";

import * as React from "react";

import type { TocEntry } from "@/components/content/markdown";
import { cn } from "@/lib/utils";

/** Índice lateral del artículo: resalta la sección visible. */
export function Toc({ entries, className }: { entries: TocEntry[]; className?: string }) {
  const [active, setActive] = React.useState<string>("");

  React.useEffect(() => {
    if (!entries.length) return;
    const headings = entries.map((e) => document.getElementById(e.id)).filter((el): el is HTMLElement => Boolean(el));
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [entries]);

  if (!entries.length) return null;

  return (
    <nav aria-label="Contenido del artículo" className={cn("text-sm", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">En este artículo</p>
      <ol className="mt-3 space-y-1.5 border-l border-gray-200">
        {entries.map((e) => (
          <li key={e.id} className={e.level === 3 ? "pl-6" : "pl-3"}>
            <a
              href={`#${e.id}`}
              aria-current={active === e.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-0.5 pl-3 leading-snug transition-colors",
                active === e.id ? "border-copper-500 text-ink-900" : "border-transparent text-gray-600 hover:text-ink-900",
              )}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
