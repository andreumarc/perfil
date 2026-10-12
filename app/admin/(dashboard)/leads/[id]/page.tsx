import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, PaperclipIcon } from "lucide-react";
import { z } from "zod";

import { SourceBadge } from "@/components/admin/badges";
import { ActivityPanel, type ActivityItem } from "@/components/admin/leads/activity-panel";
import { AssignSelect } from "@/components/admin/leads/assign-select";
import { DeleteLeadButton } from "@/components/admin/leads/delete-lead-button";
import { FollowUpsPanel, type FollowUpItem } from "@/components/admin/leads/follow-ups-panel";
import { AttributionCard, ContactCard, EventsTimeline, ProjectCard } from "@/components/admin/leads/lead-cards";
import { LEADS_PATH } from "@/components/admin/leads/query-string";
import { StatusSelect } from "@/components/admin/leads/status-select";
import { EmptyDb } from "@/components/admin/empty-db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES } from "@/content/services";
import { SECTORS } from "@/content/sectors";
import { getDb } from "@/db/client";
import { getLeadDetail } from "@/db/queries/leads";
import { getSession } from "@/lib/auth/guard";
import { listUsers } from "@/lib/auth/users";
import { formatDateTime, isPast } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Detalle de solicitud", robots: { index: false, follow: false } };

const idSchema = z.uuid();

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();
  if (!getDb()) return <EmptyDb />;

  const [detail, users, session] = await Promise.all([getLeadDetail(id), listUsers(), getSession()]);
  if (!detail) notFound();
  const { lead, activities, attachments, followUps, events } = detail;
  const serviceName = lead.serviceSlug ? SERVICES.find((s) => s.slug === lead.serviceSlug)?.name : undefined;
  const sectorName = lead.sectorSlug ? SECTORS.find((s) => s.slug === lead.sectorSlug)?.name : undefined;
  const activityItems: ActivityItem[] = activities.map((a) => ({
    id: a.id,
    type: a.type,
    payload: (a.payload ?? {}) as Record<string, unknown>,
    userName: a.userName,
    createdAtLabel: formatDateTime(a.createdAt),
  }));
  const followUpItems: FollowUpItem[] = followUps.map((t) => ({
    id: t.id,
    title: t.title,
    dueAtLabel: formatDateTime(t.dueAt),
    overdue: isPast(t.dueAt),
    done: t.done,
    assigneeName: t.assigneeName,
  }));

  return (
    <div className="space-y-6">
      <nav aria-label="Migas de pan" className="text-sm text-gray-500">
        <ol className="flex items-center gap-1.5">
          <li><Link href={LEADS_PATH} className="hover:text-ink-900 hover:underline">Solicitudes</Link></li>
          <li aria-hidden><ChevronRight className="size-3.5" /></li>
          <li className="truncate font-medium text-ink-900" aria-current="page">{lead.name}</li>
        </ol>
      </nav>

      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">{lead.name}</h1>
          <p className="text-sm text-gray-600 md:text-base">
            {serviceName ?? "Sin servicio indicado"}
            {lead.locality ? <><span className="text-gray-400"> · </span>{lead.locality}</> : null}
            <span className="text-gray-400"> · </span>
            <span className="tabular">Recibida el {formatDateTime(lead.createdAt)}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge source={lead.source} />
            {lead.utmSource ? <span className="text-xs text-gray-500">utm_source: {lead.utmSource}</span> : null}
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:shrink-0 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <StatusSelect leadId={lead.id} status={lead.status} />
            <AssignSelect leadId={lead.id} assignedTo={lead.assignedTo} users={users.filter((u) => u.isActive).map((u) => ({ id: u.id, name: u.name }))} />
          </div>
          {session?.role === "admin" ? <DeleteLeadButton leadId={lead.id} name={lead.name} /> : null}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <ContactCard lead={lead} />
        <ProjectCard lead={lead} serviceName={serviceName} sectorName={sectorName} />
        <AttributionCard lead={lead} />
      </div>

      {attachments.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Adjuntos</CardTitle>
            <CardDescription>Archivos enviados con la solicitud. Solo accesibles con sesión del panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-gray-200">
              {attachments.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2"><PaperclipIcon className="size-4 shrink-0 text-gray-400" aria-hidden /><span className="truncate">{a.filename}</span></span>
                  <span className="flex shrink-0 items-center gap-3 text-xs text-gray-500">
                    {formatBytes(a.sizeBytes)}
                    <a href={`/api/admin/attachments/${a.id}`} className="font-medium text-copper-600 hover:underline">Descargar</a>
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityPanel leadId={lead.id} activities={activityItems} internalNotes={lead.internalNotes} />
        <div className="space-y-6">
          <FollowUpsPanel leadId={lead.id} items={followUpItems} />
          <EventsTimeline events={events} />
        </div>
      </div>
    </div>
  );
}
