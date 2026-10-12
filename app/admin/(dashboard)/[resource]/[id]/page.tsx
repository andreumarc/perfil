import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";

import { ContentStatusBadge } from "@/components/admin/badges";
import { ResourceForm } from "@/components/admin/content/resource-form";
import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { getDb } from "@/db/client";
import { loadMediaOptions, loadOptionSets } from "@/lib/admin/options";
import { emptyValues, resourceByPath } from "@/lib/admin/resource-meta";
import { getRow, rowToForm } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

type Params = Promise<{ resource: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { resource } = await params;
  const meta = resourceByPath(resource);
  return { title: meta ? `Editar ${meta.singular.toLowerCase()}` : "Editar", robots: { index: false, follow: false } };
}

export default async function EditResourcePage({ params }: { params: Params }) {
  const { resource, id } = await params;
  const meta = resourceByPath(resource);
  if (!meta || !z.uuid().safeParse(id).success) notFound();
  if (!getDb()) return <EmptyDb />;
  const [row, optionSets, mediaOptions] = await Promise.all([getRow(meta.key, id), loadOptionSets(), loadMediaOptions()]);
  if (!row) notFound();
  const initial = { ...emptyValues(meta), ...rowToForm(meta.key, row) };
  const slug = meta.slugField ? String(row[meta.slugField] ?? "") : "";
  const status = row.status as "draft" | "published" | undefined;
  const publicUrl = meta.publicPrefix && slug && status === "published" ? `${meta.publicPrefix}${slug}` : undefined;
  return (
    <div className="space-y-6">
      <PageHeader title={String(row[meta.titleField] ?? meta.singular)} description={status ? <ContentStatusBadge status={status} /> : undefined} />
      <ResourceForm meta={meta} id={id} initial={initial} optionSets={optionSets} mediaOptions={mediaOptions} backHref={`/admin/${meta.path}`} publicUrl={publicUrl} />
    </div>
  );
}
