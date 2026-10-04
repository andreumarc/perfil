import Link from "next/link";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Marca tipográfica: nombre + descriptor. Sin imagen → cero peso extra. */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — inicio`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        aria-hidden
        className={cn(
          "flex size-9 items-center justify-center rounded-sm text-sm font-semibold tracking-tight",
          tone === "light" ? "bg-navy-900 text-white" : "bg-white text-navy-900",
        )}
      >
        MA
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            tone === "light" ? "text-navy-900" : "text-white",
          )}
        >
          {site.name}
        </span>
        <span
          className={cn(
            "mt-1 text-[10.5px] font-medium uppercase tracking-[0.16em]",
            tone === "light" ? "text-gray-500" : "text-navy-200",
          )}
        >
          {site.brand}
        </span>
      </span>
    </Link>
  );
}
