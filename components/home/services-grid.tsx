import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { ServiceCard } from "@/components/sections/service-card";
import { Button } from "@/components/ui/button";
import { SERVICES } from "@/content/services";

/** Grid 2x2 con los cuatro servicios del catálogo. */
export function ServicesGrid() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Servicios"
        title="Cuatro formas de intervenir. Un mismo objetivo: más EBITDA por centro."
        description="Del diagnóstico ejecutivo de tres semanas a la dirección de operaciones a tiempo parcial. Alcance, calendario y presupuesto cerrados antes de empezar; resultados medidos en el P&L, no en el número de páginas del informe."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {SERVICES.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

      <div className="mt-10">
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/servicios">
            Ver todos los servicios
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
