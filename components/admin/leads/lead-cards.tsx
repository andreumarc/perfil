import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/db/schema";
import { EVENT_LABELS } from "@/lib/analytics/events";
import { formatPhone, telHref, whatsappHref } from "@/lib/phone";
import { formatDateTime, truncate } from "@/lib/utils";
import { BUDGET_RANGES, LEAD_SOURCE_LABELS, PROPERTY_TYPES, TIMELINES, labelFor } from "@/types/lead";

function FieldList({ items }: { items: { label: string; value: React.ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-[minmax(0,9rem)_1fr] gap-x-4 gap-y-2.5 text-sm">
      {items.map((item) => (
        <div key={item.label} className="contents">
          <dt className="text-gray-500">{item.label}</dt>
          <dd className="min-w-0 break-words text-ink-900">{item.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactCard({ lead }: { lead: Lead }) {
  const phone = telHref(lead.phone);
  const wa = whatsappHref(lead.phone);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacto</CardTitle>
        <CardDescription>Datos facilitados en el formulario.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldList
          items={[
            { label: "Nombre", value: lead.name },
            { label: "Email", value: <a href={`mailto:${lead.email}`} className="text-copper-600 hover:underline">{lead.email}</a> },
            {
              label: "Teléfono",
              value: (
                <span className="tabular flex flex-wrap gap-x-3">
                  {phone ? <a href={phone} className="text-copper-600 hover:underline">{formatPhone(lead.phone)}</a> : formatPhone(lead.phone)}
                  {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">WhatsApp</a> : null}
                </span>
              ),
            },
            { label: "Localidad", value: [lead.locality, lead.postalCode].filter(Boolean).join(" · ") || "—" },
            { label: "Consentimientos", value: `Privacidad: ${lead.privacyConsent ? "sí" : "no"} · Marketing: ${lead.marketingConsent ? "sí" : "no"}${lead.consentAt ? ` · ${formatDateTime(lead.consentAt)}` : ""}` },
          ]}
        />
      </CardContent>
    </Card>
  );
}

const CONTEXT_LABELS: Record<string, string> = {
  activity: "Actividad",
  premisesState: "Estado del local",
  installations: "Instalaciones",
  kitchenType: "Tipo de cocina",
  extraction: "Extracción de humos",
  systemType: "Sistema",
  interventionType: "Intervención",
  calculator: "Calculadora",
  calculatorInputs: "Datos del cálculo",
  estimateMin: "Estimación mínima",
  estimateMax: "Estimación máxima",
};

function contextValue(key: string, v: unknown): string {
  if (Array.isArray(v)) return v.join(", ");
  if ((key === "estimateMin" || key === "estimateMax") && typeof v === "number") return `${new Intl.NumberFormat("es-ES").format(v)} € (sin IVA)`;
  return String(v);
}

export function ProjectCard({ lead, serviceName, sectorName }: { lead: Lead; serviceName?: string; sectorName?: string }) {
  const context = Object.entries((lead.context ?? {}) as Record<string, unknown>).filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyecto</CardTitle>
        <CardDescription>Qué quiere reformar y en qué condiciones.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldList
          items={[
            { label: "Servicio", value: serviceName ?? lead.serviceSlug ?? "—" },
            { label: "Sector", value: sectorName ?? lead.sectorSlug ?? "—" },
            { label: "Inmueble", value: labelFor(PROPERTY_TYPES, lead.propertyType) },
            { label: "Superficie", value: lead.squareMeters ? `${lead.squareMeters} m²` : "—" },
            { label: "Presupuesto", value: labelFor(BUDGET_RANGES, lead.budgetRange) },
            { label: "Fecha prevista", value: labelFor(TIMELINES, lead.timeline) },
            ...context.map(([k, v]) => ({ label: CONTEXT_LABELS[k] ?? k, value: contextValue(k, v) })),
          ]}
        />
        {lead.message ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Descripción</p>
            <p className="mt-1.5 rounded-md bg-gray-50 p-3 text-sm whitespace-pre-wrap text-ink-900">{lead.message}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AttributionCard({ lead }: { lead: Lead }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Origen</CardTitle>
        <CardDescription>De dónde viene la solicitud.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldList
          items={[
            { label: "Formulario", value: LEAD_SOURCE_LABELS[lead.source] ?? lead.source },
            { label: "Página", value: lead.sourcePage ?? "—" },
            { label: "Artículo", value: lead.articleSlug ?? "—" },
            { label: "UTM", value: [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "directo" },
            { label: "Referrer", value: lead.referrer ? truncate(lead.referrer, 80) : "—" },
            { label: "Dispositivo", value: [lead.device, lead.country].filter(Boolean).join(" · ") || "—" },
            { label: "Recibida", value: formatDateTime(lead.createdAt) },
          ]}
        />
      </CardContent>
    </Card>
  );
}

export function EventsTimeline({ events }: { events: { id: string; eventType: string; page: string | null; createdAt: Date; metadata: unknown }[] }) {
  if (!events.length) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Navegación previa</CardTitle>
        <CardDescription>Eventos de analítica asociados a este visitante.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2 text-sm">
          {events.slice(0, 40).map((e) => (
            <li key={e.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <span className="tabular text-xs text-gray-500">{formatDateTime(e.createdAt)}</span>
              <span className="font-medium text-ink-900">{(EVENT_LABELS as Record<string, string>)[e.eventType] ?? e.eventType}</span>
              {e.page ? <span className="truncate text-gray-500">{e.page}</span> : null}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
