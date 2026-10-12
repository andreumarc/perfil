# Checklist de producción

## Antes de publicar

- [ ] `/admin/ajustes`: nombre comercial, razón social, NIF, dirección, teléfono, WhatsApp, email, horario y zonas confirmados (sin marcadores `[POR CONFIRMAR]`).
- [ ] Textos legales revisados por un profesional (aviso legal, privacidad, cookies, términos) y fecha de última actualización.
- [ ] Emails de aviso de solicitudes configurados y Resend con dominio verificado (prueba un envío real).
- [ ] `ADMIN_SETUP_TOKEN` eliminado tras crear el administrador; contraseñas de 12+ caracteres; editores con rol `editor`.
- [ ] Imágenes del hero, servicios, sectores y blog subidas en alta resolución (las actuales son ilustrativas y de baja resolución) y marcadas como ilustrativas o reales según corresponda.
- [ ] Proyectos: los proyectos tipo siguen marcados como ilustrativos; los reales con fotos propias y `isIllustrative = false`.
- [ ] Cifras verificadas: solo las que se puedan demostrar, marcadas como verificadas.
- [ ] Calculadoras: rangos de precios revisados por la empresa (`/admin/ajustes → Calculadoras`).
- [ ] Artículos del blog revisados (precios, normativa, enlaces) y publicados o programados desde `/admin/blog`.
- [ ] GTM/GA4/Meta/Search Console configurados; banner de cookies probado (rechazar no carga scripts).
- [ ] `NEXT_PUBLIC_SITE_URL` = dominio canónico; `/sitemap.xml` enviado a Search Console; `/robots.txt` correcto.

## Verificación técnica

- [ ] `npm run lint && npm run typecheck && npm run test && npm run build` en verde.
- [ ] `npm run test:e2e` en verde (con `DATABASE_URL` de una rama de pruebas).
- [ ] `BASE_URL=https://dominio npm run check:links` sin enlaces rotos.
- [ ] `/api/health` responde OK con base de datos.
- [ ] Lighthouse móvil en home, servicio, artículo y presupuesto: LCP < 2,5 s, CLS < 0,1, INP < 200 ms.
- [ ] Prueba manual: formulario de presupuesto → aparece en `/admin/leads` con email recibido; calculadora → formulario con contexto; solicitud RGPD → `/admin/rgpd`.
- [ ] Copia de seguridad inicial de la base de datos (ver `docs/backup-restore.md`).

## Operación

- Revisar `/admin/tareas` a diario y responder solicitudes en menos de 24 h laborables.
- Revisar precios de artículos y calculadoras cada 6 meses (fecha de revisión en cada artículo).
- Rotar `AUTH_SECRET` si se sospecha una fuga (cierra todas las sesiones).
