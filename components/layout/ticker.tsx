import { cn } from "@/lib/utils";

/**
 * Cartel superior con mensajes en movimiento continuo (marquee CSS, sin JS).
 * Se duplica la lista para un bucle sin corte; con prefers-reduced-motion se
 * detiene y muestra los mensajes alineados.
 */
export function Ticker({ messages, className }: { messages: string[]; className?: string }) {
  const items = messages.map((m) => m.trim()).filter(Boolean);
  if (!items.length) return null;
  const duration = Math.max(18, items.join(" ").length * 0.45);
  return (
    <div className={cn("relative overflow-hidden border-b border-white/10 bg-ink-950 text-white", className)} role="region" aria-label="Avisos">
      <div className="rf-ticker flex w-max gap-10 py-2 text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-10" aria-hidden={copy === 1}>
            {items.map((text, i) => (
              <li key={`${copy}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
                <span>{text}</span>
                <span className="size-1.5 rounded-full bg-copper-400" aria-hidden />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
