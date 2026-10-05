import type { InsightPost } from "../types";

/**
 * Artículos de operaciones y P&L. Voz en primera persona (Marc). Las cifras que
 * aparecen son ejemplos explícitamente hipotéticos, nunca resultados propios.
 */
export const operacionesPlPosts: InsightPost[] = [
  /* ------------------------------------------------------------------ */
  /* 1. Director de operaciones multicentro                              */
  /* ------------------------------------------------------------------ */
  {
    slug: "director-de-operaciones-multicentro-que-hace",
    title: "Qué hace (de verdad) un director de operaciones multicentro",
    excerpt:
      "Dirigir quince centros no es dirigir quince veces un centro. Las responsabilidades reales del puesto, una semana tipo, lo que no debe hacer y qué perfil necesita la red según su tamaño.",
    metaDescription:
      "Funciones reales de un director de operaciones multicentro: responsabilidades, semana tipo, perfil según tamaño de red y cuándo encaja un COO externo.",
    category: "operaciones",
    tags: ["Dirección de operaciones", "Modelo operativo", "Fractional COO", "Managers de centro"],
    keywords: [
      "director operaciones multicentro",
      "director de operaciones multicentro",
      "funciones director de operaciones",
      "COO empresa multicentro",
      "dirección de operaciones redes de centros",
      "fractional COO",
      "gestión multicentro",
    ],
    publishedAt: "2026-06-16",
    readingMinutes: 7,
    relatedServices: ["fractional-coo", "multisite-performance-audit"],
    blocks: [
      {
        type: "p",
        text: "Cuando un CEO me pregunta qué hace exactamente un director de operaciones multicentro, suelo responder con otra pregunta: ¿cuánto tardas hoy en saber qué centro de tu red ha perdido margen este mes y por qué? Si la respuesta es más de cinco minutos, ya tienes la descripción del puesto. El trabajo consiste en que esa pregunta tenga respuesta todas las semanas y en que alguien haga algo con ella.",
      },
      {
        type: "p",
        text: "He dirigido redes de hasta 25 centros, con un P&L de 35 M€ y equipos de 250 personas, en healthcare, dental, veterinaria y retail. En todos los casos el puesto era el mismo aunque cambiara el sector: convertir un conjunto de unidades que funcionan cada una a su manera en una red que opera, mide y decide con un solo criterio.",
      },
      { type: "h2", text: "El problema no es el centro, es la red" },
      {
        type: "p",
        text: "Un buen responsable de centro sabe gestionar su unidad: su equipo, su agenda, sus clientes o pacientes, su caja. Lo que no puede hacer desde su posición es comparar. No sabe si su coste de personal sobre ventas es alto o bajo, si su ticket medio está en la media del grupo o si su ocupación justifica abrir una tarde más. Esa comparación solo existe si alguien construye la mirada transversal.",
      },
      {
        type: "p",
        text: "El director de operaciones es, ante todo, el responsable de esa mirada. Su valor no está en operar mejor un centro concreto, sino en que los quince, veinticinco o cuarenta centros se gestionen con el mismo modelo, se midan con los mismos KPIs y se corrijan con la misma rapidez. Cuando no existe esa figura, la red funciona como una suma de pequeñas empresas y el CEO acaba haciendo de director de operaciones a ratos, que es la forma más cara de hacerlo.",
      },
      { type: "h2", text: "Las cinco responsabilidades que no se delegan" },
      {
        type: "p",
        text: "Hay tareas que se pueden repartir y otras que, si el director de operaciones no las asume personalmente, nadie las asume. Estas son las cinco que considero irrenunciables:",
      },
      {
        type: "ul",
        items: [
          "El P&L por centro. Que exista, que sea comparable entre unidades y que se revise cada mes con cada responsable. No basta con que finanzas cierre la contabilidad: alguien tiene que convertirla en una cuenta de resultados operativa por centro.",
          "El cuadro de mando semanal. Seis u ocho indicadores, no cuarenta, que anticipan el resultado del mes: ventas, ocupación, conversión, ticket medio, horas de personal y coste de personal sobre ventas.",
          "La dirección de los managers de centro. Objetivos, rutina de seguimiento, desarrollo y, cuando hace falta, sustitución. Los managers son la palanca de ejecución más potente de la red y la que más se descuida.",
          "El modelo operativo. Decidir qué se hace igual en todos los centros (procesos clave, catálogo, plantilla tipo, estándares de servicio) y qué se deja a criterio local.",
          "La capacidad y la plantilla. Dimensionar equipos en función de la demanda real de cada centro, no de la plantilla histórica ni de lo que pide cada responsable.",
        ],
      },
      { type: "h2", text: "Una semana tipo" },
      {
        type: "p",
        text: "El puesto se entiende mejor con la agenda que con el organigrama. Una semana razonable, cuando la red ya tiene datos y rutinas, se parece a esto:",
      },
      {
        type: "ol",
        items: [
          "Lunes: revisión del cuadro de mando de la semana anterior. Qué centros se han desviado, en qué indicador y qué acción se decide para cada uno. Dura una hora si los datos están bien; dura un día si no.",
          "Martes y miércoles: visitas a centros. No para supervisar, sino para contrastar los datos con la realidad: agendas, equipos, flujo de clientes, estado de las instalaciones. Dos o tres centros por semana permiten recorrer una red de 25 en un trimestre.",
          "Jueves: comité de dirección y reuniones transversales con compras, marketing, personas y finanzas. Aquí se defienden las decisiones que afectan a toda la red.",
          "Viernes por la mañana: trabajo sobre el P&L. Análisis de desviaciones del cierre mensual, preparación de las revisiones con managers y seguimiento de los planes de acción abiertos.",
          "Viernes por la tarde: conversaciones individuales con managers. Seguimiento de objetivos, dificultades concretas y decisiones que no pueden esperar a la revisión mensual.",
        ],
      },
      { type: "h2", text: "Lo que no hace un director de operaciones" },
      {
        type: "callout",
        title: "Síntoma habitual",
        text: "Si el director de operaciones pasa la mayor parte de su semana resolviendo incidencias de centros concretos, cubriendo bajas o negociando con un proveedor local, no está dirigiendo operaciones: está haciendo de responsable de centro con un título más caro. Es la señal más clara de una red sin modelo operativo.",
      },
      {
        type: "p",
        text: "Tampoco es su trabajo sustituir al director financiero en el cierre, ni al director comercial en la captación, ni al responsable de personas en la selección. Su función es que todas esas áreas tengan un impacto medible en el P&L de cada centro y que las decisiones se tomen con los mismos datos. Cuando el puesto se convierte en un comodín para todo lo que no tiene dueño, deja de aportar lo único que nadie más puede aportar: la visión comparada de la red.",
      },
      { type: "h2", text: "Qué perfil necesita una red de 5, 15 y 40 centros" },
      {
        type: "p",
        text: "No existe un único perfil. El director de operaciones que necesita una red de cinco clínicas no es el que necesita un grupo de cuarenta tiendas. Esta tabla resume lo que suelo encontrar y recomendar:",
      },
      {
        type: "table",
        headers: ["Tamaño de red", "Situación habitual", "Perfil que encaja"],
        rows: [
          [
            "5-8 centros",
            "El CEO sigue llevando la operación. Faltan datos comparables y rutinas con los managers.",
            "Responsable de operaciones con base financiera, capaz de construir el P&L por centro y el cuadro de mando desde cero. Un formato fractional suele ser suficiente.",
          ],
          [
            "10-20 centros",
            "Ya hay managers, pero cada uno trabaja a su manera. Las desviaciones se detectan tarde y la expansión se improvisa.",
            "Director de operaciones con experiencia en estandarización y en dirección de equipos de managers. Dedicación completa o fractional con alta presencia.",
          ],
          [
            "25-40 centros o más",
            "Varias zonas o marcas, adquisiciones recientes, reporting a consejo o inversores.",
            "COO con experiencia en integraciones, estructura de responsables de zona y reporting a inversores. Dedicación completa con equipo propio.",
          ],
        ],
      },
      {
        type: "p",
        text: "La trampa frecuente está en el tramo intermedio: redes de diez a veinte centros que contratan un perfil operativo de centro grande cuando lo que necesitan es alguien que construya el sistema de dirección de la red.",
      },
      { type: "h2", text: "Cuándo tiene sentido un COO externo" },
      {
        type: "p",
        text: "Hay un momento, normalmente entre los cinco y los veinte centros, en el que la empresa necesita la función de director de operaciones pero no justifica un coste fijo de 120.000 a 150.000 euros anuales, ni tiene claro todavía qué perfil interno acabará necesitando. Para esa fase existe el formato de Fractional COO: dirección de operaciones a tiempo parcial, con responsabilidad real sobre resultados y una duración definida.",
      },
      {
        type: "quote",
        text: "El objetivo de un COO externo no es quedarse. Es dejar la red con un P&L por centro, un cuadro de mando, unos managers dirigidos y un modelo operativo que el siguiente director de operaciones, ya interno, pueda heredar sin empezar de cero.",
      },
      {
        type: "p",
        text: "Si tu red está en esa fase y quieres un punto de partida objetivo, el diagnóstico gratuito de tres minutos te sitúa en cinco bloques: finanzas, operaciones, personas, datos y escalabilidad. A partir de ahí se puede hablar de qué perfil necesitas y en qué formato.",
      },
    ],
    faqs: [
      {
        question: "¿En qué se diferencia un director de operaciones de un director general en una empresa multicentro?",
        answer:
          "El director general responde por la estrategia, la cuenta de resultados consolidada, la financiación y la relación con accionistas o inversores. El director de operaciones responde por la ejecución: que cada centro funcione con el mismo modelo, que los KPIs se midan igual, que los managers tengan dirección y que las desviaciones se corrijan a tiempo. En redes pequeñas ambas funciones recaen en la misma persona, y ese suele ser el cuello de botella.",
      },
      {
        question: "¿A partir de cuántos centros hace falta un director de operaciones?",
        answer:
          "Más que el número de centros, el indicador es el tiempo del CEO. Cuando más de la mitad de su agenda se va en operación diaria, o cuando no puede comparar la rentabilidad de sus centros en menos de cinco minutos, la función ya es necesaria. En la práctica suele ocurrir entre los cinco y los ocho centros. Que sea una contratación interna, un fractional o un interim depende del tamaño y de la fase de la empresa.",
      },
      {
        question: "¿Cómo se mide el impacto de un director de operaciones?",
        answer:
          "Con el mismo P&L por centro que él debe construir. Los indicadores habituales son el margen de contribución por centro, el coste de personal sobre ventas, la dispersión entre el mejor y el peor centro, el tiempo de cierre del reporting mensual y el porcentaje de centros que cumplen su objetivo. Si a los seis meses esos indicadores no se miden o no se mueven, algo falla en el puesto o en el encargo.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 2. Consultor de operaciones multicentro                             */
  /* ------------------------------------------------------------------ */
  {
    slug: "consultor-operaciones-multicentro-cuando-contratar",
    title: "Consultor de operaciones multicentro: cuándo contratarlo y qué exigirle",
    excerpt:
      "Cuatro señales de que la red ha crecido más que su dirección, qué debe entregar un consultor de operaciones multicentro, los tres formatos posibles y cómo evaluar una propuesta en veinte minutos.",
    metaDescription:
      "Cuándo contratar un consultor de operaciones multicentro, qué entregables exigir, diferencias con interim y Fractional COO y cómo evaluar una propuesta en 20 minutos.",
    category: "operaciones",
    tags: ["Consultoría de operaciones", "Fractional COO", "P&L por centro", "Diagnóstico operativo"],
    keywords: [
      "consultor operaciones multicentro",
      "consultor de operaciones",
      "consultoría operaciones multicentro",
      "interim COO",
      "fractional COO",
      "auditoría operativa multicentro",
      "mejorar rentabilidad red de centros",
    ],
    publishedAt: "2026-07-07",
    readingMinutes: 7,
    relatedServices: ["multisite-performance-audit", "ebitda-improvement"],
    blocks: [
      {
        type: "p",
        text: "Contratar un consultor de operaciones multicentro es una decisión que se toma casi siempre tarde. No porque falte información, sino porque la red sigue facturando y el problema parece manejable hasta que el EBITDA deja de acompañar al crecimiento. He estado en los dos lados de la mesa: como director de operaciones que contrataba apoyo externo y como externo al que se llama cuando la red ya no se puede dirigir desde la agenda del CEO.",
      },
      {
        type: "p",
        text: "Este artículo resume lo que me habría gustado saber en el primer caso: cuándo tiene sentido, qué hay que exigir y cómo distinguir una propuesta útil de un informe caro.",
      },
      { type: "h2", text: "Cuatro señales de que la red ha crecido más que su dirección" },
      {
        type: "p",
        text: "Las redes no avisan de que necesitan ayuda. Lo hacen los datos, o la ausencia de ellos. Estas cuatro señales aparecen juntas con una frecuencia sospechosa:",
      },
      {
        type: "ul",
        items: [
          "La facturación crece y el EBITDA no. Cada apertura o adquisición añade ventas, pero el margen consolidado se queda igual o baja, y nadie puede explicar centro por centro dónde se pierde.",
          "Consolidar la información lleva semanas. Cada centro reporta en un formato distinto, con criterios distintos, y el cierre mensual llega cuando ya es tarde para corregir nada.",
          "El coste de personal se ha disparado en algunos centros sin que la actividad lo justifique, y no está claro si es un problema de plantilla, de agenda o de ventas.",
          "El CEO es el cuello de botella. Todas las decisiones operativas pasan por él, los managers de centro no tienen objetivos ni rutina de seguimiento y la expansión se improvisa.",
        ],
      },
      {
        type: "p",
        text: "Si reconoces dos de las cuatro, la red ya ha superado a su estructura de dirección. La pregunta no es si hace falta ayuda, sino en qué formato.",
      },
      { type: "h2", text: "Qué debe entregar un consultor de operaciones multicentro (y qué no)" },
      {
        type: "p",
        text: "Un consultor de operaciones no se contrata para que opine. Se contrata para que entregue algo que la organización no puede producir sola en un plazo razonable. Esta tabla resume lo que pido yo cuando estoy del lado del cliente:",
      },
      {
        type: "table",
        headers: ["Entregable", "Qué pedir", "Señal de alarma"],
        rows: [
          [
            "P&L por centro comparable",
            "Una cuenta de resultados por unidad con criterios homogéneos de imputación, construida con los datos que ya existen.",
            "Que proponga implantar un sistema antes de analizar nada.",
          ],
          [
            "Ranking y mapa de desviaciones",
            "Qué centros destruyen margen, cuánto y por qué, con cuartiles y comparación interna.",
            "Un informe de cien páginas sin un ranking claro en la primera.",
          ],
          [
            "Palancas cuantificadas",
            "Oportunidades de EBITDA por palanca (personal, agendas, compras, precios, estructura) con impacto estimado y esfuerzo.",
            "Porcentajes de mejora prometidos antes de ver los datos.",
          ],
          [
            "Plan de acción a 90 días",
            "Acciones concretas, responsables internos y fechas. Quick wins para los primeros 30 días.",
            "Recomendaciones genéricas sin dueño ni calendario.",
          ],
          [
            "Transferencia",
            "Rutinas, plantillas y cuadro de mando que el equipo pueda mantener sin el consultor.",
            "Dependencia: que todo siga pasando por su correo al terminar.",
          ],
        ],
      },
      { type: "h2", text: "Consultor, interim o Fractional COO: tres formatos" },
      {
        type: "p",
        text: "El mismo problema admite tres respuestas distintas según la fase de la empresa y el tiempo disponible.",
      },
      { type: "h3", text: "Consultor de operaciones" },
      {
        type: "p",
        text: "Proyecto cerrado, de tres a ocho semanas, con un entregable definido: diagnóstico, P&L por centro, ranking y plan de acción. Encaja cuando la dirección es sólida y lo que falta es la fotografía objetiva y la priorización. El riesgo es que el plan se quede en el cajón si nadie dentro tiene tiempo para ejecutarlo.",
      },
      { type: "h3", text: "Interim COO" },
      {
        type: "p",
        text: "Dirección de operaciones a tiempo completo durante un periodo definido, habitualmente entre seis y doce meses, para cubrir una vacante, una crisis o una integración. Encaja cuando hay urgencia y la red ya justifica un COO, pero todavía no ha encontrado al definitivo. Es el formato más caro y el más intenso.",
      },
      { type: "h3", text: "Fractional COO" },
      {
        type: "p",
        text: "Dirección de operaciones a tiempo parcial, dos o tres días por semana, con responsabilidad sobre resultados y una duración mínima de seis meses. Encaja en redes de cinco a cincuenta millones de facturación que necesitan la función pero no justifican todavía el coste fijo. A diferencia del consultor, no entrega recomendaciones: ejecuta con el equipo y forma parte del comité de dirección.",
      },
      { type: "h2", text: "El error habitual: contratar antes de tener un P&L por centro" },
      {
        type: "callout",
        title: "Antes de firmar",
        text: "Si la red no tiene un P&L por centro comparable, el primer encargo de cualquier externo debe ser construirlo. Contratar un programa de mejora de EBITDA, una reorganización o un plan de expansión sin esa base es decidir a ciegas con un asesor al lado. El orden importa: primero medir, después comparar, después actuar.",
      },
      {
        type: "p",
        text: "Lo digo porque es el error que más veces he visto repetirse. La empresa contrata para resolver el síntoma visible (el coste de personal, la caída de margen de dos centros, la integración de una adquisición) y descubre en la tercera semana que no hay datos homogéneos para saber si el síntoma es real. Un buen consultor lo dirá en la primera reunión y ajustará el alcance. Uno malo facturará las tres semanas igualmente.",
      },
      { type: "h2", text: "Cómo evaluar la propuesta en 20 minutos" },
      {
        type: "p",
        text: "No hace falta ser experto en operaciones para distinguir una propuesta útil. Basta con revisar seis puntos en este orden:",
      },
      {
        type: "ol",
        items: [
          "Datos de partida: ¿pide los cierres contables, las extracciones del sistema de gestión y las plantillas por centro, o propone empezar con entrevistas y talleres? Los datos van primero.",
          "Entregable principal: ¿está escrito con una frase concreta (P&L por centro, ranking, plan a 90 días) o con sustantivos abstractos como transformación, excelencia o alineamiento?",
          "Cifras prometidas: ¿se compromete a un porcentaje de mejora antes de ver los datos? Si lo hace, desconfía. Lo serio es fijar el objetivo en la primera semana con datos propios.",
          "Tiempo del equipo directivo: ¿cuántas horas pide y a quién? Un diagnóstico bien diseñado necesita entre cuatro y seis horas de dirección en total, no un comité semanal de dos horas.",
          "Experiencia operativa: ¿ha dirigido una red de centros con responsabilidad sobre el P&L, o solo ha asesorado a quien la dirigía? La diferencia se nota en la primera visita a un centro.",
          "Qué queda al terminar: ¿nombra las rutinas, plantillas y cuadros de mando que la organización mantendrá sola, o la continuidad depende de contratar otra fase?",
        ],
      },
      { type: "h2", text: "Qué pasa después" },
      {
        type: "quote",
        text: "El mejor resultado de un proyecto de consultoría de operaciones no es el informe. Es que, tres meses después, el comité de dirección revise el P&L por centro sin que nadie pregunte de dónde salen los números.",
      },
      {
        type: "p",
        text: "Cuando la fotografía está hecha, las palancas priorizadas y el plan en marcha, la empresa tiene dos caminos: ejecutar con el equipo interno o acompañar la ejecución durante un trimestre con un sprint de mejora de EBITDA o un Fractional COO. Las dos opciones son válidas. La única que no lo es consiste en archivar el diagnóstico y volver a la agenda de siempre.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto dura un proyecto de consultoría de operaciones multicentro?",
        answer:
          "Un diagnóstico completo de una red de cinco a cincuenta centros, con P&L por centro, ranking y plan de acción, se hace en tres o cuatro semanas si los datos existen. Un programa de ejecución sobre las palancas priorizadas suele durar entre seis y ocho semanas. Más allá de eso ya no es consultoría: es dirección de operaciones externa, y conviene contratarla como tal.",
      },
      {
        question: "¿Hace falta implantar un software antes de contratar al consultor?",
        answer:
          "No. Un buen diagnóstico se construye con lo que ya existe: cierres contables, extracciones del sistema de gestión y plantillas. Si alguien condiciona el análisis a implantar primero una herramienta, está vendiendo la herramienta. El software puede venir después, cuando ya se sabe qué hay que medir y por qué.",
      },
      {
        question: "¿Cómo se mide el retorno de la consultoría?",
        answer:
          "Con el P&L por centro que el propio proyecto debe construir. Antes de empezar se fijan tres o cuatro indicadores (margen de contribución por centro, coste de personal sobre ventas, dispersión entre cuartiles, tiempo de cierre) y se comparan a los tres y a los seis meses. Si el proyecto no deja esos indicadores medibles, no hay forma de evaluar el retorno, y eso ya es una respuesta.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 3. P&L por centro                                                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "pl-por-centro-como-construirlo",
    title: "P&L por centro: cómo construirlo para comparar la rentabilidad de tu red",
    excerpt:
      "La contabilidad cierra la empresa; el P&L por centro dirige la red. Estructura línea a línea, criterios de imputación de la estructura central, errores que invalidan la comparación y un ejemplo ilustrativo con doce centros.",
    metaDescription:
      "Cómo construir un P&L por centro comparable: estructura línea a línea, criterios de imputación de costes centrales, errores habituales y un ejemplo con 12 centros.",
    category: "pl",
    tags: ["P&L por centro", "Imputación de costes", "Margen de contribución", "Cierre mensual", "CFO"],
    keywords: [
      "P&L por centro",
      "cuenta de resultados por centro",
      "P&L por tienda",
      "P&L por clínica",
      "imputación de costes centrales",
      "margen de contribución por centro",
      "rentabilidad por centro",
    ],
    publishedAt: "2026-07-28",
    readingMinutes: 8,
    relatedServices: ["multisite-performance-audit", "fractional-coo"],
    blocks: [
      {
        type: "p",
        text: "Si tienes quince centros y no puedes comparar su rentabilidad en menos de cinco minutos, tienes un problema de gestión. No de contabilidad: la contabilidad probablemente está al día. El problema es que nadie ha convertido esos asientos en una cuenta de resultados por centro que permita decidir dónde actuar.",
      },
      {
        type: "p",
        text: "El P&L por centro es la herramienta más importante de una empresa multicentro y, a la vez, la que menos redes tienen bien construida. Lo he montado desde cero en redes de distintos sectores, siempre con la misma estructura y los mismos tres debates sobre imputación. Este artículo recoge esa estructura y esos debates.",
      },
      { type: "h2", text: "Por qué la contabilidad no es un P&L por centro" },
      {
        type: "p",
        text: "La contabilidad responde a la pregunta de cuánto ha ganado la empresa y lo hace con criterios fiscales y de auditoría. El P&L por centro responde a otra: cuánto aporta cada unidad y qué explica la diferencia entre ellas. Son preguntas distintas y exigen decisiones distintas.",
      },
      {
        type: "p",
        text: "Tres diferencias habituales lo ilustran. La contabilidad registra el gasto donde se factura, no donde se consume: un pedido centralizado de consumibles aparece en la central aunque lo usen doce centros. Los periodos no coinciden con la actividad: una campaña local pagada en enero afecta a las ventas de febrero y marzo. Y la estructura central (dirección, finanzas, marketing, sistemas) existe para servir a los centros, pero contablemente no se reparte. Sin corregir esas tres cosas, comparar centros con la contabilidad es comparar peras con manzanas.",
      },
      { type: "h2", text: "La estructura línea a línea" },
      {
        type: "p",
        text: "Esta es la estructura que utilizo. Cambian los nombres según el sector (pacientes o clientes, tratamientos o tickets), pero no la lógica: primero lo que el centro controla, después lo que se le imputa.",
      },
      {
        type: "table",
        headers: ["Línea", "Qué incluye", "Criterio de imputación"],
        rows: [
          [
            "Ventas netas",
            "Facturación del centro menos devoluciones, descuentos y anulaciones.",
            "Por centro según el sistema de gestión, no según la factura.",
          ],
          [
            "Coste de ventas y consumibles",
            "Material, producto, laboratorio, consumibles clínicos o mercancía vendida.",
            "Consumo real del centro, no pedido central. Sin dato de consumo, se reparte por actividad.",
          ],
          [
            "Personal directo",
            "Salarios, seguridad social y variables del equipo que atiende en el centro.",
            "Directo. Sustituciones y personal compartido, por horas trabajadas en cada centro.",
          ],
          [
            "Personal indirecto de centro",
            "Responsable de centro, recepción, administración local.",
            "Directo al centro al que pertenece.",
          ],
          ["Alquiler y ocupación", "Renta, comunidad, tributos locales, seguros del local.", "Directo por contrato."],
          [
            "Suministros y mantenimiento",
            "Luz, agua, limpieza, reparaciones, pequeñas inversiones no activadas.",
            "Directo. Lo contratado centralmente, por superficie o por consumo.",
          ],
          [
            "Marketing local",
            "Acciones del centro: eventos, señalización, campañas de zona.",
            "Directo. El marketing de marca va a estructura central.",
          ],
          [
            "Otros gastos de centro",
            "Software local, telefonía, comisiones de pago, formación del equipo.",
            "Directo, o por ventas si es un contrato de grupo.",
          ],
          [
            "Margen de contribución",
            "Ventas netas menos todas las líneas anteriores.",
            "Es la cifra que mide la gestión del responsable de centro.",
          ],
          [
            "Estructura central imputada",
            "Dirección, finanzas, personas, marketing de marca, sistemas, compras.",
            "Por ventas, por actividad o por plantilla, siempre con el mismo criterio en todos los centros.",
          ],
          [
            "EBITDA de centro",
            "Margen de contribución menos estructura imputada.",
            "Es la cifra que mide la viabilidad del centro dentro del grupo.",
          ],
        ],
      },
      {
        type: "p",
        text: "Amortizaciones, financiación e impuestos quedan fuera. No porque no importen, sino porque dependen de decisiones de inversión y fiscales que el centro no controla y que distorsionan la comparación operativa.",
      },
      { type: "h2", text: "Tres criterios de imputación y cuándo usar cada uno" },
      {
        type: "p",
        text: "La estructura central es el punto de discusión en todas las redes. No existe un criterio perfecto; existe un criterio explícito, aplicado igual a todos y revisado una vez al año.",
      },
      { type: "h3", text: "Por ventas" },
      {
        type: "p",
        text: "El más sencillo y el más utilizado. Cada centro absorbe estructura en proporción a su facturación. Funciona cuando los centros son parecidos en tamaño y mix. Su defecto es que penaliza a los centros que venden más y oculta la ineficiencia de los pequeños.",
      },
      { type: "h3", text: "Por actividad" },
      {
        type: "p",
        text: "Se reparte según el número de visitas, tratamientos, tickets o pedidos. Refleja mejor el uso real de los servicios centrales, como atención al cliente, sistemas o administración. Exige que la actividad se mida igual en todos los centros, lo que no siempre ocurre.",
      },
      { type: "h3", text: "Por uso directo" },
      {
        type: "p",
        text: "Se imputa a cada centro lo que consume de forma identificable: horas de un responsable de zona, campañas de marketing por centro, licencias por puesto. Es el criterio más justo y el más laborioso. Suelo usarlo para las partidas grandes e identificables y repartir el resto por ventas o actividad.",
      },
      { type: "h2", text: "Errores que invalidan la comparación" },
      {
        type: "p",
        text: "Un P&L por centro mal construido es peor que ninguno, porque da apariencia de rigor a decisiones equivocadas. Los errores que más veces he tenido que corregir:",
      },
      {
        type: "ul",
        items: [
          "Imputar el personal compartido al centro donde está dado de alta, no donde trabaja. Un profesional que cubre tres centros aparece en uno y los otros dos parecen más rentables de lo que son.",
          "Cambiar el criterio de imputación de un mes a otro, o aplicar criterios distintos a centros propios y adquiridos.",
          "Registrar los pedidos centrales como gasto de central. Los consumibles son el segundo coste de la mayoría de redes y deben llegar al centro que los consume.",
          "No separar el margen de contribución del EBITDA de centro. Si se evalúa al responsable por una cifra que incluye estructura que no controla, se pierde la conversación útil.",
          "Comparar centros con menos de doce meses de actividad con centros maduros sin marcarlo. La rampa de apertura distorsiona todo el ranking.",
          "Cerrar el P&L por centro el día 25 del mes siguiente. Un P&L que llega tarde no dirige: documenta.",
        ],
      },
      { type: "h2", text: "Ejemplo ilustrativo con una red de 12 centros" },
      {
        type: "callout",
        title: "Ejemplo hipotético",
        text: "Supongamos una red de 12 clínicas con 14 millones de euros de ventas y una estructura central de 1,4 millones. Repartida por ventas, cada centro absorbe el 10 % de su facturación. Al pasar a un reparto mixto (sistemas y atención al cliente por actividad, dirección de zona por uso directo, el resto por ventas), tres centros pequeños que parecían rentables pasan a EBITDA negativo y dos grandes mejoran. El margen total de la red no cambia ni un euro: cambia dónde hay que actuar. Las cifras son inventadas para el ejemplo; la conclusión se repite en casi todas las redes que he analizado.",
      },
      {
        type: "p",
        text: "Ese es el valor del ejercicio. El P&L por centro no mejora el resultado por sí mismo. Lo que hace es señalar con precisión dónde están las decisiones pendientes: una plantilla sobredimensionada, un alquiler fuera de mercado, una agenda con huecos, un centro que debería cerrarse o reubicarse.",
      },
      { type: "h2", text: "Del P&L a la decisión" },
      {
        type: "quote",
        text: "Un P&L por centro que no se revisa cada mes con cada responsable es un informe. Uno que sí se revisa es un sistema de dirección.",
      },
      {
        type: "p",
        text: "La construcción es la parte técnica y se resuelve en tres o cuatro semanas con los datos que ya existen. La parte difícil viene después: la rutina mensual de revisión, el plan de acción por centro y la disciplina de mantener el criterio cuando un responsable discute su imputación. Si quieres saber en qué punto está hoy tu red, el diagnóstico gratuito de tres minutos es el primer paso.",
      },
    ],
    faqs: [
      {
        question: "¿Con qué frecuencia hay que cerrar el P&L por centro?",
        answer:
          "Mensualmente, y antes del día 10 del mes siguiente. Un cierre que llega el día 25 no permite corregir nada en el mes en curso. En paralelo, el cuadro de mando semanal con seis u ocho indicadores operativos (ventas, ocupación, conversión, horas de personal) anticipa el resultado y evita sorpresas en el cierre.",
      },
      {
        question: "¿Quién es responsable del P&L por centro: el CFO o el director de operaciones?",
        answer:
          "Los dos, con funciones distintas. El CFO garantiza que los datos son correctos, que los criterios de imputación se aplican y que el cierre llega a tiempo. El director de operaciones lo utiliza: lo revisa con cada responsable de centro, decide las acciones y hace seguimiento. Cuando solo lo hace finanzas, el P&L se queda en un informe; cuando solo lo hace operaciones, los números acaban discutiéndose en cada reunión.",
      },
      {
        question: "¿Qué se hace con los centros nuevos que están en rampa?",
        answer:
          "Se incluyen en el P&L desde el primer mes, pero se marcan y se comparan contra su propio plan de apertura, no contra la media de la red. A partir de los doce o dieciocho meses, según el sector, entran en el ranking general. Mezclarlos antes distorsiona los cuartiles y lleva a conclusiones equivocadas sobre los centros maduros.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 4. Rentabilidad por centro: ranking y benchmarking                  */
  /* ------------------------------------------------------------------ */
  {
    slug: "rentabilidad-por-centro-ranking-y-benchmarking",
    title: "Rentabilidad por centro: ranking y benchmarking interno para decidir dónde actuar",
    excerpt:
      "Un ranking de centros no es un informe: es una decisión. Qué métricas ordenan la red, por qué la distancia entre cuartiles es tu plan de mejora, las cinco trampas del ranking y cómo convertirlo en acciones en 90 días.",
    metaDescription:
      "Cómo analizar la rentabilidad por centro con ranking y benchmarking interno: KPIs que ordenan la red, cuartiles, trampas habituales y plan de acción a 90 días.",
    category: "kpis",
    tags: ["Rentabilidad por centro", "Benchmarking interno", "Ranking de centros", "KPIs", "Cuartiles"],
    keywords: [
      "rentabilidad por centro",
      "ranking de centros",
      "benchmarking interno multicentro",
      "KPIs por centro",
      "comparar rentabilidad entre centros",
      "cuartiles de rentabilidad",
      "mejorar EBITDA por centro",
    ],
    publishedAt: "2026-08-25",
    readingMinutes: 7,
    relatedServices: ["multisite-performance-audit", "ebitda-improvement"],
    blocks: [
      {
        type: "p",
        text: "En una red de centros la media no existe. Existen centros que ganan dinero, centros que lo pierden y una cifra consolidada que esconde a unos detrás de otros. La rentabilidad por centro solo sirve para dirigir cuando se ordena: quién está arriba, quién está abajo y cuánto los separa.",
      },
      {
        type: "p",
        text: "He construido rankings de centros en redes de healthcare, dental, veterinaria y retail. El ejercicio técnico es parecido en todos los casos. Lo que cambia, y lo que decide si el ranking sirve para algo, es qué se hace con él la semana siguiente.",
      },
      { type: "h2", text: "Un ranking es una decisión, no un informe" },
      {
        type: "p",
        text: "Cuando el comité de dirección ve por primera vez sus centros ordenados por EBITDA, pasan dos cosas. La primera es que alguien discute el criterio de imputación. La segunda es que los dos o tres últimos centros pasan a ser el tema de la reunión. Las dos reacciones son sanas si llevan a una decisión: revisar el criterio una vez y fijarlo, y abrir un plan concreto para cada centro de cola.",
      },
      {
        type: "p",
        text: "Lo que no es sano es repetir el ranking cada mes sin que cambie nada. Un ranking que no mueve plantillas, agendas, precios, alquileres o responsables no es una herramienta de dirección; es un ejercicio de reporting. La prueba es sencilla: pregunta qué decisión se tomó la última vez que se presentó.",
      },
      { type: "h2", text: "Qué métricas ordenan la red" },
      {
        type: "p",
        text: "Ordenar por una sola cifra engaña. Un centro puede tener el mejor EBITDA absoluto porque es el más grande y, a la vez, el peor margen de la red. Uso una batería corta de indicadores, todos calculables desde el P&L por centro y el sistema de gestión:",
      },
      {
        type: "table",
        headers: ["KPI", "Fórmula", "Para qué sirve"],
        rows: [
          [
            "EBITDA de centro",
            "Margen de contribución menos estructura imputada",
            "Viabilidad del centro dentro del grupo. Ordena por valor absoluto.",
          ],
          [
            "Margen de contribución %",
            "Margen de contribución / ventas netas",
            "Calidad de la gestión local, independiente del tamaño. Ordena por eficiencia.",
          ],
          [
            "Ventas por hora disponible",
            "Ventas netas / horas de apertura o de agenda ofertada",
            "Aprovechamiento de la capacidad instalada.",
          ],
          [
            "Coste de personal / ventas",
            "Coste total de personal del centro / ventas netas",
            "Dimensionamiento. La primera palanca en la mayoría de redes de servicios.",
          ],
          [
            "Ocupación",
            "Horas o citas realizadas / horas o citas disponibles",
            "Si el problema es de demanda o de capacidad.",
          ],
          [
            "Ticket medio",
            "Ventas netas / número de visitas, tratamientos o tickets",
            "Mix de servicios, precios y venta cruzada.",
          ],
          [
            "Conversión",
            "Clientes que compran o pacientes que aceptan tratamiento / primeras visitas",
            "Eficacia comercial del equipo del centro.",
          ],
        ],
      },
      {
        type: "p",
        text: "Con estas siete cifras por centro y por mes se puede explicar casi cualquier diferencia de rentabilidad. Más indicadores añaden ruido, no información.",
      },
      { type: "h2", text: "Cuartiles: la diferencia entre el primer y el último cuartil es tu plan de mejora" },
      {
        type: "callout",
        title: "Ejemplo ilustrativo",
        text: "Imaginemos una red de 20 centros ordenados por margen de contribución. Los cinco mejores están entre el 24 % y el 30 %; los cinco peores, entre el 6 % y el 12 %. Si los del último cuartil alcanzaran solo la mediana de la red, el EBITDA consolidado subiría de forma significativa sin abrir un centro ni subir un precio. Las cifras son inventadas; la estructura del razonamiento es la que utilizo en cualquier red: la distancia entre cuartiles es la medida del potencial de mejora interno.",
      },
      {
        type: "p",
        text: "Por eso el benchmarking interno es más útil que cualquier estudio sectorial. Los centros del primer cuartil demuestran que, con la misma marca, el mismo catálogo y los mismos sistemas, se puede operar a ese nivel. No hay excusa de mercado que resista esa comparación. La pregunta deja de ser si se puede mejorar y pasa a ser qué hacen distinto los de arriba.",
      },
      { type: "h2", text: "Benchmarking interno y externo" },
      { type: "h3", text: "Interno: la referencia que nadie puede discutir" },
      {
        type: "p",
        text: "Comparar cada centro con los mejores de su propia red tiene tres ventajas: los datos son homogéneos, el contexto es idéntico y las prácticas que explican la diferencia están a una llamada de teléfono. Es el punto de partida de cualquier plan de mejora y, en redes de más de diez centros, suele ser suficiente para los dos primeros años.",
      },
      { type: "h3", text: "Externo: útil para fijar la ambición, no para dirigir" },
      {
        type: "p",
        text: "Los benchmarks sectoriales (ratios de coste de personal, márgenes típicos, ventas por metro cuadrado o por sala) sirven para saber si toda la red está por debajo de lo razonable. Pero se construyen con criterios distintos a los tuyos y rara vez se sabe qué hay detrás de cada cifra. Los uso para fijar la ambición a largo plazo, nunca para evaluar a un responsable de centro.",
      },
      { type: "h2", text: "Cinco trampas del ranking" },
      {
        type: "p",
        text: "El ranking es tan bueno como los datos que lo alimentan y las correcciones que se le aplican. Estas son las cinco que más veces he visto distorsionar una decisión:",
      },
      {
        type: "ul",
        items: [
          "Tamaño. Ordenar solo por EBITDA absoluto premia a los centros grandes. Hay que mirar siempre el valor absoluto junto al porcentaje.",
          "Antigüedad. Un centro con menos de doce o dieciocho meses está en rampa y debe compararse con su plan de apertura, no con la red.",
          "Mix. Dos centros con el mismo catálogo pueden tener un mix de servicios muy distinto por su zona o su equipo. El ticket medio y el margen por servicio lo explican antes de culpar a la gestión.",
          "Estacionalidad. Un mes aislado engaña. El ranking se construye con doce meses móviles y se revisa la tendencia, no la foto.",
          "Imputación. Si la estructura se reparte por ventas, los centros grandes cargan más y bajan posiciones. Hay que tener siempre el ranking por margen de contribución al lado del ranking por EBITDA.",
        ],
      },
      { type: "h2", text: "Cómo convertir el ranking en acciones en 90 días" },
      {
        type: "p",
        text: "Un ranking bien hecho se convierte en plan en una tarde. Esta es la secuencia que sigo:",
      },
      {
        type: "ol",
        items: [
          "Semana 1: fijar el criterio de imputación, construir el ranking a doce meses por EBITDA y por margen de contribución y marcar los centros en rampa.",
          "Semana 2: para los centros del último cuartil, descomponer la diferencia con la mediana en las siete métricas. Normalmente dos o tres explican la mayor parte.",
          "Semana 3: visitar esos centros con los datos en la mano y contrastar con el responsable. La agenda, la plantilla y el flujo de clientes cuentan lo que el P&L no puede.",
          "Semana 4: acordar un plan por centro con tres acciones, un responsable y una fecha. Nada más. Tres acciones ejecutadas valen más que diez planificadas.",
          "Semanas 5 a 12: seguimiento semanal en el cuadro de mando de las métricas afectadas y revisión mensual del P&L. Lo que no mejora en ocho semanas necesita otra decisión, no otra reunión.",
          "Día 90: nuevo ranking. Qué ha cambiado, qué centros han salido del último cuartil y cuáles necesitan una decisión estructural: cambio de responsable, reubicación o cierre.",
        ],
      },
      {
        type: "p",
        text: "Si quieres un punto de partida objetivo antes de abrir ese proceso, el diagnóstico gratuito de tres minutos sitúa tu red en cinco bloques y te dice por cuál empezar.",
      },
    ],
    faqs: [
      {
        question: "¿Cada cuánto hay que actualizar el ranking de centros?",
        answer:
          "El ranking se recalcula cada mes con el cierre del P&L por centro, siempre sobre doce meses móviles para eliminar la estacionalidad. El cuadro de mando semanal sigue las métricas operativas que lo anticipan. Presentarlo al comité cada trimestre es suficiente si entre medias se trabaja en los planes de acción.",
      },
      {
        question: "¿Cómo se comparte el ranking con los managers sin generar rechazo?",
        answer:
          "Con transparencia sobre el criterio y con el ranking por margen de contribución, que mide lo que cada responsable controla. Se comparte con todos, no solo con los de cola, y se acompaña de las prácticas de los centros del primer cuartil. El rechazo aparece cuando el ranking se usa para señalar en lugar de para decidir juntos qué cambiar. Cuando el manager participa en las tres acciones de su plan, el ranking pasa a ser su herramienta.",
      },
      {
        question: "¿Qué se hace con los centros del último cuartil?",
        answer:
          "Primero entender si la causa es de gestión (plantilla, agenda, conversión) o estructural (ubicación, alquiler, demanda de la zona). Las causas de gestión se corrigen en un trimestre con el plan de tres acciones. Las estructurales exigen una decisión de dirección: renegociar el alquiler, reubicar, cambiar el formato o cerrar. Lo que no funciona es dejar un centro en el último cuartil durante años esperando a que mejore solo.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* 5. Gestión multicentro: una sola forma de operar                    */
  /* ------------------------------------------------------------------ */
  {
    slug: "gestion-multicentro-una-sola-forma-de-operar",
    title: "Gestión multicentro: una sola forma de operar en toda la red",
    excerpt:
      "Cuando cada centro trabaja a su manera, la red no escala: se multiplica. Qué significa tener una sola forma de operar, los siete elementos del modelo operativo, qué se estandariza y qué se deja local, y cómo implantarlo en 90 días.",
    metaDescription:
      "Gestión multicentro: cómo pasar de quince formas de trabajar a un solo modelo operativo. Siete elementos, qué estandarizar y qué dejar local, plan a 30-60-90 días.",
    category: "multisite",
    tags: ["Gestión multicentro", "Modelo operativo", "Estandarización", "Escalabilidad", "Integración"],
    keywords: [
      "gestión multicentro",
      "modelo operativo multicentro",
      "estandarización de procesos red de centros",
      "gestión de redes de clínicas",
      "escalar red de centros",
      "una sola forma de operar",
      "integración post adquisición",
    ],
    publishedAt: "2026-09-15",
    readingMinutes: 7,
    relatedServices: ["integration-100", "fractional-coo"],
    blocks: [
      {
        type: "p",
        text: "La mayoría de las redes de centros que he dirigido o analizado no eran una empresa con quince centros. Eran quince empresas con la misma marca. Cada una con su forma de agendar, su lista de precios con excepciones, su plantilla heredada, su manera de cerrar la caja y su propia definición de lo que es un cliente nuevo.",
      },
      {
        type: "p",
        text: "Eso funciona hasta un cierto tamaño. A partir de ahí, cada centro nuevo añade complejidad en lugar de escala, y el crecimiento se come el margen. La gestión multicentro consiste, en esencia, en resolver ese problema: que la red opere de una sola forma sin perder lo que hace bueno a cada centro.",
      },
      { type: "h2", text: "La red que funciona como quince empresas distintas" },
      {
        type: "p",
        text: "Los síntomas se parecen mucho de un sector a otro. Consolidar el cierre mensual lleva tres semanas porque cada centro reporta distinto. Un profesional que se traslada de un centro a otro necesita dos semanas para aprender cómo se hacen las cosas allí. Las compras se negocian localmente y el grupo no sabe qué precio real paga. Los KPIs tienen el mismo nombre y distinta fórmula según quién los calcule.",
      },
      {
        type: "p",
        text: "El coste de esta situación no aparece en ninguna línea del P&L, pero está en todas. Está en el tiempo de dirección dedicado a reconciliar datos, en el margen perdido en compras, en la rotación de equipos que no encuentran criterios claros y, sobre todo, en la imposibilidad de saber qué centro lo hace bien y copiarlo.",
      },
      { type: "h2", text: "Qué significa una sola forma de operar (y qué no)" },
      {
        type: "callout",
        title: "Una aclaración necesaria",
        text: "Una sola forma de operar no es uniformar todo. No se trata de que todos los centros tengan la misma decoración, el mismo horario o el mismo discurso comercial. Se trata de que los procesos que determinan el resultado (cómo se agenda, cómo se vende, cómo se compra, cómo se mide y cómo se dirige) sean los mismos, para que las diferencias de resultado se expliquen por la ejecución y no por el método.",
      },
      {
        type: "p",
        text: "La distinción importa porque el argumento más habitual contra la estandarización es que cada centro es distinto. Y es cierto: la zona, el equipo y la clientela lo son. Pero un modelo operativo común es precisamente lo que permite ver esas diferencias con claridad. Sin él, todo se atribuye al contexto y nada se puede mejorar.",
      },
      { type: "h2", text: "Los siete elementos del modelo operativo" },
      {
        type: "p",
        text: "Cuando construyo o reconstruyo el modelo operativo de una red, trabajo siempre sobre estos siete bloques, en este orden:",
      },
      {
        type: "ol",
        items: [
          "Catálogo y precios. Una lista única de servicios o productos, con precios de referencia y un margen de maniobra local definido. Las excepciones se autorizan, no se improvisan.",
          "Procesos clave. Los cinco o seis procesos que determinan el resultado: captación y primera visita, agenda, venta y cobro, compras, cierre de caja y gestión de incidencias. Documentados en una página cada uno, no en un manual de doscientas.",
          "Plantilla tipo. Cuántas personas, con qué perfiles y en qué turnos necesita cada formato de centro según su volumen de actividad. Es la referencia para dimensionar y para evaluar desviaciones de coste de personal.",
          "Agenda y capacidad. Cómo se construye la agenda, cuántas horas se ofertan, cómo se gestionan los huecos y las listas de espera. La capacidad es la variable peor gestionada en las redes de servicios.",
          "Compras. Proveedores homologados, condiciones de grupo y un catálogo de consumibles cerrado. Es la palanca más rápida y la que menos resistencia genera.",
          "KPIs y cierre mensual. Las mismas seis u ocho métricas con la misma fórmula en todos los centros, un cuadro de mando semanal y un P&L por centro antes del día 10.",
          "Rutina de dirección. Reunión semanal del director de operaciones con los managers, revisión mensual del P&L por centro y comité de dirección con la red ordenada. Sin rutina, los otros seis elementos se degradan en un trimestre.",
        ],
      },
      { type: "h2", text: "Estandarizar sin matar la iniciativa local" },
      { type: "h3", text: "Qué se fija desde el centro de la red" },
      {
        type: "p",
        text: "Todo lo que afecta a la comparabilidad y al margen: catálogo y precios de referencia, procesos clave, plantilla tipo, proveedores, definición de KPIs y calendario de cierre. Son decisiones que se toman una vez, se comunican con claridad y se revisan anualmente. Un manager no debería poder cambiarlas, pero sí proponer cambios con datos.",
      },
      { type: "h3", text: "Qué se deja en manos del responsable de centro" },
      {
        type: "p",
        text: "La gestión de su equipo dentro de la plantilla tipo, la relación con sus clientes o pacientes, las acciones de marketing local dentro de un presupuesto, la organización del día a día y la adaptación del horario a su zona. Es decir, todo lo que requiere conocer el terreno. Un buen modelo operativo da al manager menos cosas en las que pensar y más tiempo para dirigir.",
      },
      { type: "h2", text: "Antes y después en una red ilustrativa de 15 centros" },
      {
        type: "p",
        text: "Para hacerlo tangible, así se vería el cambio en una red hipotética de quince clínicas que pasa de operar como quince unidades a hacerlo con un modelo común. Es un ejemplo construido para el artículo, no corresponde a ningún cliente:",
      },
      {
        type: "table",
        headers: ["Ámbito", "Antes", "Después"],
        rows: [
          ["Cierre mensual", "Día 25, con tres formatos de reporting distintos", "Día 8, un P&L por centro con el mismo criterio"],
          ["Precios", "Lista general con excepciones en cada centro", "Catálogo único con un margen de maniobra local definido"],
          ["Compras de consumibles", "Cada centro negocia con sus proveedores", "Cuatro proveedores homologados con condiciones de grupo"],
          ["Plantilla", "Heredada; nadie sabe si está bien dimensionada", "Plantilla tipo por formato; desviaciones visibles cada mes"],
          ["KPIs", "Mismo nombre, fórmula distinta según el centro", "Siete métricas con definición única y cuadro de mando semanal"],
          ["Incorporación de un manager", "Seis meses para entender cómo funciona su centro", "Seis semanas con el modelo operativo documentado"],
          ["Decisiones de dirección", "Basadas en la impresión del último centro visitado", "Basadas en el ranking de la red a doce meses"],
        ],
      },
      { type: "h2", text: "Cómo se implanta: 30-60-90" },
      {
        type: "p",
        text: "Un modelo operativo no se implanta con un manual enviado por correo. Se implanta por fases, con los managers dentro y midiendo desde la primera semana:",
      },
      {
        type: "ol",
        items: [
          "Días 1 a 30: medir. Construir el P&L por centro y el cuadro de mando con los datos existentes, fijar la definición de los KPIs y mapear cómo trabaja hoy cada centro en los cinco o seis procesos clave. Sin cambiar nada todavía.",
          "Días 31 a 60: decidir. Definir el catálogo, la plantilla tipo, los proveedores homologados y los procesos clave en una página cada uno. Hacerlo con dos o tres managers de referencia, no contra ellos. Pilotar en tres centros.",
          "Días 61 a 90: desplegar. Extender a toda la red con formación corta y seguimiento semanal. Instaurar la rutina de dirección. Al día 90, revisar el ranking: qué ha cambiado y qué necesita una segunda ola.",
        ],
      },
      { type: "h2", text: "El coste de no hacerlo" },
      {
        type: "quote",
        text: "Una red sin modelo operativo no crece: se repite. Cada centro nuevo hereda los problemas de los anteriores y añade los suyos, y el margen del grupo paga la diferencia.",
      },
      {
        type: "p",
        text: "Esto es especialmente visible en dos situaciones: cuando se abren varios centros en poco tiempo y cuando se adquiere una empresa que trae su propia forma de trabajar. En ambos casos, tener una sola forma de operar antes de crecer es lo que distingue una expansión rentable de una expansión que solo suma facturación. Si quieres saber en qué punto está tu red, el diagnóstico gratuito de tres minutos es un buen primer paso.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto se tarda en implantar un modelo operativo común?",
        answer:
          "En una red de diez a veinticinco centros, el plan de 90 días deja implantados el P&L por centro, los KPIs, los procesos clave y la rutina de dirección. Compras y plantilla tipo suelen necesitar un segundo trimestre para notarse en el margen. Que el modelo se mantenga depende de la rutina de dirección: sin ella, en un año cada centro vuelve a hacer las cosas a su manera.",
      },
      {
        question: "¿Funciona igual en redes de franquicias que en centros propios?",
        answer:
          "La lógica es la misma, pero el alcance cambia. En centros propios se puede fijar todo el modelo. En franquicias, el contrato define qué es obligatorio (marca, catálogo, sistemas, estándares de servicio, reporting) y qué queda a criterio del franquiciado. En la práctica, los franquiciados más rentables suelen ser los que adoptan el modelo completo de forma voluntaria, y ese dato es el mejor argumento para extenderlo.",
      },
      {
        question: "¿Cómo encaja esto con una adquisición?",
        answer:
          "Es la base de cualquier integración. Si el grupo tiene un modelo operativo claro, integrar una empresa adquirida consiste en llevarla a ese modelo en 100 días: reporting desde el primer cierre, catálogo y compras en el segundo mes, procesos y rutina de dirección en el tercero. Si el grupo no lo tiene, la adquisición añade una forma más de trabajar y la complejidad crece en lugar de la escala.",
      },
    ],
  },
];
