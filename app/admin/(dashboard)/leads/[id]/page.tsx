import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { z } from "zod";

import { HotBadge, LevelBadge, ScorePill, SourceBadge } from "@/components/admin/badges";
import { ActivityTimeline } from "@/components/admin/leads/activity-timeline";
import { AttributionCard } from "@/components/admin/leads/attribution-card";
import { ContactCard } from "@/components/admin/leads/contact-card";
import { DiagnosticSection } from "@/components/admin/leads/diagnostic-section";
import { NotesPanel, type NoteItem } from "@/components/admin/leads/notes-panel";
import { LEADS_PATH } from "@/components/admin/leads/query-string";
import { ScoreCard } from "@/components/admin/leads/score-card";
import { DeleteLeadButton } from "@/components/admin/leads/delete-lead-button";
import { StatusSelect } from "@/components/admin/leads/status-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getDb } from "@/db/client";
import { getLeadDetail } from "@/db/queries/leads";
import type { DiagnosticAnswers } from "@/lib/diagnostic/calculate";
import { formatDateTime } from "@/lib/utils";
import { JOB_TITLES, labelFor } from "@/types/lead";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detalle de lead · Admin",
  robots: { index: false, follow: false },
};

const idSchema = z.uuid();

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!idSchema.safeParse(id).success) notFound();

  if (!getDb()) {
    return (
      <div className="space-y-6">
        <Alert variant="warning">
          <AlertTitle>Base de datos no configurada (DATABASE_URL)</AlertTitle>
          <AlertDescription>
            <p>
              Ejecuta <code className="font-mono text-xs">npm run db:migrate</code> y{" "}
              <code className="font-mono text-xs">npm run db:seed</code> para activar el CRM.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const detail = await getLeadDetail(id);
  if (!detail) notFound();

  const { lead, result, answers, events, notes } = detail;
  const answersMap: DiagnosticAnswers = Object.fromEntries(answers.map((a) => [a.questionId, a.answer]));
  const noteItems: NoteItem[] = notes.map((n) => ({
    id: n.id,
    note: n.note,
    author: n.author,
    createdAtLabel: formatDateTime(n.createdAt),
  }));
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();

  return (
    <div className="space-y-6">
      <nav aria-label="Migas de pan" className="text-sm text-gray-500">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href={LEADS_PATH} className="hover:text-navy-900 hover:underline">
              Leads
            </Link>
          </li>
          <li aria-hidden>
            <ChevronRight className="size-3.5" />
          </li>
          <li className="truncate font-medium text-navy-900" aria-current="page">
            {lead.company}
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-navy-900 md:text-3xl">{lead.company}</h1>
          <p className="text-sm text-gray-600 md:text-base">
            <span className="font-medium text-navy-900">{fullName}</span>
            <span className="text-gray-400"> · </span>
            {labelFor(JOB_TITLES, lead.jobTitle)}
            <span className="text-gray-400"> · </span>
            <span className="tabular">Creado el {formatDateTime(lead.createdAt)}</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ScorePill score={lead.score} />
            <HotBadge isHot={lead.isHot} />
            <LevelBadge level={lead.leadLevel} />
            <SourceBadge source={lead.source} />
            {lead.utmSource ? (
              <span className="text-xs text-gray-500">utm_source: {lead.utmSource}</span>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:shrink-0 lg:items-end">
          <StatusSelect leadId={lead.id} status={lead.status} />
          <DeleteLeadButton leadId={lead.id} company={lead.company} />
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <ContactCard lead={lead} />
        <ScoreCard lead={lead} answers={answersMap} />
        <AttributionCard lead={lead} />
      </div>

      <DiagnosticSection result={result} answers={answers} message={lead.message} />

      <div className="grid gap-6 lg:grid-cols-2">
        <NotesPanel leadId={lead.id} notes={noteItems} internalNotes={lead.notes} />
        <ActivityTimeline events={events} />
      </div>
    </div>
  );
}
