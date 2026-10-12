import type { Metadata } from "next";
import { CircleAlertIcon } from "lucide-react";

import { OpenCookieSettingsButton } from "@/components/analytics/cookie-banner";
import { Markdown } from "@/components/content/markdown";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { getSettings } from "@/lib/cms/settings";
import { LEGAL_PAGES, hasPendingPlaceholders, renderLegalBody, type LegalKey } from "@/lib/legal";
import { pageMetadata } from "@/lib/seo";

export async function legalMetadata(key: LegalKey): Promise<Metadata> {
  const s = await getSettings();
  const page = LEGAL_PAGES.find((p) => p.key === key)!;
  const title = s.legalDocs[key].title || page.fallbackTitle;
  return pageMetadata({
    title,
    description: `${title} de ${s.company.name}.`,
    path: page.path,
    siteName: s.company.name,
  });
}

/** Página legal: texto editable desde el panel con marcadores sustituidos por los datos de la empresa. */
export async function LegalPage({ docKey }: { docKey: LegalKey }) {
  const settings = await getSettings();
  const page = LEGAL_PAGES.find((p) => p.key === docKey)!;
  const doc = settings.legalDocs[docKey];
  const title = doc.title || page.fallbackTitle;
  const body = renderLegalBody(settings, doc.body);
  const pending = hasPendingPlaceholders(body);

  return (
    <>
      <section className="border-b border-gray-200 bg-white">
        <Container size="narrow" className="py-10 md:py-14">
          <Breadcrumbs items={[{ name: title, path: page.path }]} />
          <p className="eyebrow mt-6">Información legal</p>
          <h1 className="font-display mt-3 text-3xl text-ink-900 sm:text-4xl">{title}</h1>
          {settings.legal.lastUpdated ? <p className="tabular mt-3 text-sm text-gray-500">Última actualización: {settings.legal.lastUpdated}</p> : null}
        </Container>
      </section>
      <Container size="narrow" className="py-10 md:py-14">
        {pending ? (
          <div className="mb-8 flex gap-3 rounded-md border border-warning/30 bg-warning/5 p-4 text-sm text-gray-700" role="note">
            <CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            <p>Algunos datos de este documento están pendientes de confirmación por la empresa y se completarán desde el panel de administración.</p>
          </div>
        ) : null}
        {body.trim() ? (
          <Markdown content={body} />
        ) : (
          <p className="rounded-md border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-600">Este documento se redacta y publica desde el panel de administración (Ajustes → Textos legales).</p>
        )}
        {docKey === "cookies" ? (
          <div className="mt-10 rounded-lg border border-gray-200 bg-white p-5">
            <p className="text-sm font-semibold text-ink-900">Cambiar tus preferencias de cookies</p>
            <p className="mt-1 text-sm text-gray-600">Puedes aceptar, rechazar o ajustar las categorías de cookies en cualquier momento.</p>
            <OpenCookieSettingsButton className="mt-3 inline-flex h-10 items-center rounded-md border border-ink-900/20 bg-white px-4 text-sm font-medium text-ink-900 hover:bg-gray-100" />
          </div>
        ) : null}
      </Container>
    </>
  );
}
