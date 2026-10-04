import * as React from "react";

import { cn } from "@/lib/utils";

import { Container } from "./container";

type Tone = "white" | "muted" | "navy" | "navy-grid";

/**
 * Sección de página con ritmo vertical y tono de fondo consistentes.
 * `tone="navy"` cambia el color de texto a claro automáticamente.
 */
export function Section({
  className,
  tone = "white",
  size = "default",
  containerSize,
  children,
  ...props
}: React.ComponentProps<"section"> & {
  tone?: Tone;
  size?: "default" | "compact" | "spacious";
  containerSize?: "default" | "narrow" | "wide";
}) {
  return (
    <section
      className={cn(
        size === "default" && "py-16 md:py-24",
        size === "compact" && "py-10 md:py-14",
        size === "spacious" && "py-20 md:py-32",
        tone === "muted" && "bg-gray-50",
        tone === "navy" && "bg-navy-radial text-white",
        tone === "navy-grid" && "bg-navy-grid text-white",
        className,
      )}
      {...props}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("eyebrow mb-3", className)} {...props} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow className={cn(tone === "dark" && "text-navy-200")}>{eyebrow}</Eyebrow>
      ) : null}
      <Heading
        className={cn(
          "font-display text-3xl leading-[1.1] sm:text-4xl md:text-[2.75rem]",
          tone === "light" ? "text-navy-900" : "text-white",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <div
          className={cn(
            "mt-5 text-base leading-relaxed md:text-lg",
            tone === "light" ? "text-gray-600" : "text-navy-100/85",
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}
