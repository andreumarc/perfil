import { ArrowRightIcon, MessageCircleIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  /** Enlace de WhatsApp (null si no está configurado → se oculta). */
  whatsappHref?: string | null;
  location: string;
  tone?: "dark" | "light";
  className?: string;
}

/** Bloque de llamada a la acción reutilizable: presupuesto + WhatsApp opcional. */
export function CtaBand({
  eyebrow = "Siguiente paso",
  title = "Cuéntanos tu proyecto y recibe un presupuesto sin compromiso",
  description = "Visitamos el espacio, escuchamos lo que necesitas y te enviamos un presupuesto detallado por partidas con plazos y alternativas de materiales.",
  primaryLabel = "Pedir presupuesto sin compromiso",
  primaryHref = "/presupuesto",
  whatsappHref,
  location,
  tone = "dark",
  className,
}: CtaBandProps) {
  const dark = tone === "dark";
  return (
    <section className={cn(dark ? "bg-ink-grid text-white" : "bg-gray-50", "py-16 md:py-20", className)}>
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className={cn("eyebrow", dark && "text-copper-300")}>{eyebrow}</p>
            <h2 className={cn("font-display mt-3 text-3xl leading-tight md:text-4xl", dark ? "text-white" : "text-ink-900")}>{title}</h2>
            <p className={cn("mt-4 max-w-xl text-base md:text-lg", dark ? "text-ink-200" : "text-gray-600")}>{description}</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <Button asChild size="xl" className="w-full lg:w-auto">
              <TrackedLink href={primaryHref} event="cta_clicked" props={{ location }}>
                {primaryLabel}
                <ArrowRightIcon aria-hidden />
              </TrackedLink>
            </Button>
            {whatsappHref ? (
              <Button asChild size="lg" variant={dark ? "outline-light" : "outline"} className="w-full lg:w-auto">
                <TrackedLink href={whatsappHref} event="whatsapp_clicked" props={{ location }}>
                  <MessageCircleIcon aria-hidden />
                  Habla con nosotros por WhatsApp
                </TrackedLink>
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
