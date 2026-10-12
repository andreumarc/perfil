import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceForm } from "@/components/admin/content/resource-form";
import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { getDb } from "@/db/client";
import { loadMediaOptions, loadOptionSets } from "@/lib/admin/options";
import { emptyValues, resourceByPath } from "@/lib/admin/resource-meta";

export const dynamic = "force-dynamic";

type Params = Promise<{ resource: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { resource } = await params;
  const meta = resourceByPath(resource);
  return { title: meta ? `Nuevo ${meta.singular.toLowerCase()}` : "Nuevo", robots: { index: false, follow: false } };
}

export default async function NewResourcePage({ params }: { params: Params }) {
  const { resource } = await params;
  const meta = resourceByPath(resource);
  if (!meta) notFound();
  if (!getDb()) return <EmptyDb />;
  const [optionSets, mediaOptions] = await Promise.all([loadOptionSets(), loadMediaOptions()]);
  return (
    <div className="space-y-6">
      <PageHeader title={`Nuevo ${meta.singular.toLowerCase()}`} description={meta.description} />
      <ResourceForm meta={meta} id={null} initial={emptyValues(meta)} optionSets={optionSets} mediaOptions={mediaOptions} backHref={`/admin/${meta.path}`} />
    </div>
  );
}
