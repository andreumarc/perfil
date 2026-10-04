import { cn } from "@/lib/utils";

/** Cabecera de página del admin: título, descripción y acciones a la derecha. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-900 md:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-gray-600 md:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
