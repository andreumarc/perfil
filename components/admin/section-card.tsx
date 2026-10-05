import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Card de sección del admin: título compacto, descripción opcional y acción a la derecha. */
export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <Card className={cn("gap-4 py-5", className)}>
      <CardHeader className="px-5">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className={cn("px-5", contentClassName)}>{children}</CardContent>
    </Card>
  );
}

/** Mensaje neutro para bloques sin datos. */
export function EmptyHint({ children = "Sin datos todavía." }: { children?: React.ReactNode }) {
  return <p className="py-10 text-center text-sm text-gray-500">{children}</p>;
}
