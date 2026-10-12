# Despliegue en Vercel con Neon

## 0. Estado actual (12-10-2026)

- Proyecto Neon `reformas` creado (ID `dawn-lab-59498990`, región `aws-eu-central-1`, Postgres 17) con el esquema aplicado (22 tablas). Falta cargar el contenido inicial: desde el panel (`/admin/ajustes → Cargar contenido inicial`) o con `npm run db:seed` desde una máquina con acceso a Neon.
- El código está en la rama `claude/gracious-brown-v0fhtd` del repositorio `andreumarc/perfil` hasta que exista `andreumarc/reformas` (créalo vacío y haz `git push` de esa rama como `main`).
- El proyecto de Vercel y los stores de Blob no se pudieron crear desde esta sesión (permisos insuficientes del token): sigue los pasos 2 y 3.

## 1. Base de datos (Neon)

1. Crea un proyecto en Neon (región UE, por ejemplo Frankfurt `eu-central-1`).
2. Copia la cadena de conexión pooled como `DATABASE_URL`.
3. Aplica el esquema y el contenido inicial desde tu máquina:
   ```bash
   DATABASE_URL=... npm run db:migrate
   DATABASE_URL=... npm run db:seed
   ```
   Para cambios de esquema: edita `db/schema.ts`, `npm run db:generate`, revisa el SQL en `drizzle/` y `npm run db:migrate`.

## 2. Proyecto en Vercel

1. Importa el repositorio (Framework: Next.js). Node 22.
2. Crea dos stores de Vercel Blob: uno público (`reformas-media`) y uno **privado** (`reformas-adjuntos`). Conecta el público como `BLOB_READ_WRITE_TOKEN` y copia el token del privado en `BLOB_PRIVATE_READ_WRITE_TOKEN`.
3. Variables de entorno (Production y Preview):

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | cadena pooled de Neon |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.com` (sin barra final) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_SETUP_TOKEN` | token temporal para `/admin/setup`; bórralo tras crear el admin |
| `IP_HASH_SALT` | `openssl rand -hex 16` (sin ella no se guardan hashes de IP en producción) |
| `RESEND_API_KEY`, `EMAIL_FROM` | remitente de un dominio verificado en Resend |
| `NOTIFY_EMAIL` | destinatario de avisos si el panel no tiene emails configurados |
| `BLOB_READ_WRITE_TOKEN`, `BLOB_PRIVATE_READ_WRITE_TOKEN` | stores de Blob |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | opcional, anti-spam |

4. Despliega. Comprueba `https://tu-dominio.com/api/health`, `/sitemap.xml`, `/robots.txt` y `/rss.xml`.
5. Crea el primer administrador en `/admin/setup` y elimina `ADMIN_SETUP_TOKEN`.
6. Dominio: añade el dominio en Vercel y configura DNS. `NEXT_PUBLIC_SITE_URL` debe coincidir con el dominio canónico.

## 3. Integraciones (desde `/admin/ajustes`)

- **GTM / GA4 / Meta Pixel**: introduce los IDs. Solo se cargan tras consentimiento (Consent Mode v2).
- **Search Console**: token de verificación por meta etiqueta; envía `/sitemap.xml`.
- **Google Business Profile y Maps**: URLs del perfil y del mapa.
- **Resend**: con `onboarding@resend.dev` solo se entregan emails al propietario de la cuenta; verifica tu dominio para enviar a clientes.

## 4. Caché y revalidación

Las páginas públicas son estáticas con regeneración cada 5 minutos (`revalidate = 300`). Cada cambio desde el panel invalida todo el sitio (`revalidateSite()`), así que los cambios se ven en la siguiente petición.

## 5. CI

`.github/workflows/ci.yml` ejecuta lint, typecheck, tests y build en cada push. El job e2e se activa con los secretos `E2E_DATABASE_URL` (una rama de Neon de pruebas) y `E2E_AUTH_SECRET`.
