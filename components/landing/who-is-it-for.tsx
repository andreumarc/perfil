import { cn } from "@/lib/utils";

export interface Profile {
  /** Cargo o perfil (p. ej. "Operating Partner"). */
  role: string;
  /** Situación concreta en la que esta página le resuelve algo. */
  situation: string;
}

/** Tarjetas "para quién es": cargo + situación. Cuatro perfiles encajan en una fila en escritorio. */
export function WhoIsItFor({
  items,
  tone = "light",
  className,
}: {
  items: readonly Profile[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <ul className={cn("grid gap-5 sm:grid-cols-2", items.length >= 4 && "lg:grid-cols-4", className)}>
      {items.map((item) => (
        <li
          key={item.role}
          className={cn(
            "flex flex-col rounded-lg border p-6",
            dark ? "border-white/15 bg-white/[0.04]" : "border-gray-200 bg-white",
          )}
        >
          <span className={cn("h-0.5 w-8 rounded-full", dark ? "bg-navy-300" : "bg-signal")} aria-hidden />
          <h3 className={cn("font-display mt-4 text-xl", dark ? "text-white" : "text-navy-900")}>{item.role}</h3>
          <p className={cn("mt-3 text-sm leading-relaxed md:text-[15px]", dark ? "text-navy-100/80" : "text-gray-600")}>
            {item.situation}
          </p>
        </li>
      ))}
    </ul>
  );
}
