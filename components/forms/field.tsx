import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Envoltorio de campo accesible: label, ayuda y error enlazados por aria-describedby. */
export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-ink-900">
        {label}
        {optional ? <span className="ml-1 font-normal text-gray-500">(opcional)</span> : null}
      </Label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
