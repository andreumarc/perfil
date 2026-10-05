import Link from "next/link";
import { DownloadIcon, ExternalLinkIcon, HeartPulseIcon, LogOutIcon, UsersIcon } from "lucide-react";

import { logoutAction } from "@/actions/auth";
import { ConfigStatusTable, maskEmail, type ConfigItem } from "@/components/admin/config-status-table";
import { PageHeader } from "@/components/admin/page-header";
import { ScoringTables } from "@/components/admin/scoring-tables";
import { SectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { getDb } from "@/db/client";
import { isAdminConfigured } from "@/lib/auth";
import { publicEnv, serverEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

function buildConfigItems(): ConfigItem[] {
  const env = serverEnv();
  return [
    {
      name: "Base de datos (Neon)",
      envVar: "DATABASE_URL",
      configured: Boolean(getDb()),
      hint: "Sin DB no se guardan leads ni eventos. Ver pasos en el panel de cada sección.",
    },
    {
      name: "Email (Resend)",
      envVar: "RESEND_API_KEY · EMAIL_FROM",
      configured: Boolean(env.resendApiKey),
      detail: env.emailFrom,
      hint: "No se envían resultados del diagnóstico ni avisos de nuevo lead.",
    },
    {
      name: "Acceso admin",
      envVar: "ADMIN_EMAIL · ADMIN_PASSWORD · AUTH_SECRET",
      configured: isAdminConfigured(),
      detail: env.adminEmail ? maskEmail(env.adminEmail) : undefined,
      hint: "Sin estas variables no se puede iniciar sesión en el CRM.",
    },
    {
      name: "Reserva de reunión",
      envVar: "NEXT_PUBLIC_BOOKING_URL",
      configured: Boolean(publicEnv.bookingUrl),
      detail: publicEnv.bookingUrl,
      hint: "Los CTAs de reunión llevan al formulario de contacto.",
    },
    {
      name: "Google Analytics 4",
      envVar: "NEXT_PUBLIC_GA_ID",
      configured: Boolean(publicEnv.gaId),
      hint: "No se carga GA4; los eventos solo se guardan en Neon.",
    },
    {
      name: "Meta Pixel",
      envVar: "NEXT_PUBLIC_META_PIXEL_ID",
      configured: Boolean(publicEnv.metaPixelId),
      hint: "Sin retargeting en Meta.",
    },
    {
      name: "LinkedIn Insight Tag",
      envVar: "NEXT_PUBLIC_LINKEDIN_PARTNER_ID",
      configured: Boolean(publicEnv.linkedinPartnerId),
      hint: "Sin medición de conversiones en LinkedIn Ads.",
    },
    {
      name: "URL del sitio",
      envVar: "NEXT_PUBLIC_SITE_URL",
      configured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
      detail: publicEnv.siteUrl,
      hint: `Se usa ${publicEnv.siteUrl} por defecto; define la URL de producción para SEO y emails.`,
    },
  ];
}

const USEFUL_LINKS: { label: string; description: string; href: string; icon: React.ReactNode; external?: boolean; download?: boolean }[] = [
  {
    label: "Estado del sistema",
    description: "/api/health · conexión con Neon e integraciones",
    href: "/api/health",
    icon: <HeartPulseIcon />,
    external: true,
  },
  {
    label: "Exportar leads a CSV",
    description: "/api/admin/leads/export · todos los leads, UTF-8",
    href: "/api/admin/leads/export",
    icon: <DownloadIcon />,
    download: true,
  },
  {
    label: "Gestión de leads",
    description: "Filtros, estados y notas",
    href: "/admin/leads",
    icon: <UsersIcon />,
  },
  {
    label: "Sitio público",
    description: "Ver la web como la ve un CEO",
    href: "/",
    icon: <ExternalLinkIcon />,
    external: true,
  },
];

export default function AdminSettingsPage() {
  const items = buildConfigItems();
  const configuredCount = items.filter((item) => item.configured).length;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Estado de la configuración, reglas del lead scoring y accesos rápidos. Los valores secretos nunca se muestran."
        actions={
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              <LogOutIcon aria-hidden />
              Cerrar sesión
            </Button>
          </form>
        }
      />

      <SectionCard
        title="Estado de la configuración"
        description={`${configuredCount} de ${items.length} integraciones configuradas. Las variables se definen en .env.local y en el hosting.`}
        contentClassName="px-2"
      >
        <ConfigStatusTable items={items} />
      </SectionCard>

      <SectionCard
        title="Lead scoring"
        description="Pesos actuales (escala 0-100) y umbrales que determinan el nivel de cada lead y la alerta HOT."
      >
        <ScoringTables />
      </SectionCard>

      <SectionCard title="Enlaces útiles" description="Herramientas de operación del CRM">
        <ul className="grid gap-3 sm:grid-cols-2">
          {USEFUL_LINKS.map((link) => {
            const content = (
              <>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-navy-50 text-navy-900 [&_svg]:size-4">
                  {link.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-navy-900">{link.label}</span>
                  <span className="block truncate text-xs text-gray-500">{link.description}</span>
                </span>
              </>
            );
            const className =
              "flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-navy-900/30 hover:bg-navy-50/40";
            return (
              <li key={link.href}>
                {link.external || link.download ? (
                  <a
                    href={link.href}
                    className={className}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    download={link.download ? true : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <Link href={link.href} className={className}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </>
  );
}
