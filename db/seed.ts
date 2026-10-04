/**
 * Seed de datos de prueba: 20 leads ficticios con diagnósticos, eventos y notas.
 * Uso: npm run db:seed  (requiere DATABASE_URL en .env)
 *
 * Los datos son inventados (empresas y personas no reales) y sirven únicamente
 * para visualizar el dashboard.
 */
import "dotenv/config";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { randomBytes } from "node:crypto";

import { calculateDiagnostic, pointsForAnswer } from "@/lib/diagnostic/calculate";
import { QUESTIONS } from "@/lib/diagnostic/questions";
import { scoreLead } from "@/lib/lead-scoring";
import type { JobTitle, LeadStatus, MainProblem, Sector } from "@/types/lead";

import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL no definida. Copia .env.example a .env y rellénala.");
  process.exit(1);
}

const db = drizzle({ client: neon(url), schema });

/* ------------------------------------------------------------------ */
/* Generador determinista (misma semilla → mismos datos)               */
/* ------------------------------------------------------------------ */
let seed = 20260101;
function rand() {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function daysAgo(days: number, hourJitter = true) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  if (hourJitter) d.setHours(8 + Math.floor(rand() * 11), Math.floor(rand() * 60), 0, 0);
  return d;
}

interface SeedLead {
  firstName: string;
  lastName: string;
  company: string;
  domain: string;
  jobTitle: JobTitle;
  sector: Sector;
  numberLocations: "1" | "2-5" | "6-10" | "11-25" | "26-50" | "50+";
  companyRevenue: "<1M" | "1-5M" | "5-10M" | "10-25M" | "25-50M" | "50M+";
  mainProblem: MainProblem;
  status: LeadStatus;
  source: "diagnostic" | "contact" | "calculator" | "linkedin";
  utm?: { source: string; medium: string; campaign: string };
  daysAgo: number;
  /** Perfil de madurez: low → respuestas negativas, high → positivas. */
  maturity: "low" | "mid" | "high";
}

const SEED_LEADS: SeedLead[] = [
  { firstName: "Laura", lastName: "Vidal Pons", company: "Grupo Dental Levante", domain: "dentallevante-ejemplo.es", jobTitle: "ceo", sector: "dental", numberLocations: "11-25", companyRevenue: "10-25M", mainProblem: "rentabilidad", status: "MEETING", source: "diagnostic", utm: { source: "linkedin", medium: "paid_social", campaign: "multisite-q4" }, daysAgo: 2, maturity: "low" },
  { firstName: "Jordi", lastName: "Ferrer Camps", company: "VetNord Clínicas Veterinarias", domain: "vetnord-ejemplo.com", jobTitle: "managing_director", sector: "veterinaria", numberLocations: "6-10", companyRevenue: "5-10M", mainProblem: "kpis", status: "CONTACTED", source: "diagnostic", utm: { source: "google", medium: "organic", campaign: "" }, daysAgo: 4, maturity: "mid" },
  { firstName: "Marta", lastName: "Soler Ruiz", company: "Iberia Health Partners", domain: "ihp-ejemplo.com", jobTitle: "operating_partner", sector: "private_equity", numberLocations: "26-50", companyRevenue: "50M+", mainProblem: "integracion", status: "PROPOSAL", source: "contact", utm: { source: "linkedin", medium: "social", campaign: "pe-value-creation" }, daysAgo: 6, maturity: "mid" },
  { firstName: "Carlos", lastName: "Martín Ibáñez", company: "FisioActiva Centros", domain: "fisioactiva-ejemplo.es", jobTitle: "founder", sector: "healthcare", numberLocations: "2-5", companyRevenue: "1-5M", mainProblem: "crecimiento", status: "NEW", source: "diagnostic", daysAgo: 1, maturity: "low" },
  { firstName: "Elena", lastName: "García Prat", company: "Óptica Visión Grupo", domain: "opticavision-ejemplo.com", jobTitle: "coo", sector: "retail", numberLocations: "26-50", companyRevenue: "25-50M", mainProblem: "procesos", status: "WON", source: "diagnostic", utm: { source: "linkedin", medium: "paid_social", campaign: "multisite-q3" }, daysAgo: 38, maturity: "mid" },
  { firstName: "Pablo", lastName: "Navarro Gil", company: "FitClub Península", domain: "fitclub-ejemplo.es", jobTitle: "cfo", sector: "fitness", numberLocations: "11-25", companyRevenue: "10-25M", mainProblem: "costes", status: "CONTACTED", source: "calculator", utm: { source: "google", medium: "cpc", campaign: "ebitda-calculadora" }, daysAgo: 9, maturity: "mid" },
  { firstName: "Núria", lastName: "Bosch Roca", company: "Sonrisa Capital Dental", domain: "sonrisacapital-ejemplo.com", jobTitle: "investment_director", sector: "private_equity", numberLocations: "50+", companyRevenue: "50M+", mainProblem: "integracion", status: "MEETING", source: "linkedin", utm: { source: "linkedin", medium: "paid_social", campaign: "pe-buy-and-build" }, daysAgo: 12, maturity: "low" },
  { firstName: "Andrés", lastName: "Molina Serra", company: "AutoTaller Red Ibérica", domain: "autotallerred-ejemplo.es", jobTitle: "area_manager", sector: "automocion", numberLocations: "6-10", companyRevenue: "5-10M", mainProblem: "equipos", status: "NEW", source: "diagnostic", daysAgo: 3, maturity: "low" },
  { firstName: "Isabel", lastName: "Romero Díaz", company: "Residencias Mediterráneo", domain: "resmed-ejemplo.com", jobTitle: "managing_director", sector: "healthcare", numberLocations: "11-25", companyRevenue: "25-50M", mainProblem: "rentabilidad", status: "LOST", source: "contact", daysAgo: 55, maturity: "mid" },
  { firstName: "Sergi", lastName: "Puig Vila", company: "Franquicias Café & Co", domain: "cafeco-ejemplo.es", jobTitle: "founder", sector: "franquicias", numberLocations: "26-50", companyRevenue: "10-25M", mainProblem: "expansion", status: "NEW", source: "diagnostic", utm: { source: "newsletter", medium: "email", campaign: "insights-octubre" }, daysAgo: 5, maturity: "mid" },
  { firstName: "Cristina", lastName: "López Mena", company: "Clínicas Capilares Nova", domain: "capilaresnova-ejemplo.com", jobTitle: "ceo", sector: "healthcare", numberLocations: "6-10", companyRevenue: "5-10M", mainProblem: "kpis", status: "CONTACTED", source: "diagnostic", utm: { source: "linkedin", medium: "social", campaign: "" }, daysAgo: 15, maturity: "low" },
  { firstName: "Miguel", lastName: "Ortega Sanz", company: "Grupo Restauración Sur", domain: "grsur-ejemplo.es", jobTitle: "coo", sector: "restauracion", numberLocations: "11-25", companyRevenue: "10-25M", mainProblem: "costes", status: "NEW", source: "calculator", daysAgo: 7, maturity: "mid" },
  { firstName: "Anna", lastName: "Casals Mir", company: "Audiología Clara", domain: "audioclara-ejemplo.com", jobTitle: "managing_director", sector: "healthcare", numberLocations: "2-5", companyRevenue: "1-5M", mainProblem: "crecimiento", status: "NEW", source: "diagnostic", daysAgo: 20, maturity: "high" },
  { firstName: "David", lastName: "Herrera Cano", company: "Vetcare Iberia", domain: "vetcare-ejemplo.es", jobTitle: "operations_director", sector: "veterinaria", numberLocations: "26-50", companyRevenue: "25-50M", mainProblem: "procesos", status: "PROPOSAL", source: "diagnostic", utm: { source: "linkedin", medium: "paid_social", campaign: "healthcare-ops" }, daysAgo: 24, maturity: "low" },
  { firstName: "Raquel", lastName: "Jiménez Toro", company: "Academias Idiomas Plus", domain: "idiomasplus-ejemplo.es", jobTitle: "ceo", sector: "otros", numberLocations: "11-25", companyRevenue: "5-10M", mainProblem: "equipos", status: "CONTACTED", source: "diagnostic", utm: { source: "google", medium: "organic", campaign: "" }, daysAgo: 30, maturity: "mid" },
  { firstName: "Xavier", lastName: "Riera Bou", company: "Alpha Growth Partners", domain: "alphagp-ejemplo.com", jobTitle: "portfolio_manager", sector: "private_equity", numberLocations: "11-25", companyRevenue: "25-50M", mainProblem: "rentabilidad", status: "MEETING", source: "contact", utm: { source: "referral", medium: "referral", campaign: "" }, daysAgo: 17, maturity: "mid" },
  { firstName: "Beatriz", lastName: "Alonso Vega", company: "Estética Avanzada Grupo", domain: "esteticaavanzada-ejemplo.es", jobTitle: "founder", sector: "healthcare", numberLocations: "6-10", companyRevenue: "1-5M", mainProblem: "rentabilidad", status: "NEW", source: "linkedin", utm: { source: "linkedin", medium: "paid_social", campaign: "multisite-q4" }, daysAgo: 1, maturity: "low" },
  { firstName: "Tomás", lastName: "Blanco Ruiz", company: "Gimnasios Urban Fit", domain: "urbanfit-ejemplo.com", jobTitle: "area_manager", sector: "fitness", numberLocations: "2-5", companyRevenue: "<1M", mainProblem: "crecimiento", status: "LOST", source: "diagnostic", daysAgo: 70, maturity: "low" },
  { firstName: "Patricia", lastName: "Domènech Sala", company: "Dental Nord Grup", domain: "dentalnord-ejemplo.cat", jobTitle: "ceo", sector: "dental", numberLocations: "26-50", companyRevenue: "25-50M", mainProblem: "integracion", status: "WON", source: "diagnostic", utm: { source: "linkedin", medium: "social", campaign: "" }, daysAgo: 80, maturity: "mid" },
  { firstName: "Hugo", lastName: "Sánchez Lara", company: "Talleres Motor Express", domain: "motorexpress-ejemplo.es", jobTitle: "other", sector: "automocion", numberLocations: "1", companyRevenue: "<1M", mainProblem: "costes", status: "NEW", source: "diagnostic", daysAgo: 11, maturity: "low" },
];

function answersFor(lead: SeedLead): Record<string, string> {
  const answers: Record<string, string> = {
    q1: lead.numberLocations,
    q13: lead.companyRevenue,
    q14: lead.sector,
    q15: lead.mainProblem,
  };
  const bias = lead.maturity === "low" ? 0.2 : lead.maturity === "mid" ? 0.5 : 0.85;
  for (const q of QUESTIONS) {
    if (q.profileField) continue;
    if (q.id === "q9") {
      answers.q9 = lead.mainProblem === "integracion" ? "yes" : pick(["no", "no", "considering"]);
      continue;
    }
    const scored = [...q.options].sort(
      (a, b) =>
        Object.values(b.points ?? {}).reduce((x, y) => x + y, 0) -
        Object.values(a.points ?? {}).reduce((x, y) => x + y, 0),
    );
    // bias alto → opciones mejor puntuadas con más probabilidad
    const r = rand();
    const idx = r < bias ? 0 : r < bias + (1 - bias) / 2 ? Math.min(1, scored.length - 1) : scored.length - 1;
    answers[q.id] = scored[idx].value;
  }
  return answers;
}

async function main() {
  console.log("→ Insertando 20 leads de prueba…");

  for (const item of SEED_LEADS) {
    const createdAt = daysAgo(item.daysAgo);
    const hasDiagnostic = item.source === "diagnostic" || item.source === "linkedin";
    const answers = hasDiagnostic ? answersFor(item) : null;
    const result = answers ? calculateDiagnostic(answers) : null;
    const score = scoreLead({
      numberLocations: item.numberLocations,
      companyRevenue: item.companyRevenue,
      jobTitle: item.jobTitle,
      sector: item.sector,
      mainProblem: item.mainProblem,
      pain: result?.pain ?? null,
    });
    const visitorId = `seed-${randomBytes(6).toString("hex")}`;
    const email = `${item.firstName.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}.${item.lastName.split(" ")[0].toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}@${item.domain}`;

    const [lead] = await db
      .insert(schema.leads)
      .values({
        createdAt,
        updatedAt: createdAt,
        firstName: item.firstName,
        lastName: item.lastName,
        company: item.company,
        jobTitle: item.jobTitle,
        email,
        phone: rand() > 0.5 ? `+34 6${Math.floor(10000000 + rand() * 89999999)}` : null,
        sector: item.sector,
        companyRevenue: item.companyRevenue,
        numberLocations: item.numberLocations,
        mainProblem: item.mainProblem,
        score: score.score,
        leadLevel: score.level,
        isHot: score.isHot,
        status: item.status,
        source: item.source,
        message: item.source === "contact" ? "Nos interesa valorar una colaboración. ¿Podemos agendar una llamada esta semana?" : null,
        notes: "Lead de prueba (seed).",
        utmSource: item.utm?.source ?? null,
        utmMedium: item.utm?.medium ?? null,
        utmCampaign: item.utm?.campaign || null,
        referrer: item.utm?.source === "linkedin" ? "https://www.linkedin.com/" : item.utm?.source === "google" ? "https://www.google.com/" : null,
        landingPage: item.source === "linkedin" ? "/linkedin/multisite?utm_source=linkedin" : item.source === "calculator" ? "/calculadora-ebitda" : "/",
        resultToken: hasDiagnostic ? randomBytes(24).toString("base64url") : null,
        gdprConsent: true,
        consentAt: createdAt,
        consentTextVersion: "2026-01",
        device: pick(["mobile", "mobile", "desktop"]),
        country: "ES",
        visitorId,
      })
      .returning();

    if (answers && result) {
      await db.insert(schema.diagnosticAnswers).values(
        Object.entries(answers).map(([questionId, answer]) => ({
          leadId: lead.id,
          questionId,
          answer,
          points: pointsForAnswer(questionId, answer),
          createdAt,
        })),
      );
      await db.insert(schema.diagnosticResults).values({
        leadId: lead.id,
        totalScore: result.totalScore,
        financeScore: result.scores.finance,
        operationsScore: result.scores.operations,
        peopleScore: result.scores.people,
        dataScore: result.scores.data,
        scalabilityScore: result.scores.scalability,
        resultLevel: result.level,
        recommendations: result.recommendations,
        createdAt,
      });
    }

    // Eventos del funnel para este visitante
    const events: (typeof schema.leadEvents.$inferInsert)[] = [
      { leadId: lead.id, visitorId, eventType: "page_view", page: lead.landingPage ?? "/", createdAt: new Date(createdAt.getTime() - 15 * 60_000), metadata: { device: lead.device } },
    ];
    if (hasDiagnostic) {
      events.push(
        { leadId: lead.id, visitorId, eventType: "cta_clicked", page: lead.landingPage ?? "/", createdAt: new Date(createdAt.getTime() - 12 * 60_000), metadata: { location: "hero" } },
        { leadId: lead.id, visitorId, eventType: "page_view", page: "/diagnostico", createdAt: new Date(createdAt.getTime() - 11 * 60_000), metadata: {} },
        { leadId: lead.id, visitorId, eventType: "diagnostic_started", page: "/diagnostico", createdAt: new Date(createdAt.getTime() - 10 * 60_000), metadata: {} },
        { leadId: lead.id, visitorId, eventType: "diagnostic_completed", page: "/diagnostico", createdAt: new Date(createdAt.getTime() - 60_000), metadata: { totalScore: result?.totalScore } },
      );
    }
    events.push({ leadId: lead.id, visitorId, eventType: "lead_created", page: lead.landingPage ?? "/", createdAt, metadata: { score: score.score, source: item.source } });
    if (["MEETING", "PROPOSAL", "WON"].includes(item.status)) {
      events.push({ leadId: lead.id, visitorId, eventType: "meeting_clicked", page: "/diagnostico", createdAt: new Date(createdAt.getTime() + 3 * 60_000), metadata: { location: "result" } });
    }
    await db.insert(schema.leadEvents).values(events);

    // Notas de seguimiento según estado
    const notes: string[] = [];
    if (item.status !== "NEW") notes.push("Primer contacto por email con resumen del diagnóstico y propuesta de sesión de 30 min.");
    if (["MEETING", "PROPOSAL", "WON", "LOST"].includes(item.status)) notes.push("Sesión estratégica realizada. Interés principal: P&L por centro y dimensionamiento de plantilla.");
    if (["PROPOSAL", "WON"].includes(item.status)) notes.push("Enviada propuesta de Multisite Performance Audit. Decisión prevista en comité de dirección.");
    if (item.status === "WON") notes.push("Propuesta aceptada. Inicio del proyecto acordado.");
    if (item.status === "LOST") notes.push("Descartado por el momento: priorizan apertura de nuevos centros este año. Revisar en 6 meses.");
    if (notes.length) {
      await db.insert(schema.leadNotes).values(
        notes.map((note, i) => ({
          leadId: lead.id,
          note,
          author: "seed",
          createdAt: new Date(createdAt.getTime() + (i + 1) * 36 * 60 * 60_000),
        })),
      );
    }

    console.log(`  ✓ ${item.company} — score ${score.score} (${score.level}${score.isHot ? ", HOT" : ""}) — ${item.status}`);
  }

  // Visitantes anónimos adicionales para que el funnel tenga volumen realista.
  console.log("→ Insertando tráfico anónimo…");
  const pages = ["/", "/diagnostico", "/servicios", "/private-equity", "/healthcare", "/multisite", "/insights", "/calculadora-ebitda", "/servicios/fractional-coo"];
  const anonEvents: (typeof schema.leadEvents.$inferInsert)[] = [];
  for (let i = 0; i < 180; i++) {
    const vid = `seed-anon-${i}`;
    const when = daysAgo(Math.floor(rand() * 30));
    const views = 1 + Math.floor(rand() * 3);
    for (let v = 0; v < views; v++) {
      anonEvents.push({ visitorId: vid, eventType: "page_view", page: pick(pages), createdAt: new Date(when.getTime() + v * 90_000), metadata: { device: pick(["mobile", "desktop"]) } });
    }
    if (rand() < 0.3) {
      anonEvents.push({ visitorId: vid, eventType: "diagnostic_started", page: "/diagnostico", createdAt: new Date(when.getTime() + 5 * 60_000), metadata: {} });
      if (rand() < 0.5) {
        anonEvents.push({ visitorId: vid, eventType: "diagnostic_completed", page: "/diagnostico", createdAt: new Date(when.getTime() + 9 * 60_000), metadata: {} });
      }
    }
  }
  await db.insert(schema.leadEvents).values(anonEvents);

  console.log("✓ Seed completado.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
