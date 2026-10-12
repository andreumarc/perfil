import Image from "next/image";
import { ArrowRightIcon, MessageCircleIcon, PlayIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { CommitmentIcon } from "@/components/sections/commitment-icon";
import { IllustrativeBadge } from "@/components/sections/illustrative-badge";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { whatsappHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/validation/settings";

/**
 * Hero cinematográfico: fotografía a sangre con degradado oscuro desde la
 * izquierda, titular con palabra destacada, compromisos y dos CTA.
 * La imagen se marca como ilustrativa (recurso de diseño, no obra real).
 */
export function Hero({ settings, hasImage }: { settings: SiteSettings; hasImage: boolean }) {
  const { hero, company, commitments } = settings;
  const wa = whatsappHref(company.whatsapp, company.whatsappMessage);

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      <div className="absolute inset-0 -z-10">
        {hasImage ? (
          <Image
            src={hero.imagePath}
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-ink-grid" aria-hidden />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/90 via-ink-950/60 to-ink-900/20" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/80 to-transparent" aria-hidden />
      </div>

      <Container size="wide" className="relative flex min-h-[80vh] flex-col justify-center py-20 md:min-h-[88vh] md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow text-copper-300">{hero.eyebrow}</p>
          <h1 className="font-display mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            {hero.titleBefore} <span className="text-copper-400">{hero.titleHighlight}</span> {hero.titleAfter}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-100/90 md:text-lg">{hero.subtitle}</p>

          {commitments.length ? (
            <RevealGroup className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:divide-x sm:divide-white/15" amount={0.1}>
              {commitments.map((c) => (
                <RevealItem key={c.title} scale className="flex items-center gap-3 sm:pr-6 sm:pl-6 sm:first:pl-0">
                  <CommitmentIcon name={c.icon} className="size-6 shrink-0 text-copper-400" />
                  <span className="text-sm font-medium leading-tight text-white">{c.title}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <TrackedLink href="/presupuesto" event="cta_clicked" props={{ location: "hero" }}>
                {hero.primaryCtaLabel}
                <ArrowRightIcon aria-hidden />
              </TrackedLink>
            </Button>
            {wa ? (
              <Button asChild size="xl" variant="outline-light">
                <TrackedLink href={wa} event="whatsapp_clicked" props={{ location: "hero" }}>
                  <MessageCircleIcon aria-hidden />
                  Habla con nosotros
                </TrackedLink>
              </Button>
            ) : (
              <Button asChild size="xl" variant="outline-light">
                <TrackedLink href="/proyectos" event="cta_clicked" props={{ location: "hero_secondary" }}>
                  <PlayIcon aria-hidden />
                  {hero.secondaryCtaLabel || "Ver proyectos"}
                </TrackedLink>
              </Button>
            )}
          </div>
        </div>
        {hasImage ? <IllustrativeBadge className="absolute right-5 bottom-5 sm:right-8" /> : null}
      </Container>
    </section>
  );
}
