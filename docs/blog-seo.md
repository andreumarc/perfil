# Plan SEO del blog: 20 artículos iniciales

Documento de trabajo para el equipo editorial y de marketing. Cubre la matriz de keywords, el mapa de enlaces internos, los riesgos de canibalización, las fuentes citadas, el checklist de revisión previa a la publicación y el calendario de publicación y actualización.

Base de datos: los 20 ficheros de `content/articles/*.ts` tal y como están a fecha 2026-10-12 (todos en `status: "draft"`, `reviewedAt: "2026-10-12"`, autor `equipo-tecnico`). Los enlaces internos se han extraído con grep de los cuerpos markdown. No se incluyen volúmenes de búsqueda ni estimaciones de tráfico: se decidirán con Search Console y la herramienta de keywords cuando el blog lleve unas semanas publicado.

Convenciones del documento:

- Nº = número del artículo según el brief (01 a 20). Se usa como identificador corto en todo el documento.
- Intención: comercial (quien busca ya quiere contratar y pide precio), informativa (quiere entender un trámite o una tecnología) o mixta (precio y comprensión a partes iguales).
- Servicio al que empuja: la página `/servicios/<slug>` que debe recibir el enlace más visible del artículo (primer enlace de servicio del cuerpo y primero de `relatedServiceSlugs`).
- Variante de formulario: valor de `formVariant` (formulario contextual que se muestra bajo el artículo).

## 1. Matriz de keywords

### 1.1 Tabla principal

| Nº | Slug | Título | Keyword principal | Keywords secundarias (selección) | Intención | Categoría | Servicio al que empuja | Formulario | Prioridad |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | cuanto-cuesta-reforma-integral-piso | ¿Cuánto cuesta una reforma integral de un piso en 2026? Precios por m² y presupuesto detallado | precio reforma integral piso | cuánto cuesta una reforma integral; precio reforma integral por m2; presupuesto reforma integral piso; desglose presupuesto reforma | comercial | costes | reformas-integrales-viviendas | vivienda | 1 (ALTA) |
| 07 | cuanto-cuesta-reformar-local-comercial | ¿Cuánto cuesta reformar un local comercial en 2026? Precios por m² y tipo de negocio | precio reforma local comercial | cuánto cuesta reformar un local comercial; reforma local comercial precio m2; adecuación de local precio; coste reforma tienda | comercial | costes | reformas-locales-comerciales | local | 2 (ALTA) |
| 08 | reforma-locales-comerciales-barcelona-precios-licencias-plazos | Reforma de locales comerciales en Barcelona: precios, licencias y plazos | reforma locales comerciales Barcelona | licencia de actividad Barcelona; licencia de obras local Barcelona; comunicado de obras Barcelona local; cuánto tarda reformar un local | mixta | reformas-comerciales | reformas-locales-comerciales | local | 3 (ALTA) |
| 09 | reformar-restaurante-presupuesto-cocina-extraccion-normativa | Reformar un restaurante: presupuesto de obra, cocina, extracción y normativa | reforma restaurante precio | cuánto cuesta reformar un restaurante; montar un restaurante coste; extracción de humos restaurante; licencia de actividad restaurante | comercial | restaurantes | reformas-restaurantes | restaurante | 4 (ALTA) |
| 10 | cuanto-cuesta-montar-reformar-gimnasio | ¿Cuánto cuesta montar o reformar un gimnasio? Obras, instalaciones y presupuesto | reforma gimnasio precio | cuánto cuesta montar un gimnasio; presupuesto reforma gimnasio; pavimento gimnasio precio; licencia de actividad gimnasio | comercial | gimnasios | reformas-gimnasios | gimnasio | 5 (ALTA) |
| 06 | permisos-reformar-vivienda-cataluna-licencia-obras | Permisos para reformar una vivienda en Cataluña: cuándo necesitas licencia de obras | permiso reforma vivienda Cataluña | licencia de obras Cataluña; comunicación previa obras Cataluña; obra mayor o menor reforma piso; cuánto cuesta licencia de obras reforma | informativa | licencias | licencias-direccion-tecnica | vivienda | 6 |
| 04 | cuanto-cuesta-reformar-bano-completo | ¿Cuánto cuesta reformar un baño completo? Presupuesto por partidas y materiales | precio reforma baño completo | cuánto cuesta reformar un baño; presupuesto reforma baño; cambiar bañera por ducha precio; reforma baño pequeño precio | comercial | banos-cocinas | reformas-banos | vivienda | 7 |
| 05 | reforma-cocinas-precios-distribucion-instalaciones | Reforma de cocinas: precios, distribución, instalaciones y consejos para ahorrar | precio reforma cocina | cuánto cuesta reformar una cocina; reforma cocina 10 m2 precio; abrir cocina al salón; presupuesto reforma cocina por partidas | comercial | banos-cocinas | reformas-cocinas | vivienda | 8 |
| 15 | aire-acondicionado-conductos-o-cassette-locales | Aire acondicionado por conductos o cassette: precios y diferencias para locales | aire acondicionado local comercial | aire acondicionado por conductos precio; aire acondicionado cassette precio; climatizar un local precio; precio climatización local 100 m2 | mixta | climatizacion | climatizacion-aire-acondicionado | instalaciones | 9 |
| 16 | ventilacion-gimnasios-locales-rite | Ventilación de gimnasios y locales comerciales: requisitos del RITE y soluciones | ventilación gimnasio RITE | ventilación gimnasio normativa; renovación de aire local comercial; caudal ventilación gimnasio; recuperador de calor gimnasio precio | informativa | normativa | ventilacion-extraccion | gimnasio | 10 |
| 18 | reforma-oficinas-cuanto-cuesta-modernizar | Reforma de oficinas: cuánto cuesta modernizar un espacio de trabajo | reforma oficina precio | cuánto cuesta reformar una oficina; precio reforma oficina m2; reforma oficina sin parar la actividad; reforma de oficinas Barcelona | comercial | reformas-comerciales | reformas-oficinas | local | 11 |
| 11 | reforma-clinica-dental-distribucion-instalaciones-normativa | Reforma de clínicas dentales: distribución, instalaciones, normativa y costes | reforma clínica dental | montar una clínica dental coste; precio reforma clínica dental; distribución clínica dental; autorización sanitaria clínica dental | mixta | clinicas | reformas-clinicas | clinica | 12 |
| 02 | reformar-piso-70-90-120-m2-coste-tiempo | Reformar un piso de 70, 90 o 120 m²: cuánto cuesta y cuánto tiempo se tarda | cuánto cuesta reformar un piso | precio reforma piso 70 m2; precio reforma piso 90 m2; precio reforma piso 120 m2; cuánto se tarda en reformar un piso | comercial | reformas-viviendas | reformas-pisos | vivienda | 13 |
| 13 | instalacion-electrica-completa-vivienda-precio-certificado | Instalación eléctrica completa de una vivienda: precio, materiales y certificado | precio instalación eléctrica vivienda | cuánto cuesta una instalación eléctrica completa; renovar instalación eléctrica piso precio; boletín eléctrico precio; cuadro eléctrico vivienda precio | mixta | instalaciones | instalaciones-electricas | instalaciones | 14 |
| 17 | cuanto-cuesta-renovar-fontaneria-vivienda | ¿Cuánto cuesta renovar la fontanería de una vivienda? Precios y cuándo cambiarla | precio cambiar fontanería piso | cuánto cuesta cambiar la fontanería de un piso; cambiar tuberías de plomo precio; cuándo cambiar la fontanería; fontanería multicapa o PEX | mixta | instalaciones | fontaneria-saneamiento | instalaciones | 15 |
| 14 | aerotermia-viviendas-precio-cuando-merece-la-pena | Aerotermia en viviendas: cuánto cuesta instalarla y cuándo merece la pena | precio instalación aerotermia | aerotermia precio; aerotermia merece la pena; aerotermia con radiadores; ayudas aerotermia | mixta | climatizacion | calefaccion-aerotermia | instalaciones | 16 |
| 20 | reforma-energetica-vivienda-aislamiento-ventanas-climatizacion | Reforma energética de viviendas: aislamiento, ventanas, climatización y ahorro | reforma energética vivienda | rehabilitación energética vivienda precio; aislar vivienda precio; cambiar ventanas ahorro energético; ayudas rehabilitación energética | informativa | eficiencia-energetica | techos-aislamientos | vivienda | 17 |
| 19 | rehabilitacion-fachadas-precios-m2-aislamiento-permisos | Rehabilitación de fachadas: precios por m², aislamiento y permisos | rehabilitación fachada precio m2 | cuánto cuesta rehabilitar una fachada; precio SATE m2; rehabilitación fachada comunidad de propietarios; andamio fachada precio | comercial | eficiencia-energetica | rehabilitacion-fachadas | vivienda | 18 |
| 03 | reforma-integral-casa-antigua-precios-permisos | Reforma integral de una casa antigua: precios, permisos y errores que debes evitar | reforma integral casa antigua | precio reforma casa antigua; rehabilitar casa antigua; permisos reforma casa antigua; humedades casa antigua | mixta | reformas-viviendas | reformas-casas | vivienda | 19 |
| 12 | convertir-local-comercial-en-vivienda | Convertir un local comercial en vivienda: requisitos, permisos y coste de la reforma | convertir local en vivienda | cambio de uso local a vivienda; requisitos convertir local en vivienda; cuánto cuesta convertir un local en vivienda; cédula de habitabilidad local | informativa | licencias | licencias-direccion-tecnica | vivienda | 20 |

### 1.2 Por qué este orden de publicación

Los cinco prioritarios (01, 07, 08, 09, 10) van primero porque son los que el negocio ha marcado como ALTA y porque son los "hubs" de cada clúster: 01 abre el clúster de vivienda y 07 el de locales; 08, 09 y 10 son las variantes con mayor valor comercial (Barcelona, hostelería y gimnasios tienen ticket medio alto y formulario propio).

El resto se ordena con tres criterios, en este orden:

1. Resolver enlaces internos ya escritos. 06 (permisos) recibe 11 enlaces entrantes y 01 lo enlaza: publicarlo en tercera semana evita que el artículo más enlazado del blog esté en borrador. 04 y 05 reciben enlaces desde 01 y 02 y tienen calculadora propia (`/calculadoras/bano`, `/calculadoras/cocina`).
2. Cerrar el clúster comercial mientras los prioritarios están frescos. 15 y 16 reciben enlaces de 07, 08, 09 y 10; 18 y 11 completan los sectores (oficinas, clínicas) que 07 y 08 ya enlazan.
3. Completar el clúster de vivienda e instalaciones y dejar para el final la temporada de eficiencia energética (14, 20, 19) y los dos artículos más de nicho (03, 12), que tienen menos enlaces entrantes y dependen de los anteriores para contextualizarse.

El calendario detallado está en la sección 6.

## 2. Mapa de enlaces internos

### 2.1 Enlaces salientes por artículo

Resumen de lo que enlaza cada cuerpo (markdown). "Presupuesto" indica el número de enlaces a `/presupuesto`.

| Nº | Servicios enlazados | Artículos enlazados | Calculadoras | /presupuesto |
| --- | --- | --- | --- | --- |
| 01 | reformas-integrales-viviendas, reformas-pisos, reformas-cocinas, reformas-banos, instalaciones-electricas, fontaneria-saneamiento, climatizacion-aire-acondicionado, carpinteria, pintura-revestimientos, pladur-albanileria, suelos-pavimentos, proyectos-diseno, licencias-direccion-tecnica (x2) | 02, 04, 05, 06, 13, 17, 20 | reforma-integral (x2), bano, cocina, electricidad, pintura, pladur, suelos | 1 |
| 02 | reformas-pisos, reformas-integrales-viviendas, instalaciones-electricas, fontaneria-saneamiento, climatizacion-aire-acondicionado, suelos-pavimentos, proyectos-diseno, licencias-direccion-tecnica | 01, 04, 05, 06, 13, 17, 20 | reforma-integral, bano, cocina, electricidad | 1 |
| 03 | reformas-casas, rehabilitacion-edificios, rehabilitacion-fachadas, techos-aislamientos, calefaccion-aerotermia, licencias-direccion-tecnica | 01, 06, 14, 20 | reforma-integral | 1 |
| 04 | reformas-banos, fontaneria-saneamiento, suelos-pavimentos, instalaciones-electricas, pladur-albanileria, licencias-direccion-tecnica | 01, 05, 06, 13, 17 | bano | 2 |
| 05 | reformas-cocinas, instalaciones-electricas, fontaneria-saneamiento, iluminacion, ventilacion-extraccion, instalaciones-gas, suelos-pavimentos, licencias-direccion-tecnica | 01, 02, 04, 06, 13, 17 | cocina | 2 |
| 06 | licencias-direccion-tecnica, proyectos-diseno, reformas-integrales-viviendas, rehabilitacion-edificios, reformas-casas, reformas-comunidades, instalaciones-electricas | 01, 03, 12, 13, 19 | reforma-integral | 1 |
| 07 | reformas-locales-comerciales, adecuacion-locales, instalaciones-electricas, climatizacion-aire-acondicionado, ventilacion-extraccion, proteccion-contra-incendios, reformas-restaurantes, licencias-direccion-tecnica | 08, 09, 10, 11, 16, 18 | local-comercial (x3) | 2 |
| 08 | reformas-locales-comerciales, adecuacion-locales, instalaciones-electricas, climatizacion-aire-acondicionado, proteccion-contra-incendios, licencias-direccion-tecnica | 06, 07, 09, 10, 11, 12, 15, 18 | local-comercial (x2) | 1 |
| 09 | reformas-restaurantes, ventilacion-extraccion, instalaciones-gas, instalaciones-electricas, proteccion-contra-incendios, techos-aislamientos, licencias-direccion-tecnica | 07, 08, 15, 16 | local-comercial (x3) | 2 |
| 10 | reformas-gimnasios, ventilacion-extraccion, agua-caliente-sanitaria, suelos-pavimentos, instalaciones-electricas, proteccion-contra-incendios, licencias-direccion-tecnica | 07, 15, 16 | local-comercial (x3) | 2 |
| 11 | reformas-clinicas, instalaciones-electricas, climatizacion-aire-acondicionado, domotica-telecomunicaciones, proyectos-diseno, licencias-direccion-tecnica | 07, 08, 15 | local-comercial (x2) | 2 |
| 12 | licencias-direccion-tecnica, reformas-integrales-viviendas, proyectos-diseno, carpinteria, fontaneria-saneamiento, techos-aislamientos | 01, 06, 13 | reforma-integral (x3) | 2 |
| 13 | instalaciones-electricas (x2), iluminacion, domotica-telecomunicaciones, reformas-comunidades | 01, 06, 14 | electricidad | 2 |
| 14 | calefaccion-aerotermia (x2), agua-caliente-sanitaria, techos-aislamientos, reformas-integrales-viviendas | 13, 20 | climatizacion | 2 |
| 15 | climatizacion-aire-acondicionado (x2), reformas-locales-comerciales, adecuacion-locales, ventilacion-extraccion, instalaciones-electricas | 08, 16 | climatizacion | 2 |
| 16 | ventilacion-extraccion (x2), reformas-gimnasios, climatizacion-aire-acondicionado, agua-caliente-sanitaria, licencias-direccion-tecnica | 08, 10, 15 | climatizacion | 2 |
| 17 | fontaneria-saneamiento, reformas-banos, reformas-cocinas, agua-caliente-sanitaria | 01, 04, 06 | bano | 1 |
| 18 | reformas-oficinas, domotica-telecomunicaciones, climatizacion-aire-acondicionado, instalaciones-electricas, proteccion-contra-incendios, proyectos-diseno, licencias-direccion-tecnica | 07, 15 | local-comercial | 1 |
| 19 | rehabilitacion-fachadas, reformas-comunidades, techos-aislamientos, reformas-casas, licencias-direccion-tecnica | 06, 20 | pintura | 1 |
| 20 | techos-aislamientos, carpinteria, calefaccion-aerotermia, rehabilitacion-fachadas | 06, 14, 19 | climatizacion | 1 |

Observaciones sobre los salientes:

- Todos cumplen el mínimo del brief (3 servicios, 2 artículos, 1 calculadora). Ningún enlace apunta a una ruta inexistente.
- 01 enlaza 7 calculadoras distintas. Es útil como hub, pero conviene que la calculadora principal (`/calculadoras/reforma-integral`) sea la primera y la única repetida, y el resto se queden en la sección de partidas.
- 19 enlaza a `/calculadoras/pintura` porque no hay calculadora de fachadas. Es aceptable, pero el ancla debe dejar claro que sirve solo para la partida de pintura de fachada, no para el conjunto.
- 14, 15 y 16 ya enlazan a `/calculadoras/climatizacion` y 17 a `/calculadoras/bano`: coherente.
- Las páginas de servicios más enlazadas desde el blog son `licencias-direccion-tecnica` (18 artículos), `instalaciones-electricas` (14) y `climatizacion-aire-acondicionado` (9). Hay servicios que ningún artículo enlaza: reformas-hoteles, reformas-naves-industriales, cerrajeria, proteccion-contra-incendios sí (6), pero reformas-comunidades solo 3. Hoteles y naves son candidatos para artículos de la siguiente tanda.

### 2.2 Enlaces entrantes por artículo (desde otros artículos)

| Nº | Artículo | Entrantes | Desde |
| --- | --- | --- | --- |
| 06 | permisos-reformar-vivienda-cataluna-licencia-obras | 11 | 01, 02, 03, 04, 05, 08, 12, 13, 17, 19, 20 |
| 01 | cuanto-cuesta-reforma-integral-piso | 8 | 02, 03, 04, 05, 06, 12, 13, 17 |
| 13 | instalacion-electrica-completa-vivienda-precio-certificado | 7 | 01, 02, 04, 05, 06, 12, 14 |
| 15 | aire-acondicionado-conductos-o-cassette-locales | 6 | 08, 09, 10, 11, 16, 18 |
| 07 | cuanto-cuesta-reformar-local-comercial | 5 | 08, 09, 10, 11, 18 |
| 08 | reforma-locales-comerciales-barcelona-precios-licencias-plazos | 5 | 07, 09, 11, 15, 16 |
| 20 | reforma-energetica-vivienda-aislamiento-ventanas-climatizacion | 5 | 01, 02, 03, 14, 19 |
| 04 | cuanto-cuesta-reformar-bano-completo | 4 | 01, 02, 05, 17 |
| 16 | ventilacion-gimnasios-locales-rite | 4 | 07, 09, 10, 15 |
| 17 | cuanto-cuesta-renovar-fontaneria-vivienda | 4 | 01, 02, 04, 05 |
| 05 | reforma-cocinas-precios-distribucion-instalaciones | 3 | 01, 02, 04 |
| 10 | cuanto-cuesta-montar-reformar-gimnasio | 3 | 07, 08, 16 |
| 14 | aerotermia-viviendas-precio-cuando-merece-la-pena | 3 | 03, 13, 20 |
| 02 | reformar-piso-70-90-120-m2-coste-tiempo | 2 | 01, 05 |
| 09 | reformar-restaurante-presupuesto-cocina-extraccion-normativa | 2 | 07, 08 |
| 11 | reforma-clinica-dental-distribucion-instalaciones-normativa | 2 | 07, 08 |
| 12 | convertir-local-comercial-en-vivienda | 2 | 06, 08 |
| 18 | reforma-oficinas-cuanto-cuesta-modernizar | 2 | 07, 08 |
| 19 | rehabilitacion-fachadas-precios-m2-aislamiento-permisos | 2 | 06, 20 |
| 03 | reforma-integral-casa-antigua-precios-permisos | 1 | 06 |

### 2.3 Artículos huérfanos y débiles

No hay huérfanos en sentido estricto: los 20 artículos reciben al menos un enlace desde otro artículo. Sí hay un grupo débil con 1 o 2 entrantes (02, 03, 09, 11, 12, 18, 19) que incluye un prioritario (09) y los dos artículos de precio por sector con formulario propio (11 y 18); 10, también prioritario, se queda en 3. El objetivo es que ningún artículo tenga menos de 3 entrantes y que los prioritarios tengan al menos 4.

Enlaces concretos a añadir (artículo origen, sección H2 donde insertarlo, destino y ancla sugerida):

| Origen | Sección H2 del origen | Destino | Ancla sugerida |
| --- | --- | --- | --- |
| 01 | Qué factores cambian el presupuesto | 03 | "si es una casa antigua, los imprevistos de estructura y humedades cambian el cálculo" |
| 19 | Aislamiento de fachadas: SATE y otras opciones | 03 | "reforma integral de una casa antigua" (caso de vivienda unifamiliar con fachada propia) |
| 20 | Por dónde empezar: envolvente, huecos e instalaciones | 03 | "en una casa antigua el orden de actuación cambia" |
| 06 | Plazos: cuánto tarda y cuándo puedes empezar | 02 | "cuánto tiempo se tarda en reformar un piso" |
| 13 | Cuándo hay que renovar la instalación eléctrica de una vivienda | 02 | "reforma completa de un piso de 70, 90 o 120 m²" |
| 17 | Cuándo hay que cambiar la fontanería de una vivienda | 02 | "si vas a reformar el piso entero, aprovecha la obra" |
| 15 | Factores que cambian el presupuesto | 09 | "en un restaurante la climatización compite con la extracción de humos" |
| 16 | Soluciones de ventilación para gimnasios y locales | 09 | "extracción de humos de un restaurante" (es un caso aparte del RITE) |
| 15 | Conductos o cassette: diferencias que importan en un local | 18 | "en oficinas suele ganar el sistema por conductos" |
| 16 | Qué exige el RITE a la ventilación de un local con público | 18 | "oficinas con alta ocupación" |
| 11 | Plazos orientativos | 18 | "reformar por fases sin parar la actividad" |
| 15 | Factores que cambian el presupuesto | 11 | "en clínicas dentales la climatización se dimensiona por gabinete" |
| 18 | Licencias y normativa para reformar una oficina | 11 | "si la actividad es sanitaria, además necesitarás autorización" |
| 13 | Certificado de instalación eléctrica (boletín): qué es y cómo se tramita | 12 | "al convertir un local en vivienda el boletín es obligatorio" |
| 17 | Cuándo hay que cambiar la fontanería de una vivienda | 12 | "un local convertido en vivienda necesita red de agua y desagües nuevos" |
| 03 | Normativa que condiciona la obra | 19 | "rehabilitación de fachadas: precios por m² y permisos" |
| 14 | Cuándo merece la pena la aerotermia | 19 | "antes de cambiar la caldera, aislar la fachada reduce la potencia necesaria" |
| 09 | Normativa que condiciona la reforma de un restaurante | 10 | "gimnasios y otros locales con público" (opcional, refuerza el clúster de locales) |

Con estos cambios la distribución mínima pasa a: 03 (4 entrantes), 02 (5), 09 (4), 11 (4), 12 (4), 18 (5), 19 (4). Se recomienda hacerlos en el mismo commit en que se publique cada artículo destino, para no enlazar a borradores.

Regla de mantenimiento: cada artículo nuevo debe enlazar a 2 o 3 artículos existentes y recibir al menos 2 enlaces desde artículos ya publicados antes de salir.

## 3. Riesgos de canibalización

### 3.1 Entre artículos

| Par | Riesgo | Por qué | Cómo evitarlo |
| --- | --- | --- | --- |
| 01 vs 02 | Alto | Ambos responden a "cuánto cuesta reformar un piso" con tabla por m², desglose de partidas, ejemplo simulado y consejos. Las secundarias se solapan: 01 lleva "precio reforma piso m2" y 02 lleva "reforma integral piso precio m2" y "presupuesto reforma piso". | 01 se queda con el precio por m² y cómo leer un presupuesto (partidas, IVA, garantías). 02 se centra en superficie y plazo: tabla por 70, 90 y 120 m² y cronograma por semanas. Quitar de 02 las secundarias "reforma integral piso precio m2" y "presupuesto reforma piso"; quitar de 01 "precio reforma piso m2". En 02, sustituir el desglose de partidas por una tabla corta por tamaño y un enlace a 01 con ancla "desglose completo de partidas". Sin canonical: la intención difiere. Si en 3 meses Search Console muestra que las dos URLs alternan posiciones para la misma query, fusionar 02 en 01 como sección y redirigir 301. |
| 07 vs 08 | Alto | 08 repite la tabla de precio por m², el desglose de partidas y el ejemplo de "tienda de 100 m²" que ya están en 07. Secundarias solapadas: "reforma local en bruto precio" (07) y "reforma local en bruto precio m2" (08). | 07 es el artículo de precio (genérico, España y Cataluña, por tipo de negocio). 08 es el artículo de Barcelona: licencias (comunicado, licencia de obras, licencia de actividad), plazos reales, logística de obra en la ciudad y sobrecostes locales. En 08 reducir la tabla de precios a una línea con rango y enlace a 07; mantener el ejemplo simulado pero con enfoque en tasas, plazos y ocupación de vía pública. Quitar de 08 "reforma local en bruto precio m2". Cambiar el H2 "Desglose de partidas: en qué se va el dinero" de 08 por "Qué encarece una reforma de local en Barcelona". |
| 14 vs 20 | Medio | 20 incluye la secundaria "aerotermia o caldera" y una sección de climatización con precios; 14 es el artículo de aerotermia. Los dos citan ayudas e IDAE. | 20 es la guía global (envolvente, huecos, instalaciones, ahorro, ayudas). Su sección de climatización no debe repetir rangos de precio de aerotermia: una frase con rango y enlace a 14 con ancla "precio de instalar aerotermia". 14 no habla de ventanas ni fachada salvo para remitir a 20 y 19. Mantener "aerotermia o caldera" en 20 porque es una comparativa que 14 no hace. |
| 15 vs 16 | Medio | Ambos son climatización de locales con público, citan RITE y tienen ejemplo simulado en local comercial. 16 incluye costes de ventilación; 15 incluye ventilación como partida. | 15 = frío y calor (conductos vs cassette, potencia, precio). 16 = renovación de aire y calidad del aire (caudales, IDA, recuperadores). En 15, la ventilación aparece solo como partida con enlace a 16; en 16, la climatización solo como "equipo que se combina" con enlace a 15. Las keywords ya están separadas; no tocar. |
| 10 vs 16 | Medio | 10 lleva la secundaria "ventilación gimnasio" (muy próxima a la principal de 16) y tiene un H2 propio de ventilación. | Quitar "ventilación gimnasio" de las secundarias de 10. Mantener su H2 pero acortarlo a lo que afecta al presupuesto, con enlace a 16 en el primer párrafo. |
| 06 vs 12 | Bajo | Ambos en categoría licencias. 12 trata el cambio de uso, 06 la licencia de obras en vivienda. | Ya enlazados en ambos sentidos. 06 no debe desarrollar el cambio de uso más allá de un párrafo. |
| 06 vs 08 | Bajo | 06 tiene H2 "El caso de Barcelona" y secundaria "licencia obras Barcelona reforma piso"; 08 trata licencias de local en Barcelona. | Diferencia clara vivienda vs local. Mantener. Si se crea más adelante un artículo "licencia de obras Barcelona" genérico, habrá que repartir. |
| 04 vs 17 | Bajo | 04 incluye partidas de fontanería; 17 incluye el baño como motivo de cambio. | 17 trata la red completa de la vivienda; 04 solo la fontanería del baño. Ya enlazados. |
| 03 vs 19 y 20 | Bajo | 03 lleva "aislar casa antigua" y "humedades"; 19 y 20 tratan aislamiento. | 03 habla de aislamiento solo como partida y decisión; remite a 19 (fachada) y 20 (envolvente). Añadir el enlace 03 a 19 propuesto en 2.3. |
| 07 vs 18 y 11 | Bajo | 07 tiene tabla "precio según tipo de negocio" con oficinas y clínicas. | Es correcto que 07 dé el rango y los artículos de sector lo desarrollen. Vigilar que 07 no crezca en esas filas. |

### 3.2 Con páginas de servicios

Las páginas `/servicios/<slug>` compiten con los artículos cuando sus cuerpos incluyen tablas de precio por m², desglose de partidas o explicación larga de licencias. El reparto debe ser:

- Página de servicio: intención transaccional. Keyword tipo "reforma de X", "empresa de reformas de X", "reforma X Barcelona". Contenido: qué incluye, cómo trabajamos, plazos orientativos, normativa en 1 o 2 párrafos, FAQs, CTA. Una sola línea con rango de precio y enlace al artículo de precio.
- Artículo: intención informativa o comercial de investigación. Keyword tipo "precio de X", "cuánto cuesta X", "permisos para X". Contenido largo, tablas, ejemplo simulado.

Pares a vigilar:

| Servicio | Artículo | Qué hacer |
| --- | --- | --- |
| reformas-integrales-viviendas y reformas-pisos | 01, 02 | El cuerpo del servicio no incluye tabla de precios por m². Si la tiene, dejar un rango de una línea y enlace a 01. El servicio apunta a "reforma integral piso Barcelona" y "empresa reformas integrales". |
| reformas-locales-comerciales y adecuacion-locales | 07, 08 | Mismo criterio. El servicio puede tener un H2 corto "Precio orientativo" con un enlace a 07, y nada sobre licencias de Barcelona (eso es 08). |
| reformas-restaurantes | 09 | El servicio no desarrolla la extracción de humos ni la normativa: enlace a 09. |
| reformas-gimnasios | 10 | El servicio no incluye tabla de pavimentos deportivos: enlace a 10. |
| reformas-clinicas | 11 | El servicio no desarrolla la autorización sanitaria: enlace a 11. |
| reformas-oficinas | 18 | El servicio no incluye ejemplo de presupuesto: enlace a 18. |
| reformas-banos y reformas-cocinas | 04, 05, 17 | Servicios sin tabla de materiales ni precios unitarios. |
| instalaciones-electricas | 13 | El servicio no explica el boletín con detalle: una frase y enlace a 13. |
| fontaneria-saneamiento | 17 | Igual. |
| calefaccion-aerotermia | 14, 20 | El servicio no compara aerotermia con caldera ni cita ayudas con detalle. |
| climatizacion-aire-acondicionado y ventilacion-extraccion | 15, 16 | El servicio no compara conductos vs cassette ni explica caudales. |
| rehabilitacion-fachadas y reformas-comunidades | 19 | El servicio no incluye precio del SATE por m². |
| licencias-direccion-tecnica y proyectos-diseno | 06, 12 | El servicio describe qué tramitamos; el "cuándo necesitas licencia" vive en 06. |

No se recomienda canonical entre servicio y artículo: son páginas distintas con intenciones distintas. El canonical de cada artículo debe apuntar a sí mismo.

### 3.3 Con calculadoras

Las calculadoras (`/calculadoras/<id>`) deben posicionar para "calculadora precio reforma X" o "simulador presupuesto X", no para "precio reforma X". Para evitar que compitan con 01, 04, 05, 07, 13, 15 y 16:

- Texto de la calculadora corto (300 a 500 palabras): qué calcula, qué no incluye, aviso de orientativo e IVA, y enlace al artículo de precio correspondiente ("cómo se calcula este precio: ver el artículo").
- No añadir tablas de precio por m² en las calculadoras; las tablas viven en los artículos.
- Correspondencia: reforma-integral con 01 y 02; bano con 04 y 17; cocina con 05; electricidad con 13; climatizacion con 14, 15 y 16; local-comercial con 07, 08, 09, 10, 11 y 18; pintura con 19 (solo partida de pintura); pladur y suelos con 01.
- Si una calculadora llega a posicionar para una query de precio por encima del artículo, no se corrige con canonical: se revisa el título y el H1 de la calculadora para que digan "calculadora" o "simulador".

### 3.4 Con páginas de zona

Las páginas `/zonas/barcelona` y `/zonas/cataluna` pueden solaparse con 08 (locales Barcelona) y 06 (permisos Cataluña). Las páginas de zona hablan de logística y servicios en la zona; no deben desarrollar precios ni licencias. Enlace de `/zonas/barcelona` a 08 y de `/zonas/cataluna` a 06.

## 4. Fuentes citadas

Lista consolidada de las 11 URLs usadas en el campo `sources` de los artículos. Todas pertenecen a la lista permitida del brief.

| Fuente | URL | Artículos que la citan | Total |
| --- | --- | --- | --- |
| Código Técnico de la Edificación (RD 314/2006), BOE | https://www.boe.es/buscar/act.php?id=BOE-A-2006-5515 | 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 | 20 |
| Generalitat de Catalunya | https://web.gencat.cat/ | 01, 02, 03, 04, 05, 06, 07, 08, 10, 11, 12, 13, 14, 16, 18, 19, 20 | 17 |
| Reglamento Electrotécnico para Baja Tensión (RD 842/2002), BOE | https://www.boe.es/buscar/act.php?id=BOE-A-2002-18099 | 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 15, 18 | 16 |
| Reglamento de Instalaciones Térmicas en los Edificios (RD 1027/2007), BOE | https://www.boe.es/buscar/act.php?id=BOE-A-2007-15820 | 01, 02, 03, 07, 08, 09, 10, 11, 14, 15, 16, 17, 18, 20 | 14 |
| Ayuntamiento de Barcelona | https://ajuntament.barcelona.cat/ | 02, 04, 05, 06, 07, 08, 09, 12, 15, 16, 18, 19 | 12 |
| Código Técnico de la Edificación (sitio oficial, documentos básicos) | https://www.codigotecnico.org/ | 04, 05, 10, 16, 17, 19, 20 | 7 |
| IDAE | https://www.idae.es/ | 03, 13, 14, 15, 19, 20 | 6 |
| Reglamento de instalaciones de protección contra incendios (RD 513/2017), BOE | https://www.boe.es/buscar/act.php?id=BOE-A-2017-6606 | 07, 08, 09, 10, 11, 18 | 6 |
| Ley de Ordenación de la Edificación (Ley 38/1999), BOE | https://www.boe.es/buscar/act.php?id=BOE-A-1999-21567 | 01, 02, 03, 06, 12 | 5 |
| Reglamento técnico de distribución y utilización de combustibles gaseosos (RD 919/2006), BOE | https://www.boe.es/buscar/act.php?id=BOE-A-2006-15345 | 05, 09, 17 | 3 |
| MITECO | https://www.miteco.gob.es/ | 20 | 1 |

Notas:

- Ningún artículo supera las 6 fuentes. 13 y 17 llevan 4; el resto 5 o 6.
- Las URLs de Generalitat, Ayuntamiento de Barcelona, IDAE y MITECO son portadas. Es correcto como fuente genérica, pero en la revisión editorial se puede sustituir por la página concreta del trámite (licencias, ayudas) si el revisor la verifica a mano. No añadir URLs profundas sin comprobarlas en el navegador el mismo día.
- Los artículos que citan licencia de actividad o comunicado de obras en municipios distintos de Barcelona (16 cita Igualada, 14 cita Anoia) remiten a "la ordenanza municipal" sin URL. Mantenerlo así hasta tener la URL verificada del ayuntamiento correspondiente.

## 5. Checklist de revisión editorial antes de publicar

Aplicar a cada artículo, en este orden. Quien revisa marca cada punto y anota la fecha en `reviewedAt`.

### 5.1 Contenido y veracidad

- [ ] Precios: todos los importes llevan "orientativo", "según mercado" o "varía según proyecto", indican IVA excluido y remiten a visita para presupuesto real. Ningún precio exacto garantizado.
- [ ] Ejemplos de presupuesto: etiquetados como "Ejemplo simulado" en el H2 y en la primera frase. Las sumas de la tabla cuadran.
- [ ] Rangos contrastados con 2 o 3 presupuestos reales recientes de la empresa (sin publicarlos). Si un rango queda fuera del mercado actual, ajustar y anotar en el changelog interno.
- [ ] Normativa: solo normas de la lista permitida (CTE y DB, RITE, REBT, LOE, RIPCI, gas, RD 1627/1997, Ley 3/2012 y Decreto 64/2014 de Cataluña, ordenanzas). Sin artículos, porcentajes ni plazos de tramitación inventados. Verbos "suele", "habitualmente" donde no hay certeza.
- [ ] Habilitaciones: electricidad, gas, climatización/RITE y PCI aparecen como trabajos de profesionales o empresas habilitados, sin afirmar que la empresa posee la habilitación.
- [ ] Sin experiencia inventada: nada de años, clientes, proyectos concretos, testimonios, certificaciones ni cifras de empresa.
- [ ] Zona: sin oficinas ni delegaciones. Base en Barcelona, Igualada y Anoia; actuación en Cataluña y España.
- [ ] Tono: español de España, segunda persona, sin frases hechas de IA, sin rayas largas, sin emojis, sin listas de tres por inercia.
- [ ] Sin FAQ dentro del body; las FAQ están en `faqs` (4 a 6, respuestas de 2 a 4 frases).
- [ ] Extensión dentro del rango del brief (1.800 a 3.200 palabras los prioritarios, 1.400 a 2.400 el resto). Varios borradores superan el máximo al contar tablas; decidir si se recorta o se acepta, y recalcular `readingMinutes`.

### 5.2 Enlaces

- [ ] Todos los enlaces internos apuntan a rutas existentes (servicios, sectores, calculadoras, zonas, /presupuesto, /contacto y los 20 slugs de blog). Comprobar con el script de índice de contenido.
- [ ] Ningún enlace a un artículo que siga en borrador en la fecha de publicación. Si lo hay, retrasar ese enlace o publicar antes el destino (ver calendario).
- [ ] Mínimos cumplidos: 3 servicios, 2 artículos, 1 calculadora, 1 enlace a /presupuesto en "Siguiente paso".
- [ ] Enlaces entrantes: el artículo recibe al menos 2 enlaces desde artículos ya publicados (añadir los de la sección 2.3 en el mismo commit).
- [ ] Anclas descriptivas (no "aquí", "este artículo").
- [ ] Fuentes externas: URLs abiertas y comprobadas en el navegador el día de la revisión; máximo 6; sin enlaces a competidores ni a sitios no oficiales.

### 5.3 Imagen

- [ ] Fichero en `public/images/blog/<nn>-<slug>.webp` con la ruta exacta de `coverImagePath`.
- [ ] Resolución mínima 1600 px de ancho (ideal 1920 x 1080 o 1600 x 900), peso inferior a 250 KB en WebP, sin texto incrustado, sin logos ni marcas de terceros, sin personas identificables sin cesión de derechos.
- [ ] Fotografía propia o con licencia que permita uso comercial; sin imágenes de obras ajenas presentadas como propias.
- [ ] Texto alternativo descriptivo (qué se ve, no la keyword repetida), definido donde el componente de artículo lo tome (título o campo específico si se añade).
- [ ] Imagen para Open Graph: la misma cover o una versión 1200 x 630.

### 5.4 Metadatos y SEO on-page

- [ ] `metaTitle` de 60 caracteres o menos, con la keyword principal al principio y sin repetir el nombre de la web si el layout ya lo añade.
- [ ] `metaDescription` de 120 a 155 caracteres, con keyword y llamada a la acción implícita.
- [ ] `excerpt` de 140 a 200 caracteres y distinto de la metaDescription.
- [ ] Un solo H1 (el título). H2 y H3 sin saltos de nivel. El índice se genera desde los H2/H3: comprobar que los títulos tengan sentido fuera de contexto.
- [ ] Keyword principal en el título, en el primer párrafo, en al menos un H2 y en la metaDescription. Secundarias repartidas en H2/H3 sin forzar.
- [ ] Canonical a la propia URL. Sin parámetros.
- [ ] `categorySlug` correcto y `tags` entre 4 y 8.
- [ ] `relatedServiceSlugs` entre 2 y 5, todos existentes, el primero es el servicio al que empuja.

### 5.5 Autor, fechas y estado

- [ ] `authorSlug: "equipo-tecnico"` y ficha de autor publicada con descripción real del equipo (sin credenciales inventadas).
- [ ] `reviewedAt` actualizado a la fecha de la revisión final. Añadir `publishedAt` si el tipo lo contempla; si no, usar la fecha de `reviewedAt` como fecha de publicación visible.
- [ ] Mientras `status` sea `draft`, la página no se indexa (noindex y fuera del sitemap) y no aparece en listados ni en enlaces relacionados. Verificarlo en el entorno de preview antes del primer artículo.
- [ ] Al cambiar a `published`, la URL entra en el sitemap y se envía a Search Console (inspección de URL) el mismo día.
- [ ] Programación: la fecha de publicación coincide con el calendario de la sección 6. Si se adelanta o retrasa, actualizar el calendario y revisar los enlaces entrantes afectados.

### 5.6 Conversión

- [ ] `formVariant` coherente con el tema (vivienda, local, gimnasio, restaurante, clinica, instalaciones). El formulario contextual aparece bajo el artículo y se envía correctamente en preview.
- [ ] Sección "Siguiente paso" corta, con CTA a /presupuesto y sin describir el formulario.
- [ ] Calculadora enlazada coherente con el tema y operativa.
- [ ] Evento de analítica de clic en CTA y envío de formulario comprobados en la consola de depuración de GTM (solo con consentimiento).

### 5.7 Datos estructurados

- [ ] `Article` (o `BlogPosting`) con headline, description, image, datePublished, dateModified, author (Organization o Person según decisión de empresa) y publisher con logo.
- [ ] `FAQPage` generado a partir del campo `faqs`, con las mismas preguntas y respuestas visibles en la página.
- [ ] `BreadcrumbList` (Inicio > Blog > Categoría > Artículo).
- [ ] Validación con la prueba de resultados enriquecidos de Google y con el validador de Schema.org sin errores. Las advertencias se anotan pero no bloquean.
- [ ] No marcar `HowTo` ni `Product`: no aplican y pueden generar avisos.

### 5.8 Técnico

- [ ] `npm run typecheck` y el script de índice de contenido pasan sin errores tras el cambio.
- [ ] Sin backticks ni la secuencia de dólar y llave dentro del template literal.
- [ ] Vista previa en móvil: tablas con scroll horizontal, sin desbordes; tiempo de carga de la cover aceptable.
- [ ] Enlaces de la sección "Siguiente paso" y del formulario probados en móvil.

## 6. Calendario de publicación y plan de actualización

### 6.1 Calendario sugerido (2 artículos por semana, 10 semanas)

Fechas de referencia: lunes y jueves, empezando el lunes 19 de octubre de 2026. Si se cambia la fecha de inicio, mantener el orden y la separación.

| Semana | Fecha | Nº | Artículo | Motivo del orden | Enlaces entrantes a añadir ese día |
| --- | --- | --- | --- | --- | --- |
| 1 | lun 19 oct | 01 | cuanto-cuesta-reforma-integral-piso | Hub del clúster vivienda, prioritario | Ninguno (primero). Enlazar desde `/servicios/reformas-integrales-viviendas` y `/calculadoras/reforma-integral` |
| 1 | jue 22 oct | 07 | cuanto-cuesta-reformar-local-comercial | Hub del clúster locales, prioritario | Desde `/servicios/reformas-locales-comerciales` y `/calculadoras/local-comercial` |
| 2 | lun 26 oct | 08 | reforma-locales-comerciales-barcelona-precios-licencias-plazos | Prioritario, apoyado por 07 | 07 ya lo enlaza. Desde `/zonas/barcelona` |
| 2 | jue 29 oct | 09 | reformar-restaurante-presupuesto-cocina-extraccion-normativa | Prioritario, formulario propio | 07 y 08 ya lo enlazan. Desde `/servicios/reformas-restaurantes` y `/sectores/restaurantes` |
| 3 | lun 2 nov | 10 | cuanto-cuesta-montar-reformar-gimnasio | Prioritario, formulario propio | 07 y 08 ya lo enlazan. Desde `/servicios/reformas-gimnasios` y `/sectores/gimnasios` |
| 3 | jue 5 nov | 06 | permisos-reformar-vivienda-cataluna-licencia-obras | Artículo más enlazado (11 entrantes); 01 y 08 ya apuntan a él | Desde `/servicios/licencias-direccion-tecnica` y `/zonas/cataluna` |
| 4 | lun 9 nov | 04 | cuanto-cuesta-reformar-bano-completo | Enlazado desde 01; calculadora propia | Desde `/servicios/reformas-banos` y `/calculadoras/bano` |
| 4 | jue 12 nov | 05 | reforma-cocinas-precios-distribucion-instalaciones | Enlazado desde 01 y 04; calculadora propia | Desde `/servicios/reformas-cocinas` y `/calculadoras/cocina` |
| 5 | lun 16 nov | 15 | aire-acondicionado-conductos-o-cassette-locales | Enlazado desde 08, 09, 10; completa clúster locales | Añadir enlaces 15 a 09, 11 y 18 (sección 2.3) cuando esos destinos estén publicados |
| 5 | jue 19 nov | 16 | ventilacion-gimnasios-locales-rite | Enlazado desde 07, 09, 10, 15 | Añadir enlaces 16 a 09 y 18 |
| 6 | lun 23 nov | 18 | reforma-oficinas-cuanto-cuesta-modernizar | Sector comercial, enlazado desde 07 y 08 | Añadir en 15 y 16 los enlaces hacia 18. Desde `/servicios/reformas-oficinas` |
| 6 | jue 26 nov | 11 | reforma-clinica-dental-distribucion-instalaciones-normativa | Sector comercial, formulario propio | Añadir en 15 y 18 los enlaces hacia 11. Desde `/servicios/reformas-clinicas` |
| 7 | lun 30 nov | 02 | reformar-piso-70-90-120-m2-coste-tiempo | Complementa 01 tras aplicar el reparto de la sección 3.1 | Añadir en 06 el enlace hacia 02 |
| 7 | jue 3 dic | 13 | instalacion-electrica-completa-vivienda-precio-certificado | Recibe 7 entrantes ya escritos (01, 02, 04, 05, 06) | Añadir en 13 los enlaces hacia 02 y 12 (12 cuando se publique). Desde `/servicios/instalaciones-electricas` y `/calculadoras/electricidad` |
| 8 | lun 7 dic | 17 | cuanto-cuesta-renovar-fontaneria-vivienda | Recibe 4 entrantes (01, 02, 04, 05) | Añadir en 17 el enlace hacia 02. Desde `/servicios/fontaneria-saneamiento` |
| 8 | jue 10 dic | 14 | aerotermia-viviendas-precio-cuando-merece-la-pena | Inicio de temporada de calefacción y ayudas | Añadir en 14 el enlace hacia 19 cuando se publique. Desde `/servicios/calefaccion-aerotermia` y `/calculadoras/climatizacion` |
| 9 | lun 14 dic | 20 | reforma-energetica-vivienda-aislamiento-ventanas-climatizacion | Guía global; 14 ya publicado | Añadir en 20 el enlace hacia 03 cuando se publique |
| 9 | jue 17 dic | 19 | rehabilitacion-fachadas-precios-m2-aislamiento-permisos | Cierra clúster energético; 06 y 20 lo enlazan | Añadir en 14 el enlace hacia 19. Desde `/servicios/rehabilitacion-fachadas` y `/sectores/comunidades-propietarios` |
| 10 | lun 21 dic | 03 | reforma-integral-casa-antigua-precios-permisos | Nicho; necesita los enlaces nuevos de 01, 19 y 20 | Añadir en 01, 19 y 20 los enlaces hacia 03 |
| 10 | jue 24 dic | 12 | convertir-local-comercial-en-vivienda | Nicho; depende de 06, 13 y 17 | Añadir en 13 y 17 los enlaces hacia 12 |

Notas de calendario:

- La semana 10 cae en Navidad. Si el equipo prefiere no publicar el 24 de diciembre, mover 12 al lunes 28 de diciembre o al 4 de enero sin alterar el resto.
- Los enlaces de un artículo publicado hacia uno aún en borrador deben estar ocultos o eliminados hasta que el destino salga. Si el componente de markdown no filtra enlaces a borradores, retirarlos a mano y reponerlos en la fecha del destino.
- Cada publicación va acompañada de: envío de la URL a Search Console, una publicación en redes de la empresa y, si hay lista de contactos, inclusión en el siguiente envío.

### 6.2 Seguimiento tras la publicación

- Semana 2 tras publicar cada artículo: comprobar en Search Console que está indexado y qué queries muestra.
- Mes 1: anotar queries con impresiones y posición. No tocar el contenido todavía.
- Mes 3: para cada par de la sección 3.1, comprobar si las dos URLs aparecen para la misma query. Si una se come a la otra de forma estable, aplicar el reparto de keywords o la fusión descrita.
- Mes 3: revisar los artículos con menos de 3 enlaces entrantes y menos clics; añadir enlaces desde los que más tráfico reciben.

### 6.3 Plan de actualización

Revisión semestral de precios (abril y octubre):

- Revisar todos los rangos de precio y los ejemplos simulados de los 20 artículos contra presupuestos reales recientes y precios de materiales. Ajustar rangos; nunca convertirlos en precios fijos.
- Actualizar el año de títulos y metaTitles que lo incluyen (01, 07, 18) en enero, y los ejemplos "en 2026" del cuerpo. Mantener el slug sin año para no redirigir.
- Actualizar `reviewedAt` y `dateModified` en los datos estructurados. Si el cambio es relevante, cambiar también el excerpt.
- Registrar los cambios en un changelog interno (fecha, artículo, qué rango cambió).

Revisión anual de normativa (enero):

- Comprobar en el BOE si ha habido modificaciones del CTE, RITE, REBT, RIPCI o del reglamento de gas, y en la Generalitat y el Ayuntamiento de Barcelona cambios en trámites de licencias. Actualizar los párrafos afectados en 06, 08, 12, 13, 16 y en cualquier artículo que cite la norma.
- Revisar las ayudas citadas en 14, 19 y 20 (IDAE, MITECO, Generalitat): quitar programas cerrados, añadir convocatorias nuevas sin importes concretos salvo verificación.

Revisión continua:

- Enlaces rotos: comprobación mensual automática de enlaces externos e internos.
- Nuevos artículos: cada artículo nuevo recibe entradas desde 2 o 3 de los 20 iniciales y la tabla de la sección 2 se actualiza.
- Imágenes: si se sustituye una cover, mantener la misma ruta para no perder la indexación de la imagen.

### 6.4 Candidatos para la siguiente tanda

Para no canibalizar los 20 actuales, los siguientes artículos deberían cubrir servicios y sectores sin artículo: reformas de hoteles, naves industriales, bares y cafeterías (sin repetir 09), comunidades de propietarios (ascensor, zonas comunes, no fachadas), domótica y telecomunicaciones en vivienda, protección contra incendios en locales, licencia de actividad en Igualada y Anoia, y mantenimiento (categoría sin ningún artículo todavía).
