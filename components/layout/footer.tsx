import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { footerNav, meetingHref, primaryCta, site } from "@/lib/site";

import { Container } from "./container";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-white pb-24 md:pb-0">
      <Container size="wide" className="py-14 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-gray-600">{site.valueProposition}</p>
            <p className="mt-4 text-sm text-gray-500">{site.location}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedLink
                href={primaryCta.href}
                event="cta_clicked"
                props={{ location: "footer" }}
                className="inline-flex h-10 items-center rounded-md bg-navy-900 px-4 text-sm font-medium text-white hover:bg-navy-800"
              >
                {primaryCta.label}
              </TrackedLink>
              {site.linkedinUrl ? (
                <TrackedLink
                  href={site.linkedinUrl}
                  event="linkedin_clicked"
                  props={{ location: "footer" }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md border border-gray-300 px-4 text-sm font-medium text-navy-900 hover:bg-gray-50"
                >
                  LinkedIn <ArrowUpRightIcon className="size-4" />
                </TrackedLink>
              ) : null}
            </div>
          </div>

          <FooterColumn title="Servicios" items={footerNav.servicios} />
          <FooterColumn title="Sectores" items={footerNav.sectores} />
          <FooterColumn title="Recursos" items={footerNav.recursos} />
          <div>
            <FooterColumn title="Legal" items={footerNav.legal} />
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Contacto</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <TrackedLink
                    href={meetingHref}
                    event="meeting_clicked"
                    props={{ location: "footer" }}
                    className="text-gray-600 hover:text-navy-900"
                  >
                    Solicitar sesión de 30 min
                  </TrackedLink>
                </li>
                {site.contactEmail ? (
                  <li>
                    <TrackedLink
                      href={`mailto:${site.contactEmail}`}
                      event="email_clicked"
                      props={{ location: "footer" }}
                      className="text-gray-600 hover:text-navy-900"
                    >
                      {site.contactEmail}
                    </TrackedLink>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Todos los derechos reservados.
          </p>
          <p>Especialista en rendimiento de empresas multicentro · P&amp;L · EBITDA · Integración post-adquisición</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm text-gray-600 transition-colors hover:text-navy-900">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
