# Web de reformas integrales e instalaciones

Plataforma de captación de leads para una empresa de reformas e instalaciones (viviendas, locales, oficinas, gimnasios, restaurantes, hoteles, clínicas y naves) con base en Barcelona, Igualada y Anoia y actuación en toda Cataluña y toda España. Incluye web pública, blog SEO, calculadoras de precios, formularios con CRM, panel de administración y cumplimiento RGPD.

## Stack

- Next.js 16 (App Router, `proxy.ts`), React 19, TypeScript estricto, Tailwind CSS v4, shadcn-style UI, Motion.
- Neon (PostgreSQL) con Drizzle ORM. Sin base de datos la web pública funciona con el contenido de `content/`.
- Autenticación propia del panel (argon2id + JWT en cookie `__Host-rf_session`), roles `admin` y `editor`.
- Resend (emails), Vercel Blob (imágenes públicas y adjuntos privados), Cloudflare Turnstile opcional.
- Vitest (unitarias y PGlite) y Playwright (e2e + axe).

## Puesta en marcha

```bash
npm install
cp .env.example .env.local      # rellena DATABASE_URL, AUTH_SECRET, ADMIN_SETUP_TOKEN, IP_HASH_SALT
npm run db:migrate              # crea las tablas en Neon
npm run db:seed                 # contenido inicial (sin solicitudes)
npm run dev
```

1. Abre `http://localhost:3000/admin/setup` y crea el primer administrador con `ADMIN_SETUP_TOKEN`.
2. En `/admin/ajustes` rellena nombre, teléfono, WhatsApp, email, dirección, textos legales e integraciones.
3. Publica los artículos del blog desde `/admin/blog` cuando los hayas revisado (se siembran como borradores).

Sin `DATABASE_URL` el panel muestra instrucciones y los formularios devuelven un error explícito (nunca un falso éxito).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` / `build` / `start` | desarrollo, build de producción, servidor |
| `npm run lint` · `typecheck` · `test` | calidad: ESLint, TypeScript, Vitest |
| `npm run test:e2e` | Playwright (arranca el build; con `DATABASE_URL` prueba también lead → panel) |
| `npm run db:generate` · `db:migrate` · `db:seed` · `db:check` | migraciones Drizzle, siembra y comprobación |
| `npm run db:seed:dev` | solicitudes ficticias para probar el CRM (bloqueado en producción) |
| `npm run check:links` | rastrea el sitio y detecta enlaces o CTAs rotos (`BASE_URL=...`) |
| `node scripts/generate-content-index.mjs` | regenera los índices de `content/` tras añadir ficheros |

## Estructura

```
app/(marketing)/   páginas públicas (home, servicios, sectores, proyectos, blog, calculadoras, zonas, legales)
app/admin/         panel: CRM, contenido ([resource] genérico), medios, ajustes, usuarios, RGPD, auditoría
app/api/           events, consent, health, admin/attachments
actions/           server actions (submitLead, submitDataRequest, admin-*)
components/        ui, layout, sections, forms, calculators, blog, motion, admin
content/           contenido inicial tipado (servicios, sectores, proyectos, artículos, zonas, legales, ajustes)
lib/               cms (lectura BD con fallback), calculators, validation (Zod), auth, analytics, seo, email, storage
db/                schema Drizzle, cliente, queries, seed
docs/              deploy, copias de seguridad, checklist de producción, esquema, SEO del blog
```

## Principios de contenido

- No se inventan reseñas, proyectos, certificaciones, equipo, años ni cifras: las cifras solo se muestran marcadas como verificadas en ajustes.
- Las imágenes generadas se marcan como ilustrativas (`media_assets.kind = illustrative`, proyectos `isIllustrative`).
- Instalaciones de gas, PCI, electricidad y climatización: "con profesional habilitado", sin atribuir habilitaciones a la empresa.
- Precios de calculadoras y artículos: rangos orientativos sin IVA, editables desde el panel.

Documentación adicional: [docs/deploy.md](docs/deploy.md), [docs/backup-restore.md](docs/backup-restore.md), [docs/checklist-produccion.md](docs/checklist-produccion.md), [docs/schema.md](docs/schema.md), [docs/blog-seo.md](docs/blog-seo.md).
