import Link from "next/link";

import { INSIGHT_CATEGORIES } from "@/content/insights";
import { cn } from "@/lib/utils";

/**
 * Filtro de categorías como fila de chips con scroll horizontal en móvil.
 * Son enlaces (estáticos): cada categoría tiene su propia URL indexable.
 */
export function CategoryChips({
  active,
  basePath = "/insights/categoria",
  className,
}: {
  /** Slug de la categoría activa; sin valor = "Todos". */
  active?: string;
  basePath?: string;
  className?: string;
}) {
  const chipBase =
    "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-200";
  const chipIdle = "border-gray-200 bg-white text-navy-900 hover:border-navy-300 hover:bg-navy-50";
  const chipActive = "border-navy-900 bg-navy-900 text-white";

  return (
    <nav aria-label="Categorías de insights" className={cn("-mx-5 sm:mx-0", className)}>
      <ul className="no-scrollbar flex gap-2 overflow-x-auto px-5 pb-1 sm:flex-wrap sm:px-0">
        <li>
          <Link
            href="/insights"
            aria-current={!active ? "page" : undefined}
            className={cn(chipBase, !active ? chipActive : chipIdle)}
          >
            Todos
          </Link>
        </li>
        {INSIGHT_CATEGORIES.map((category) => {
          const isActive = category.slug === active;
          return (
            <li key={category.slug}>
              <Link
                href={`${basePath}/${category.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(chipBase, isActive ? chipActive : chipIdle)}
              >
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
