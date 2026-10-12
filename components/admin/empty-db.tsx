import { DatabaseIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const STEPS: { title: string; detail: React.ReactNode }[] = [
  { title: "Crea un proyecto en Neon", detail: "Desde console.neon.tech, crea un proyecto Postgres y copia la cadena de conexión (pooled)." },
  { title: "Define DATABASE_URL", detail: <>Añade <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">DATABASE_URL</code> en <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">.env.local</code> y en las variables de entorno del hosting.</> },
  { title: "Aplica el esquema", detail: <>Ejecuta <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">npm run db:migrate</code> para crear las tablas.</> },
  { title: "Carga el contenido inicial", detail: <>Ejecuta <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs">npm run db:seed</code> para sembrar servicios, sectores, artículos y ajustes (sin solicitudes falsas).</> },
];

/** Panel que sustituye a cualquier página del admin cuando no hay DATABASE_URL. */
export function EmptyDb() {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-copper-50 text-copper-600"><DatabaseIcon className="size-5" aria-hidden /></div>
        <CardTitle className="text-xl">Base de datos no configurada</CardTitle>
        <CardDescription>El panel necesita una base de datos Neon para solicitudes, contenidos y ajustes. La web pública funciona con el contenido por defecto, pero aquí no hay nada que mostrar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ol className="space-y-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">{index + 1}</span>
              <div>
                <p className="text-sm font-semibold text-ink-900">{step.title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-5">
          <Button asChild variant="ghost" size="sm"><a href="/api/health" target="_blank" rel="noopener noreferrer">Comprobar /api/health</a></Button>
        </div>
      </CardContent>
    </Card>
  );
}
