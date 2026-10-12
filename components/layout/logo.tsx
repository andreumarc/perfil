import Link from "next/link";

import { cn } from "@/lib/utils";

/** Icono de marca: trazo de casa con tejado en cobre (sin imagen, cero peso). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-9", className)} fill="none">
      <path d="M6 22 20 8l14 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v12h8v-8h4v8h8V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Marca tipográfica: icono + nombre + descriptor. Editable desde ajustes. */
export function Logo({
  name,
  tagline,
  tone = "light",
  className,
  href = "/",
}: {
  name: string;
  tagline?: string;
  tone?: "light" | "dark";
  className?: string;
  href?: string;
}) {
  return (
    <Link href={href} aria-label={`${name} — inicio`} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="text-copper-500" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[15px] font-bold tracking-tight uppercase", tone === "light" ? "text-ink-900" : "text-white")}>
          {name}
        </span>
        {tagline ? (
          <span className={cn("mt-1 text-[10px] font-medium uppercase tracking-[0.18em]", tone === "light" ? "text-gray-500" : "text-ink-200")}>
            {tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
