import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { EmptyDb } from "@/components/admin/empty-db";
import { PageHeader } from "@/components/admin/page-header";
import { DataRequestCard } from "@/components/admin/rgpd/request-row";
import { EmptyHint, SectionCard } from "@/components/admin/section-card";
import { getDb } from "@/db/client";
import { consentRecords, dataRequests, users } from "@/db/schema";
import { getSession } from "@/lib/auth/guard";
import { formatDate, isPast } from "@/lib/utils";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "RGPD", robots: { index: false, follow: false } };

export default async function RgpdPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");
  const db = getDb();
  if (!db) return <EmptyDb />;

  const [requests, consentStats] = await Promise.all([
    db
      .select({ r: dataRequests, handler: users.name })
      .from(dataRequests)
      .leftJoin(users, eq(dataRequests.handledBy, users.id))
      .orderBy(desc(dataRequests.createdAt))
      .limit(200),
    db
      .select({
        total: sql<number>`count(*)::int`,
        analytics: sql<number>`sum(case when ${consentRecords.analytics} then 1 else 0 end)::int`,
        marketing: sql<number>`sum(case when ${consentRecords.marketing} then 1 else 0 end)::int`,
        last30: sql<number>`sum(case when ${consentRecords.createdAt} > now() - interval '30 days' then 1 else 0 end)::int`,
      })
      .from(consentRecords)
      .where(eq(consentRecords.source, "cookie_banner")),
  ]);
  const stats = consentStats[0];

  return (
    <div className="space-y-6">
      <PageHeader title="Protección de datos" description="Solicitudes de derechos (acceso, rectificación, supresión…) con su plazo legal de un mes, y registro de consentimientos de cookies." />

      <SectionCard title="Consentimientos de cookies" description="Decisiones registradas desde el banner (prueba del consentimiento).">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Registros", stats?.total ?? 0],
            ["Últimos 30 días", stats?.last30 ?? 0],
            ["Aceptan analítica", stats?.analytics ?? 0],
            ["Aceptan marketing", stats?.marketing ?? 0],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <dt className="text-xs uppercase tracking-[0.12em] text-gray-500">{label}</dt>
              <dd className="tabular mt-1 text-2xl font-semibold text-ink-900">{value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-ink-900">Solicitudes de derechos</h2>
        {requests.length ? (
          requests.map(({ r, handler }) => {
            const deadline = new Date(r.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
            return (
              <DataRequestCard
                key={r.id}
                item={{
                  id: r.id,
                  type: r.type,
                  name: r.name,
                  email: r.email,
                  message: r.message,
                  status: r.status,
                  resolutionNote: r.resolutionNote,
                  createdLabel: formatDate(r.createdAt),
                  deadlineLabel: formatDate(deadline),
                  overdue: isPast(deadline),
                  handlerName: handler,
                }}
              />
            );
          })
        ) : (
          <EmptyHint>No hay solicitudes de derechos.</EmptyHint>
        )}
      </section>
    </div>
  );
}
