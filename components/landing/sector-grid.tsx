import { cn } from "@/lib/utils";

export interface SectorItem {
  name: string;
  /** Una frase: qué se mide o qué palanca pesa en ese subsector. */
  description: string;
}

/** Grid de sectores o subsectores con una frase operativa por tarjeta. */
export function SectorGrid({
  items,
  columns = 4,
  className,
}: {
  items: readonly SectorItem[];
  columns?: 3 | 4 | 5;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid gap-4 sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
        columns === 5 && "lg:grid-cols-5",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.name} className="rounded-lg border border-gray-200 bg-white p-5 md:p-6">
          <h3 className="font-display text-xl text-navy-900">{item.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.description}</p>
        </li>
      ))}
    </ul>
  );
}
