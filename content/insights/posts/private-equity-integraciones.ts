import type { InsightPost } from "../types";

/**
 * Artículos de Private Equity e integraciones post-adquisición.
 * Voz: Marc Andreu Guerao, en primera persona. Dirigidos a Investment Directors,
 * Operating Partners y CEOs de plataformas Buy & Build.
 * Los ejemplos numéricos son ilustrativos y así se marcan en el texto.
 */
export const privateEquityPosts: InsightPost[] = [
  {
    slug: "integracion-post-adquisicion-plan-100-dias-multicentro",
    title: "Integración post adquisición: el plan de 100 días para redes de centros",
    excerpt:
      "La integración post adquisición de una red de centros se decide en los primeros 100 días: seis áreas, hitos a día 1, 30, 60 y 100, los errores que más cuestan y cómo medir sin asfixiar al equipo.",
    metaDescription:
      "Plan de integración post adquisición en 100 días para redes de centros: seis áreas, hitos a día 1, 30, 60 y 100, errores caros y KPIs para medir el avance.",
    category: "integraciones",
    tags: ["Integración", "Plan 100 días", "Buy & Build", "Multicentro"],
    keywords: [
      "integración post adquisición",
      "plan 100 días integración",
      "integración de centros adquiridos",
      "post merger integration multicentro",
      "sinergias adquisición",
    ],
    publishedAt: "2026-06-18",
    readingMinutes: 9,
    relatedServices: ["integration-100", "multisite-performance-audit", "fractional-coo"],
    blocks: [
      {
        type: "p",
        text: "He vivido integraciones de centros adquiridos desde dentro, y la conclusión es siempre la misma: la integración post adquisición no se decide en la firma ni en el modelo financiero, sino en los primeros 100 días. Al día 100 la empresa comprada reporta como el resto del grupo, opera con los mismos procesos y tiene las sinergias asignadas con fecha, o se ha convertido en una unidad aparte que consume tiempo de dirección y añade complejidad al P&L consolidado.",
      },
      { type: "h2", text: "Qué significa la integración post adquisición en una red de centros (y qué no)" },
      {
        type: "p",
        text: "Integrar no es uniformizar todo. Un grupo que compra tres clínicas o cinco tiendas compra facturación recurrente, un equipo que la genera y una posición local. Si la integración destruye alguna de las tres, el precio deja de tener sentido. La primera decisión del plan es explícita: qué se integra siempre y qué se evalúa antes de tocar.",
      },
      {
        type: "ul",
        items: [
          "Se integra siempre: datos y reporting (P&L por centro con criterios del grupo desde el primer cierre), procesos clave (caja, agendas, compras, cierre) y estándares de servicio y cumplimiento.",
          "Se evalúa antes de decidir: marca local, catálogo y precios, horarios y la relación de los profesionales con sus pacientes o clientes.",
          "No se toca en los primeros 30 días: nada que afecte al cliente o a la retribución del equipo sin datos que lo justifiquen.",
        ],
      },
      { type: "h2", text: "Las seis áreas que hay que integrar" },
      {
        type: "p",
        text: "Seis frentes avanzan en paralelo y, si uno se queda atrás, bloquea a los demás: sin sistemas no hay reporting fiable, sin reporting no hay sinergias medibles y sin gobernanza nadie resuelve los conflictos entre áreas.",
      },
      {
        type: "ul",
        items: [
          "Personas: comunicación del día 1, mapa de perfiles clave, retención y gestión del cambio.",
          "Reporting: P&L por centro con criterios del grupo, KPIs homogéneos y el mismo calendario de cierre.",
          "Sistemas: gestión, agendas, caja y datos; no siempre hay que migrar.",
          "Compras: homologación de proveedores, condiciones de grupo y catálogo.",
          "Procesos: una única forma de operar en lo que importa, documentada y formada.",
          "Gobernanza: comité de integración, decisiones, escalado y reporting al fondo o al consejo.",
        ],
      },
      { type: "h2", text: "Calendario de hitos: día 1, 30, 60 y 100" },
      {
        type: "p",
        text: "Divido los 100 días en tres fases: control (días 1-30), integración (días 31-60) y captura de valor (días 61-100). La tabla resume el hito mínimo por área en cada corte: es el estándar frente al que se mide si la integración va a tiempo.",
      },
      {
        type: "table",
        headers: ["Área", "Día 1", "Día 30", "Día 60", "Día 100"],
        rows: [
          [
            "Personas",
            "Comunicación al equipo adquirido",
            "Mapa de perfiles clave y conversaciones individuales hechas",
            "Plan de retención firmado y organigrama objetivo comunicado",
            "Rotación de perfiles clave bajo control",
          ],
          [
            "Reporting",
            "Acceso a datos contables y de gestión",
            "Primer P&L por centro con criterios del grupo",
            "KPIs homogéneos en el cuadro de mando semanal",
            "Cierre en el calendario y formato de la red",
          ],
          [
            "Sistemas",
            "Inventario de sistemas, licencias y contratos",
            "Decisión con fecha: migrar, conectar o mantener",
            "Extracción homogénea o migración iniciada",
            "Sistema objetivo operativo en los centros adquiridos",
          ],
          [
            "Compras",
            "Lista de proveedores y condiciones actuales",
            "Comparativa con las condiciones del grupo",
            "Proveedores homologados y catálogo activo",
            "Sinergia de compras visible en el P&L",
          ],
          [
            "Procesos",
            "Observación de la operación real, sin cambios",
            "Diferencias documentadas frente al modelo del grupo",
            "Procesos clave implantados y responsables formados",
            "Auditoría interna del modelo operativo",
          ],
          [
            "Gobernanza",
            "Comité de integración constituido",
            "Seguimiento quincenal con dirección e inversores",
            "Decisiones de estructura tomadas",
            "Playbook documentado para la siguiente adquisición",
          ],
        ],
      },
      { type: "h2", text: "Los tres errores que más caro cuestan en los primeros 30 días" },
      {
        type: "ol",
        items: [
          "No comunicar el día 1. El equipo adquirido se entera por un proveedor o por un rumor y dedica la primera semana a buscar ofertas. La comunicación se prepara antes del cierre: qué cambia, qué no y cuándo se sabrá el resto.",
          "Tocar precios, agendas o retribución antes de tener datos. Sin un P&L por centro comparable, cualquier cambio es una apuesta que, si sale mal, se paga en facturación y en confianza del equipo.",
          "Dejar las sinergias sin responsable. El plan de inversión fija cuánto ahorrar en compras o ganar en productividad, pero nadie tiene ese número como objetivo. Cada sinergia necesita responsable, importe, fecha y línea del P&L.",
        ],
      },
      { type: "h2", text: "Cómo medir la integración sin asfixiar al equipo" },
      {
        type: "p",
        text: "Exigir treinta indicadores nuevos a un equipo que acaba de cambiar de dueño termina en agotamiento. Mido la integración con pocos KPIs, los mismos en todas las adquisiciones, revisados en el comité quincenal.",
      },
      {
        type: "ul",
        items: [
          "Retención de perfiles clave a día 30, 60 y 100.",
          "Primer cierre con criterios de grupo: fecha real frente a objetivo. Si se retrasa, todo se retrasa.",
          "Porcentaje del gasto en compras bajo proveedores homologados.",
          "Sinergias con responsable y fecha frente al total del plan, y cuántas aparecen ya en el P&L.",
          "Facturación de los centros adquiridos frente al año anterior: la integración no puede pagarse con pérdida de actividad.",
        ],
      },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Supongamos un grupo dental de 12 clínicas que compra otras 3. A día 30, las 3 tienen su primer P&L con criterios del grupo y se confirma que dos odontólogos concentran buena parte de la facturación de una de ellas; su plan de retención se cierra antes de cualquier otro cambio. A día 60, el material pasa al catálogo de grupo y las agendas al sistema de la red. A día 100, las 15 clínicas cierran el mes en el mismo formato y el comité decide qué funciones centrales estaban duplicadas. Situación hipotética; lo que importa es la secuencia.",
      },
      {
        type: "quote",
        text: "Integrar no es que la adquirida haga lo que hacía antes con otro logo. Es que el grupo tenga una sola forma de operar en lo que importa y que cada centro siga haciendo bien lo que ya hacía bien.",
      },
      {
        type: "p",
        text: "El valor del plan de 100 días no está en la primera integración, sino en la segunda y la tercera: con el calendario, los KPIs y la comunicación del día 1 ya escritos, cada add-on pasa de proyecto a proceso. Si tienes una adquisición cerrada o en firma sin un plan concreto para el día 1, el diagnóstico gratuito de esta web es un buen punto de partida.",
      },
    ],
    faqs: [
      {
        question: "¿Cuándo hay que empezar a preparar el plan de integración?",
        answer:
          "Antes del cierre. Las semanas entre la firma y el día 1 son las más baratas para preparar comunicación, acceso a datos y conversaciones con perfiles clave. Si la operación ya está cerrada, lo razonable es un diagnóstico de dos semanas y construir el plan de 100 días desde ahí.",
      },
      {
        question: "¿Hay que migrar los sistemas en los primeros 100 días?",
        answer:
          "No necesariamente. Lo que sí hay que tener a día 30 es una decisión con fecha: migrar, conectar o mantener. A veces basta con extraer los datos con la estructura del grupo y planificar la migración para el trimestre siguiente.",
      },
      {
        question: "¿Qué papel tiene el fondo durante la integración?",
        answer:
          "Visibilidad sin operar. El fondo, o su Operating Partner, se sienta en el comité quincenal, ve el avance por área y las sinergias con responsable, y resuelve los bloqueos que exceden a la dirección de la plataforma. Lo que no debe hacer es dirigir la integración centro a centro.",
      },
    ],
  },
  {
    slug: "post-merger-integration-errores-habituales-redes-de-centros",
    title: "Post merger integration en redes de centros: los errores que se repiten",
    excerpt:
      "La post merger integration en empresas multicentro no falla por el modelo financiero: falla en personas, sistemas, sinergias sin dueño y gobernanza. Seis errores que se repiten y cómo evitarlos.",
    metaDescription:
      "Post merger integration en redes de centros: los seis errores operativos que más se repiten tras una adquisición y cómo corregirlos antes de que cuesten EBITDA.",
    category: "integraciones",
    tags: ["Post Merger Integration", "Integración", "Multicentro", "Gobernanza"],
    keywords: [
      "post merger integration",
      "errores integración adquisición",
      "PMI redes de centros",
      "integración de clínicas adquiridas",
      "retención de talento post adquisición",
    ],
    publishedAt: "2026-07-09",
    readingMinutes: 8,
    relatedServices: ["integration-100", "fractional-coo", "multisite-performance-audit"],
    blocks: [
      {
        type: "p",
        text: "Cuando una post merger integration falla en una red de centros, casi nunca es por el modelo financiero. Falla después, en la operación: sistemas que no se hablan, un director de clínica que se marcha a los cuatro meses, sinergias que nadie persigue y un comité que nunca se constituye. He visto estos errores desde dentro, y se repiten con independencia del sector.",
      },
      { type: "h2", text: "Error 1: tratar la post merger integration como un proyecto de finanzas" },
      {
        type: "p",
        text: "El primer error es de propiedad. La integración la lidera el CFO porque hizo el modelo, y el plan resulta preciso en el cálculo de sinergias y vago en cómo se consiguen. Las sinergias de una red de centros viven en la operación: agendas, plantilla, proveedores y procesos de cada unidad.",
      },
      {
        type: "ul",
        items: [
          "El responsable de la integración debe tener autoridad sobre la operación de los centros, no solo sobre el reporting.",
          "Finanzas aporta el P&L por centro y la medición; operaciones, el plan de acción y la ejecución.",
          "Cada sinergia del modelo se traduce a una acción en un centro concreto antes del día 30.",
        ],
      },
      { type: "h2", text: "Error 2: no decidir qué se integra y qué se respeta" },
      {
        type: "p",
        text: "El segundo error es la ambigüedad. Al equipo adquirido se le dice que nada va a cambiar, y tres meses después cambia todo. Hace falta un criterio explícito, comunicado el día 1 y mantenido.",
      },
      {
        type: "callout",
        title: "Criterio de integración",
        text: "Se integran siempre los datos (P&L por centro y KPIs del grupo), los procesos clave (caja, agenda, compras, cierre) y los estándares de servicio y cumplimiento. Se evalúan antes de decidir la marca local, el catálogo, los precios y la relación de los profesionales con sus pacientes o clientes. Lo primero no se negocia; lo segundo se decide con datos antes del día 60.",
      },
      { type: "h2", text: "Error 3: perder a las personas clave antes de saber quiénes son" },
      {
        type: "p",
        text: "En una red de centros la facturación está concentrada en personas: el director de clínica que conoce a los pacientes, el veterinario de referencia, la encargada que lleva diez años en la tienda. Si una de ellas se va, se lleva una actividad que ningún plan de sinergias compensa.",
      },
      {
        type: "ol",
        items: [
          "Mapa de dependencia en las dos primeras semanas: qué parte de la facturación depende de cada profesional y quién sostiene la operación diaria.",
          "Conversación individual con cada perfil clave antes del día 30, liderada por alguien de la plataforma con capacidad de decidir.",
          "Plan de retención realista: condiciones, rol futuro y horizonte claros. Un plan incumplible es peor que no tener plan.",
        ],
      },
      { type: "h2", text: "Error 4: dos sistemas, dos P&L, dos verdades" },
      {
        type: "p",
        text: "El cuarto error es técnico en apariencia y de gobierno en el fondo. La adquirida sigue con su software, su plan contable y su calendario de cierre. Cada mes hay dos versiones de la realidad y el comité dedica la mitad del tiempo a discutir cuál es la buena.",
      },
      {
        type: "table",
        headers: ["Síntoma", "Causa habitual", "Qué hacer"],
        rows: [
          [
            "El EBITDA de la adquirida no cuadra con el reporting del grupo",
            "Criterios distintos de imputación y periodificación",
            "Un único P&L por centro con criterios del grupo desde el primer cierre",
          ],
          [
            "El cierre de la adquirida llega dos semanas más tarde",
            "Calendario propio y dependencia de una persona",
            "Mismo calendario y cierre asignado a finanzas del grupo con apoyo local",
          ],
          [
            "Los KPIs no son comparables entre centros",
            "Definiciones distintas de ocupación, ticket medio o productividad",
            "Diccionario de KPIs del grupo aplicado a los datos de la adquirida",
          ],
          [
            "Nadie sabe qué licencias y contratos de software hay",
            "Inventario inexistente",
            "Inventario en la primera semana y decisión de migrar, conectar o mantener a día 30",
          ],
        ],
      },
      { type: "h2", text: "Error 5: sinergias sin responsable, calendario ni KPI" },
      {
        type: "p",
        text: "Las sinergias del plan de inversión tienen una propiedad incómoda: están en una hoja de cálculo del fondo y no en el objetivo anual de nadie. Compras más baratas, estructura compartida, mejor ocupación: todo plausible y sin dueño.",
      },
      {
        type: "ul",
        items: [
          "Cada sinergia con responsable nominal, importe, fecha y la línea del P&L donde debe aparecer.",
          "Seguimiento en tres estados: identificada, en ejecución y conseguida, es decir, visible en el cierre mensual.",
          "Las que a día 60 no tienen responsable se eliminan del plan o se escalan al comité.",
        ],
      },
      { type: "h2", text: "Error 6: gobernanza por correo electrónico" },
      {
        type: "p",
        text: "El último error permite todos los anteriores. No hay comité de integración, o se reúne solo cuando hay un problema. Las decisiones se toman por correo, nadie sabe quién aprobó qué y cada área avanza a su ritmo. Un comité quincenal de una hora, con dirección de la plataforma, el responsable de integración y el equipo de inversión, y un orden del día fijo, resuelve más que cualquier herramienta.",
      },
      { type: "h3", text: "Qué hacer si la adquisición lleva seis meses sin integrarse" },
      {
        type: "p",
        text: "Es más frecuente de lo que parece: la operación se cerró, la actividad siguió y la integración nunca empezó. No es irrecuperable, pero exige reiniciar con disciplina.",
      },
      {
        type: "ol",
        items: [
          "Diagnóstico de dos semanas: P&L por centro con criterios del grupo, mapa de personas clave, inventario de sistemas y sinergias del plan original.",
          "Decisión explícita de qué se integra y qué se respeta, comunicada con fechas.",
          "Plan de 100 días reiniciado con comité quincenal desde la primera semana.",
          "Prioridad a reporting y personas; sistemas y compras después.",
        ],
      },
      {
        type: "quote",
        text: "Una adquisición que seis meses después sigue reportando aparte no es una empresa integrada con retraso: es una empresa distinta que consume tiempo del comité.",
      },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Imaginemos una red veterinaria de 10 centros que ha comprado 2 add-ons, cada uno con su propio software. El cierre mensual se retrasa porque los add-ons envían la información en hojas de cálculo con criterios propios, y la ocupación de quirófano no es comparable. El reinicio consistiría en fijar un diccionario de KPIs común, extraer los datos de los tres sistemas con la misma estructura desde el siguiente cierre y decidir en el comité la migración para el trimestre siguiente. Situación hipotética.",
      },
      {
        type: "p",
        text: "Ninguno de estos errores requiere una gran inversión para evitarse. Requiere decidir quién es el responsable, qué se integra y con qué calendario, antes de que la inercia decida por ti. Si una de tus adquisiciones encaja en estos síntomas, el diagnóstico gratuito te dará una primera lectura.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto debería durar una post merger integration en una red de centros?",
        answer:
          "La fase intensiva, 100 días: control en los primeros 30, integración de procesos y sistemas hasta el 60 y captura de valor hasta el 100. Algunas sinergias tardan trimestres en verse en el P&L, pero al día 100 la adquirida debe reportar y operar como el resto del grupo.",
      },
      {
        question: "¿Es mejor integrar rápido o despacio?",
        answer:
          "Rápido en lo que da control (datos, reporting, comunicación, personas clave) y con criterio en lo que afecta al cliente (marca, catálogo, precios). La lentitud no protege a la adquirida; la mantiene en la incertidumbre. Lo que la protege es decidir qué no se toca y decirlo.",
      },
      {
        question: "¿Quién debe liderar la integración: la plataforma o la adquirida?",
        answer:
          "La plataforma, con un responsable de integración con autoridad operativa y la participación activa de los responsables de centro adquiridos. Si lidera la adquirida, no hay integración; si la plataforma lo hace sin ellos, pierde el conocimiento local que ha pagado.",
      },
    ],
  },
  {
    slug: "buy-and-build-operations-playbook-operativo",
    title: "Buy and build operations: el playbook que la plataforma necesita para absorber add-ons",
    excerpt:
      "La tesis Buy & Build se gana o se pierde en la capacidad de absorción de la plataforma. Los siete componentes del playbook de buy and build operations y qué debe estar listo antes del segundo add-on.",
    metaDescription:
      "Buy and build operations: el playbook operativo de la plataforma, qué debe estar listo antes del segundo add-on y el papel del Operating Partner.",
    category: "private-equity",
    tags: ["Buy & Build", "Private Equity", "Playbook", "Plataforma"],
    keywords: [
      "buy and build operations",
      "playbook integración add-ons",
      "plataforma private equity",
      "modelo operativo plataforma",
      "value creation operativa",
    ],
    publishedAt: "2026-08-12",
    readingMinutes: 8,
    relatedServices: ["integration-100", "fractional-coo", "ebitda-improvement"],
    blocks: [
      {
        type: "p",
        text: "Una tesis Buy & Build es fácil de explicar: comprar una plataforma, añadir add-ons a múltiplos inferiores, integrarlos y vender un conjunto más grande y eficiente. La memoria de inversión rara vez responde la pregunta que decide si funciona: ¿tiene la plataforma capacidad operativa para absorber lo que va a comprar? Las buy and build operations se ganan o se pierden ahí, no en el sourcing de targets.",
      },
      { type: "h2", text: "Por qué la plataforma, no el add-on, es el cuello de botella" },
      {
        type: "p",
        text: "Cuando un add-on se integra mal, la explicación habitual apunta al add-on: cultura distinta, sistemas antiguos, fundador difícil. Mi experiencia absorbiendo centros adquiridos desde la operación es que el problema casi siempre estaba en casa. Una plataforma sin modelo operativo escrito no puede pedirle a nadie que lo adopte.",
      },
      {
        type: "ul",
        items: [
          "Sin P&L por centro comparable, no se sabe si el add-on mejora o empeora el grupo.",
          "Si los procesos clave viven en la cabeza de tres personas, cada integración depende de su agenda.",
          "Si la estructura central ya va justa, el add-on la desborda y el servicio a toda la red se degrada.",
          "Si la integración anterior no se documentó, la siguiente empieza de cero y repite los errores.",
        ],
      },
      { type: "h2", text: "Los siete componentes del playbook de buy and build operations" },
      {
        type: "p",
        text: "El playbook no es un documento de cien páginas: es el conjunto mínimo de estándares, herramientas y rutinas que hace que cada add-on se integre igual.",
      },
      { type: "h3", text: "1. Modelo operativo estándar" },
      {
        type: "p",
        text: "Cómo funciona un centro del grupo: apertura y cierre, agenda, caja, atención, protocolos, roles. Escrito, formado y auditado.",
      },
      { type: "h3", text: "2. P&L por centro y KPIs de grupo" },
      {
        type: "p",
        text: "Cuenta de resultados por unidad con criterios homogéneos y un diccionario de KPIs. Sin esto, la palabra sinergia no significa nada.",
      },
      { type: "h3", text: "3. Organización y roles de centro" },
      {
        type: "p",
        text: "Qué hace un responsable de centro, de quién depende, qué decide y qué reporta. El add-on suele llegar con un fundador que lo hacía todo; el playbook define su rol posterior.",
      },
      { type: "h3", text: "4. Sistemas y datos" },
      {
        type: "p",
        text: "Sistema de gestión objetivo, estructura de datos y criterio para migrar, conectar o mantener, con un plazo estándar para cada opción.",
      },
      { type: "h3", text: "5. Compras y catálogo" },
      {
        type: "p",
        text: "Proveedores homologados, condiciones de grupo y catálogo. La sinergia más rápida y la primera que debe estar lista.",
      },
      { type: "h3", text: "6. Plan de 100 días reutilizable" },
      {
        type: "p",
        text: "Calendario de hitos por área, comunicación del día 1, mapa de perfiles clave y KPIs de integración. Igual para todos los add-ons.",
      },
      { type: "h3", text: "7. Gobernanza y reporting al fondo" },
      {
        type: "p",
        text: "Comité de integración, comité de dirección y paquete mensual al equipo de inversión. Pocas páginas, siempre las mismas, con las sinergias en tres estados.",
      },
      { type: "h2", text: "Qué debe estar listo antes del segundo add-on" },
      {
        type: "p",
        text: "El primer add-on se puede integrar a pulso, con el CEO encima de todo. El segundo ya no. La tabla indica el mínimo viable de cada componente antes de firmar la segunda adquisición.",
      },
      {
        type: "table",
        headers: ["Componente", "Mínimo viable antes del add-on 2", "Señal de que no está listo"],
        rows: [
          [
            "Modelo operativo",
            "Procesos clave documentados y formados en todos los centros",
            "Cada centro de la plataforma opera de una forma distinta",
          ],
          ["P&L por centro", "Cierre mensual comparable en menos de diez días", "Consolidar el mes lleva semanas y ajustes manuales"],
          ["Organización", "Rol de responsable de centro definido y cubierto", "El CEO sigue resolviendo incidencias de centro"],
          ["Sistemas", "Sistema objetivo elegido y estructura de datos definida", "Cada integración reabre el debate del software"],
          ["Compras", "Catálogo y proveedores homologados activos", "Cada centro negocia por su cuenta"],
          [
            "Plan de 100 días",
            "Documentado a partir del primer add-on, con lecciones aprendidas",
            "Nadie recuerda qué se hizo en la primera integración",
          ],
          ["Gobernanza", "Comité de integración y paquete mensual al fondo en marcha", "El fondo pregunta por correo cómo va la integración"],
        ],
      },
      { type: "h2", text: "Cómo encadenar adquisiciones sin que la estructura central se dispare" },
      {
        type: "p",
        text: "El riesgo opuesto es construir una estructura central que se come las sinergias. La respuesta no es un número mágico, sino tres decisiones ordenadas.",
      },
      {
        type: "ol",
        items: [
          "Fijar un ratio de estructura central sobre ventas y revisarlo en cada adquisición: si el add-on no lo diluye, algo no funciona.",
          "Compartir funciones antes de crearlas: compras, finanzas, personas, marketing y sistemas se centralizan una vez y sirven a toda la red; cada add-on aporta volumen, no una función nueva.",
          "Incorporar un COO, interno o fraccional, cuando el CEO ya no puede dirigir a los responsables de centro y negociar la siguiente compra a la vez.",
        ],
      },
      { type: "h2", text: "El papel del Operating Partner y del CEO de la plataforma" },
      {
        type: "p",
        text: "Los dos roles son complementarios. El Operating Partner no dirige la integración; el CEO de la plataforma no reporta como un gestor de centro.",
      },
      {
        type: "ul",
        items: [
          "Operating Partner: exige el playbook, valida los hitos a día 30, 60 y 100, y desbloquea decisiones de estructura.",
          "CEO de la plataforma: responde de la integración, del modelo operativo y de los resultados por centro; decide quién lidera cada add-on.",
          "Ambos: se sientan en el comité quincenal y revisan las sinergias con responsable y fecha.",
        ],
      },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Supongamos una plataforma de 8 centros de fisioterapia que planea 4 add-ons en 18 meses. Antes del primero, el equipo dedica un trimestre a cerrar el modelo operativo, el P&L por centro y el catálogo de compras. El primer add-on sirve para probar y documentar el plan de 100 días. A partir del segundo, cada integración sigue el mismo calendario. La estructura central crece una vez, en finanzas y sistemas, no con cada compra. Caso hipotético.",
      },
      {
        type: "quote",
        text: "Una plataforma no se mide por los add-ons que compra, sino por los que absorbe sin que el resto de la red lo note.",
      },
      {
        type: "p",
        text: "El playbook de buy and build operations se escribe una vez y se mejora en cada integración. El coste de no tenerlo no aparece en el modelo: aparece en el tiempo del CEO, en la rotación de perfiles clave y en sinergias que llegan dos años tarde. Si tu plataforma tiene add-ons en el pipeline y aún no tiene P&L por centro comparable, el diagnóstico gratuito muestra qué falta antes de firmar.",
      },
    ],
    faqs: [
      {
        question: "¿Cuándo hay que escribir el playbook: antes o después del primer add-on?",
        answer:
          "El esqueleto, antes: modelo operativo, P&L por centro, catálogo de compras y gobernanza se construyen sobre la plataforma, no sobre el add-on. El plan de 100 días se termina de escribir con el primer add-on, que sirve de piloto, y se corrige antes del segundo.",
      },
      {
        question: "¿Qué tamaño de estructura central necesita una plataforma Buy & Build?",
        answer:
          "El mínimo que da servicio a toda la red en finanzas, compras, personas y sistemas, y que se diluye con cada adquisición. No hay un porcentaje universal: depende del sector y del tamaño medio de centro. Lo universal es fijarlo como ratio sobre ventas, revisarlo en cada compra y crecer por funciones, no por add-on.",
      },
      {
        question: "¿Cómo se mide que la plataforma absorbe bien los add-ons?",
        answer:
          "Con pocos indicadores: días hasta el primer cierre del add-on con criterios del grupo, retención de perfiles clave a día 100, porcentaje de compras bajo catálogo de grupo, sinergias conseguidas frente a plan y facturación de los centros adquiridos frente al año anterior. Si se cumplen integración tras integración, la plataforma absorbe.",
      },
    ],
  },
  {
    slug: "operational-due-diligence-que-mirar-en-una-empresa-multicentro",
    title: "Operational due diligence en empresas multicentro: qué mirar antes de firmar",
    excerpt:
      "La due diligence financiera dice cuánto gana la empresa. La operational due diligence dice si ese EBITDA se sostiene centro a centro y si se puede escalar. Checklist de 12 puntos para redes de centros.",
    metaDescription:
      "Operational due diligence en empresas multicentro: checklist de 12 puntos, señales de alerta y cómo llevar los hallazgos a precio, SPA y plan de 100 días.",
    category: "private-equity",
    tags: ["Operational Due Diligence", "Private Equity", "Multicentro", "Calidad del EBITDA"],
    keywords: [
      "operational due diligence",
      "due diligence operativa multicentro",
      "calidad del EBITDA por centro",
      "riesgos operativos adquisición",
      "ODD private equity",
    ],
    publishedAt: "2026-09-16",
    readingMinutes: 9,
    relatedServices: ["multisite-performance-audit", "integration-100", "ebitda-improvement"],
    blocks: [
      {
        type: "p",
        text: "La due diligence financiera responde a una pregunta: cuánto gana la empresa. La operational due diligence responde a otra más decisiva en una empresa multicentro: si ese EBITDA se sostiene centro a centro, de quién depende y si se puede replicar con veinte centros más. He dirigido redes de hasta 25 centros e integrado centros adquiridos, y la lección es siempre la misma: el consolidado esconde la red.",
      },
      { type: "h2", text: "Qué responde una operational due diligence que la financiera no responde" },
      {
        type: "p",
        text: "La financiera trabaja con la cuenta consolidada, el EBITDA normalizado y la deuda neta. La operacional baja al centro, a la agenda y a la plantilla.",
      },
      {
        type: "ul",
        items: [
          "¿Cuántos centros ganan dinero tras imputar estructura con un criterio homogéneo, y cuántos viven de los demás?",
          "¿Qué parte de la facturación depende de dos o tres personas que podrían irse tras el cambio de control?",
          "¿Los procesos son los mismos en todos los centros, o cada unidad funciona a su manera?",
          "¿La estructura central puede servir al doble de centros, o hay que construirla y eso se come las sinergias?",
        ],
      },
      { type: "h2", text: "El EBITDA consolidado esconde la red" },
      {
        type: "p",
        text: "Un margen EBITDA razonable a nivel de grupo puede esconder tres centros excelentes que financian a cinco mediocres y dos en pérdida. La tabla, con cifras inventadas a modo de ejemplo ilustrativo, muestra la dispersión que el consolidado nunca enseñaría.",
      },
      {
        type: "table",
        headers: ["Centro", "Ventas", "EBITDA", "Margen", "Comentario"],
        rows: [
          ["Centro A", "1,8 M€", "0,41 M€", "23 %", "Maduro; el director concentra buena parte de la facturación"],
          ["Centro B", "1,2 M€", "0,17 M€", "14 %", "En la media; huecos de agenda por la tarde"],
          ["Centro C", "0,9 M€", "0,05 M€", "6 %", "Coste de personal sobre ventas muy superior al resto"],
          ["Centro D", "0,7 M€", "-0,06 M€", "-9 %", "Apertura reciente; alquiler por encima de mercado"],
          ["Centro E", "1,5 M€", "0,30 M€", "20 %", "Buen margen; sistema de gestión distinto al del grupo"],
        ],
      },
      {
        type: "p",
        text: "El grupo cerraría con un margen agregado en torno al 14 %, un dato que no dice nada del centro D ni de la dependencia del centro A. La pregunta del comprador no es cuánto gana el grupo, sino qué tiene que pasar para que C y D se acerquen a A y E, y si eso está en manos del management.",
      },
      { type: "h2", text: "Checklist de operational due diligence: 12 puntos" },
      {
        type: "p",
        text: "Es la lista que utilizo como índice del trabajo. No todos pesan igual en cada sector, pero ninguno se puede dejar fuera.",
      },
      {
        type: "ol",
        items: [
          "Calidad del EBITDA por centro: dispersión, centros en pérdida, ajustes no recurrentes y criterios de imputación de estructura.",
          "Dependencia de personas clave: fundador, directores médicos o profesionales que concentran facturación, y su situación tras el cambio de control.",
          "Homogeneidad de procesos: si existe un modelo operativo escrito o cada centro funciona a su manera.",
          "Sistemas: gestión, agendas, caja y contabilidad; cuántos hay, si se hablan y si el dato es accesible y fiable.",
          "Plantilla: dimensionamiento, rotación, absentismo y coste de personal sobre ventas por centro.",
          "Contratos de alquiler: vencimientos, rentas frente a mercado, garantías y cláusulas de cambio de control.",
          "Pipeline comercial y recurrencia: de dónde viene el cliente nuevo, qué proporción vuelve y cuánto depende del marketing local.",
          "Precios, catálogo y mix de servicios por centro: si el margen viene de volumen o de mix, y precios fuera de la banda del grupo.",
          "Compras y proveedores: concentración, condiciones, contratos con permanencia y margen de homologación.",
          "Capacidad instalada frente a utilizada: ocupación de salas, sillones o quirófanos y horas disponibles frente a facturadas.",
          "Estructura central y costes de soporte: qué funciones existen, cuánto cuestan y qué falta para servir a una red mayor.",
          "Cumplimiento regulatorio y licencias por centro: autorizaciones sanitarias, prevención, protección de datos e inspecciones pendientes.",
        ],
      },
      { type: "h2", text: "Cómo convertir los hallazgos en precio, SPA y plan de 100 días" },
      {
        type: "p",
        text: "Una operational due diligence que termina en un informe de riesgos no ha terminado. Cada hallazgo sale por una de tres puertas.",
      },
      {
        type: "ul",
        items: [
          "Precio: lo que afecta a la calidad del EBITDA (centros en pérdida estructural, ajustes discutibles, dependencia extrema de una persona) se traslada al EBITDA de referencia o al múltiplo.",
          "SPA: lo que es un riesgo identificable pero no cuantificable (licencias pendientes, cláusulas de cambio de control, litigios laborales) va a garantías, indemnidades o precio aplazado.",
          "Plan de 100 días: lo que es una oportunidad operativa (compras, agendas, plantilla, procesos) se convierte en sinergia con responsable y fecha antes del cierre.",
        ],
      },
      { type: "h2", text: "Señales de alerta que justifican parar o renegociar" },
      {
        type: "ul",
        items: [
          "No existe P&L por centro, o el management tarda semanas en producirlo.",
          "Una parte muy relevante de la facturación depende de personas sin pacto de permanencia ni plan de sucesión.",
          "Los dos mejores centros tienen el alquiler vencido o en renegociación con cláusula de cambio de control.",
          "El EBITDA normalizado incluye ajustes que el management no sabe explicar centro a centro.",
          "La estructura central ya está desbordada con la red actual.",
        ],
      },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Imaginemos un fondo que analiza una cadena de 18 centros de estética con un margen EBITDA agregado atractivo. La operational due diligence construye el P&L por centro y encuentra que cuatro centros abiertos en los dos últimos años están en pérdida y que el margen lo sostienen seis centros maduros cuyos directores llevan años con el fundador. El resultado no es abandonar la operación, sino separar el EBITDA de referencia del de las aperturas, incluir planes de retención en el SPA y llevar al plan de 100 días la reestructuración de agendas de los cuatro centros nuevos. Caso hipotético.",
      },
      {
        type: "quote",
        text: "La financiera te dice cuánto pagas. La operacional te dice qué compras y qué vas a tener que arreglar el día 1.",
      },
      {
        type: "p",
        text: "Una operational due diligence en una empresa multicentro no duplica el trabajo de la financiera: mira donde ella no mira, centro a centro, y lleva los hallazgos al precio, al contrato y al plan de integración. Si estás analizando un target de 10 a 30 centros, o diriges una participada y quieres saber qué encontraría un comprador, el diagnóstico gratuito de esta web es un primer paso útil.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto dura una operational due diligence de una empresa de 10 a 30 centros?",
        answer:
          "Entre tres y cinco semanas si el data room incluye cierres contables por centro y extracciones del sistema de gestión. Si el P&L por centro no existe y hay que construirlo desde la contabilidad, se añaden una o dos semanas. Comprimirla a una semana para encajar en el calendario del proceso es un error.",
      },
      {
        question: "¿Qué datos hay que pedir en el data room?",
        answer:
          "Cierres contables mensuales de los últimos 24 meses por centro, extracción del sistema de gestión (ventas, actividad, agendas, ocupación), plantillas y nóminas por centro, contratos de alquiler y de los principales proveedores, licencias por centro y el organigrama con antigüedades.",
      },
      {
        question: "¿Se puede hacer una operational due diligence con acceso limitado al management?",
        answer:
          "Parcialmente. Con datos se puede construir el P&L por centro, la dispersión y la capacidad. Lo que no se puede evaluar sin hablar con los responsables de centro es la dependencia de personas y la homogeneidad real de procesos. Si el vendedor restringe el acceso, hay que reflejarlo como riesgo en el SPA o pactar entrevistas en exclusividad.",
      },
    ],
  },
];
