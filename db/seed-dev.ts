/**
 * Datos de desarrollo: solicitudes claramente ficticias para probar el CRM.
 * Se niega a ejecutarse en producción. Uso: npm run db:seed:dev
 */
import { scriptDb, schema } from "./seed-client";

const { leads, leadActivities } = schema;

const SAMPLE = [
  { name: "Prueba Uno (ficticio)", email: "prueba1@example.com", phone: "+34600000001", locality: "Barcelona", serviceSlug: "reformas-integrales-viviendas", propertyType: "piso", squareMeters: 85, budgetRange: "25k-50k", timeline: "1-3m", source: "presupuesto", message: "Solicitud de prueba generada por db:seed:dev." },
  { name: "Prueba Dos (ficticio)", email: "prueba2@example.com", phone: "+34600000002", locality: "Igualada", serviceSlug: "reformas-locales-comerciales", propertyType: "local", squareMeters: 140, budgetRange: "50k-100k", timeline: "inmediato", source: "servicio", message: "Solicitud de prueba generada por db:seed:dev." },
  { name: "Prueba Tres (ficticio)", email: "prueba3@example.com", phone: "+34600000003", locality: "Vilanova del Camí", serviceSlug: "reformas-banos", propertyType: "casa", squareMeters: 6, budgetRange: "lt10k", timeline: "3-6m", source: "calculadora", message: "Solicitud de prueba generada por db:seed:dev." },
] as const;

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    console.error("db:seed:dev no se ejecuta en producción.");
    process.exit(1);
  }
  if (!process.argv.includes("--with-leads")) {
    console.log("Añade --with-leads para insertar solicitudes ficticias.");
    return;
  }
  const db = scriptDb();
  for (const s of SAMPLE) {
    const [lead] = await db
      .insert(leads)
      .values({ ...s, privacyConsent: true, consentAt: new Date(), consentTextVersion: "dev", status: "NEW", formVariant: "general" } as typeof leads.$inferInsert)
      .returning({ id: leads.id });
    if (lead) await db.insert(leadActivities).values({ leadId: lead.id, type: "system", payload: { event: "created", dev: true } });
  }
  console.log(`${SAMPLE.length} solicitudes ficticias creadas.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
