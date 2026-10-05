import { Skeleton } from "@/components/ui/skeleton";

/**
 * Fallback del <Suspense> que envuelve al formulario (usa useSearchParams).
 * Replica la silueta del formulario para evitar saltos de layout en el prerender.
 */
export function ContactFormSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando formulario" className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-7 w-3/4" />
      </div>
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-11 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      ))}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-14 w-full sm:w-64" />
    </div>
  );
}
