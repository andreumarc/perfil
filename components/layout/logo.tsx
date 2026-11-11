import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Logo horizontal de Mardari (icono + wordmark), en PNG con fondo transparente. */
const LOGO_SRC = {
  light: "/images/logo/mardari.png",
  dark: "/images/logo/mardari-blanco.png",
} as const;

/** Dimensiones reales del PNG; la altura visible la fija la clase `h-*`. */
const LOGO_WIDTH = 1097;
const LOGO_HEIGHT = 256;

/**
 * Marca: imagen del logo con un descriptor opcional (p. ej. «Panel» en el administrador).
 * `tone="dark"` usa la versión con el wordmark en blanco para fondos oscuros.
 */
export function Logo({
  name,
  tagline,
  tone = "light",
  className,
  href = "/",
  priority = false,
}: {
  name: string;
  tagline?: string;
  tone?: "light" | "dark";
  className?: string;
  href?: string;
  priority?: boolean;
}) {
  return (
    <Link href={href} aria-label={`${name} — inicio`} className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={LOGO_SRC[tone]}
        alt=""
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        sizes="(min-width: 768px) 200px, 172px"
        priority={priority}
        className="h-10 w-auto md:h-[46px]"
      />
      {tagline ? (
        <span
          className={cn(
            "border-l pl-3 text-[10px] font-semibold uppercase tracking-[0.18em]",
            tone === "light" ? "border-gray-200 text-gray-500" : "border-white/25 text-ink-200",
          )}
        >
          {tagline}
        </span>
      ) : null}
    </Link>
  );
}
