# Despliegue en Vercel con Neon

## 0. Estado actual (12-10-2026)

- Código en https://github.com/andreumarc/reformas (rama `main`). La rama `claude/gracious-brown-v0fhtd` de `andreumarc/perfil` conserva una copia.
- Proyecto Neon `reformas` (ID `dawn-lab-59498990`, región `aws-eu-central-1`, Postgres 17) con el esquema aplicado (22 tablas), el primer administrador creado y el contenido inicial cargado: servicios, sectores, proyectos de ejemplo, categorías, autor, 20 artículos en borrador, zonas y FAQs. La fila de `site_settings` se crea con la primera edición guardada en `/admin/ajustes`; hasta entonces el sitio usa los valores por defecto de `content/settings.ts`.
- No hace falta `/admin/setup` ni `ADMIN_SETUP_TOKEN`: entra en `/admin/login` con las credenciales entregadas y cambia la contraseña en `/admin/cuenta`. El acceso admite email o nombre de usuario: un usuario sin arroba se resuelve como `usuario@reformas.local`.
- Variables ya cargadas en Vercel (proyecto `reformas`, equipo `marc19`): `DATABASE_URL` (integración Neon, producción y desarrollo; copia manual para previsualización), `AUTH_SECRET` e `IP_HASH_SALT`. Los stores de Blob siguen pendientes de crear a mano.
- El proyecto de Vercel y los stores de Blob no se pudieron crear desde esta sesión (el token no tiene permisos): sigue los pasos 2 y 3. Las variables de entorno preparadas están en el fichero `vercel-env.txt` entregado con el informe.
- Si hay que volver a sembrar sin acceso de red a Neon, `npm run db:seed:sql <carpeta>` genera el contenido como SQL idempotente (`INSERT ... ON CONFLICT DO NOTHING`) para ejecutarlo en la consola de Neon, junto con una consulta de verificación por hash.

## 1. Base de datos (Neon)

1. Crea un proyecto en Neon (región UE, por ejemplo Frankfurt `eu-central-1`).
2. Copia la cadena de conexión pooled como `DATABASE_URL`.
3. Aplica el esquema y el contenido inicial desde tu máquina:
   ```bash
   DATABASE_URL=... npm run db:migrate
   DATABASE_URL=... npm run db:seed
   ```
   Para cambios de esquema: edita `db/schema.ts`, `npm run db:generate`, revisa el SQL en `drizzle/` y `npm run db:migrate`.
   Sin acceso de red a Neon: `npm run db:seed:sql ./seed-sql` y ejecuta los ficheros `stmt-*.sql` en la consola SQL de Neon; `checks.sql` devuelve un hash por tabla que debe coincidir con `hashes.json`.

## 2. Proyecto en Vercel

1. Importa el repositorio (Framework: Next.js). Node 22.
2. Crea dos stores de Vercel Blob: uno público (`reformas-media`) y uno **privado** (`reformas-adjuntos`). Conecta el público como `BLOB_READ_WRITE_TOKEN` y copia el token del privado en `BLOB_PRIVATE_READ_WRITE_TOKEN`.
3. Variables de entorno (Production y Preview):

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | cadena pooled de Neon |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.com` (sin barra final) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_SETUP_TOKEN` | solo si la tabla `users` está vacía: token temporal para `/admin/setup`; bórralo tras crear el admin |
| `IP_HASH_SALT` | `openssl rand -hex 16` (sin ella no se guardan hashes de IP en producción) |
| `RESEND_API_KEY`, `EMAIL_FROM` | remitente de un dominio verificado en Resend |
| `NOTIFY_EMAIL` | destinatario de avisos si el panel no tiene emails configurados |
| `BLOB_READ_WRITE_TOKEN`, `BLOB_PRIVATE_READ_WRITE_TOKEN` | stores de Blob |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | opcional, anti-spam |

4. Despliega. Comprueba `https://tu-dominio.com/api/health`, `/sitemap.xml`, `/robots.txt` y `/rss.xml`.
5. Si la base de datos no tiene usuarios, crea el primer administrador en `/admin/setup` y elimina `ADMIN_SETUP_TOKEN`. En el proyecto actual el administrador ya existe: entra en `/admin/login` y cambia la contraseña en `/admin/cuenta`.
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
