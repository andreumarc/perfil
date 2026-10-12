import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { getSettings } from "@/lib/cms/settings";

export default async function NotFound() {
  const s = await getSettings();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-gray-200">
        <Container size="wide" className="flex h-16 items-center">
          <Logo name={s.company.name} tagline={s.company.tagline} />
        </Container>
      </header>
      <main className="flex flex-1 items-center">
        <Container size="narrow" className="py-24 text-center">
          <p className="eyebrow justify-center">Error 404</p>
          <h1 className="font-display mt-3 text-4xl text-ink-900 md:text-5xl">Esta página no existe</h1>
          <p className="mx-auto mt-5 max-w-md text-gray-600">
            Puede que el enlace esté desactualizado. Si estás pensando en una reforma o una instalación, cuéntanos tu
            proyecto y te preparamos un presupuesto sin compromiso.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/presupuesto">Pedir presupuesto</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}
