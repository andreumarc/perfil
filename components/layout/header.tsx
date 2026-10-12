import { ArrowRightIcon, PhoneIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { Button } from "@/components/ui/button";
import { formatPhone, telHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/validation/settings";

import { Container } from "./container";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";

export function Header({ settings }: { settings: SiteSettings }) {
  const { company, menus } = settings;
  const phoneHref = telHref(company.phone);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <Container size="wide" className="flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <Logo name={company.name} tagline={company.tagline} />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          {menus.main.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {phoneHref ? (
            <TrackedLink
              href={phoneHref}
              event="phone_clicked"
              props={{ location: "navbar" }}
              className="hidden items-center gap-2 rounded-md border border-copper-200 px-3 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-copper-400 hover:bg-copper-50 xl:inline-flex"
            >
              <PhoneIcon className="size-4 text-copper-500" aria-hidden />
              <span className="flex flex-col leading-none">
                <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500">Llámanos</span>
                <span className="tabular mt-0.5">{formatPhone(company.phone)}</span>
              </span>
            </TrackedLink>
          ) : null}
          <Button asChild size="sm" className="hidden md:inline-flex">
            <TrackedLink href="/presupuesto" event="cta_clicked" props={{ location: "navbar" }}>
              Pedir presupuesto
              <ArrowRightIcon aria-hidden />
            </TrackedLink>
          </Button>
          <MobileNav company={company} menus={menus} />
        </div>
      </Container>
    </header>
  );
}
