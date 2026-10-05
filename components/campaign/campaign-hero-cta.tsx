"use client";

import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const TARGET_ID = "diagnostico";
const WIZARD_ID = "diagnostico-wizard";

/**
 * CTA del hero de campaña: registra el clic y desplaza al diagnóstico embebido,
 * moviendo el foco al wizard para teclado y lectores de pantalla.
 */
export function CampaignHeroCta({
  label = "Analizar mi red",
  location = "linkedin_hero",
  className,
}: {
  label?: string;
  location?: string;
  className?: string;
}) {
  const handleClick = () => {
    track("cta_clicked", { location, href: `#${TARGET_ID}` });
    document.getElementById(TARGET_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById(WIZARD_ID)?.focus({ preventScroll: true });
  };

  return (
    <Button type="button" size="xl" onClick={handleClick} className={cn("w-full sm:w-auto", className)}>
      {label}
      <ArrowRightIcon />
    </Button>
  );
}
