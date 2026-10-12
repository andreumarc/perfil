# Copias de seguridad y restauración

## Base de datos (Neon)

- **Historial de restauración (PITR)**: Neon conserva el historial del proyecto (por defecto 1 día en el plan gratuito, hasta 30 en planes de pago). Desde la consola: *Branches → Restore* permite crear una rama en un punto del tiempo y comprobar los datos antes de promoverla.
- **Snapshots manuales**: antes de una migración o de un borrado masivo, crea una rama (`neonctl branches create --name backup-AAAAMMDD`) o un snapshot desde la consola.
- **Exportación lógica** (fuera de Neon):
  ```bash
  pg_dump "$DATABASE_URL" --no-owner --format=custom --file=reformas-$(date +%F).dump
  ```
  Guarda los volcados cifrados fuera de Vercel/Neon (contienen datos personales de los leads).
- **Restauración**:
  ```bash
  pg_restore --clean --if-exists --no-owner --dbname "$DATABASE_URL" reformas-AAAA-MM-DD.dump
  ```
  Tras restaurar, ejecuta `npm run db:check` y revisa `/admin`.

## Archivos (Vercel Blob)

- Las imágenes públicas y los adjuntos privados viven en dos stores. Vercel no ofrece versiones; para una copia, lista los blobs con el SDK (`list()`) y descárgalos a un almacenamiento propio de forma periódica.
- La tabla `media_assets` y `lead_attachments` guardan las claves (`storage_key`): una restauración de la base de datos sin los blobs deja enlaces rotos, y viceversa. Haz las dos copias juntas.

## Contenido

El contenido inicial está versionado en `content/`. Los cambios hechos en el panel solo viven en la base de datos: inclúyelos en las copias. `npm run db:seed` nunca pisa estados ni fechas de publicación editados.

## Qué borrar y cuándo (RGPD)

- Leads: conserva lo necesario para la relación comercial; borra desde la ficha (cascada a actividades, adjuntos y tareas; los eventos quedan anonimizados).
- Solicitudes de derechos: resuélvelas en `/admin/rgpd` dentro del plazo de un mes.
