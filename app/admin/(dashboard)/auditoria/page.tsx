import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";

import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { EmptyHint } from "@/components/admin/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDb } from "@/db/client";
import { auditLogs } from "@/db/schema";
import { getSession } from "@/lib/auth/guard";
import { formatDateTime, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Auditoría", robots: { index: false, follow: false } };

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");
  const db = getDb();
  if (!db) return <EmptyDb />;
  const { q } = await searchParams;
  const rows = await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(500);
  const query = (q ?? "").trim().toLowerCase();
  const filtered = query ? rows.filter((r) => [r.action, r.entity, r.entityId, r.userEmail].some((v) => v?.toLowerCase().includes(query))) : rows;

  return (
    <div className="space-y-6">
      <PageHeader title="Auditoría" description="Quién hizo qué en el panel: cambios de contenido, ajustes, usuarios, solicitudes y RGPD (últimos 500 registros)." />
      <form method="get" className="flex max-w-md gap-2">
        <input type="search" name="q" defaultValue={q ?? ""} placeholder="Filtrar por acción, entidad o usuario…" aria-label="Filtrar" className="h-9 flex-1 rounded-md border border-input bg-white px-3 text-sm" />
        <button type="submit" className="h-9 rounded-md border border-ink-900/20 bg-white px-3 text-sm font-medium text-ink-900 hover:bg-gray-100">Filtrar</button>
      </form>
      {filtered.length ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="tabular whitespace-nowrap text-gray-600">{formatDateTime(r.createdAt)}</TableCell>
                  <TableCell className="text-ink-900">{r.userEmail ?? "sistema"}</TableCell>
                  <TableCell className="font-mono text-xs">{r.action}</TableCell>
                  <TableCell className="text-gray-600">{r.entity}{r.entityId ? <span className="ml-1 font-mono text-xs text-gray-400">{truncate(r.entityId, 12)}</span> : null}</TableCell>
                  <TableCell className="max-w-md truncate font-mono text-xs text-gray-500" title={JSON.stringify(r.diff)}>{truncate(JSON.stringify(r.diff), 90)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyHint>Sin registros.</EmptyHint>
      )}
    </div>
  );
}
