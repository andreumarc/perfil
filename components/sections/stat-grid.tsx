import { credentials } from "@/lib/site";
import { cn } from "@/lib/utils";

interface Stat {
  value: string;
  suffix?: string;
  label: string;
}

/** Credenciales en cifras grandes. Por defecto usa las credenciales reales del perfil. */
export function StatGrid({
  stats = credentials as unknown as Stat[],
  tone = "light",
  className,
}: {
  stats?: Stat[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <dl className={cn("grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4", className)}>
      {stats.map((stat) => (
        <div key={stat.label} className={cn("border-l pl-5", tone === "light" ? "border-navy-200" : "border-white/20")}>
          <dd
            className={cn(
              "font-display tabular text-4xl leading-none md:text-5xl",
              tone === "light" ? "text-navy-900" : "text-white",
            )}
          >
            {stat.value}
            {stat.suffix ? <span className="text-2xl md:text-3xl">{stat.suffix}</span> : null}
          </dd>
          <dt className={cn("mt-3 text-sm leading-snug", tone === "light" ? "text-gray-600" : "text-navy-100/80")}>
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
