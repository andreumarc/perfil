import type { Metadata } from "next";
import Link from "next/link";

import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { QueryError, safeQuery } from "@/components/admin/query-error";
import { EmptyHint } from "@/components/admin/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getDb } from "@/db/client";
import { listPendingFollowUps } from "@/db/queries/leads";
import { cn, formatDateTime, isPast } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tareas", robots: { index: false, follow: false } };

export default async function TasksPage() {
  if (!getDb()) return <EmptyDb />;
  const result = await safeQuery(() => listPendingFollowUps(100));
  if (!result.ok) return <QueryError message={result.error} />;
  const rows = result.data;
  return (
    <div className="space-y-6">
      <PageHeader title="Tareas de seguimiento" description="Recordatorios pendientes de todas las solicitudes, ordenados por fecha. Se marcan como hechas desde la ficha de cada solicitud." />
      {rows.length === 0 ? (
        <EmptyHint>No hay tareas pendientes.</EmptyHint>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Fecha</TableHead>
                <TableHead>Tarea</TableHead>
                <TableHead>Solicitud</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const overdue = isPast(r.followUp.dueAt);
                return (
                  <TableRow key={r.followUp.id}>
                    <TableCell className={cn("tabular", overdue ? "font-medium text-red-700" : "text-gray-700")}>{formatDateTime(r.followUp.dueAt)}{overdue ? " · vencida" : ""}</TableCell>
                    <TableCell className="font-medium text-ink-900">{r.followUp.title}</TableCell>
                    <TableCell><Link href={`/admin/leads/${r.leadId}`} className="text-copper-600 hover:underline">{r.leadName}</Link></TableCell>
                    <TableCell className="text-gray-700">{r.assigneeName ?? <span className="text-gray-400">Sin asignar</span>}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
