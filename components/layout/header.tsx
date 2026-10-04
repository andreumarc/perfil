import Link from "next/link";

import { Button } from "@/components/ui/button";
import { mainNav, primaryCta } from "@/lib/site";

import { Container } from "./container";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { TrackedLink } from "@/components/analytics/tracked-link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <Container size="wide" className="flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden xl:inline-flex">
            <Link href="/contacto">Contacto</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <TrackedLink href={primaryCta.href} event="cta_clicked" props={{ location: "navbar" }}>
              {primaryCta.label}
            </TrackedLink>
          </Button>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
