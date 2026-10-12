# CLAUDE.md — Guía del proyecto `reformas`

Web de captación de leads para una empresa de reformas integrales e instalaciones en España (base en Barcelona, Igualada y Anoia; actuación en toda Cataluña y toda España). Objetivo: convertir visitantes en solicitudes de presupuesto. Prioridad: conversión > veracidad > diseño > complejidad.

## Reglas de negocio innegociables

- No inventar reseñas, proyectos, certificaciones, dirección, equipo, años ni cifras. Las cifras solo se muestran si están marcadas como verificadas en ajustes.
- No afirmar habilitaciones (gas, PCI, electricidad, RITE, dirección técnica): siempre "con profesional habilitado".
- Imágenes generadas = ilustrativas (`IllustrativeBadge`, `media_assets.kind`, `projects.isIllustrative`). Nunca presentarlas como obra real.
- Precios: rangos orientativos sin IVA, editables en el panel. Nada de placeholders, "TODO" ni botones o formularios decorativos.
- No sembrar leads falsos en producción (`db/seed-dev.ts` lo bloquea). Secretos solo en variables de entorno.

## Stack (no cambiar versiones)

Next.js 16 (App Router, `proxy.ts`, `params`/`searchParams`/`cookies()` async), React 19, TypeScript estricto, Tailwind v4 (tokens en `app/globals.css`), Drizzle + Neon (`getDb()` puede ser `null`), Zod 4 (`{ error }`, `z.email()`, `z.uuid()`), RHF, jose, Resend, Motion (`motion/react-m` con `LazyMotion strict`), Vitest + PGlite, Playwright.

## Arquitectura

- `app/(marketing)` páginas públicas **estáticas** (`revalidate = 300`); nunca leen cookies/headers. Composición de secciones; lógica en `lib/`, datos en `content/`.
- `lib/cms/*` lee la BD y solo sin `DATABASE_URL` usa `content/*`. Toda acción de contenido llama a `revalidateSite()`.
- Panel en `app/admin`: `force-dynamic`, `requireRole("editor" | "admin")` en cada acción, `audit()` en cada escritura. Recursos de contenido declarados en `lib/admin/resource-meta.ts` + `lib/admin/resources.ts` (ruta genérica `[resource]`).
- Formularios: Zod en servidor (`lib/validation/*`), honeypot `website`, `startedAt`, rate limit (`lib/rate-limit.ts`), `isSameOrigin` en APIs, consentimiento RGPD obligatorio.
- Calculadoras: `lib/calculators/definitions.ts` (sin dependencias de servidor); tarifas en `site_settings.calculators`.
- Analítica: `track()` de `lib/analytics/track.ts`; eventos en `lib/analytics/events.ts`; scripts de terceros solo tras consentimiento (`AnalyticsProvider`).

## Convenciones

- `import "server-only"` en módulos de BD/auth/email/storage. Nunca secretos en componentes cliente (solo `publicEnv`).
- Contenido nuevo en `content/<tipo>/*.ts` y `node scripts/generate-content-index.mjs`. Markdown sin H1, sin backticks ni `${`, sin rayas largas.
- Diseño: base clara `#faf8f5`, carbón `ink-900`, acento cobre `copper-500`; Manrope (`font-display`) + Inter; `Section`/`SectionHeading`; móvil primero; `prefers-reduced-motion` respetado.
- Español de España, segunda persona, frases cortas. CTA principal: "Pedir presupuesto sin compromiso".

## Comandos

`npm run typecheck && npm run lint && npm run test` deben pasar antes de dar algo por terminado; `npm run build` antes de desplegar; `npm run test:e2e` con una BD de pruebas.
