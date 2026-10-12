import { get } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getDb } from "@/db/client";
import { leadAttachments } from "@/db/schema";
import { getSession } from "@/lib/auth/guard";
import { serverEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

/** Descarga de un adjunto del store privado. Solo con sesión del panel (proxy.ts ya exige cookie). */
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const db = getDb();
  const token = serverEnv().blobPrivateToken;
  if (!db || !token) return NextResponse.json({ error: "Almacenamiento no configurado" }, { status: 503 });

  const row = await db.query.leadAttachments.findFirst({ where: eq(leadAttachments.id, id) });
  if (!row) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const result = await get(row.storageKey, { access: "private", token });
  if (!result || !result.stream) return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 });

  const safeName = row.filename.replace(/[^\w.\- ]+/g, "_");
  return new Response(result.stream, {
    headers: {
      "Content-Type": row.mime || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"`,
      "Content-Length": String(row.sizeBytes),
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}
