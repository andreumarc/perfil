import { Badge } from "@/components/ui/badge";
import { LEAD_SOURCE_LABELS, LEAD_STATUS_LABELS, type LeadSource, type LeadStatus } from "@/types/lead";

const STATUS_VARIANT: Record<LeadStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  NEW: "copper",
  CONTACTED: "secondary",
  VISIT_SCHEDULED: "olive",
  QUOTE_SENT: "warning",
  WON: "success",
  LOST: "muted",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{LEAD_STATUS_LABELS[status]}</Badge>;
}

export function SourceBadge({ source }: { source: LeadSource }) {
  return <Badge variant="outline">{LEAD_SOURCE_LABELS[source] ?? source}</Badge>;
}

export function ContentStatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? <Badge variant="success">Publicado</Badge> : <Badge variant="muted">Borrador</Badge>;
}
