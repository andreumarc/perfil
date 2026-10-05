import { CheckIcon } from "lucide-react";

import { TrackedLink } from "@/components/analytics/tracked-link";
import { CampaignAttribution } from "@/components/campaign/campaign-attribution";
import { CampaignHeroCta } from "@/components/campaign/campaign-hero-cta";
import { DiagnosticWizard } from "@/components/diagnostic/diagnostic-wizard";
import { Container } from "@/components/layout/container";
import { credentials, meetingHref, site } from "@/lib/site";

export interface CampaignLandingProps {
  /** Identificador de campaña para la atribución (utm_campaign por defecto). */
  campaign: string;
  eyebrow: string;
  title: string;
  description: string;
  problemsTitle?: string;
  problems: readonly [string, string, string];
  outcomes: readonly [string, string, string];
}

/**
 * Landing de campaña LinkedIn: hero compacto con un único objetivo, tres
 * síntomas, qué se obtiene y el Diagnóstico Multisite embebido. Sin navegación.
 */
export function CampaignLanding({
  campaign,
  eyebrow,
  title,
  description,
  problemsTitle = "Tres síntomas que vemos en redes como la tuya",
  problems,
  outcomes,
}: CampaignLandingProps) {
  const proof = credentials.map((c) => `${c.value}${c.suffix} ${c.label}`);

  return (
    <>
      <CampaignAttribution campaign={campaign} />

      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <Container className="pt-10 pb-12 md:pt-16 md:pb-16">
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="font-display mt-5 text-4xl leading-[1.05] text-navy-900 sm:text-5xl">{title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">{description}</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <CampaignHeroCta />
              <p className="text-sm text-gray-500">3 minutos · 15 preguntas · resultado inmediato</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Síntomas y resultado */}
      <section className="bg-gray-50 py-12 md:py-16">
        <Container>
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-xl font-semibold text-navy-900 md:text-2xl">{problemsTitle}</h2>
              <ol className="mt-6 space-y-4">
                {problems.map((problem, index) => (
                  <li key={problem} className="flex gap-4">
                    <span className="tabular shrink-0 text-sm font-semibold text-signal">0{index + 1}</span>
                    <p className="text-base leading-relaxed text-gray-700">{problem}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy-900 md:text-2xl">Qué obtienes en 3 minutos</h2>
              <ul className="mt-6 space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-base text-gray-700">
                    <CheckIcon className="mt-0.5 size-5 shrink-0 text-signal" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-gray-500">
                Sin coste, sin compromiso. Pedimos tus datos solo al final, para enviarte el resultado.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Diagnóstico embebido */}
      <section id="diagnostico" className="scroll-mt-20 py-12 md:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            <DiagnosticWizard source="linkedin" compact />
          </div>
        </Container>
      </section>

      {/* Credenciales y reunión directa */}
      <section className="border-t border-gray-200 bg-white py-10 md:py-12">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-navy-900">
                {site.name} · {site.role}
              </p>
              <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                {proof.map((point, index) => (
                  <li key={point} className="flex items-center gap-3">
                    {index > 0 ? <span className="text-gray-300">·</span> : null}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <TrackedLink
              href={meetingHref}
              event="meeting_clicked"
              props={{ location: `${campaign}_footer` }}
              className="inline-flex min-h-11 items-center text-base font-semibold text-navy-900 underline-offset-4 hover:underline"
            >
              ¿Prefieres hablar directamente? Reserva 30 minutos
            </TrackedLink>
          </div>
        </Container>
      </section>
    </>
  );
}
