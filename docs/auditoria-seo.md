# Auditoría SEO y plan de posicionamiento local (noviembre de 2026)

Web: https://reformasmardari.com · Empresa: Mardari Reformas Integrales SL, oficina en L'Hospitalet de Llobregat · Ámbito: toda España y, sobre todo, toda Cataluña.

## 1. Diagnóstico (antes de los cambios)

| Área | Estado encontrado | Impacto |
| --- | --- | --- |
| Rendimiento móvil | Resuelto el 18-11 (ver `docs/rendimiento.md`): de 67 a 88-95 en Lighthouse | Alto: Google penaliza LCP > 2,5 s en móvil |
| Indexación técnica | Correcta: sitemap.xml completo, robots.txt, canonicals, Open Graph, breadcrumbs, FAQ, Service y Article en JSON-LD, RSS | Base sólida |
| Páginas de zona | Solo 5 genéricas (Barcelona, Igualada, Anoia, Cataluña, España). Ninguna de L'Hospitalet, donde está la oficina, ni del Baix Llobregat | Muy alto: no se compite en ninguna búsqueda "reformas en <municipio>" |
| Textos de base | Varias páginas decían "base en Barcelona, Igualada y Anoia" (dato antiguo) | Medio: señales de ubicación incoherentes para Google |
| Blog | 20 guías genéricas (precios, permisos, instalaciones), ninguna local | Medio: sin contenido para búsquedas locales de intención informativa |
| Enlazado interno hacia zonas | Solo desde /zonas, /empresa y una línea del pie | Alto: las páginas locales no reciben autoridad interna |
| Metadatos de servicios | Título "X en L'Hospitalet de Llobregat y toda España" | Bajo-medio: poco local, sin comarca |
| Datos estructurados de empresa | HomeAndConstructionBusiness con teléfono, dirección y zonas; sin horario, sin catálogo de servicios, sin redes | Medio |
| Buscadores con IA | Sin llms.txt, sin reglas explícitas para GPTBot, ClaudeBot, PerplexityBot; contenido oculto hasta hidratar (ya corregido) | Medio-alto: ChatGPT, Claude y Perplexity leen el HTML renderizado y llms.txt |
| Search Console y Bing Webmaster | Sin verificar (campos vacíos en ajustes) | Alto: sin datos reales de posiciones ni envío a Google |
| Google Business Profile | Sin enlace en ajustes (`gbpUrl` vacío) | Muy alto para búsquedas locales y el mapa |
| Redes | Facebook configurado; Instagram faltaba en los ajustes (añadido) | Bajo |

## 2. Estrategia: municipios pequeños con poca competencia

En "reformas Barcelona" compiten cientos de empresas y directorios (Habitissimo, Cronoshare, Houzz). En "reformas en Vallirana" o "empresa de reformas Sant Just Desvern" la competencia son dos o tres webs locales poco optimizadas y los mismos directorios, con mucho menos contenido específico. Una página propia por municipio, con texto único sobre su parque de viviendas, sus trámites y su logística, puede entrar en la primera página en semanas y acumula clics de intención alta (quien busca "reformas en <su pueblo>" quiere presupuesto).

Criterios de selección: municipios de 5.000 a 90.000 habitantes a menos de 45 minutos de la oficina, con parque de vivienda que demanda reforma (bloques de los 60-70, urbanizaciones de casas de los 70-90, segunda residencia convertida en primera, cascos antiguos) y sin un competidor local dominante.

### Páginas creadas (37 zonas en total)

| Comarca | Municipios con página propia |
| --- | --- |
| Barcelonès | L'Hospitalet de Llobregat (oficina), Barcelona |
| Baix Llobregat | Cornellà, Esplugues, Sant Joan Despí, Sant Just Desvern, Sant Boi, Sant Feliu, Molins de Rei, Sant Vicenç dels Horts, El Prat, Viladecans, Gavà, Castelldefels, Sant Andreu de la Barca, Pallejà, Martorell, Olesa de Montserrat, Esparreguera, Abrera, Corbera, Cervelló, Vallirana, Begues |
| Garraf | Sitges, Vilanova i la Geltrú |
| Alt Penedès | Vilafranca del Penedès, Sant Sadurní d'Anoia |
| Anoia | Igualada, comarca de l'Anoia, Piera, Capellades, Masquefa, Vilanova del Camí, Santa Margarida de Montbui |
| Genéricas | Toda Cataluña, toda España |

### Palabras clave objetivo por página

Cada página de municipio ataca el mismo grupo de búsquedas con el nombre del municipio: "reformas en X", "empresa de reformas X", "reformas X", "reforma piso X", "reformar casa X", "reforma baño X", "reforma cocina X", "reforma local X". Volumen estimado por municipio: de 10 a 200 búsquedas al mes en los pequeños y de 200 a 900 en Cornellà, Castelldefels, Sant Boi, Viladecans, Gavà, Vilanova i la Geltrú y Sitges. Son estimaciones: el dato real aparecerá en Search Console a las 4-6 semanas. No usamos cifras de herramientas de pago porque la cuenta de Ahrefs no tiene plan activo.

Palabras clave de la portada y de servicios (más competidas, a medio plazo): "empresa de reformas L'Hospitalet", "reformas L'Hospitalet de Llobregat", "reformas Baix Llobregat", "reformas integrales Barcelona", "reforma cocina Barcelona", "reforma baño L'Hospitalet", "reforma local comercial Barcelona".

### Artículos locales publicados (blog)

1. Reformar un piso en L'Hospitalet de Llobregat: precios 2026, permisos y barrios.
2. Reformas en el Baix Llobregat: cuánto cuesta reformar un piso o una casa en cada municipio.
3. Reformar un piso de los años 60 y 70 en un bloque del Baix Llobregat o L'Hospitalet.
4. Reformar una casa o un apartamento en la costa: Castelldefels, Gavà Mar, Sitges y Vilanova.
5. Reformar una casa de urbanización en Corbera, Vallirana, Cervelló, Begues o Piera.
6. Licencia de obras en L'Hospitalet y el Baix Llobregat: comunicación previa, licencia y qué pide cada ayuntamiento.

Cada artículo enlaza a las páginas de zona y de servicio relacionadas, lleva FAQ con datos estructurados y fuentes oficiales.

## 3. Cambios técnicos aplicados

- Metadatos: títulos de servicio con sufijo local ("Reformas de cocinas en L'Hospitalet de Llobregat, Barcelona y Baix Llobregat"), descripción y palabras clave del sitio actualizadas (también en la base de datos de ajustes).
- Enlazado interno: bloque "Zonas de actuación" en la portada con enlace a cada municipio, ficha de empresa en la portada, catorce municipios enlazados desde el pie en todas las páginas, chips "Dónde ofrecemos este servicio" en cada página de servicio, zonas relacionadas por comarca en cada página de zona, índice /zonas agrupado por comarca.
- Datos estructurados: la empresa (HomeAndConstructionBusiness) incluye ahora todos los municipios en areaServed, horario (OpeningHoursSpecification), catálogo de servicios (OfferCatalog), nombre legal, eslogan, logo e Instagram y Facebook en sameAs.
- Buscadores con IA: `/llms.txt` generado desde el contenido (empresa en una frase, contacto, precios orientativos, todas las páginas con una línea de contexto), robots.txt con permiso explícito para GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot, Applebot y otros. Todo el contenido se sirve renderizado en el HTML (ver `docs/rendimiento.md`).
- Textos de base: "oficina en L'Hospitalet de Llobregat, obra en toda España y sobre todo en toda Cataluña" en FAQ, servicios, sectores, empresa, zonas y formulario.
- Contenido nuevo cargado también en la base de datos (local_areas, faqs de zona y artículos), que es lo que lee la web en producción.

## 4. Lo que tienes que hacer tú (no se puede hacer desde el código)

1. **Google Search Console** (10 minutos, el paso más importante): sigue `docs/indexacion-buscadores.md`. Pega el token en /admin/ajustes, verifica, envía el sitemap y solicita indexación de la portada, /zonas/hospitalet-de-llobregat, /zonas/cornella-de-llobregat, /zonas/castelldefels y los seis artículos nuevos.
2. **Bing Webmaster Tools**: importa desde Search Console. ChatGPT usa el índice de Bing para buscar en la web; sin Bing no hay citas en ChatGPT.
3. **Google Business Profile**: crea la ficha "Mardari Reformas Integrales" con la dirección de la oficina (Carrer General Prim 78, L'Hospitalet), categoría "Empresa de reformas", teléfono 711 506 037, web, horario, las fotos del logo y las áreas de servicio (los municipios de arriba). Pega el enlace de la ficha en /admin/ajustes → Integraciones (campo "Google Business Profile"). Pide reseña a cada cliente al terminar la obra.
4. **Citas y directorios con el mismo nombre, dirección y teléfono**: Habitissimo, Cronoshare, Houzz, Páginas Amarillas, Yelp, Cylex, QDQ, Infoisinfo, Europages. La coherencia del nombre, la dirección y el teléfono en todos ellos es lo que más pesa en el mapa de Google y en las respuestas de ChatGPT y Perplexity.
5. **Instagram y Facebook**: publica según `docs/instagram.md`; enlaza la web en la bio. Las menciones y enlaces desde redes aceleran el descubrimiento.
6. **Enlaces locales**: ayuntamientos (bolsas de empresas locales), asociaciones de comerciantes de L'Hospitalet y Baix Llobregat, proveedores (fabricantes de cocinas, almacenes de materiales) que listan instaladores, patrocinio de un club deportivo local con enlace. Dos o tres enlaces de dominios locales valen más que cien de directorios.
7. **Fotos reales**: en cuanto haya obras terminadas con permiso del cliente, sustituye los proyectos ilustrativos por reales, con la población en el título. Google y los asistentes con IA valoran la prueba real.
8. **Mide cada mes** en Search Console: consultas con "reformas" + municipio, posición media y clics por página de zona. Reescribe o amplía las páginas que se queden entre las posiciones 8 y 20: son las que están a un empujón.

## 5. Calendario orientativo

- Semana 1: Search Console, Bing, Google Business Profile, directorios.
- Semanas 2 a 4: indexación de las 32 páginas nuevas (IndexNow ya avisa a Bing en cada despliegue), primeras impresiones en Search Console.
- Mes 2: un artículo local nuevo cada dos semanas (temas en `content/blog.ts`, plan editorial: "cuánto cuesta reformar un baño en Cornellà", "reformar un local en Sant Boi", "ayudas a la rehabilitación en L'Hospitalet"), reseñas en Google.
- Mes 3: revisar posiciones y ampliar las páginas de los municipios con más impresiones; añadir municipios nuevos si conviene (Rubí, Sant Cugat, Cerdanyola, Badalona, Santa Coloma, Mataró, Granollers, Terrassa y Sabadell son los siguientes, con más competencia).

## 6. Cómo añadir una zona o un artículo nuevos

1. Crea `content/zones/<slug>.ts` o `content/articles/NN-<slug>.ts` copiando uno existente (mismo formato y mismas reglas: sin inventar datos, sin rayas largas, enlaces internos a rutas existentes).
2. Ejecuta `node scripts/generate-content-index.mjs` y `npm run test`.
3. Haz push: en cada despliegue de Vercel, `scripts/sync-on-build.mjs` carga en la base de datos las zonas, FAQs de zona y artículos de código que aún no existan (nunca pisa lo editado en el panel). También puedes ejecutarlo a mano con `npm run db:sync-local` (con `DATABASE_URL`) o generar SQL con `npx tsx scripts/local-content-sql.ts <carpeta>`. Las páginas aparecen en el sitemap y se avisa a IndexNow en el mismo despliegue.
4. En /admin/ajustes pulsa "Avisar a los buscadores ahora" y en Search Console solicita la indexación de la URL nueva.
