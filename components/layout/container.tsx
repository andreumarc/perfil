import * as React from "react";

import { cn } from "@/lib/utils";

/** Contenedor de ancho máximo con márgenes laterales consistentes (mobile-first). */
export function Container({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "narrow" | "wide" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "default" && "max-w-6xl",
        size === "narrow" && "max-w-3xl",
        size === "wide" && "max-w-7xl",
        className,
      )}
      {...props}
    />
  );
}
