import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeadEvent } from "@/db/schema";
import { EVENT_LABELS, type EventType } from "@/lib/analytics/events";
import { formatDateTime, truncate } from "@/lib/utils";

const MAX_EVENTS = 50;
const MAX_CHIPS = 6;

function eventLabel(type: string): string {
  return (EVENT_LABELS as Record<string, string>)[type] ?? type;
}

function isEventType(type: string): type is EventType {
  return type in EVENT_LABELS;
}

/** Convierte el jsonb de metadata en chips "clave: valor" legibles. */
function metadataChips(metadata: unknown): { key: string; value: string }[] {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return [];
  const chips: { key: string; value: string }[] = [];
  for (const [key, raw] of Object.entries(metadata as Record<string, unknown>)) {
    if (raw === null || raw === undefined || raw === "") continue;
    let value: string;
    if (typeof raw === "string") value = raw;
    else if (typeof raw === "number" || typeof raw === "boolean") value = String(raw);
    else value = JSON.stringify(raw);
    chips.push({ key, value: truncate(value, 60) });
    if (chips.length >= MAX_CHIPS) break;
  }
  return chips;
}

const DOT_TONE: Partial<Record<EventType, string>> = {
  lead_created: "bg-navy-900",
  diagnostic_completed: "bg-signal",
  meeting_clicked: "bg-signal",
  contact_clicked: "bg-signal",
  email_clicked: "bg-signal",
  diagnostic_started: "bg-navy-400",
  page_view: "bg-gray-300",
};

export function ActivityTimeline({ events }: { events: LeadEvent[] }) {
  const visible = events.slice(0, MAX_EVENTS);
  const hidden = events.length - visible.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad</CardTitle>
        <CardDescription>
          {events.length === 0
            ? "Sin eventos registrados para este lead."
            : `${visible.length} evento${visible.length === 1 ? "" : "s"}${hidden > 0 ? ` · ${hidden} más no mostrados` : ""}`}
        </CardDescription>
      </CardHeader>
      {visible.length > 0 ? (
        <CardContent>
          <ol className="relative space-y-5 border-l border-gray-200 pl-5">
            {visible.map((event) => {
              const tone = isEventType(event.eventType) ? DOT_TONE[event.eventType] ?? "bg-navy-300" : "bg-gray-300";
              const chips = metadataChips(event.metadata);
              return (
                <li key={event.id} className="relative">
                  <span
                    className={`absolute top-1.5 -left-[25px] size-2.5 rounded-full ring-4 ring-white ${tone}`}
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="text-sm font-medium text-navy-900">{eventLabel(event.eventType)}</p>
                    <time dateTime={event.createdAt.toISOString()} className="tabular text-xs text-gray-500">
                      {formatDateTime(event.createdAt)}
                    </time>
                  </div>
                  {event.page ? (
                    <p className="mt-0.5 truncate font-mono text-xs text-gray-500" title={event.page}>
                      {event.page}
                    </p>
                  ) : null}
                  {chips.length > 0 ? (
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {chips.map((chip) => (
                        <li
                          key={chip.key}
                          className="inline-flex max-w-full items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-700"
                        >
                          <span className="text-gray-500">{chip.key}:</span>
                          <span className="truncate font-medium text-navy-900">{chip.value}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </CardContent>
      ) : null}
    </Card>
  );
}
