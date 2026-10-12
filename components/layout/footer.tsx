import Link from "next/link";
import { MailIcon, MapPinIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { OpenCookieSettingsButton } from "@/components/analytics/cookie-banner";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { formatPhone, telHref, whatsappHref } from "@/lib/phone";
import type { SiteSettings } from "@/lib/validation/settings";

import { Container } from "./container";
import { Logo } from "./logo";

export function Footer({ settings }: { settings: SiteSettings }) {
  const { company, menus } = settings;
  const year = new Date().getFullYear();
  const phoneHref = telHref(company.phone);
  const waHref = whatsappHref(company.whatsapp, company.whatsappMessage);
  const address = [company.address, [company.postalCode, company.city].filter(Boolean).join(" "), company.province]
    .filter(Boolean)
    .join(" · ");
  const socials = Object.entries(company.socials).filter(([, url]) => Boolean(url)) as [string, string][];

  return (
    <footer className="border-t border-gray-200 bg-white pb-24 md:pb-0">
      <Container size="wide" className="py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Logo name={company.name} tagline={company.tagline} />
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{settings.seo.defaultDescription}</p>
            <ul className="mt-6 space-y-2.5 text-sm text-gray-600">
              {phoneHref ? (
                <li>
                  <TrackedLink href={phoneHref} event="phone_clicked" props={{ location: "footer" }} className="inline-flex items-center gap-2 hover:text-ink-900">
                    <PhoneIcon className="size-4 text-copper-500" aria-hidden />
                    <span className="tabular">{formatPhone(company.phone)}</span>
                  </TrackedLink>
                </li>
              ) : null}
              {waHref ? (
                <li>
                  <TrackedLink href={waHref} event="whatsapp_clicked" props={{ location: "footer" }} className="inline-flex items-center gap-2 hover:text-ink-900">
                    <MessageCircleIcon className="size-4 text-copper-500" aria-hidden />
                    WhatsApp
                  </TrackedLink>
                </li>
              ) : null}
              {company.email ? (
                <li>
                  <TrackedLink href={`mailto:${company.email}`} event="email_clicked" props={{ location: "footer" }} className="inline-flex items-center gap-2 hover:text-ink-900">
                    <MailIcon className="size-4 text-copper-500" aria-hidden />
                    {company.email}
                  </TrackedLink>
                </li>
              ) : null}
              {address ? (
                <li className="flex items-start gap-2">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-copper-500" aria-hidden />
                  <span>{address}</span>
                </li>
              ) : null}
              {company.hours ? <li className="pl-6 text-gray-500">{company.hours}</li> : null}
            </ul>
            {company.zones.length ? (
              <p className="mt-5 text-xs text-gray-500">
                Zonas de actuación: {company.zones.join(", ")}.{" "}
                <Link href="/zonas" className="underline underline-offset-4 hover:text-ink-900">
                  Ver zonas
                </Link>
              </p>
            ) : null}
          </div>

          {menus.footer.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-gray-600 transition-colors hover:text-ink-900">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {socials.map(([name, url]) => (
              <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-ink-900">
                {name}
              </a>
            ))}
            <OpenCookieSettingsButton className="underline underline-offset-4 hover:text-ink-900" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
