import { cn } from "@/lib/utils";

export interface Field {
  label: string;
  value: React.ReactNode;
}

/** Lista etiqueta → valor compacta para las cards del detalle de lead. */
export function FieldList({ fields, className }: { fields: Field[]; className?: string }) {
  return (
    <dl className={cn("divide-y divide-gray-100", className)}>
      {fields.map((f) => (
        <div key={f.label} className="grid grid-cols-[minmax(0,7.5rem)_1fr] gap-3 py-2 text-sm first:pt-0 last:pb-0">
          <dt className="text-gray-500">{f.label}</dt>
          <dd className="min-w-0 break-words text-navy-900">{f.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Empty() {
  return <span className="text-gray-400">—</span>;
}
