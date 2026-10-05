import { Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lead } from "@/db/schema";
import { COMPANY_REVENUE, JOB_TITLES, MAIN_PROBLEMS, NUMBER_LOCATIONS, SECTORS, labelFor } from "@/types/lead";

import { Empty, FieldList } from "./field-list";

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Móvil",
  tablet: "Tablet",
  desktop: "Escritorio",
};

export function ContactCard({ lead }: { lead: Lead }) {
  const subject = encodeURIComponent(`Tu diagnóstico Multisite — ${lead.company}`);
  const mailHref = `mailto:${lead.email}?subject=${subject}`;
  const locationLine = [lead.country, lead.device ? DEVICE_LABELS[lead.device] ?? lead.device : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <FieldList
          fields={[
            {
              label: "Email",
              value: (
                <a href={`mailto:${lead.email}`} className="text-navy-700 underline-offset-4 hover:underline">
                  {lead.email}
                </a>
              ),
            },
            {
              label: "Teléfono",
              value: lead.phone ? (
                <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className="text-navy-700 underline-offset-4 hover:underline">
                  {lead.phone}
                </a>
              ) : (
                <Empty />
              ),
            },
            { label: "Empresa", value: lead.company },
            { label: "Cargo", value: labelFor(JOB_TITLES, lead.jobTitle) },
            { label: "Sector", value: labelFor(SECTORS, lead.sector) },
            { label: "Centros", value: <span className="tabular">{labelFor(NUMBER_LOCATIONS, lead.numberLocations)}</span> },
            { label: "Facturación", value: <span className="tabular">{labelFor(COMPANY_REVENUE, lead.companyRevenue)}</span> },
            { label: "Problema", value: labelFor(MAIN_PROBLEMS, lead.mainProblem) },
            { label: "País / disp.", value: locationLine || <Empty /> },
          ]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <a href={mailHref}>
              <Mail className="size-4" aria-hidden />
              Enviar email
            </a>
          </Button>
          {lead.phone ? (
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${lead.phone.replace(/\s+/g, "")}`}>
                <Phone className="size-4" aria-hidden />
                Llamar
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
