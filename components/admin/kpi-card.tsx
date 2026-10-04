import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Tarjeta KPI estilo SaaS: etiqueta, valor grande y texto de apoyo. */
export function KpiCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "default" | "hot" | "signal";
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-2 py-5", className)}>
      <div className="flex items-center justify-between px-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">{label}</p>
        {icon ? <span className="text-gray-400 [&_svg]:size-4">{icon}</span> : null}
      </div>
      <p
        className={cn(
          "tabular px-5 text-3xl font-semibold tracking-tight",
          tone === "default" && "text-navy-900",
          tone === "hot" && "text-red-600",
          tone === "signal" && "text-signal-dark",
        )}
      >
        {value}
      </p>
      {hint ? <p className="px-5 text-xs text-gray-500">{hint}</p> : null}
    </Card>
  );
}
