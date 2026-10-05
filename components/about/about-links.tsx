import { ArrowRightIcon, ArrowUpRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { meetingHref, site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * CTAs de contacto directo: reunión (siempre) y LinkedIn (solo si está
 * configurado en el entorno). `location` identifica el bloque en analítica.
 */
export function AboutLinks({ location, className }: { location: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <Button asChild size="xl" className="w-full sm:w-auto">
        <TrackedLink href={meetingHref} event="meeting_clicked" props={{ location }}>
          Reservar sesión de 30 min
          <ArrowRightIcon />
        </TrackedLink>
      </Button>
      {site.linkedinUrl ? (
        <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
          <TrackedLink href={site.linkedinUrl} event="linkedin_clicked" props={{ location }}>
            Ver perfil en LinkedIn
            <ArrowUpRightIcon />
          </TrackedLink>
        </Button>
      ) : null}
    </div>
  );
}
