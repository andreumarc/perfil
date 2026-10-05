import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/layout/section";
import { ServiceCard } from "@/components/sections/service-card";
import { Button } from "@/components/ui/button";
import { getService, type ServiceSlug } from "@/content/services";
import { cn } from "@/lib/utils";

/** Servicios relevantes para una landing sectorial, en el orden indicado. */
export function RelatedServices({
  slugs,
  eyebrow = "Servicios",
  title,
  description,
  tone = "muted",
  id,
}: {
  slugs: readonly ServiceSlug[];
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "white" | "muted";
  id?: string;
}) {
  const services = slugs.map((slug) => getService(slug)).filter((s) => s !== undefined);

  return (
    <Section tone={tone} id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div
        className={cn(
          "mt-12 grid gap-5",
          services.length === 2 && "md:grid-cols-2",
          services.length === 3 && "md:grid-cols-3",
          services.length >= 4 && "md:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {services.map((service) => (
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
