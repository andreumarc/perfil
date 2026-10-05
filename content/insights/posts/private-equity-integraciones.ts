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
        text: "He vivido integraciones de centros adquiridos desde dentro, dirigiendo la operación que tenía que absorberlos. La conclusión es siempre la misma: la integración post adquisición no se decide en la firma ni en el modelo financiero, se decide en los primeros 100 días. Al día 100, la empresa comprada reporta como el resto del grupo, opera con los mismos procesos y tiene las sinergias asignadas a alguien con fecha, o se ha convertido en una unidad aparte que consume tiempo de dirección y añade complejidad al P&L consolidado. No hay un tercer escenario estable.",
      },
      { type: "h2", text: "Qué significa integrar una red de centros (y qué no)" },
      {
        type: "p",
        text: "Integrar no es uniformizar todo. Cuando un grupo compra tres clínicas o cinco tiendas, lo que compra es facturación recurrente, un equipo que la genera y una posición local. Si la integración destruye alguna de esas tres cosas, el precio pagado deja de tener sentido. Por eso la primera decisión de cualquier plan de integración post adquisición es explícita: qué se integra siempre y qué se evalúa antes de tocar.",
      },
      {
        type: "ul",
        items: [
          "Se integra siempre: datos y reporting (P&L por centro con criterios del grupo desde el primer cierre), procesos clave (caja, agendas, compras, cierre mensual) y estándares de servicio y cumplimiento.",
          "Se evalúa antes de decidir: marca local, catálogo y precios, horarios, relación de los profesionales con sus pacientes o clientes, y todo lo que explica por qué ese centro factura lo que factura.",
          "No se toca en los primeros 30 días: nada que afecte a la experiencia del cliente o a la retribución del equipo sin datos que lo justifiquen.",
        ],
      },
      { type: "h2", text: "Las seis áreas que hay que integrar" },
      {
        type: "p",
        text: "En una red de centros la integración tiene seis frentes que avanzan en paralelo. Si uno se queda atrás, bloquea a los demás: sin sistemas no hay reporting fiable, sin reporting no hay sinergias medibles y sin gobernanza nadie resuelve los conflictos entre áreas.",
      },
      { type: "h3", text: "Personas" },
      {
        type: "p",
        text: "Comunicación del día 1, mapa de perfiles clave, retención y gestión del cambio. Es el área donde más valor se pierde y donde menos tiempo se invierte.",
      },
      { type: "h3", text: "Reporting" },
      {
        type: "p",
        text: "P&L por centro con los criterios del grupo, KPIs homogéneos y el mismo calendario de cierre. Es el área que permite medir todo lo demás.",
      },
      { type: "h3", text: "Sistemas" },
      {
        type: "p",
        text: "Gestión, agendas, caja y datos. La decisión no siempre es migrar: a veces basta con conectar y extraer con la misma estructura que el resto de la red.",
      },
      { type: "h3", text: "Compras" },
      {
        type: "p",
        text: "Homologación de proveedores, condiciones de grupo y catálogo. Suele ser la sinergia más rápida y la más fácil de medir en el P&L.",
      },
      { type: "h3", text: "Procesos" },
      {
        type: "p",
        text: "Una única forma de operar en lo que importa: apertura y cierre, caja, agenda, atención, protocolos. Documentada y formada, no supuesta.",
      },
      { type: "h3", text: "Gobernanza" },
      {
        type: "p",
        text: "Comité de integración, decisiones, escalado y reporting al fondo o al consejo. Sin ella, las cinco áreas anteriores avanzan a ritmos distintos.",
      },
      { type: "h2", text: "Calendario de hitos: día 1, 30, 60 y 100" },
      {
        type: "p",
        text: "El calendario que utilizo divide los 100 días en tres fases: control (días 1-30), integración (días 31-60) y captura de valor (días 61-100). La tabla resume el hito mínimo por área en cada corte. No es un plan cerrado: es el estándar frente al que se mide si la integración va a tiempo.",
      },
      {
        type: "table",
        headers: ["Área", "Día 1", "Día 30", "Día 60", "Día 100"],
        rows: [
          [
            "Personas",
            "Comunicación a todo el equipo adquirido y a los responsables de centro",
            "Mapa de perfiles clave cerrado y conversaciones individuales hechas",
            "Plan de retención firmado y organigrama objetivo comunicado",
            "Rotación de perfiles clave bajo control y roles de centro operativos",
          ],
          [
            "Reporting",
            "Acceso a datos contables y de gestión",
            "Primer P&L por centro con criterios del grupo",
            "KPIs homogéneos en el cuadro de mando semanal",
            "Cierre mensual en el mismo calendario y formato que el resto de la red",
          ],
          [
            "Sistemas",
            "Inventario de sistemas, licencias y contratos",
            "Decisión con fecha: migrar, conectar o mantener",
            "Extracción de datos homogénea o migración iniciada",
            "Sistema objetivo operativo en todos los centros adquiridos",
          ],
          [
            "Compras",
            "Lista de proveedores y condiciones actuales",
            "Comparativa de precios con las condiciones del grupo",
            "Proveedores homologados y catálogo de grupo activo",
            "Sinergia de compras visible en el P&L",
          ],
          [
            "Procesos",
            "Observación de la operación real, sin cambios",
            "Diferencias documentadas frente al modelo del grupo",
            "Procesos clave implantados y responsables formados",
            "Auditoría interna de cumplimiento del modelo operativo",
          ],
          [
            "Gobernanza",
            "Comité de integración constituido y calendario fijado",
            "Seguimiento quincenal con dirección e inversores",
            "Decisiones de estructura y funciones duplicadas tomadas",
            "Playbook documentado para la siguiente adquisición",
          ],
        ],
      },
      { type: "h2", text: "Los tres errores que más caro cuestan en los primeros 30 días" },
      {
        type: "ol",
        items: [
          "No comunicar el día 1. El equipo adquirido se entera de la operación por un proveedor o por un rumor, y la primera semana la dedica a buscar ofertas en lugar de a atender pacientes o clientes. La comunicación del día 1 se prepara antes del cierre, con un mensaje claro sobre qué cambia, qué no cambia y cuándo se sabrá el resto.",
          "Tocar precios, agendas o retribución antes de tener datos. Es la tentación de capturar sinergias rápido. Sin un P&L por centro comparable, cualquier cambio es una apuesta, y las apuestas que salen mal se pagan en facturación y en confianza del equipo.",
          "Dejar las sinergias sin responsable. El plan de inversión dice cuánto hay que ahorrar en compras o ganar en productividad, pero nadie en la organización tiene ese número como objetivo. Cada sinergia necesita un responsable, un importe, una fecha y una línea del P&L donde se verá.",
        ],
      },
      { type: "h2", text: "Cómo medir la integración sin asfixiar al equipo" },
      {
        type: "p",
        text: "Una integración que exige treinta indicadores nuevos a un equipo que acaba de cambiar de dueño fracasa por agotamiento. Mido la integración con pocos KPIs, los mismos en todas las adquisiciones, y los reviso en el comité quincenal.",
      },
      {
        type: "ul",
        items: [
          "Retención de perfiles clave: cuántos de los profesionales y responsables identificados en el mapa siguen en la empresa a día 30, 60 y 100.",
          "Primer cierre con criterios de grupo: fecha real frente a fecha objetivo. Si se retrasa, todo lo demás se retrasa.",
          "Porcentaje de compras bajo proveedores homologados, medido sobre el gasto real y no sobre el número de proveedores.",
          "Sinergias con responsable y fecha frente a sinergias totales del plan de inversión, y cuántas aparecen ya en el P&L.",
          "Facturación de los centros adquiridos frente al mismo periodo del año anterior: la integración no puede pagarse con pérdida de actividad.",
        ],
      },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Supongamos un grupo dental de 12 clínicas que compra otras 3 en la misma comunidad autónoma. A día 30, las 3 clínicas tienen su primer P&L con los criterios del grupo y se confirma que dos odontólogos concentran una parte muy relevante de la facturación de una de ellas; su plan de retención se cierra antes de cualquier otro cambio. A día 60, el material pasa al catálogo de grupo y las agendas se gestionan con el mismo sistema que el resto de la red. A día 100, las 15 clínicas cierran el mes en el mismo formato y el comité decide qué funciones centrales estaban duplicadas. La situación es hipotética; lo que importa es la secuencia.",
      },
      {
        type: "quote",
        text: "Integrar no es que la adquirida haga lo que hacía antes con otro logo. Es que el grupo tenga una sola forma de operar en lo que importa y que cada centro siga haciendo bien lo que ya hacía bien.",
      },
      {
        type: "p",
        text: "El valor real del plan de 100 días no está en la primera integración, sino en la segunda y la tercera: cuando el calendario, los KPIs y la comunicación del día 1 ya están escritos, cada add-on deja de ser un proyecto y pasa a ser un proceso. Si tienes una adquisición cerrada o en firma y todavía no tienes un plan concreto para el día 1 y los 100 días siguientes, el diagnóstico gratuito de esta web es un buen punto de partida para ver dónde está el riesgo.",
      },
    ],
    faqs: [
      {
        question: "¿Cuándo hay que empezar a preparar el plan de integración?",
        answer:
          "Antes del cierre. Las semanas entre la firma y el día 1 son las más baratas para preparar la comunicación, el acceso a datos y las conversaciones con perfiles clave. Si la operación ya está cerrada, lo razonable es un diagnóstico de dos semanas de la empresa adquirida y construir el plan de 100 días a partir de ahí.",
      },
      {
        question: "¿Hay que migrar los sistemas en los primeros 100 días?",
        answer:
          "No necesariamente. Lo que sí hay que tener a día 30 es una decisión con fecha: migrar, conectar o mantener. A veces basta con extraer los datos con la misma estructura que el resto del grupo y planificar la migración para el trimestre siguiente, cuando el equipo ya ha asumido los cambios de proceso.",
      },
      {
        question: "¿Qué papel tiene el fondo durante la integración?",
        answer:
          "Visibilidad sin operar. El fondo, o su Operating Partner, debe sentarse en el comité de integración quincenal, ver el avance por área y las sinergias con responsable, y resolver los bloqueos que exceden a la dirección de la plataforma. Lo que no debe hacer es dirigir la integración centro a centro: para eso está el equipo operativo.",
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
        text: "Cuando una post merger integration falla en una red de centros, casi nunca es porque el modelo financiero estuviera mal. El múltiplo era razonable, las sinergias eran plausibles y la due diligence no encontró nada grave. Falla después, en el terreno operativo: dos sistemas que no se hablan, un director de clínica que se marcha a los cuatro meses, unas sinergias de compras que nadie persigue y un comité que nunca llega a constituirse. He visto estos errores desde dentro de la operación, y lo relevante es que se repiten con independencia del sector.",
      },
      { type: "h2", text: "Error 1: tratar la integración como un proyecto de finanzas" },
      {
        type: "p",
        text: "El primer error es de propiedad. La integración la lidera el CFO porque es quien hizo el modelo, y el resultado es un plan muy preciso en el cálculo de sinergias y muy vago en cómo se consiguen. Las sinergias de una red de centros viven en la operación: en las agendas, en el dimensionamiento de plantilla, en los proveedores y en los procesos de cada unidad.",
      },
      {
        type: "ul",
        items: [
          "El responsable de la integración debe tener autoridad sobre la operación de los centros, no solo sobre el reporting.",
          "Finanzas aporta el P&L por centro y la medición; operaciones aporta el plan de acción y la ejecución.",
          "Cada sinergia del modelo debe traducirse a una acción concreta en un centro concreto antes del día 30.",
        ],
      },
      { type: "h2", text: "Error 2: no decidir qué se integra y qué se respeta" },
      {
        type: "p",
        text: "El segundo error es la ambigüedad. Al equipo adquirido se le dice que nada va a cambiar, y tres meses después cambia todo. O al revés: se uniformizan el catálogo, los horarios y la marca de un centro que facturaba precisamente por ser distinto. La post merger integration necesita un criterio explícito, comunicado el día 1 y mantenido.",
      },
      {
        type: "callout",
        title: "Criterio de integración",
        text: "Se integran siempre los datos (P&L por centro y KPIs del grupo), los procesos clave (caja, agenda, compras, cierre) y los estándares de servicio y cumplimiento. Se evalúan antes de decidir la marca local, el catálogo, los precios y la relación de los profesionales con sus pacientes o clientes. Lo primero no se negocia; lo segundo se decide con datos en los primeros 60 días.",
      },
      { type: "h2", text: "Error 3: perder a las personas clave antes de saber quiénes son" },
      {
        type: "p",
        text: "En una red de centros la facturación está concentrada en personas: el director de clínica que conoce a los pacientes, el veterinario de referencia, la encargada de tienda que lleva diez años. Si una de esas personas se va en los primeros meses, se lleva una actividad que ningún plan de sinergias compensa. El error habitual es descubrir quiénes eran cuando ya han presentado la baja.",
      },
      {
        type: "ol",
        items: [
          "Mapa de dependencia en las dos primeras semanas: qué parte de la facturación de cada centro depende de cada profesional y quién sostiene la operación diaria.",
          "Conversación individual con cada perfil clave antes del día 30, liderada por alguien de la plataforma con capacidad de decidir, no por un proceso genérico de recursos humanos.",
          "Plan de retención realista: condiciones, rol futuro y horizonte temporal claros. Un plan que no se puede cumplir es peor que no tener plan.",
        ],
      },
      { type: "h2", text: "Error 4: dos sistemas, dos P&L, dos verdades" },
      {
        type: "p",
        text: "El cuarto error es técnico en apariencia y de gobierno en el fondo. La adquirida sigue con su software de gestión, su plan contable y su calendario de cierre. Cada mes hay dos versiones de la realidad y el comité dedica la mitad del tiempo a discutir cuál es la buena. La tabla resume los síntomas más habituales y qué hacer con cada uno.",
      },
      {
        type: "table",
        headers: ["Síntoma", "Causa habitual", "Qué hacer"],
        rows: [
          [
            "El EBITDA de la adquirida no cuadra entre el reporting del grupo y el suyo",
            "Criterios distintos de imputación de estructura y de periodificación",
            "Un único P&L por centro con criterios del grupo desde el primer cierre, aunque el sistema de origen sea otro",
          ],
          [
            "El cierre de la adquirida llega dos semanas después que el del resto",
            "Calendario de cierre propio y dependencia de una persona",
            "Fijar el mismo calendario y asignar el cierre a finanzas del grupo con apoyo local",
          ],
          [
            "Los KPIs operativos no son comparables entre centros",
            "Definiciones distintas de ocupación, ticket medio o productividad",
            "Diccionario de KPIs del grupo aplicado a la extracción de datos de la adquirida",
          ],
          [
            "Nadie sabe qué licencias y contratos de software hay",
            "Inventario inexistente",
            "Inventario de sistemas en la primera semana y decisión de migrar, conectar o mantener a día 30",
          ],
        ],
      },
      { type: "h2", text: "Error 5: sinergias sin responsable, calendario ni KPI" },
      {
        type: "p",
        text: "Las sinergias del plan de inversión tienen una propiedad incómoda: están en una hoja de cálculo del fondo y no en el objetivo anual de nadie. Compras más baratas, estructura compartida, mejor ocupación. Todo plausible y todo sin dueño.",
      },
      {
        type: "ul",
        items: [
          "Cada sinergia con un responsable nominal, un importe, una fecha y la línea del P&L donde debe aparecer.",
          "Seguimiento en tres estados: identificada, en ejecución y conseguida, es decir, visible en el cierre mensual.",
          "Las sinergias que a día 60 no tienen responsable se eliminan del plan o se escalan al comité; no se dejan en el limbo.",
        ],
      },
      { type: "h2", text: "Error 6: gobernanza por correo electrónico" },
      {
        type: "p",
        text: "El último error es el que permite todos los anteriores. No existe un comité de integración, o existe pero se reúne cuando hay un problema. Las decisiones se toman por correo, nadie sabe quién aprobó qué y las áreas avanzan a ritmos distintos. Un comité quincenal de una hora, con dirección de la plataforma, el responsable de integración y el equipo de inversión, con un orden del día fijo (avance por área, sinergias, personas, bloqueos), resuelve más que cualquier herramienta.",
      },
      { type: "h3", text: "Qué hacer si la adquisición lleva seis meses sin integrarse" },
      {
        type: "p",
        text: "Es más frecuente de lo que parece: la operación se cerró, la actividad siguió y la integración nunca empezó formalmente. No es irrecuperable, pero exige reiniciar con disciplina.",
      },
      {
        type: "ol",
        items: [
          "Diagnóstico de dos semanas: P&L por centro con criterios del grupo, mapa de personas clave, inventario de sistemas y lista de sinergias del plan original.",
          "Decisión explícita de qué se integra y qué se respeta, comunicada al equipo adquirido con fechas.",
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
        text: "Imaginemos una red veterinaria de 10 centros que ha comprado 2 add-ons en el último año, cada uno con su propio software de gestión. El cierre mensual del grupo se retrasa porque los 2 add-ons envían la información en hojas de cálculo con criterios propios, y la ocupación de quirófano no es comparable. El reinicio consistiría en fijar un diccionario de KPIs común, extraer los datos de los tres sistemas con la misma estructura desde el siguiente cierre y tomar en el comité la decisión de migración para el trimestre siguiente. Situación hipotética para ilustrar la secuencia.",
      },
      {
        type: "p",
        text: "Ninguno de estos seis errores requiere una gran inversión para evitarse. Requiere decidir quién es el responsable, qué se integra y con qué calendario, antes de que la inercia decida por ti. Si una de tus adquisiciones encaja en alguno de estos síntomas, el diagnóstico gratuito te dará una primera lectura de dónde está el problema.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto debería durar una post merger integration en una red de centros?",
        answer:
          "La fase intensiva, 100 días: control en los primeros 30, integración de procesos y sistemas hasta el día 60 y captura de valor hasta el 100. Algunas sinergias de estructura o de compras terminan de verse en el P&L en los dos o tres trimestres siguientes, pero al día 100 la adquirida debe reportar y operar como el resto del grupo.",
      },
      {
        question: "¿Es mejor integrar rápido o despacio?",
        answer:
          "Rápido en lo que da control (datos, reporting, comunicación, personas clave) y con criterio en lo que afecta al cliente (marca, catálogo, precios). La lentitud no protege a la adquirida; la mantiene en la incertidumbre. Lo que la protege es decidir qué no se toca y decirlo.",
      },
      {
        question: "¿Quién debe liderar la integración: la plataforma o la adquirida?",
        answer:
          "La plataforma, con un responsable de integración con autoridad operativa y con la participación activa de los responsables de centro adquiridos. Si lidera la adquirida, no hay integración; si la plataforma lo hace sin ellos, pierde el conocimiento local que ha pagado.",
      },
    ],
  },
  {
    slug: "buy-and-build-operations-playbook-operativo",
    title: "Buy and build operations: el playbook que la plataforma necesita para absorber add-ons",
    excerpt:
      "La tesis Buy & Build se gana o se pierde en la capacidad de absorción de la plataforma. Los siete componentes del playbook de buy and build operations y qué debe estar listo antes del segundo add-on.",
    metaDescription:
      "Buy and build operations: los siete componentes del playbook operativo de una plataforma, qué debe estar listo antes del segundo add-on y el papel del Operating Partner.",
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
        text: "Una tesis Buy & Build es sencilla de explicar al comité de inversión: comprar una plataforma, añadir add-ons a múltiplos inferiores, integrarlos y vender un conjunto más grande y más eficiente. Lo que no suele estar en la memoria de inversión es la pregunta que decide si funciona: ¿tiene la plataforma capacidad operativa para absorber lo que va a comprar? Las buy and build operations se ganan o se pierden ahí, no en el sourcing de targets.",
      },
      { type: "h2", text: "Por qué la plataforma, no el add-on, es el cuello de botella" },
      {
        type: "p",
        text: "Cuando un add-on se integra mal, la explicación habitual apunta al add-on: cultura distinta, sistemas antiguos, fundador difícil. Mi experiencia dirigiendo la operación que tenía que absorber centros adquiridos es que el problema casi siempre estaba en casa. Una plataforma que no tiene un modelo operativo escrito no puede pedirle a nadie que lo adopte.",
      },
      {
        type: "ul",
        items: [
          "Si la plataforma no tiene P&L por centro comparable, no puede saber si el add-on mejora o empeora el grupo.",
          "Si los procesos clave viven en la cabeza de tres personas, cada integración depende de su agenda.",
          "Si la estructura central ya va justa con los centros actuales, el add-on la desborda y el servicio a toda la red se degrada.",
          "Si la integración anterior no se documentó, la siguiente empieza de cero y comete los mismos errores.",
        ],
      },
      { type: "h2", text: "Los siete componentes del playbook operativo" },
      {
        type: "p",
        text: "Un playbook de buy and build operations no es un documento de cien páginas. Es el conjunto mínimo de estándares, herramientas y rutinas que hace que cada add-on se integre de la misma manera. Estos son los siete componentes que considero imprescindibles.",
      },
      { type: "h3", text: "1. Modelo operativo estándar" },
      {
        type: "p",
        text: "Cómo funciona un centro del grupo: apertura y cierre, agenda, caja, atención, protocolos, roles. Escrito, formado y auditado. Es lo que el add-on adopta.",
      },
      { type: "h3", text: "2. P&L por centro y KPIs de grupo" },
      {
        type: "p",
        text: "Una cuenta de resultados por unidad con criterios homogéneos de imputación y un diccionario de KPIs. Sin esto, la palabra sinergia no significa nada.",
      },
      { type: "h3", text: "3. Organización y roles de centro" },
      {
        type: "p",
        text: "Qué hace un responsable de centro, de quién depende, qué decide y qué reporta. El add-on suele llegar con un fundador que lo hacía todo; el playbook define el rol que ocupa después.",
      },
      { type: "h3", text: "4. Sistemas y datos" },
      {
        type: "p",
        text: "Sistema de gestión objetivo, estructura de datos y criterio para decidir entre migrar, conectar o mantener. Y un plazo estándar para cada opción.",
      },
      { type: "h3", text: "5. Compras y catálogo" },
      {
        type: "p",
        text: "Proveedores homologados, condiciones de grupo y catálogo de productos y servicios. Es la sinergia más rápida y la primera que debe estar lista.",
      },
      { type: "h3", text: "6. Plan de 100 días reutilizable" },
      {
        type: "p",
        text: "Calendario de hitos por área, comunicación del día 1, mapa de perfiles clave y KPIs de integración. Igual para todos los add-ons, ajustado en el detalle.",
      },
      { type: "h3", text: "7. Gobernanza y reporting al fondo" },
      {
        type: "p",
        text: "Comité de integración, comité de dirección y el paquete mensual que recibe el equipo de inversión. Pocas páginas, siempre las mismas, con las sinergias en tres estados.",
      },
      { type: "h2", text: "Qué debe estar listo antes del segundo add-on" },
      {
        type: "p",
        text: "El primer add-on se puede integrar a pulso, con esfuerzo y con el CEO encima de todo. El segundo ya no. La tabla indica el mínimo viable de cada componente antes de firmar la segunda adquisición y la señal que indica que no está.",
      },
      {
        type: "table",
        headers: ["Componente", "Mínimo viable antes del add-on 2", "Señal de que no está listo"],
        rows: [
          [
            "Modelo operativo",
            "Procesos clave documentados y formados en todos los centros actuales",
            "Cada centro de la plataforma opera de una forma distinta",
          ],
          [
            "P&L por centro",
            "Cierre mensual comparable para toda la red en menos de diez días",
            "Consolidar el mes lleva semanas y requiere ajustes manuales",
          ],
          [
            "Organización",
            "Rol de responsable de centro definido y cubierto en cada unidad",
            "El CEO sigue resolviendo incidencias de centro",
          ],
          [
            "Sistemas",
            "Sistema objetivo elegido y estructura de datos definida",
            "Cada integración reabre el debate del software",
          ],
          [
            "Compras",
            "Catálogo y proveedores homologados activos en la plataforma",
            "Cada centro negocia por su cuenta",
          ],
          [
            "Plan de 100 días",
            "Documentado a partir del primer add-on, con lecciones aprendidas",
            "Nadie recuerda qué se hizo en la primera integración",
          ],
          [
            "Gobernanza",
            "Comité de integración y paquete mensual al fondo en funcionamiento",
            "El fondo pregunta por correo cómo va la integración",
          ],
        ],
      },
      { type: "h2", text: "Cómo encadenar adquisiciones sin que la estructura central se dispare" },
      {
        type: "p",
        text: "El riesgo opuesto a la falta de capacidad es construir una estructura central que se come las sinergias. La respuesta no es un número mágico, sino tres decisiones ordenadas.",
      },
      {
        type: "ol",
        items: [
          "Fijar un ratio de estructura central sobre ventas y revisarlo en cada adquisición: si el add-on no lo diluye, algo no está funcionando.",
          "Compartir funciones antes de crearlas: compras, finanzas, personas, marketing y sistemas se centralizan una vez y dan servicio a toda la red; cada add-on aporta volumen, no una nueva función.",
          "Incorporar un COO, interno o fraccional, cuando la plataforma supera el punto en que el CEO no puede dirigir a los responsables de centro y a la vez negociar la siguiente compra. En mi experiencia ese punto llega antes de lo que el plan de negocio prevé.",
        ],
      },
      { type: "h2", text: "El papel del Operating Partner y del CEO de la plataforma" },
      {
        type: "p",
        text: "Los dos roles son complementarios y los problemas aparecen cuando se confunden. El Operating Partner no debe dirigir la integración; el CEO de la plataforma no debe reportar como si fuera un gestor de centro.",
      },
      {
        type: "ul",
        items: [
          "Operating Partner: exige el playbook, valida los hitos a día 30, 60 y 100, desbloquea decisiones de estructura y aporta experiencia de otras participadas.",
          "CEO de la plataforma: es responsable de la integración, del modelo operativo y de los resultados por centro; decide quién lidera cada add-on.",
          "Ambos: se sientan en el comité de integración quincenal y revisan las sinergias con responsable y fecha. Si uno de los dos falta de forma habitual, la integración pierde prioridad.",
        ],
      },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Supongamos una plataforma de 8 centros de fisioterapia que planea 4 add-ons en 18 meses. Antes del primer add-on, el equipo dedica un trimestre a cerrar el modelo operativo, el P&L por centro y el catálogo de compras. El primer add-on sirve para probar el plan de 100 días y documentarlo. A partir del segundo, cada integración sigue el mismo calendario y el comité quincenal revisa las sinergias por centro. La estructura central crece una vez, en finanzas y sistemas, en lugar de crecer con cada compra. Caso hipotético para ilustrar la secuencia.",
      },
      {
        type: "quote",
        text: "Una plataforma no se mide por los add-ons que compra, sino por los que absorbe sin que el resto de la red lo note.",
      },
      {
        type: "p",
        text: "El playbook de buy and build operations se escribe una vez y se mejora en cada integración. El coste de no tenerlo no aparece en el modelo: aparece en el tiempo del CEO, en la rotación de perfiles clave y en sinergias que llegan dos años tarde. Si tu plataforma tiene uno o dos add-ons en el pipeline y todavía no tiene un P&L por centro comparable, el diagnóstico gratuito es una buena forma de ver qué falta antes de firmar.",
      },
    ],
    faqs: [
      {
        question: "¿Cuándo hay que escribir el playbook: antes o después del primer add-on?",
        answer:
          "El esqueleto, antes: modelo operativo, P&L por centro, catálogo de compras y gobernanza se construyen sobre la plataforma, no sobre el add-on. El plan de 100 días se termina de escribir con el primer add-on, que sirve de piloto, y se corrige con las lecciones aprendidas antes del segundo.",
      },
      {
        question: "¿Qué tamaño de estructura central necesita una plataforma Buy & Build?",
        answer:
          "El mínimo que da servicio a toda la red en finanzas, compras, personas y sistemas, y que se diluye con cada adquisición. No hay un porcentaje universal: depende del sector y del tamaño medio de centro. Lo que sí es universal es que debe fijarse como ratio sobre ventas, revisarse en cada compra y crecer por funciones, no por add-on.",
      },
      {
        question: "¿Cómo se mide que la plataforma absorbe bien los add-ons?",
        answer:
          "Con pocos indicadores: días hasta el primer cierre del add-on con criterios del grupo, retención de perfiles clave a día 100, porcentaje de compras bajo catálogo de grupo, sinergias conseguidas frente a plan y evolución de la facturación de los centros adquiridos frente al año anterior. Si estos cinco se cumplen integración tras integración, la plataforma absorbe.",
      },
    ],
  },
  {
    slug: "operational-due-diligence-que-mirar-en-una-empresa-multicentro",
    title: "Operational due diligence en empresas multicentro: qué mirar antes de firmar",
    excerpt:
      "La due diligence financiera dice cuánto gana la empresa. La operational due diligence dice si ese EBITDA se sostiene centro a centro y si se puede escalar. Checklist de 12 puntos para redes de centros.",
    metaDescription:
      "Operational due diligence en empresas multicentro: qué revela que la financiera no ve, checklist de 12 puntos, señales de alerta y cómo llevar los hallazgos a precio y SPA.",
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
        text: "La due diligence financiera responde a una pregunta: cuánto gana la empresa y si las cuentas son fiables. La operational due diligence responde a otra distinta y, en una empresa multicentro, más decisiva: si ese EBITDA se sostiene centro a centro, de quién depende y si se puede replicar con veinte centros más. He dirigido redes de hasta 25 centros y he integrado centros adquiridos, y la lección es siempre la misma: el consolidado esconde la red.",
      },
      { type: "h2", text: "Qué responde una operational due diligence que la financiera no responde" },
      {
        type: "p",
        text: "La financiera trabaja con la cuenta consolidada, los ajustes de EBITDA normalizado y la deuda neta. La operacional baja al centro, a la agenda y a la plantilla. Las preguntas que añade son concretas.",
      },
      {
        type: "ul",
        items: [
          "¿Cuántos centros ganan dinero de verdad después de imputar estructura con un criterio homogéneo, y cuántos viven de los demás?",
          "¿Qué parte de la facturación depende de dos o tres personas que podrían irse tras el cambio de control?",
          "¿Los procesos son los mismos en todos los centros, o cada unidad es una pequeña empresa con su propia forma de hacer las cosas?",
          "¿Hay capacidad instalada sin usar, o el crecimiento del plan exige abrir y contratar?",
          "¿La estructura central actual puede dar servicio al doble de centros, o hay que construirla y eso se come las sinergias?",
        ],
      },
      { type: "h2", text: "El EBITDA consolidado esconde la red" },
      {
        type: "p",
        text: "Un margen EBITDA razonable a nivel de grupo puede ser el resultado de tres centros excelentes que financian a cinco mediocres y dos en pérdida. La tabla, con cifras inventadas a modo de ejemplo ilustrativo, muestra el tipo de dispersión que una operational due diligence saca a la luz y que un consolidado nunca enseñaría.",
      },
      {
        type: "table",
        headers: ["Centro", "Ventas", "EBITDA", "Margen", "Comentario"],
        rows: [
          ["Centro A", "1,8 M€", "0,41 M€", "23 %", "Centro maduro; el director concentra buena parte de la facturación"],
          ["Centro B", "1,2 M€", "0,17 M€", "14 %", "En la media; agenda con huecos por la tarde"],
          ["Centro C", "0,9 M€", "0,05 M€", "6 %", "Coste de personal sobre ventas muy por encima del resto"],
          ["Centro D", "0,7 M€", "-0,06 M€", "-9 %", "Apertura reciente; alquiler por encima de mercado"],
          ["Centro E", "1,5 M€", "0,30 M€", "20 %", "Buen margen; sistema de gestión distinto al del grupo"],
        ],
      },
      {
        type: "p",
        text: "En este ejemplo el grupo cerraría con un margen agregado en torno al 14 %, un dato que por sí solo no dice nada de la situación del centro D ni del riesgo de dependencia del centro A. La pregunta para el comprador no es cuánto gana el grupo, sino qué tiene que pasar para que los centros C y D se acerquen a A y E, y si eso está en manos del management.",
      },
      { type: "h2", text: "Checklist de operational due diligence: 12 puntos" },
      {
        type: "p",
        text: "Esta es la lista que utilizo como índice del trabajo. No todos los puntos pesan igual en todos los sectores, pero ninguno se puede dejar fuera en una red de centros.",
      },
      {
        type: "ol",
        items: [
          "Calidad del EBITDA por centro: dispersión entre unidades, centros en pérdida, ajustes no recurrentes y criterios de imputación de estructura.",
          "Dependencia de personas clave: fundador, directores médicos o profesionales que concentran facturación, y qué pasa con cada uno tras el cambio de control.",
          "Homogeneidad de procesos entre centros: si existe un modelo operativo escrito o cada unidad funciona a su manera.",
          "Sistemas: gestión, agendas, caja y contabilidad; cuántos hay, si se hablan entre ellos y si el dato es accesible y fiable.",
          "Plantilla: dimensionamiento por centro, rotación, absentismo y coste de personal sobre ventas unidad a unidad.",
          "Contratos de alquiler: vencimientos, rentas frente a mercado, garantías y cláusulas de cambio de control.",
          "Pipeline comercial y recurrencia: de dónde viene el cliente o paciente nuevo, qué proporción vuelve y cuánto depende del marketing local.",
          "Precios, catálogo y mix de servicios por centro: si el margen viene de volumen o de mix, y si hay centros con precios fuera de la banda del grupo.",
          "Compras y proveedores: concentración, condiciones negociadas, contratos con permanencia y margen de homologación.",
          "Capacidad instalada frente a utilizada: ocupación de salas, sillones o quirófanos, y horas disponibles frente a horas facturadas.",
          "Estructura central y costes de soporte: qué funciones existen, cuánto cuestan y qué falta para dar servicio a una red más grande.",
          "Cumplimiento regulatorio y licencias por centro: autorizaciones sanitarias, prevención, protección de datos y cualquier inspección pendiente.",
        ],
      },
      { type: "h2", text: "Cómo convertir los hallazgos en precio, SPA y plan de 100 días" },
      {
        type: "p",
        text: "Una operational due diligence que termina en un informe de riesgos no ha terminado. Cada hallazgo debe salir por una de tres puertas.",
      },
      {
        type: "ul",
        items: [
          "Precio: lo que afecta a la calidad del EBITDA (centros en pérdida estructural, ajustes no recurrentes discutibles, dependencia extrema de una persona) se traslada al EBITDA de referencia o al múltiplo.",
          "SPA: lo que es un riesgo identificable pero no cuantificable con certeza (licencias pendientes, alquileres con cláusula de cambio de control, litigios laborales) va a garantías, indemnidades o precio aplazado.",
          "Plan de 100 días: lo que es una oportunidad operativa (compras, agendas, plantilla, procesos) se convierte en sinergia con responsable y fecha, y entra en el plan de integración antes del cierre.",
        ],
      },
      { type: "h2", text: "Señales de alerta que justifican parar o renegociar" },
      {
        type: "ul",
        items: [
          "No existe P&L por centro, o el management tarda semanas en producirlo: el negocio se dirige a ciegas.",
          "Una parte muy relevante de la facturación depende de personas sin pacto de permanencia ni plan de sucesión.",
          "Los dos mejores centros tienen el alquiler vencido o en renegociación con cláusula de cambio de control.",
          "El EBITDA normalizado incluye ajustes que el management no sabe explicar centro a centro.",
          "La estructura central ya está desbordada con la red actual: cualquier add-on exigirá construirla desde cero.",
          "Acceso limitado al management de centro durante la due diligence sin una razón de confidencialidad clara.",
        ],
      },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Imaginemos un fondo que analiza una cadena de 18 centros de estética con un margen EBITDA agregado atractivo. La operational due diligence construye el P&L por centro con criterios homogéneos y encuentra que cuatro centros abiertos en los dos últimos años están en pérdida y que el margen agregado lo sostienen seis centros maduros cuyos directores llevan más de ocho años con el fundador. El resultado no es abandonar la operación, sino separar el EBITDA de referencia del EBITDA de las aperturas, incluir planes de retención en el SPA y llevar al plan de 100 días la reestructuración de agendas de los cuatro centros nuevos. Caso hipotético para ilustrar el método.",
      },
      {
        type: "quote",
        text: "La financiera te dice cuánto pagas. La operacional te dice qué compras y qué vas a tener que arreglar el día 1.",
      },
      {
        type: "p",
        text: "Hacer una operational due diligence en una empresa multicentro no es duplicar el trabajo de la financiera: es mirar donde ella no mira, centro a centro, y traer los hallazgos al precio, al contrato y al plan de integración. Si estás analizando un target de 10 a 30 centros, o eres el management de una participada que quiere saber qué encontraría un comprador, el diagnóstico gratuito de esta web es un primer paso útil para ver dónde está la dispersión.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto dura una operational due diligence de una empresa de 10 a 30 centros?",
        answer:
          "Entre tres y cinco semanas si el data room incluye cierres contables por centro y extracciones del sistema de gestión. Si el P&L por centro no existe y hay que construirlo a partir de la contabilidad, se añaden una o dos semanas. Lo que no debería hacerse es comprimirla a una semana para encajar en el calendario del proceso.",
      },
      {
        question: "¿Qué datos hay que pedir en el data room?",
        answer:
          "Cierres contables mensuales de los últimos 24 meses con desglose por centro, extracción del sistema de gestión (ventas, actividad, agendas, ocupación), plantillas y nóminas por centro, contratos de alquiler, contratos con los principales proveedores, licencias y autorizaciones por centro y el organigrama con la antigüedad de responsables y profesionales.",
      },
      {
        question: "¿Se puede hacer una operational due diligence con acceso limitado al management?",
        answer:
          "Parcialmente. Con datos se puede construir el P&L por centro, la dispersión y la capacidad. Lo que no se puede evaluar sin hablar con los responsables de centro es la dependencia de personas y la homogeneidad real de procesos. Si el vendedor restringe el acceso, hay que reflejarlo como riesgo en el SPA o pactar entrevistas en la fase de exclusividad.",
      },
    ],
  },
];
