import type { Metadata } from "next";
import { desc } from "drizzle-orm";

import { EmptyDb } from "@/components/admin/empty-db";
import { MediaManager } from "@/components/admin/media/media-manager";
import { PageHeader } from "@/components/admin/page-header";
import { getDb } from "@/db/client";
import { mediaAssets } from "@/db/schema";
import { isStorageConfigured } from "@/lib/storage/blob";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Medios", robots: { index: false, follow: false } };

function bytes(n: number) {
  return n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaPage() {
  const db = getDb();
  if (!db) return <EmptyDb />;
  const rows = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)).limit(400);
  return (
    <div className="space-y-6">
      <PageHeader title="Biblioteca de medios" description="Imágenes para servicios, sectores, proyectos, artículos y portada. Las ilustrativas se etiquetan en la web; las reales deben ser fotografías propias." />
      <MediaManager
        canUpload={isStorageConfigured("public")}
        items={rows.map((r) => ({ id: r.id, url: r.url, filename: r.filename, alt: r.alt, kind: r.kind, sizeLabel: bytes(r.sizeBytes), createdLabel: formatDate(r.createdAt) }))}
      />
    </div>
  );
}
