# Marc Andreu Guerao · Multisite Performance — Sistema de captación de leads B2B

Aplicación web orientada a **generar leads cualificados** (CEOs, Directores Generales, COOs, CFOs e inversores de
empresas multicentro) para Marc Andreu Guerao, Director de Operaciones especializado en operaciones multicentro,
P&L, EBITDA e integración post-adquisición.

No es una web corporativa pasiva: es un funnel completo.

```
TRÁFICO → LANDING → DIAGNÓSTICO MULTISITE → CAPTURA LEAD → RESULTADO → CTA REUNIÓN → CRM
```

## Qué incluye

| Bloque | Detalle |
| --- | --- |
| **Landings** | Home, 4 páginas de servicio, Private Equity, Healthcare, Multisite, Casos, Sobre mí, Contacto, legales |
| **Diagnóstico Multisite** | 15 preguntas (una por pantalla), 5 bloques de madurez (Finanzas, Operaciones, Personas, Datos, Escalabilidad), resultado 0-100 con recomendaciones, captura de lead antes del resultado completo |
| **Calculadora EBITDA** | Segundo lead magnet: benchmark orientativo por sector + formulario |
| **Landings LinkedIn** | `/linkedin/multisite`, `/linkedin/private-equity`, `/linkedin/healthcare` (minimalistas, con el diagnóstico embebido) |
| **Lead scoring** | Algoritmo 0-100 configurable en `lib/lead-scoring.ts` (centros, facturación, cargo, sector, problema, dolor operativo, Private Equity). Niveles: bajo / medio / alto / estratégico. HOT ≥ 75 |
| **CRM privado** | `/admin`: overview, leads (filtros, búsqueda, orden, paginación, CSV), detalle con notas y status, analytics del funnel, diagnósticos, settings |
| **Analítica** | Eventos del funnel guardados en Neon + Vercel Analytics + GA4 / Meta Pixel / LinkedIn Insight (solo con consentimiento) |
| **Email** | Resend: aviso de nuevo lead (🔥 HOT LEAD si score > 75) y resumen del diagnóstico al lead |
| **Blog / SEO** | Insights por categorías con artículos orientados a keywords, metadata dinámica, schema.org, OpenGraph, sitemap, robots |
| **Seguridad / RGPD** | Validación Zod en servidor, rate limiting, honeypot, cabeceras de seguridad y CSP, admin con JWT, consentimiento de cookies, políticas legales |

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · shadcn-style UI · Drizzle ORM ·
Neon PostgreSQL · Zod · React Hook Form · Recharts · Lucide · Resend · jose · Vitest · Vercel.

## Estructura

```
app/
  (marketing)/        páginas públicas (header, footer, CTA sticky móvil)
  (campaign)/         landings de campaña /linkedin/*
  admin/              CRM privado (login + dashboard)
  api/                events, health, admin/leads/export
actions/              server actions (diagnóstico, contacto, admin, auth)
components/           ui/ layout/ sections/ analytics/ diagnostic/ calculator/ admin/ ...
content/              servicios, casos, insights (artículos tipados), legal
db/                   schema.ts, client.ts, queries/, seed.ts, check.ts
drizzle/              migraciones SQL generadas
lib/                  lead-scoring, diagnostic/, validation/, analytics/, seo, auth, rate-limit, email/
tests/                Vitest
types/                tipos de dominio
proxy.ts              protección de /admin (antes "middleware")
```

## Puesta en marcha local

Requisitos: Node.js ≥ 20.9 y npm.

```bash
git clone <url-del-repo> perfil
cd perfil
npm install
cp .env.example .env        # rellena al menos DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET
npm run db:migrate          # crea las tablas en Neon
npm run db:seed             # (opcional) 20 leads ficticios para ver el dashboard
npm run dev                 # http://localhost:3000
```

La aplicación funciona aunque falten variables opcionales: sin `DATABASE_URL` el diagnóstico se calcula igual
(sin persistir), sin `RESEND_API_KEY` no se envían emails, sin IDs de analítica no se cargan esos scripts.

## Variables de entorno

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Sí (producción) | Connection string de Neon (pooled, `?sslmode=require`) |
| `NEXT_PUBLIC_SITE_URL` | Sí (producción) | URL canónica, p. ej. `https://www.tudominio.com` |
| `NEXT_PUBLIC_BOOKING_URL` | Recomendada | Calendly u otra URL de reserva. Todos los CTA de reunión la usan; si falta, llevan a `/contacto` |
| `ADMIN_EMAIL` | Sí | Recibe los avisos de nuevo lead y es el usuario de `/admin` |
| `ADMIN_PASSWORD` | Sí | Contraseña de `/admin` (≥ 12 caracteres) |
| `AUTH_SECRET` | Sí | Secreto para firmar la sesión admin: `openssl rand -base64 32` |
| `RESEND_API_KEY` | Opcional | Activa los emails transaccionales |
| `EMAIL_FROM` | Opcional | Remitente verificado en Resend (por defecto `onboarding@resend.dev`) |
| `NEXT_PUBLIC_LINKEDIN_URL` | Opcional | URL del perfil LinkedIn (si falta, se ocultan los enlaces) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Opcional | Email público de contacto |
| `NEXT_PUBLIC_GA_ID` | Opcional | Google Analytics 4 (`G-XXXX`), solo con consentimiento |
| `NEXT_PUBLIC_META_PIXEL_ID` | Opcional | Meta Pixel, solo con consentimiento de marketing |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | Opcional | LinkedIn Insight Tag, solo con consentimiento de marketing |
| `IP_HASH_SALT` | Recomendada | Sal para anonimizar IPs (`openssl rand -hex 16`) |

Nunca subas `.env` al repositorio (ya está en `.gitignore`).

## Neon (base de datos)

1. Crea una cuenta en [neon.tech](https://neon.tech) y un proyecto (región recomendada: `eu-central-1`, Frankfurt).
2. En **Connect** copia la connection string **pooled** y pégala en `DATABASE_URL`.
3. Ejecuta las migraciones:
   ```bash
   npm run db:migrate
   ```
   (Alternativa sin historial de migraciones: `npm run db:push`.)
4. Comprueba la conexión y las tablas:
   ```bash
   npm run db:check
   ```
5. Carga datos de prueba para ver el dashboard:
   ```bash
   npm run db:seed
   ```

Cambios de esquema: edita `db/schema.ts`, ejecuta `npm run db:generate` (crea el SQL en `drizzle/`) y
`npm run db:migrate`. `npm run db:studio` abre Drizzle Studio.

Tablas: `leads`, `diagnostic_answers`, `diagnostic_results`, `lead_events`, `lead_notes`, `rate_limits`.

## Vercel (despliegue)

1. Sube el repositorio a GitHub (`git push`).
2. En [vercel.com/new](https://vercel.com/new) importa el repositorio. Framework: **Next.js** (detectado automáticamente).
3. En **Environment Variables** añade todas las variables de la tabla anterior (al menos las obligatorias).
   Para `NEXT_PUBLIC_SITE_URL` usa el dominio final (puedes empezar con el `*.vercel.app`).
4. **Deploy**. El build ejecuta `next build`; las páginas públicas se generan estáticas y el admin es dinámico.
5. Ejecuta las migraciones contra la base de datos de producción desde tu máquina
   (`DATABASE_URL=... npm run db:migrate`) o conecta la integración Neon de Vercel.
6. Añade tu dominio en **Settings → Domains** y actualiza `NEXT_PUBLIC_SITE_URL`.
7. Comprueba `https://tu-dominio/api/health` (debe devolver `"database": "ok"`).

Opcional: activa **Vercel Analytics** en el panel del proyecto (el componente ya está integrado).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build de producción y arranque |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Tests Vitest (scoring, diagnóstico, validación, base de datos con PGlite) |
| `npm run db:generate` | Genera migración SQL desde `db/schema.ts` |
| `npm run db:migrate` | Aplica migraciones a `DATABASE_URL` |
| `npm run db:push` | Sincroniza el esquema sin migraciones |
| `npm run db:seed` | 20 leads ficticios + eventos + notas |
| `npm run db:check` | Comprueba la conexión y lista las tablas |
| `npm run db:studio` | Drizzle Studio |

## Lead scoring

Definido en `lib/lead-scoring.ts` (`SCORING_WEIGHTS`). Suma máxima 100:

| Factor | Máx. | Ejemplo |
| --- | --- | --- |
| Número de centros | 25 | 1 → 0 · 2-5 → 5 · 6-10 → 10 · 11-25 → 15 · 26-50 → 20 · +50 → 25 |
| Facturación | 25 | <1M → 0 · 1-5M → 5 · 5-10M → 10 · 10-25M → 15 · 25-50M → 20 · +50M → 25 |
| Cargo | 15 | CEO / Founder / MD / COO / PE partner → 15 · CFO / Ops Director → 12 · Area Manager → 6 · Otro → 3 |
| Sector | 5 | Dental, veterinaria, healthcare, PE → 5 · retail, fitness, franquicias → 4 … |
| Problema principal | 5 | Rentabilidad, integración → 5 · KPIs, costes, procesos → 4 … |
| Dolor operativo (diagnóstico) | 20 | Sin EBITDA por centro, sin KPIs comunes, sin cuadro de mando, procesos distintos, adquisición reciente |
| Private Equity | 5 | Rol o sector PE |

Niveles: 0-30 bajo · 31-60 medio · 61-80 alto · 81-100 estratégico. **HOT LEAD** si score ≥ 75.

## Diagnóstico Multisite

Preguntas en `lib/diagnostic/questions.ts`; cálculo en `lib/diagnostic/calculate.ts`; recomendaciones en
`lib/diagnostic/recommendations.ts`. Cada opción puntúa en uno o varios bloques; la madurez total es la media de
los cinco bloques. El resultado incluye 3 problemas, 3 oportunidades, 3 acciones y el servicio recomendado.

## Analítica del funnel

Eventos (`lib/analytics/events.ts`): `page_view`, `diagnostic_started`, `diagnostic_step_completed`,
`diagnostic_completed`, `lead_created`, `contact_clicked`, `email_clicked`, `linkedin_clicked`,
`meeting_clicked`, `service_viewed`, `cta_clicked`, `calculator_used`, `consent_updated`.
Los eventos clave se guardan en `lead_events` vía `POST /api/events`. UTMs, referrer y landing page se
capturan en cliente (`sessionStorage`) y se guardan con el lead.

## Seguridad

- Validación Zod en servidor para todos los formularios y la API de eventos.
- Rate limiting persistido en Neon (`rate_limits`) con fallback en memoria.
- Honeypot + tiempo mínimo de cumplimentación; comprobación de origen en `/api/events`.
- Cabeceras: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, nosniff.
- Admin: sesión JWT (HS256, `AUTH_SECRET`) en cookie httpOnly, comprobada en `proxy.ts` y en el layout.
- IPs anonimizadas con hash y sal; país vía cabecera de Vercel (sin servicios externos).

## RGPD

- Banner de cookies con aceptar / rechazar / configurar; GA4, Meta y LinkedIn solo se cargan con consentimiento.
- Consentimiento de formularios guardado con el lead (`gdpr_consent`, `consent_at`, versión del texto).
- Páginas: `/legal`, `/politica-privacidad`, `/cookies`. Completa el NIF y la dirección del titular en
  `content/legal.ts` antes de publicar.

## Contenido que debes revisar antes de publicar

- `content/legal.ts`: NIF y domicilio del titular.
- `.env`: `NEXT_PUBLIC_BOOKING_URL` (Calendly), `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`.
- Foto profesional en `/sobre-mi` (el componente está preparado para añadirla).
- Precios orientativos de los servicios en `content/services.ts`.
