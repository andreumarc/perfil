"use client";

import * as React from "react";
import Link from "next/link";

import { track } from "@/lib/analytics/track";
import type { EventProps, EventType } from "@/lib/analytics/events";

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: string;
  event: EventType;
  props?: EventProps;
  /** Fuerza <a> nativo (enlaces externos, mailto, tel). */
  external?: boolean;
};

/**
 * Enlace que registra un evento de analítica al hacer clic.
 * Detecta automáticamente enlaces externos, mailto: y tel:.
 */
export function TrackedLink({ href, event, props, external, children, onClick, ...rest }: Props) {
  const isExternal =
    external ?? (/^https?:\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:"));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    track(event, { href, ...props });
    onClick?.(e);
  };

  if (isExternal) {
    const { prefetch: _prefetch, replace: _replace, scroll: _scroll, ...anchorRest } = rest as Record<string, unknown>;
    void _prefetch;
    void _replace;
    void _scroll;
    return (
      <a
        href={href}
        onClick={handleClick}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...(anchorRest as React.ComponentProps<"a">)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
