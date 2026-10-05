import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/db/schema";
import { formatDateTime } from "@/lib/utils";

import { Empty, FieldList } from "./field-list";

function Mono({ value }: { value: string | null | undefined }) {
  if (!value) return <Empty />;
  return <span className="font-mono text-xs break-all text-navy-900">{value}</span>;
}

function Url({ value }: { value: string | null | undefined }) {
  if (!value) return <Empty />;
  const isAbsolute = /^https?:\/\//i.test(value);
  if (!isAbsolute) return <Mono value={value} />;
  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-xs break-all text-navy-700 underline-offset-4 hover:underline"
    >
      {value}
    </a>
  );
}

export function AttributionCard({ lead }: { lead: Lead }) {
  const consent = lead.gdprConsent ? (
    <span>
      <span className="font-medium text-emerald-700">Aceptado</span>
      {lead.consentAt ? <span className="text-gray-500"> · {formatDateTime(lead.consentAt)}</span> : null}
      {lead.consentTextVersion ? <span className="text-gray-500"> · v{lead.consentTextVersion}</span> : null}
    </span>
  ) : (
    <span className="font-medium text-red-700">Sin consentimiento</span>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atribución</CardTitle>
      </CardHeader>
      <CardContent>
        <FieldList
          fields={[
            { label: "utm_source", value: <Mono value={lead.utmSource} /> },
            { label: "utm_medium", value: <Mono value={lead.utmMedium} /> },
            { label: "utm_campaign", value: <Mono value={lead.utmCampaign} /> },
            { label: "utm_content", value: <Mono value={lead.utmContent} /> },
            { label: "utm_term", value: <Mono value={lead.utmTerm} /> },
            { label: "Referrer", value: <Url value={lead.referrer} /> },
            { label: "Landing", value: <Url value={lead.landingPage} /> },
            { label: "Visitor ID", value: <Mono value={lead.visitorId} /> },
            { label: "RGPD", value: consent },
          ]}
        />
      </CardContent>
    </Card>
  );
}
