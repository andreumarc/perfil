# CLAUDE.md — Guía del proyecto `perfil`

Sistema de captación de leads B2B para **Marc Andreu Guerao**, Director de Operaciones especializado en
empresas multicentro (healthcare, dental, veterinaria, retail, fitness, franquicias, Private Equity /
Buy & Build). Objetivo único: convertir CEOs, Directores Generales, COOs, CFOs e inversores en leads.

**Criterio de cada decisión:** "¿Esto aumenta la probabilidad de convertir a un CEO/COO/inversor en lead?"
Prioridad: CONVERSIÓN > DISEÑO > COMPLEJIDAD TÉCNICA.

## Stack (ya instalado y configurado — no cambiar versiones)

- Next.js 16.3 (App Router, Turbopack, `proxy.ts` en lugar de middleware), React 19.3, TypeScript estricto.
- Tailwind CSS v4 (tokens en `app/globals.css`, sin tailwind.config). shadcn-style UI en `components/ui/*`.
- Drizzle ORM + Neon (`db/schema.ts`, `db/client.ts` → `getDb()` puede devolver `null` si no hay DATABASE_URL).
- Zod v4 (`z.email()`, `{ error: "..." }` en lugar de `message`), React Hook Form + `@hookform/resolvers/zod`.
- Recharts 3, lucide-react, Resend, jose, Vitest 3.
- `params`/`searchParams` en páginas son **Promises** (`const { slug } = await params`). `cookies()`/`headers()` son async.
- Páginas de marketing deben ser **estáticas** (no leer cookies/headers; la analítica va en cliente).
- Imports con alias `@/` desde la raíz del repo.

## Arquitectura (respetar)

```
app/(marketing)/*     páginas públicas con Header/Footer/StickyCta (layout ya hecho)
app/(campaign)/*      landings de campaña minimalistas (layout ya hecho) → /linkedin/*
app/admin/*           CRM privado (proxy.ts protege /admin salvo /admin/login)
app/api/*             route handlers (events, health, admin export) — ya hechos
actions/*             server actions ("use server") — submitDiagnostic, submitContact, admin, auth — ya hechos
components/ui/*       primitivos (button, card, input, label, textarea, select, checkbox, badge, progress,
                      dialog, sheet, tabs, dropdown-menu, table, separator, skeleton, alert)
components/layout/*   Container, Section, SectionHeading, Eyebrow, Header, Footer, Logo, StickyCta
components/sections/* CtaBand, StatGrid, DiagnosticTeaser, ServiceCard, Faq, Breadcrumbs, SectorStrip,
                      Methodology (METHODOLOGY_STEPS), ProblemList (HOME_PROBLEMS)
components/analytics/* TrackedLink (enlace que registra evento), CookieBanner, AnalyticsProvider
components/seo/json-ld.tsx  <JsonLd data={...}/>
content/*             contenido tipado (services.ts, insights/*)
lib/*                 lógica de negocio: site.ts (config/nav/CTAs), seo.ts (pageMetadata + JSON-LD helpers),
                      lead-scoring.ts, diagnostic/* (QUESTIONS, calculateDiagnostic), validation/*, analytics/*
db/*                  schema, client, queries/{leads,analytics,events}.ts, seed.ts
types/lead.ts         enums (NUMBER_LOCATIONS, COMPANY_REVENUE, SECTORS, MAIN_PROBLEMS, JOB_TITLES, LEAD_*)
```

No meter lógica de negocio en `page.tsx`: las páginas componen secciones. Lógica → `lib/`, datos → `content/`.

## Diseño (premium, ejecutivo, tipo McKinsey/Bain/BCG — nunca "startup infantil")

- Paleta: blanco, negro azulado (`text-navy-900`), grises fríos (`text-gray-600`), navy primario, acento teal
  discreto (`text-signal`, `bg-signal`) solo para eyebrows, highlights y barras. Sin degradados llamativos,
  sin emojis, sin ilustraciones genéricas, sin fotos de stock.
- Tipografía: titulares `font-display` (Source Serif 4, serif) + cuerpo Inter. KPIs/tablas con `tabular`.
- Mucho espacio en blanco. Secciones con `<Section tone="white|muted|navy|navy-grid">` y
  `<SectionHeading eyebrow title description />`. Eyebrows con la clase `eyebrow`.
- Cards limpias (`rounded-lg border border-gray-200 bg-white`), sombras muy sutiles, animaciones mínimas.
- **Mobile-first**: botones grandes (`size="lg"`/`"xl"`), formularios simples, textos legibles.
  La barra sticky móvil ya existe; no duplicar CTAs fijos.
- Fondos oscuros: usar `tone="navy"` y texto `text-white` / `text-navy-100/85`.

## Copy (español, nivel directivo)

- Habla de los problemas del CEO con lenguaje de P&L, EBITDA, margen, productividad, capacidad, benchmarking,
  estructura, costes, KPIs, ejecución. Frases concretas: "Si tienes 15 centros y no puedes comparar su
  rentabilidad en menos de cinco minutos, tienes un problema de gestión."
- Prohibido: "ofrecemos soluciones personalizadas", Lorem ipsum, "TODO", "Coming soon", placeholders.
- Prohibido inventar clientes reales, logos, testimonios o resultados económicos (porcentajes de mejora).
  Los casos son "Ejemplo de intervención" hipotéticos y claramente marcados.
- Credenciales reales permitidas: 25 centros dirigidos, 35 M€ de P&L, 250 personas, healthcare + retail,
  integración post-adquisición (`credentials` en `lib/site.ts`).
- Botones: nunca "Enviar". Usar "Ver mi diagnóstico", "Analizar mi red", "Descubrir oportunidades",
  "Hacer diagnóstico gratuito" (`primaryCta`), CTAs de servicio definidos en `content/services.ts`.
- CTA de reunión siempre con `meetingHref` de `lib/site.ts` (Calendly configurable) y evento `meeting_clicked`.

## Analítica y conversión

- Enlaces con intención de conversión → `<TrackedLink href event="cta_clicked" props={{ location }}>`.
  Eventos válidos en `lib/analytics/events.ts`. Desde cliente: `track(event, props)`.
- Todo visitante debe poder convertir en ≤ 2 clics desde cualquier página.
- No añadir scripts de terceros: ya los gestiona `AnalyticsProvider` según consentimiento.

## SEO

- Cada página exporta `metadata` con `pageMetadata({ title, description, path, keywords })` de `lib/seo.ts`.
- Añadir JSON-LD relevante con `<JsonLd data={serviceJsonLd(...) | articleJsonLd(...) | faqJsonLd(...)} />`.
- `Breadcrumbs` en páginas interiores. Un solo `<h1>` por página.

## Seguridad / RGPD

- Toda entrada de usuario se valida en servidor con Zod (schemas en `lib/validation/*`). No crear nuevos
  endpoints sin validación, rate limit (`lib/rate-limit.ts`) y comprobación de origen.
- Formularios: honeypot `website`, `startedAt`, checkbox RGPD obligatorio con enlace a /politica-privacidad.
- Nunca leer secretos en componentes cliente; solo `publicEnv` de `lib/env.ts`.

## Comandos

`npm run typecheck` · `npm run lint` · `npm run test` · `npm run build` · `npm run db:generate|migrate|seed|check`

Antes de dar algo por terminado: `npm run typecheck && npm run lint` deben pasar sin errores.
