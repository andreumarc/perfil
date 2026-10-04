import { Badge } from "@/components/ui/badge";
import {
  LEAD_LEVEL_LABELS,
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_LABELS,
  type LeadLevel,
  type LeadSource,
  type LeadStatus,
} from "@/types/lead";

const STATUS_VARIANT: Record<LeadStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  NEW: "secondary",
  CONTACTED: "outline",
  MEETING: "signal",
  PROPOSAL: "warning",
  WON: "success",
  LOST: "muted",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{LEAD_STATUS_LABELS[status]}</Badge>;
}

const LEVEL_VARIANT: Record<LeadLevel, React.ComponentProps<typeof Badge>["variant"]> = {
  low: "muted",
  medium: "secondary",
  high: "signal",
  strategic: "default",
};

export function LevelBadge({ level }: { level: LeadLevel }) {
  return <Badge variant={LEVEL_VARIANT[level]}>{LEAD_LEVEL_LABELS[level]}</Badge>;
}

export function HotBadge({ isHot }: { isHot: boolean }) {
  if (!isHot) return null;
  return <Badge variant="hot">HOT LEAD</Badge>;
}

export function SourceBadge({ source }: { source: LeadSource }) {
  return <Badge variant="outline">{LEAD_SOURCE_LABELS[source]}</Badge>;
}

/** Puntuación 0-100 con color según nivel. */
export function ScorePill({ score }: { score: number }) {
  const tone =
    score >= 81
      ? "bg-navy-900 text-white"
      : score >= 61
        ? "bg-signal-light text-signal-dark"
        : score >= 31
          ? "bg-navy-50 text-navy-800"
          : "bg-gray-100 text-gray-600";
  return (
    <span className={`tabular inline-flex min-w-10 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ${tone}`}>
      {score}
    </span>
  );
}
