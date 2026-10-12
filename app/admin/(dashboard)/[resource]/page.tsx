import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlusIcon } from "lucide-react";

import { ResourceTable } from "@/components/admin/content/resource-table";
import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { SectionCard } from "@/components/admin/section-card";
import { Button } from "@/components/ui/button";
import { EDITORIAL_PLAN } from "@/content/blog";
import { getDb } from "@/db/client";
import { resourceByPath } from "@/lib/admin/resource-meta";
import { leadsPerArticle, listRows } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

type Params = Promise<{ resource: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { resource } = await params;
  const meta = resourceByPath(resource);
  return { title: meta?.plural ?? "Contenido", robots: { index: false, follow: false } };
}

export default async function ResourceListPage({ params, searchParams }: { params: Params; searchParams: Promise<{ q?: string }> }) {
  const { resource } = await params;
  const meta = resourceByPath(resource);
  if (!meta) notFound();
  if (!getDb()) return <EmptyDb />;
  const { q } = await searchParams;

  const [rows, extra] = await Promise.all([listRows(meta.key), meta.key === "articles" ? leadsPerArticle() : Promise.resolve(null)]);
  const query = (q ?? "").trim().toLowerCase();
  const filtered = query ? rows.filter((r) => Object.values(r).some((v) => typeof v === "string" && v.toLowerCase().includes(query))) : rows;
  const extraCounts = extra ? Object.fromEntries(Object.entries(extra).map(([slug, n]) => [slug, { label: "Solicitudes", value: n }])) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title={meta.plural}
        description={meta.description}
        actions={
          <>
            {meta.related?.map((r) => (
              <Button key={r.path} asChild variant="ghost" size="sm">
                <Link href={r.path}>{r.label}</Link>
              </Button>
            ))}
            <Button asChild variant="dark" size="sm">
              <Link href={`/admin/${meta.path}/nuevo`}>
                <PlusIcon aria-hidden />
                Nuevo {meta.singular.toLowerCase()}
              </Link>
            </Button>
          </>
        }
      />

      <form method="get" className="flex max-w-md gap-2">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder={`Buscar en ${meta.plural.toLowerCase()}…`}
          aria-label="Buscar"
          className="h-9 flex-1 rounded-md border border-input bg-white px-3 text-sm"
        />
        <Button type="submit" variant="outline" size="sm">
          Buscar
        </Button>
      </form>

      <ResourceTable meta={meta} rows={filtered} extra={extraCounts} />

      {meta.key === "articles" && EDITORIAL_PLAN.length ? (
        <SectionCard title="Plan editorial" description="Temas con intención de búsqueda pendientes de redactar. No son páginas publicadas.">
          <ul className="divide-y divide-gray-100 text-sm">
            {EDITORIAL_PLAN.map((p) => (
              <li key={p.title} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-ink-900">{p.title}</span>
                <span className="text-xs text-gray-500">
                  {p.keyword} · {p.categorySlug}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      ) : null}
    </div>
  );
}
