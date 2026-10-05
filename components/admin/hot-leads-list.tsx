import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { ScorePill, StatusBadge } from "@/components/admin/badges";
import { EmptyHint } from "@/components/admin/section-card";
import type { Lead } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { JOB_TITLES, NUMBER_LOCATIONS, labelFor } from "@/types/lead";

/** Lista de HOT leads abiertos (NEW / CONTACTED): los que hay que llamar hoy. */
export function HotLeadsList({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return <EmptyHint>No hay HOT leads pendientes de contactar.</EmptyHint>;
  }

  return (
    <ul className="divide-y divide-gray-200">
      {leads.map((lead) => (
        <li key={lead.id}>
          <Link
            href={`/admin/leads/${lead.id}`}
            className="group flex items-center gap-4 py-3 transition-colors hover:bg-navy-50/60 -mx-2 px-2 rounded-md"
          >
            <ScorePill score={lead.score} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy-900">{lead.company}</p>
              <p className="truncate text-xs text-gray-500">
                {lead.firstName} {lead.lastName} · {labelFor(JOB_TITLES, lead.jobTitle)}
                {lead.numberLocations ? ` · ${labelFor(NUMBER_LOCATIONS, lead.numberLocations)}` : ""}
              </p>
            </div>
            <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
              <StatusBadge status={lead.status} />
              <span className="tabular text-[11px] text-gray-400">{formatDate(lead.createdAt)}</span>
            </div>
            <ArrowRightIcon
              className="size-4 shrink-0 text-gray-300 transition-colors group-hover:text-navy-900"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
