import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

import { ContentStatusBadge } from "@/components/admin/badges";
import { StatusToggle } from "@/components/admin/content/status-toggle";
import { EmptyHint } from "@/components/admin/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ResourceMeta } from "@/lib/admin/resource-meta";
import type { ResourceRow } from "@/lib/admin/resources";
import { formatDateTime } from "@/lib/utils";

function cell(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (value instanceof Date) return formatDateTime(value);
  if (typeof value === "boolean") return value ? "Sí" : "No";
  return String(value);
}

export function ResourceTable({ meta, rows, extra }: { meta: ResourceMeta; rows: ResourceRow[]; extra?: Record<string, { label: string; value: string | number }> }) {
  if (!rows.length) return <EmptyHint>Todavía no hay elementos. Crea el primero o ejecuta `npm run db:seed` para cargar el contenido inicial.</EmptyHint>;
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {meta.listColumns.map((c) => (
              <TableHead key={c.name}>{c.label}</TableHead>
            ))}
            {extra ? <TableHead>Solicitudes</TableHead> : null}
            {meta.hasStatus ? <TableHead>Estado</TableHead> : null}
            <TableHead>Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const status = row.status as "draft" | "published" | undefined;
            const slug = meta.slugField ? String(row[meta.slugField] ?? "") : "";
            const publicUrl = meta.publicPrefix && slug && status === "published" ? `${meta.publicPrefix}${slug}` : null;
            const ex = extra && slug ? extra[slug] : undefined;
            return (
              <TableRow key={row.id}>
                {meta.listColumns.map((c, i) => (
                  <TableCell key={c.name} className={i === 0 ? "max-w-[28rem]" : "text-gray-600"}>
                    {i === 0 ? (
                      <Link href={`/admin/${meta.path}/${row.id}`} className="font-medium text-ink-900 hover:underline">
                        {cell(row[c.name])}
                      </Link>
                    ) : (
                      <span className={c.name.toLowerCase().includes("slug") ? "font-mono text-xs" : undefined}>{cell(row[c.name])}</span>
                    )}
                  </TableCell>
                ))}
                {extra ? (
                  <TableCell>
                    <Badge variant={ex && Number(ex.value) > 0 ? "copper" : "muted"}>{ex ? ex.value : 0}</Badge>
                  </TableCell>
                ) : null}
                {meta.hasStatus ? <TableCell>{status ? <ContentStatusBadge status={status} /> : "—"}</TableCell> : null}
                <TableCell className="tabular text-gray-600">{row.updatedAt instanceof Date ? formatDateTime(row.updatedAt) : "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {meta.hasStatus && status ? <StatusToggle resource={meta.key} id={row.id} status={status} /> : null}
                    {publicUrl ? (
                      <Button asChild size="sm" variant="ghost">
                        <a href={publicUrl} target="_blank" rel="noopener noreferrer" aria-label="Ver en el sitio">
                          <ExternalLinkIcon aria-hidden />
                        </a>
                      </Button>
                    ) : null}
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/${meta.path}/${row.id}`}>Editar</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
