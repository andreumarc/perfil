# Esquema de datos

Fuente de verdad: `db/schema.ts` (Drizzle). Migraciones en `drizzle/`. Esta descripción sirve para auditoría y para derivar un `schema.prisma` si hiciera falta.

## Enumeraciones

`user_role` (admin, editor) · `lead_status` (NEW, CONTACTED, VISIT_SCHEDULED, QUOTE_SENT, WON, LOST) · `lead_source` (presupuesto, contacto, servicio, sector, zona, proyecto, blog, calculadora, whatsapp, telefono, otro) · `property_type` · `budget_range` · `timeline` · `content_status` (draft, published) · `media_kind` (real, illustrative) · `data_request_type` (access, rectification, erasure, other) · `data_request_status` (new, in_progress, closed) · `activity_type`.

## Tablas

| Tabla | Propósito | Claves |
| --- | --- | --- |
| `users` | cuentas del panel (argon2id, `session_version` invalida sesiones) | email único (lower) |
| `leads` | solicitudes: contacto, proyecto, contexto (`context` jsonb: campos contextuales y datos de calculadora), atribución UTM, consentimientos, estado CRM, asignación, pseudonimización de IP | índices por fecha, estado, email, asignado, fuente |
| `lead_activities` | historial (notas, llamadas, cambios de estado) | FK lead cascade |
| `lead_attachments` | adjuntos en Blob privado | FK lead cascade |
| `follow_ups` | tareas de seguimiento | FK lead cascade |
| `lead_events` | eventos del funnel (anónimos o enlazados al lead; `set null` al borrar) | índices por tipo, fecha, visitante |
| `consent_records` | decisiones de cookies y consentimientos de formularios | |
| `services`, `sectors`, `projects`, `project_images` | contenido comercial | slug único |
| `blog_categories`, `authors`, `articles` | blog (borrador/publicado, publicación programada, SEO, FAQs, fuentes) | slug único |
| `faqs` | preguntas por ámbito (global, service, sector, area) | índice scope + slug |
| `local_areas` | zonas de actuación | slug único |
| `media_assets` | biblioteca de imágenes (real / ilustrativa) | |
| `site_settings` | fila única (`id = 1`) con toda la configuración en jsonb validado por `siteSettingsSchema` | check id = 1 |
| `audit_logs` | quién hizo qué en el panel | |
| `data_requests` | solicitudes de derechos RGPD | |
| `rate_limits` | ventana fija por clave (IP + acción) | PK key |

## Reglas

- Borrar un lead elimina en cascada actividades, adjuntos y tareas; los eventos se conservan anonimizados (`lead_id = null`).
- Borrar un usuario no está permitido desde el panel (se desactiva); las referencias usan `set null`.
- `site_settings.data` se fusiona por secciones con `content/settings.ts` al leer, de modo que añadir campos nuevos no rompe configuraciones antiguas.
