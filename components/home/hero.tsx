import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { ArrowRightIcon, MessageCircleIcon, PlayIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Container } from "@/components/layout/container";
import { CommitmentIcon } from "@/components/sections/commitment-icon";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { whatsappHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/validation/settings";

/** Punto de corte por debajo del cual se sirve el recorte vertical del hero (móvil). */
const MOBILE_MEDIA = "(max-width: 767px)";
const DESKTOP_MEDIA = "(min-width: 768px)";
/** Calidad algo inferior a la estándar: el hero va bajo un degradado oscuro y es la imagen más grande de la página. */
const HERO_QUALITY = 60;

/**
 * Imagen del hero con prioridad real de descarga (es el LCP en todas las pantallas):
 * `fetchpriority="high"`, precarga en el `<head>` y, si existe el recorte vertical
 * (`<imagen>-movil.webp`), dirección de arte con `<picture>` para no descargar en
 * móvil una foto apaisada de la que solo se ve el centro.
 */
function HeroImage({ src, mobileSrc, alt }: { src: string; mobileSrc?: string; alt: string }) {
  const common = { alt, fill: true, sizes: "100vw", quality: HERO_QUALITY, priority: true } as const;
  const { props: desktop } = getImageProps({ ...common, src });
  const mobile = mobileSrc ? getImageProps({ ...common, src: mobileSrc }).props : null;

  // Precarga explícita (getImageProps no la emite): una por variante, con su media query.
  if (mobile) {
    preload(mobile.src, { as: "image", imageSrcSet: mobile.srcSet, imageSizes: mobile.sizes, fetchPriority: "high", media: MOBILE_MEDIA });
    preload(desktop.src, { as: "image", imageSrcSet: desktop.srcSet, imageSizes: desktop.sizes, fetchPriority: "high", media: DESKTOP_MEDIA });
  } else {
    preload(desktop.src, { as: "image", imageSrcSet: desktop.srcSet, imageSizes: desktop.sizes, fetchPriority: "high" });
  }

  return (
    <picture>
      {mobile ? <source media={MOBILE_MEDIA} srcSet={mobile.srcSet} sizes={mobile.sizes} /> : null}
      <img {...desktop} alt={alt} fetchPriority="high" decoding="async" className="object-cover object-center" />
    </picture>
  );
}

/**
 * Hero cinematográfico: fotografía a sangre con degradado oscuro desde la
 * izquierda, titular con palabra destacada, compromisos y dos CTA.
 * La imagen es un recurso de diseño editable desde ajustes.
 */
export function Hero({ settings, hasImage, mobileImagePath }: { settings: SiteSettings; hasImage: boolean; mobileImagePath?: string }) {
  const { hero, company, commitments } = settings;
  const wa = whatsappHref(company.whatsapp, company.whatsappMessage);

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      <div className="absolute inset-0 -z-10">
        {hasImage ? (
          <HeroImage src={hero.imagePath} mobileSrc={mobileImagePath} alt={hero.imageAlt} />
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
      </Container>
    </section>
  );
}
