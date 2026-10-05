import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export type QueryResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Ejecuta una consulta y captura cualquier error para que la página del admin
 * pueda mostrar un aviso en lugar de romperse.
 */
export async function safeQuery<T>(fn: () => Promise<T>): Promise<QueryResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (error) {
    console.error("[admin] Error al consultar la base de datos:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Error desconocido al consultar la base de datos.";
    return { ok: false, error: message };
  }
}

/** Alert destructivo con el mensaje de error de una consulta. */
export function QueryError({
  title = "No se han podido cargar los datos",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="break-words">{message}</p>
        <p className="text-red-800/80">
          Comprueba la conexión con Neon en <span className="font-mono text-xs">/api/health</span> y que las migraciones
          estén aplicadas (<span className="font-mono text-xs">npm run db:migrate</span>).
        </p>
      </AlertDescription>
    </Alert>
  );
}
