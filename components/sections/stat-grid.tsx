import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/validation/settings";

/**
 * Franja de cifras. Solo renderiza las marcadas como verificadas en ajustes:
 * sin datos reales confirmados no se muestra nada (ni valores inventados).
 */
export function StatGrid({ stats, tone = "light", className }: { stats: SiteSettings["verifiedStats"]; tone?: "light" | "dark"; className?: string }) {
  const visible = stats.filter((s) => s.verified && s.value.trim().length > 0);
  if (visible.length === 0) return null;
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4", className)}>
      {visible.map((stat) => (
        <div key={stat.label} className={cn("border-l pl-5", tone === "light" ? "border-copper-200" : "border-white/20")}>
          <dd className={cn("font-display tabular text-4xl leading-none md:text-5xl", tone === "light" ? "text-ink-900" : "text-white")}>
            {stat.value}
            {stat.suffix ? <span className="text-2xl md:text-3xl">{stat.suffix}</span> : null}
          </dd>
          <dt className={cn("mt-3 text-sm leading-snug", tone === "light" ? "text-gray-600" : "text-ink-200")}>{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
