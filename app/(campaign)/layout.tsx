import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { site } from "@/lib/site";

/**
 * Layout minimalista para landings de campaña (LinkedIn Ads):
 * sin navegación compleja, un único objetivo de conversión.
 */
export default function CampaignLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <Container size="wide" className="flex h-16 items-center justify-between">
          <Logo />
          <span className="hidden text-xs font-medium uppercase tracking-[0.14em] text-gray-500 sm:inline">
            Diagnóstico gratuito · 3 minutos
          </span>
        </Container>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <Container size="wide" className="flex flex-col gap-2 py-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.location}
          </p>
          <nav className="flex gap-4">
            <Link href="/legal" className="hover:text-navy-900">
              Aviso legal
            </Link>
            <Link href="/politica-privacidad" className="hover:text-navy-900">
              Privacidad
            </Link>
            <Link href="/cookies" className="hover:text-navy-900">
              Cookies
            </Link>
          </nav>
        </Container>
      </footer>
    </>
  );
}
