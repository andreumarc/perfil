import type { InsightPost } from "../types";

/** Artículos de las categorías EBITDA y Management. */
export const ebitdaManagementPosts: InsightPost[] = [
  {
    slug: "consultor-ebitda-que-es-y-cuando-tiene-sentido",
    title: "Consultor EBITDA: qué hace, qué no hace y cuándo tiene sentido contratarlo",
    excerpt:
      "Qué debe entregar un consultor EBITDA en las primeras semanas, cómo evaluarlo antes de firmar y en qué situaciones es mejor no contratarlo.",
    metaDescription:
      "Qué hace un consultor EBITDA, qué debe entregar en tres semanas, cómo evaluarlo antes de firmar y cuándo no tiene sentido contratarlo. Guía para CEOs.",
    category: "ebitda",
    tags: ["EBITDA", "Consultoría", "Rentabilidad", "Multicentro"],
    keywords: ["consultor EBITDA", "mejora de EBITDA", "consultor de rentabilidad", "P&L por centro"],
    publishedAt: "2026-06-04",
    readingMinutes: 7,
    relatedServices: ["ebitda-improvement", "multisite-performance-audit"],
    blocks: [
      {
        type: "p",
        text: "Cuando un CEO me llama buscando un consultor EBITDA, casi nunca tiene un problema de contabilidad. Tiene una red que factura más que hace dos años y gana lo mismo o menos, y no sabe explicar por qué con datos. He dirigido redes de hasta 25 centros, con 35 millones de euros de P&L y 250 personas, y la pregunta de fondo siempre es la misma: ¿dónde se queda el margen entre la facturación y el resultado?",
      },
      { type: "h2", text: "Qué es un consultor EBITDA (y qué no es)" },
      {
        type: "p",
        text: "Un consultor EBITDA trabaja sobre la cuenta de resultados operativa para mejorar el resultado antes de intereses, impuestos, depreciaciones y amortizaciones. En la práctica, eso significa actuar sobre cuatro cosas: ingresos, margen bruto, costes de personal y costes de estructura. Todo lo demás es ruido.",
      },
      {
        type: "p",
        text: "No es un auditor financiero: no revisa la contabilidad para certificar que es correcta. No es un asesor fiscal: no optimiza impuestos, que están fuera del EBITDA por definición. Y no es un consultor estratégico que entrega un documento de 80 páginas sobre el posicionamiento del grupo. Su trabajo es más incómodo y más concreto: identificar las palancas que mueven el resultado operativo, cuantificarlas y conseguir que se ejecuten.",
      },
      { type: "h3", text: "La diferencia entre analizar y mover el EBITDA" },
      {
        type: "p",
        text: "Hay consultores que diagnostican y consultores que ejecutan. Los dos perfiles son legítimos, pero conviene saber cuál se contrata. Un diagnóstico sin ejecución se queda en el cajón; una ejecución sin diagnóstico ataca las palancas equivocadas. Mi criterio es que el diagnóstico debe durar semanas, no meses, y que el plan resultante debe tener responsables y fechas desde el primer día.",
      },
      { type: "h2", text: "Las tres señales de que lo necesitas" },
      {
        type: "p",
        text: "No todas las empresas necesitan un consultor EBITDA. Estas son las tres situaciones en las que, en mi experiencia, aporta más valor que cualquier otra inversión en dirección:",
      },
      {
        type: "ul",
        items: [
          "La facturación crece y el EBITDA no acompaña. Si llevas dos ejercicios creciendo en ventas y el margen EBITDA se ha mantenido plano o ha bajado, el crecimiento está absorbiendo coste de estructura o de personal que nadie ha dimensionado.",
          "No puedes comparar la rentabilidad de tus centros en menos de cinco minutos. Si para saber qué centro gana y cuál pierde hace falta pedir un informe a finanzas y esperar dos semanas, no estás dirigiendo la red: la estás contabilizando.",
          "Tienes un objetivo de EBITDA comprometido con un consejo o un inversor y el equipo interno está al límite. El Director General no puede llevar la operación diaria y dirigir a la vez un programa de rentabilidad de ocho semanas.",
        ],
      },
      {
        type: "p",
        text: "Si reconoces dos de las tres, el problema no es de voluntad ni de talento del equipo. Es de capacidad de dirección dedicada a una sola cosa: el resultado.",
      },
      { type: "h2", text: "Qué debe entregar en las primeras semanas" },
      {
        type: "p",
        text: "Desconfío de cualquier propuesta que no concrete entregables para las primeras tres semanas. Esto es lo mínimo que yo exijo (y que me exijo):",
      },
      {
        type: "ol",
        items: [
          "Un P&L por centro con criterios homogéneos. No el contable, el operativo: ingresos por línea de servicio, coste directo de personal, consumibles, alquiler y una imputación de estructura central explícita y discutible.",
          "Un ranking de centros por margen y por eficiencia, con cuartiles. El valor está en la diferencia entre el primer y el último cuartil: ahí se esconde casi siempre el potencial.",
          "Un mapa de palancas cuantificadas por impacto y esfuerzo. Qué hay que mover, cuánto vale moverlo y cuánto cuesta en tiempo y en decisiones incómodas.",
          "Un plan a 90 días con responsable interno por palanca. Sin responsable, una palanca es un deseo.",
        ],
      },
      {
        type: "callout",
        title: "Regla práctica",
        text: "Si en la semana tres no tienes un P&L por centro comparable y un ranking que te sorprenda al menos en una posición, el proyecto va mal. Un buen diagnóstico siempre contradice alguna creencia del equipo directivo.",
      },
      { type: "h2", text: "Cómo evaluar a un consultor EBITDA antes de firmar" },
      {
        type: "p",
        text: "Las credenciales en una web dicen poco. Lo que distingue a un consultor EBITDA útil de uno que entregará un informe bonito son las respuestas a cinco preguntas:",
      },
      {
        type: "ol",
        items: [
          "¿Ha dirigido un P&L o solo lo ha analizado? Quien ha tenido que cerrar un mes con un centro en pérdidas sabe qué palancas son reales y cuáles son teóricas.",
          "¿Puede explicar en diez minutos cómo construiría tu P&L por centro? Si la respuesta es vaga, el método no existe.",
          "¿Qué datos pide y qué hace si no existen? Las redes reales tienen datos incompletos. El consultor tiene que trabajar con lo que hay, no exigir un ERP nuevo.",
          "¿Cómo involucra al equipo? Si la respuesta es que él lo hace todo, el conocimiento se marchará con él al terminar.",
          "¿Promete un porcentaje antes de ver los datos? Si lo hace, descártalo. Nadie serio fija un objetivo sin haber visto el P&L.",
        ],
      },
      {
        type: "quote",
        text: "El EBITDA no se mejora en una hoja de cálculo. Se mejora en la agenda de un centro, en el turno de un equipo y en la factura de un proveedor. La hoja de cálculo solo dice dónde mirar.",
      },
      { type: "h2", text: "Cuándo no contratarlo" },
      {
        type: "p",
        text: "Hay tres casos en los que yo mismo recomiendo no contratar a un consultor EBITDA:",
      },
      {
        type: "ul",
        items: [
          "Cuando el problema es de caja, no de resultado. Si la empresa tiene un EBITDA razonable pero no cobra, el perfil adecuado es financiero, no operativo.",
          "Cuando la dirección no está dispuesta a tomar decisiones sobre personas, precios o centros. Un plan de EBITDA sin decisiones incómodas es una lista de buenas intenciones.",
          "Cuando la red tiene menos de cuatro o cinco centros y el CEO está encima de cada uno. En ese tamaño, el problema suele resolverse con un P&L por centro bien hecho y disciplina mensual, sin ayuda externa.",
        ],
      },
      { type: "h2", text: "Ejemplo ilustrativo de alcance y plazo" },
      {
        type: "p",
        text: "Supongamos una red de 14 centros de servicios con 18 millones de euros de facturación y un margen EBITDA que la dirección considera bajo para su sector. Un alcance razonable sería: tres o cuatro semanas de diagnóstico (P&L por centro, ranking, palancas cuantificadas y plan a 90 días) seguidas de un sprint de seis a ocho semanas sobre las cinco o seis palancas priorizadas, con un responsable interno por palanca y un cuadro de mando semanal.",
      },
      {
        type: "p",
        text: "En ese ejemplo, la dirección debería dedicar entre cuatro y seis horas al diagnóstico y una reunión semanal de 45 minutos durante el sprint. El resto del trabajo se hace sin interrumpir la operación. Las cifras concretas de mejora no se fijan hasta ver los datos: eso es exactamente lo que diferencia un plan serio de una promesa comercial.",
      },
      {
        type: "p",
        text: "Si estás en una de las tres situaciones que describo arriba, el primer paso no es contratar a nadie. Es construir, o pedir que te construyan, un P&L por centro comparable. Con eso en la mano, la decisión de contratar o no un consultor EBITDA se toma sola.",
      },
    ],
    faqs: [
      {
        question: "¿En qué se diferencia un consultor EBITDA de un consultor financiero?",
        answer:
          "El financiero trabaja sobre la estructura de capital, la caja, la deuda y el reporting contable. El consultor EBITDA trabaja sobre la operación que genera el resultado: ingresos, margen, personal, compras y estructura. Son complementarios, pero resuelven problemas distintos.",
      },
      {
        question: "¿Cuánto dura un proyecto de mejora de EBITDA?",
        answer:
          "Un diagnóstico serio dura entre tres y cuatro semanas. Un programa de ejecución sobre las palancas priorizadas, entre seis y ocho. Más allá de un trimestre sin resultados medibles, algo falla en el alcance o en la ejecución.",
      },
      {
        question: "¿Necesito tener los datos ordenados antes de empezar?",
        answer:
          "No. Lo habitual es trabajar con cierres contables, extracciones del sistema de gestión y plantillas por centro, aunque estén dispersos. Normalizar esa información forma parte del trabajo y suele ser la primera fuente de hallazgos.",
      },
    ],
  },
  {
    slug: "como-mejorar-el-ebitda-de-una-empresa-multicentro",
    title: "Cómo mejorar el EBITDA de una empresa multicentro: las ocho palancas que de verdad mueven la cuenta",
    excerpt:
      "Las ocho palancas que explican la diferencia entre un centro rentable y uno que no lo es, cómo priorizarlas por impacto y esfuerzo y qué seguimiento semanal necesita el plan.",
    metaDescription:
      "Cómo mejorar el EBITDA de una empresa multicentro: P&L por centro, las ocho palancas que mueven la cuenta, cómo priorizarlas y el seguimiento semanal.",
    category: "ebitda",
    tags: ["EBITDA", "Palancas", "P&L por centro", "Multicentro"],
    keywords: ["mejorar EBITDA empresa", "palancas de EBITDA", "rentabilidad por centro", "mejora de rentabilidad multicentro"],
    publishedAt: "2026-06-25",
    readingMinutes: 8,
    relatedServices: ["ebitda-improvement", "multisite-performance-audit", "fractional-coo"],
    blocks: [
      {
        type: "p",
        text: "Mejorar el EBITDA de una empresa con un solo centro es un problema de gestión. Mejorarlo en una red de 12, 25 o 40 centros es un problema de dirección: hay que decidir dónde actuar, en qué orden y con quién, porque no se puede estar en todos los sitios a la vez. He dirigido redes de hasta 25 centros y 35 millones de euros de P&L, y la lección más cara que aprendí es que las medidas «para toda la red» casi nunca funcionan.",
      },
      { type: "h2", text: "Por qué el EBITDA de una red no se mejora «en general»" },
      {
        type: "p",
        text: "Una red multicentro es, en realidad, una cartera de pequeñas empresas con la misma marca. Cada centro tiene su demanda, su equipo, su alquiler, su agenda y su manager. Cuando se lanza una medida general (recorte lineal de gasto, subida uniforme de precios, congelación de contrataciones), se penaliza a los centros que ya lo hacen bien y se alivia poco a los que destruyen margen.",
      },
      {
        type: "p",
        text: "El EBITDA de la red es la suma de los EBITDA de los centros menos la estructura central. Por eso la mejora empieza siempre por la misma pregunta: ¿qué centros están por debajo de lo que deberían y por qué? Sin esa respuesta, cualquier plan es un ejercicio de fe.",
      },
      { type: "h2", text: "Primero el P&L por centro, después las palancas" },
      {
        type: "p",
        text: "El primer paso es un P&L operativo por centro con criterios homogéneos. No el contable, que suele imputar costes como conviene a la fiscalidad, sino uno que permita comparar unidades: ingresos por línea, coste directo de personal, consumibles, alquiler, marketing local y una imputación explícita de estructura central.",
      },
      {
        type: "p",
        text: "Con el P&L hecho, el ranking aparece solo. Y con el ranking aparece lo que yo llamo la brecha de cuartil: la diferencia de margen entre los centros del primer cuartil y los del último. Esa brecha es la medida más honesta del potencial de mejora, porque no compara con un benchmark externo discutible, sino con lo que la propia red ya demuestra que es posible.",
      },
      { type: "h3", text: "Qué no imputar al centro" },
      {
        type: "p",
        text: "Un error habitual es cargar al centro costes que no controla: la nómina del CEO, el coste financiero, las amortizaciones de la sede. El centro debe responder de lo que su manager puede mover. Lo demás se analiza aparte como coste de estructura, que tiene su propia palanca.",
      },
      { type: "h2", text: "Las ocho palancas que de verdad mueven la cuenta" },
      {
        type: "p",
        text: "Después de muchos P&L por centro, las palancas que explican la mayor parte de la diferencia entre un centro rentable y uno que no lo es se reducen a ocho. La tabla resume cómo se mide cada una, el plazo en que suele dar resultados y quién debe responder por ella.",
      },
      {
        type: "table",
        headers: ["Palanca", "Cómo se mide", "Plazo típico", "Responsable"],
        rows: [
          ["Ticket medio y mix de servicios", "Ingreso por cliente atendido y peso de cada línea en la facturación", "1-3 meses", "Manager de centro y dirección comercial"],
          ["Conversión comercial", "Primeras visitas o presupuestos convertidos en venta, por centro y por profesional", "1-2 meses", "Manager de centro"],
          ["Ocupación y capacidad", "Horas vendidas sobre horas disponibles por sala, gabinete o profesional", "1-2 meses", "Manager de centro y operaciones"],
          ["Coste de personal", "Coste de personal sobre ventas y horas no productivas por centro", "2-4 meses", "Operaciones y RRHH"],
          ["Compras y consumibles", "Precio unitario por referencia y consumo por servicio, comparado entre centros", "2-3 meses", "Compras centrales"],
          ["Estructura central", "Coste de servicios centrales sobre ventas de la red y funciones duplicadas", "3-6 meses", "Dirección general y CFO"],
          ["Precios", "Precio efectivo por servicio frente a tarifa y descuentos aplicados por centro", "1-2 meses", "Dirección comercial"],
          ["Procesos sin valor", "Tiempo del equipo en tareas administrativas, repetidas o manuales", "2-4 meses", "Operaciones"],
        ],
      },
      {
        type: "p",
        text: "Las cuatro primeras son palancas de centro: las mueve el manager con dirección y seguimiento. Las cuatro últimas son palancas de grupo: solo tienen sentido si se deciden desde la central para toda la red.",
      },
      { type: "h2", text: "Cómo priorizar: impacto por esfuerzo" },
      {
        type: "p",
        text: "Ocho palancas por doce centros son 96 frentes. Nadie puede dirigir eso. La priorización se hace con dos ejes: impacto en euros de EBITDA a doce meses y esfuerzo, medido en decisiones difíciles, tiempo de dirección y dependencia de sistemas.",
      },
      {
        type: "ul",
        items: [
          "Alto impacto, bajo esfuerzo: se ejecutan en las primeras cuatro semanas. Suelen ser agendas, precios efectivos y renegociación de dos o tres proveedores.",
          "Alto impacto, alto esfuerzo: se planifican con responsable y calendario a 90 días. Dimensionamiento de plantilla, estructura central, cambios de proceso.",
          "Bajo impacto: se descartan por ahora, aunque sean fáciles. Dispersan la atención del equipo.",
        ],
      },
      {
        type: "p",
        text: "Mi regla es seleccionar entre cinco y siete palancas, no más. Cada una con un responsable interno con nombre y apellido, un KPI semanal y una cifra objetivo.",
      },
      { type: "h2", text: "Ejemplo ilustrativo con una red de 12 centros" },
      {
        type: "p",
        text: "Supongamos una red de 12 centros de servicios con 15 millones de euros de facturación y un margen EBITDA del 9 %. El P&L por centro muestra que los tres mejores operan con un 17 % de margen y los tres peores con un 1 %. La brecha de cuartil es de 16 puntos: ese es el potencial teórico, aunque nunca se cierre del todo.",
      },
      {
        type: "p",
        text: "Al analizar los tres peores aparece un patrón: coste de personal del 58 % sobre ventas frente al 44 % de los mejores, con agendas al 60 % de ocupación. No es un problema de salarios: es de capacidad mal dimensionada frente a la demanda real. La palanca prioritaria no es recortar personal, sino redistribuir turnos y llenar agendas, en ese orden.",
      },
      {
        type: "p",
        text: "En paralelo, una comparación de precios de compra entre centros revela que un mismo consumible se paga a tres precios distintos. Esa palanca es de grupo, rápida y no exige ninguna decisión incómoda sobre personas. Todas las cifras de este ejemplo son ilustrativas: su valor está en el método, no en los números.",
      },
      { type: "h2", text: "Los errores que destruyen el plan" },
      {
        type: "ul",
        items: [
          "Atacar las ocho palancas a la vez. El equipo se dispersa y en tres meses no se ha movido ninguna.",
          "Fijar un porcentaje de mejora antes de tener el P&L por centro. Es la forma más rápida de perder credibilidad ante el consejo.",
          "Delegar el plan en finanzas. Finanzas mide; la operación ejecuta. Si el responsable de cada palanca no es quien dirige el centro o la función, no pasará nada.",
          "Confundir recorte con mejora. Un recorte lineal de personal en un centro con agendas llenas destruye ingresos en el trimestre siguiente.",
          "No cambiar las rutinas. Si a las ocho semanas la reunión semanal desaparece, el EBITDA vuelve a su sitio en seis meses.",
        ],
      },
      { type: "h2", text: "Qué seguimiento semanal necesita" },
      {
        type: "p",
        text: "Un plan de EBITDA se sostiene con una reunión semanal de 30 a 45 minutos, siempre el mismo día, con una sola página: las cinco a siete palancas, su KPI de la semana, su objetivo y su responsable. No se discute el pasado; se decide qué se hace esta semana. Lo que no está en la página no existe.",
      },
      {
        type: "quote",
        text: "Una red multicentro no tiene un problema de EBITDA. Tiene tres o cuatro centros con un problema de EBITDA y una estructura central que nadie ha cuestionado. Encontrarlos es el trabajo; lo demás es ejecución.",
      },
      {
        type: "p",
        text: "Si no puedes construir hoy el ranking de tus centros por margen, ese es el punto de partida. Todo lo demás viene después.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto se tarda en ver resultados en el EBITDA?",
        answer:
          "Las palancas de agenda, precios efectivos y compras suelen reflejarse en el P&L en uno o dos meses. Las de personal y estructura necesitan entre tres y seis. Un programa bien diseñado combina ambas para que haya resultados visibles en el primer trimestre.",
      },
      {
        question: "¿Hay que cerrar los centros menos rentables?",
        answer:
          "Casi nunca es la primera decisión. Antes hay que saber si el centro pierde por demanda, por capacidad o por costes. Muchos centros del último cuartil son recuperables con agenda, precios y plantilla ajustados; cerrar es la última palanca, no la primera.",
      },
      {
        question: "¿Se puede mejorar el EBITDA sin reducir plantilla?",
        answer:
          "Sí, y suele ser el camino más sostenible. La mayor parte del potencial está en ocupación, conversión, ticket medio, compras y precios efectivos. Reducir plantilla sin haber trabajado la capacidad suele destruir ingresos.",
      },
    ],
  },
  {
    slug: "fractional-coo-espana-que-es-y-para-quien",
    title: "Fractional COO en España: qué es, para quién tiene sentido y qué esperar los primeros 90 días",
    excerpt:
      "Qué es un Fractional COO, en qué se diferencia de un consultor y de un COO interno, para qué empresas tiene sentido y qué debe ocurrir en los primeros 90 días.",
    metaDescription:
      "Fractional COO en España: qué es, para qué empresas de 5-50 M€ tiene sentido, diferencias con consultor y COO interno, coste y qué esperar en 90 días.",
    category: "management",
    tags: ["Fractional COO", "Dirección de operaciones", "Management", "Private Equity"],
    keywords: ["fractional COO España", "director de operaciones externo", "COO a tiempo parcial", "COO fraccional"],
    publishedAt: "2026-07-16",
    readingMinutes: 7,
    relatedServices: ["fractional-coo", "multisite-performance-audit"],
    blocks: [
      {
        type: "p",
        text: "El término Fractional COO ha llegado a España desde el mercado anglosajón y todavía genera confusión: ¿es un consultor, un interino, un directivo a tiempo parcial? Después de dirigir operaciones de redes de hasta 25 centros y 250 personas, y de trabajar ahora en este formato, mi definición es sencilla: es un Director de Operaciones con responsabilidad real sobre resultados, que dedica a la empresa dos o tres días a la semana en lugar de cinco.",
      },
      { type: "h2", text: "Qué es un Fractional COO" },
      {
        type: "p",
        text: "Un Fractional COO es un director de operaciones externo que se integra en el comité de dirección con una dedicación parcial y un compromiso de medio plazo. Dirige a los responsables de centro, implanta el cuadro de mando, sigue el P&L por centro y ejecuta los proyectos operativos prioritarios. La palabra clave es dirigir: no asesora desde fuera, decide y responde.",
      },
      {
        type: "p",
        text: "El formato tiene sentido porque la mayoría de empresas de entre 5 y 50 millones de euros necesitan dirección operativa senior pero no necesitan, o no pueden justificar, cinco días a la semana de un perfil que supone un coste fijo de entre 120.000 y 150.000 euros anuales.",
      },
      { type: "h2", text: "Para quién tiene sentido" },
      {
        type: "ul",
        items: [
          "Empresas de 5 a 50 millones de euros de facturación que han crecido más rápido que su estructura de dirección y siguen operando con las rutinas de cuando tenían tres centros.",
          "CEOs fundadores que son el cuello de botella: toda decisión operativa pasa por ellos y no les queda tiempo para estrategia, ventas o inversores.",
          "Participadas de Private Equity con un plan de valor que exige profesionalizar operaciones en doce meses, antes de que tenga sentido contratar un COO a jornada completa.",
          "Grupos que abren o adquieren centros sin un modelo operativo replicable y empiezan a notar que cada apertura cuesta más que la anterior.",
        ],
      },
      {
        type: "p",
        text: "El patrón común es una red con managers de centro a los que nadie dirige con objetivos, KPIs y rutinas semanales. Hay gente capaz; falta la función que los convierta en un equipo.",
      },
      { type: "h2", text: "Qué asume y qué no" },
      { type: "h3", text: "Lo que asume" },
      {
        type: "ul",
        items: [
          "Dirección de los responsables de centro, con objetivos y rutina semanal.",
          "Cuadro de mando operativo semanal y mensual.",
          "P&L por centro y análisis de desviaciones con el CFO.",
          "Dimensionamiento, agendas y productividad.",
          "Expansión: aperturas, integraciones y playbook replicable.",
          "Reporting operativo a dirección general, consejo e inversores.",
        ],
      },
      { type: "h3", text: "Lo que no asume" },
      {
        type: "p",
        text: "No sustituye al CEO en la estrategia ni al CFO en la financiación. No lleva la operación diaria de cada centro: para eso están los managers, y precisamente el trabajo consiste en que la lleven ellos. Y no es un recurso de emergencia para tapar una baja: es una función de dirección, no un interino.",
      },
      { type: "h2", text: "Fractional COO frente a consultor y a COO interno" },
      {
        type: "p",
        text: "La comparación más útil es por responsabilidad, dedicación y coste. Esta tabla resume las diferencias que importan al CEO que decide.",
      },
      {
        type: "table",
        headers: ["Criterio", "Fractional COO", "Consultor de operaciones", "COO interno"],
        rows: [
          ["Responsabilidad", "Dirige equipos y responde por el resultado operativo", "Recomienda; la ejecución queda en la empresa", "Dirige y responde a jornada completa"],
          ["Dedicación", "2-3 días por semana, compromiso mínimo de 6 meses", "Por proyecto, de semanas a pocos meses", "5 días por semana, indefinido"],
          ["Coste", "Honorario mensual, sin coste fijo de estructura", "Honorario por proyecto", "Salario fijo, variable, cargas sociales y periodo de búsqueda"],
          ["Posición", "Miembro del comité de dirección", "Externo al organigrama", "Miembro del comité de dirección"],
          ["Mejor momento", "Crecimiento, profesionalización, fase previa a un COO interno", "Diagnóstico o proyecto acotado", "Red consolidada que justifica la función a tiempo completo"],
          ["Salida", "Transición ordenada a un COO interno", "Fin del proyecto", "Sustitución"],
        ],
      },
      { type: "h2", text: "Los primeros 90 días" },
      {
        type: "ol",
        items: [
          "Mes 1, diagnóstico y cuadro de mando. Fotografía de la red, P&L por centro, KPIs y rutinas actuales. Se fijan con dirección los objetivos del primer trimestre. Al final del mes existe una página semanal que antes no existía.",
          "Mes 2, modelo operativo. Rutina de dirección con los managers (reunión semanal, KPIs, decisiones), estandarización de los dos o tres procesos que más margen explican y plan de productividad y plantilla por tipología de centro.",
          "Mes 3, ejecución. Proyectos prioritarios en marcha con responsable, primer cierre mensual con análisis de desviaciones por centro y primer reporting consolidado a consejo o inversores. Revisión de objetivos para el siguiente trimestre.",
        ],
      },
      {
        type: "callout",
        title: "Qué debería notar el CEO a los 90 días",
        text: "Que ha dejado de recibir llamadas operativas que antes le ocupaban media semana, que sabe cada lunes qué centros van bien y cuáles no, y que los managers vienen a la reunión semanal con datos y propuestas en lugar de con problemas.",
      },
      { type: "h2", text: "Cuánto cuesta y cómo se mide el retorno" },
      {
        type: "p",
        text: "Un COO interno en empresas de este tamaño supone un coste fijo de entre 120.000 y 150.000 euros anuales, sin contar variable, cargas sociales ni el periodo de búsqueda. Un Fractional COO con dedicación de dos o tres días por semana se contrata por un honorario mensual, sin estructura fija, y la dedicación se ajusta por trimestre según los proyectos en curso.",
      },
      {
        type: "p",
        text: "El retorno se mide en el P&L, no en horas. Supongamos una red de 10 centros con 12 millones de euros de facturación: si la dirección operativa permite recuperar dos puntos de margen EBITDA en doce meses, hablamos de 240.000 euros anuales. Es un ejemplo ilustrativo, no una promesa: el objetivo se fija con datos propios en el primer mes y se revisa cada trimestre. Lo que sí es constante es que el coste de no tener dirección operativa casi nunca aparece en una línea del P&L, pero está repartido por todas.",
      },
      {
        type: "quote",
        text: "El CEO que lleva la operación no está ahorrando un COO. Está pagando el COO más caro de la empresa: él mismo, a tiempo completo, en el trabajo equivocado.",
      },
      { type: "h2", text: "Cuándo pasar a un COO interno" },
      {
        type: "p",
        text: "El Fractional COO tiene fecha de caducidad, y eso es una virtud. Cuando la red supera cierto tamaño, cuando los proyectos de expansión exigen presencia diaria o cuando el modelo operativo ya está estabilizado y hace falta alguien que lo escale a jornada completa, llega el momento de contratar. Un buen Fractional COO deja el cuadro de mando, las rutinas y el equipo de managers funcionando, y acompaña la transición. Si quien ocupa el puesto se resiste a esa salida, no está dirigiendo operaciones: está protegiendo un contrato.",
      },
    ],
    faqs: [
      {
        question: "¿Cuántos días a la semana dedica un Fractional COO?",
        answer:
          "Habitualmente dos o tres, combinando presencia en los centros y trabajo remoto. La dedicación se revisa cada trimestre en función de los proyectos en curso: una integración o una apertura puede exigir más durante unas semanas.",
      },
      {
        question: "¿Qué compromiso mínimo tiene sentido?",
        answer:
          "Seis meses. Es el tiempo necesario para implantar el cuadro de mando y las rutinas de dirección y ver su efecto en al menos tres cierres mensuales. Periodos más cortos convierten la función en una consultoría encubierta.",
      },
      {
        question: "¿Funciona en una empresa con centros en varias comunidades autónomas?",
        answer:
          "Sí. La mayoría de redes multicentro están distribuidas geográficamente. La dirección se organiza con presencia periódica planificada en los centros y gestión remota del resto, apoyada en el cuadro de mando y en la rutina semanal con los managers.",
      },
    ],
  },
  {
    slug: "fractional-coo-barcelona-direccion-operaciones-externa",
    title: "Fractional COO en Barcelona: dirección de operaciones externa para grupos de clínicas, retail y franquicias",
    excerpt:
      "Qué aporta tener la dirección de operaciones cerca de los centros, cómo organizo la semana entre sede y red, y qué problemas resuelve en empresas con sede en Barcelona y centros en toda España.",
    metaDescription:
      "Fractional COO en Barcelona para grupos de clínicas, retail y franquicias: dirección de operaciones externa, presencia en centros y gestión remota.",
    category: "management",
    tags: ["Fractional COO", "Barcelona", "Dirección de operaciones", "Multicentro"],
    keywords: ["fractional COO Barcelona", "director de operaciones externo Barcelona", "dirección de operaciones externa", "COO a tiempo parcial"],
    publishedAt: "2026-08-06",
    readingMinutes: 6,
    relatedServices: ["fractional-coo", "ebitda-improvement"],
    blocks: [
      {
        type: "p",
        text: "Trabajo desde Barcelona como Fractional COO para empresas multicentro: grupos de clínicas, cadenas de retail, redes de fitness y franquicias que facturan entre 5 y 50 millones de euros. Este artículo explica qué aporta tener la dirección de operaciones cerca de los centros, cómo organizo la semana y qué tipo de problemas resuelvo en redes con sede en Cataluña y centros repartidos por España.",
      },
      { type: "h2", text: "Por qué Barcelona concentra redes multicentro" },
      {
        type: "p",
        text: "Barcelona y su área metropolitana reúnen una densidad notable de empresas que operan en red: grupos de clínicas dentales, oftalmológicas y veterinarias, cadenas de retail especializado, operadores de fitness, redes de centros educativos y franquiciadores con decenas o centenares de puntos de venta. Es también una plaza habitual para los fondos de Private Equity que construyen plataformas sectoriales mediante Buy & Build.",
      },
      {
        type: "p",
        text: "El patrón es casi siempre el mismo: una empresa que nació con uno o dos centros, creció con aperturas y adquisiciones, y hoy tiene una sede en Barcelona con un equipo central pequeño y entre 8 y 40 centros, parte de ellos en otras provincias. La estructura de dirección no ha crecido al mismo ritmo que la red.",
      },
      { type: "h2", text: "Qué cambia cuando el COO está cerca de los centros" },
      {
        type: "p",
        text: "Un cuadro de mando dice qué centro se desvía. No dice por qué. El porqué está en el centro: en cómo se gestiona la agenda, en cómo recibe el equipo al cliente, en lo que el manager hace a las ocho de la mañana. Dirigir operaciones solo desde una hoja de cálculo es dirigir a ciegas.",
      },
      {
        type: "ul",
        items: [
          "Verificación directa: un dato anómalo se contrasta en el propio centro en 48 horas, no en el cierre del mes siguiente.",
          "Dirección de managers en su terreno: la conversación sobre productividad o ventas es distinta cuando se tiene delante la agenda real y el equipo.",
          "Estandarización creíble: los procesos se diseñan viendo cómo trabajan los mejores centros, no en una sala de reuniones.",
          "Legitimidad ante los equipos: un director que aparece en el centro, escucha y decide tiene una autoridad que ningún correo electrónico consigue.",
        ],
      },
      {
        type: "p",
        text: "La proximidad no significa estar en todos los centros cada semana. Significa que la presencia es planificada, con un objetivo por visita, y que el resto se dirige en remoto con datos.",
      },
      { type: "h2", text: "Cómo organizo la semana" },
      {
        type: "p",
        text: "Con una dedicación de dos o tres días por semana, la semana tipo combina un día de dirección desde la sede o en remoto y uno o dos días en centros. El día de dirección concentra la reunión semanal con los managers, el repaso del cuadro de mando con el CEO y el trabajo con el CFO sobre el P&L por centro. Los días de centro se dedican a los que el cuadro de mando señala: los que se desvían, los que abren, los que se integran o los que marcan el estándar que el resto debe copiar.",
      },
      { type: "h3", text: "La regla de los centros a visitar" },
      {
        type: "p",
        text: "No visito los centros por rotación, sino por prioridad: un centro que destruye margen recibe más presencia que uno que funciona. Y siempre aviso del objetivo de la visita con antelación. Las visitas sorpresa generan miedo, no mejora.",
      },
      { type: "h2", text: "Qué problemas resuelve en una red catalana con centros fuera de Cataluña" },
      {
        type: "p",
        text: "Muchas redes con sede en Barcelona tienen centros en Madrid, Valencia, Zaragoza, Baleares o Andalucía. Los problemas que me encuentro con más frecuencia son estos:",
      },
      {
        type: "ul",
        items: [
          "Los centros lejanos reportan peor y más tarde, y nadie los visita salvo cuando hay un incendio.",
          "Cada zona ha desarrollado su propia forma de operar; el manual del grupo existe pero no se aplica.",
          "Las compras se negocian localmente y el grupo no conoce el precio real que paga por un mismo consumible.",
          "Los managers de fuera de Cataluña se sienten periferia y la rotación es mayor.",
          "Las adquisiciones en otras provincias siguen funcionando como empresas aparte un año después.",
        ],
      },
      {
        type: "p",
        text: "La respuesta es un modelo operativo único (P&L por centro, cuadro de mando, rutina semanal y procesos clave) y un calendario de presencia que trate a cada centro según su situación, no según su distancia a la sede.",
      },
      { type: "h2", text: "Ejemplo ilustrativo de agenda semanal" },
      {
        type: "p",
        text: "Supongamos una red de 14 clínicas con sede en Barcelona: nueve en Cataluña, tres en la Comunidad Valenciana y dos en Madrid, con una dedicación de tres días por semana. Una semana tipo podría ser esta:",
      },
      {
        type: "table",
        headers: ["Día", "Dónde", "Qué"],
        rows: [
          ["Lunes", "Sede en Barcelona", "Cuadro de mando semanal con el CEO, reunión de 45 minutos con los 14 managers y revisión de desviaciones del P&L con el CFO"],
          ["Martes", "Remoto", "Seguimiento individual de los tres centros con peor evolución, trabajo de compras con proveedores y preparación de visitas"],
          ["Miércoles", "Dos clínicas en Cataluña", "Visita con objetivo: agenda y productividad en una, acompañamiento al manager nuevo en la otra"],
          ["Jueves y viernes", "Sin dedicación", "La operación la llevan los managers; el CEO escala solo lo que supere los criterios acordados"],
          ["Cada tres o cuatro semanas", "Valencia o Madrid", "Visita de dos días a las clínicas fuera de Cataluña, priorizadas por el cuadro de mando"],
        ],
      },
      {
        type: "p",
        text: "El ejemplo es ilustrativo: la agenda real se ajusta cada trimestre a los proyectos en curso. Lo que no cambia es el principio: una reunión semanal fija, datos antes de las visitas y presencia donde el margen lo pide.",
      },
      {
        type: "callout",
        title: "Un criterio sencillo",
        text: "Si el CEO sigue recibiendo llamadas operativas de los centros a las tres semanas de arrancar, el modelo de dirección no está funcionando. El indicador de éxito de un Fractional COO es el silencio operativo del CEO.",
      },
      {
        type: "quote",
        text: "Dirigir una red desde Barcelona no consiste en estar en Barcelona. Consiste en que cada centro, esté en Girona o en Sevilla, sepa cada lunes qué se espera de él y cada viernes cómo ha ido.",
      },
      { type: "h2", text: "Cómo empezar" },
      {
        type: "p",
        text: "El punto de partida es siempre el mismo: una conversación de una hora con el CEO para entender la red, seguida de un diagnóstico de la situación operativa (P&L por centro, KPIs y rutinas) que fija los objetivos del primer trimestre. El compromiso inicial es de seis meses con revisión trimestral, dedicación de dos o tres días por semana y un honorario mensual que depende del tamaño de la red. Si la empresa tiene su sede en Barcelona, la primera reunión es presencial. Si no, también funciona.",
      },
    ],
    faqs: [
      {
        question: "¿Solo trabaja con empresas de Barcelona?",
        answer:
          "No. La base está en Barcelona, pero la mayoría de redes multicentro tienen centros en varias provincias. La dirección combina presencia planificada en los centros con gestión remota apoyada en el cuadro de mando.",
      },
      {
        question: "¿El trabajo es presencial o remoto?",
        answer:
          "Ambos. Un día semanal de dirección desde la sede o en remoto y uno o dos días en centros, priorizados por el cuadro de mando. Los centros fuera de Cataluña reciben visitas periódicas de uno o dos días.",
      },
      {
        question: "¿En qué idioma se trabaja con los equipos?",
        answer:
          "En castellano y catalán con normalidad, según el equipo y el centro. El reporting a consejo o inversores internacionales se prepara en inglés cuando hace falta.",
      },
    ],
  },
];
