import { Container } from "@/components/layout/container";
import { sectors } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Franja de sectores (sustituye a la tira de logos de clientes, que no se inventan). */
export function SectorStrip({ className, label = "Sectores en los que trabajo" }: { className?: string; label?: string }) {
  return (
    <section className={cn("border-y border-gray-200 bg-white py-8", className)}>
      <Container size="wide">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{label}</p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:gap-x-12">
          {sectors.map((sector) => (
            <li key={sector} className="font-display text-lg text-navy-900/80 md:text-xl">
              {sector}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
