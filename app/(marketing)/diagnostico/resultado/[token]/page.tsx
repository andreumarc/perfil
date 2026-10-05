import { notFound } from "next/navigation";

import { ResultView } from "@/components/diagnostic/result-view";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { getLeadByResultToken } from "@/db/queries/leads";
import { calculateDiagnostic } from "@/lib/diagnostic/calculate";
import { RESULT_PAGE_RATE_LIMIT, rateLimit } from "@/lib/rate-limit";
import { getRequestMeta } from "@/lib/request-meta";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

/** Página privada por token: siempre dinámica, nunca indexable. */
export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  title: "Resultado del Diagnóstico Multisite",
  description: "Resultado privado del Diagnóstico Multisite: madurez operativa, bloques prioritarios y acciones recomendadas.",
  path: "/diagnostico/resultado",
  noIndex: true,
});

export default async function DiagnosticResultPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  // Cada visita consulta Neon: límite por IP para evitar sondeos masivos.
  const meta = await getRequestMeta();
  const limit = await rateLimit(`result:${meta.rateKey}`, RESULT_PAGE_RATE_LIMIT);
  if (!limit.ok) notFound();

  const view = await getLeadByResultToken(token);
  if (!view) notFound();

  const { lead } = view;
  // El resultado se recalcula desde las respuestas: fuente de verdad única.
  const answers = Object.fromEntries(view.answers.map((a) => [a.questionId, a.answer]));
  const result = calculateDiagnostic(answers);

  return (
    <>
      <Section size="compact" className="pb-0 md:pb-0">
        <Breadcrumbs
          items={[
            { name: "Diagnóstico Multisite", path: "/diagnostico" },
            { name: "Resultado", path: `/diagnostico/resultado/${token}` },
          ]}
        />
        <div className="mt-8 max-w-3xl">
          <p className="eyebrow">Diagnóstico Multisite</p>
          <h1 className="font-display mt-3 text-3xl leading-[1.1] text-navy-900 sm:text-4xl md:text-[2.75rem]">
            Diagnóstico de {lead.company}
          </h1>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Realizado el {formatDate(lead.createdAt)} · {lead.firstName} {lead.lastName}
          </p>
        </div>
      </Section>

      <Section tone="muted" containerSize="wide" className="mt-12 md:mt-16">
        <div className="mx-auto max-w-5xl">
          <ResultView result={result} firstName={lead.firstName} company={lead.company} resultToken={token} persisted />
        </div>
      </Section>
    </>
  );
}
