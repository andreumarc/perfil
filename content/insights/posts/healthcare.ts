import type { InsightPost } from "../types";

/** Artículos de las categorías Healthcare y KPIs. */
export const healthcarePosts: InsightPost[] = [
  {
    slug: "consultor-healthcare-operaciones-grupos-de-clinicas",
    title: "Consultor healthcare de operaciones: qué aporta a un grupo de clínicas y cómo elegirlo",
    excerpt:
      "Dónde pierde margen una red sanitaria, qué hace un consultor healthcare de operaciones (y qué no), y cómo trabajar con directores médicos sin invadir lo clínico.",
    metaDescription:
      "Qué aporta un consultor healthcare de operaciones a un grupo de clínicas: P&L por clínica, agendas, conversión, compras y cómo trabajar con directores médicos.",
    category: "healthcare",
    tags: ["Healthcare", "Grupos de clínicas", "Operaciones", "Consultoría"],
    keywords: ["consultor healthcare", "consultor operaciones clínicas", "gestión grupos de clínicas", "rentabilidad clínicas"],
    publishedAt: "2026-06-15",
    readingMinutes: 7,
    relatedServices: ["multisite-performance-audit", "ebitda-improvement", "fractional-coo"],
    blocks: [
      {
        type: "p",
        text: "Los grupos de clínicas tienen una particularidad que no tiene ninguna otra empresa multicentro: el servicio lo entrega un profesional sanitario con criterio propio, y el margen depende de cómo se organiza su tiempo. He dirigido redes sanitarias de hasta 25 centros y 250 personas, y la mayor parte del margen que se pierde en una red de clínicas no se pierde en el acto clínico. Se pierde alrededor de él.",
      },
      { type: "h2", text: "El problema operativo de los grupos de clínicas" },
      {
        type: "p",
        text: "Una clínica aislada funciona por la implicación de su director médico y de un equipo que se conoce. Cuando el grupo llega a 6, 10 o 20 clínicas, ese modelo deja de escalar: cada clínica tiene su agenda, su forma de presupuestar, sus proveedores y su manera de reportar. La dirección recibe datos tarde, no comparables y, con frecuencia, discutidos por los propios directores de clínica.",
      },
      {
        type: "p",
        text: "El síntoma habitual es que la facturación del grupo crece con las aperturas y adquisiciones, pero el margen EBITDA no mejora o baja. Y nadie sabe decir, con datos, qué clínicas lo explican.",
      },
      { type: "h2", text: "Qué hace un consultor healthcare de operaciones (y qué no)" },
      {
        type: "p",
        text: "Un consultor healthcare de operaciones trabaja sobre el modelo de gestión de la red: P&L por clínica, agendas y capacidad, productividad de los profesionales, conversión de primera visita, compras, estructura central y cuadro de mando. Su objetivo es que cada clínica sea comparable, dirigible y rentable, y que el grupo opere de una sola manera en lo que importa.",
      },
      { type: "h3", text: "Lo que no hace" },
      {
        type: "ul",
        items: [
          "No es un consultor clínico: no opina sobre protocolos, diagnósticos ni tratamientos. Eso corresponde a la dirección médica.",
          "No es un consultor regulatorio: no gestiona autorizaciones sanitarias, acreditaciones ni cumplimiento normativo.",
          "No es un consultor de marketing: puede medir la conversión comercial, pero no diseña campañas.",
        ],
      },
      {
        type: "p",
        text: "La frontera es nítida: todo lo que ocurre antes y después del acto clínico (agenda, admisión, presupuesto, cobro, compras, personal, datos) es operaciones. Lo que ocurre durante el acto clínico es medicina.",
      },
      { type: "h2", text: "Las cinco áreas donde se pierde margen en una red sanitaria" },
      {
        type: "ol",
        items: [
          "Capacidad ociosa en agendas. Gabinetes, consultas o quirófanos con huecos en unas franjas y lista de espera en otras. Es la pérdida más frecuente y la más invisible, porque no aparece como coste sino como ingreso que no llega.",
          "Conversión de primera visita. El paciente que acude, recibe un plan de tratamiento o presupuesto y no vuelve. En muchas redes nadie mide ese dato por clínica y por profesional.",
          "Coste de personal desalineado con la actividad. Plantillas dimensionadas para la demanda de hace dos años, turnos que no siguen la curva de pacientes y horas no productivas que nadie cuenta.",
          "Compras y consumibles descentralizados. Cada clínica negocia con su proveedor de siempre y el grupo paga precios distintos por la misma referencia.",
          "Estructura central que crece más que la red. Funciones duplicadas, servicios de soporte sin métricas y una sede cuyo coste sobre ventas nadie revisa.",
        ],
      },
      {
        type: "callout",
        title: "Dónde mirar primero",
        text: "Si solo puedes medir una cosa en cada clínica, mide la ocupación real de las agendas por franja horaria. Explica más margen que cualquier otro indicador y es el punto de partida de casi todas las palancas.",
      },
      { type: "h2", text: "Qué debe saber de tu sector antes de empezar" },
      {
        type: "p",
        text: "La operación de una clínica dental, de una veterinaria y de un centro de fisioterapia se parecen más de lo que sus directores médicos creen, pero las diferencias importan. Antes de contratar a un consultor healthcare, comprueba que entiende al menos esto de tu negocio:",
      },
      {
        type: "ul",
        items: [
          "La unidad de capacidad: gabinete, box, consulta, quirófano o profesional, y cuántas horas vendibles tiene al año.",
          "El embudo comercial del paciente: cómo llega, quién le atiende, cómo se presupuesta, cuánto se convierte y cuánto se cobra.",
          "La estructura de retribución de los profesionales: fija, variable por producción, por acto o mixta, porque condiciona toda la palanca de productividad.",
          "El peso del laboratorio, la farmacia o los consumibles en el coste directo, y quién lo controla.",
          "El sistema de gestión clínica que usa la red y qué datos se pueden extraer de él sin proyectos informáticos.",
        ],
      },
      {
        type: "p",
        text: "Si el consultor habla de productividad sin preguntar primero cómo cobran los profesionales, no conoce el sector.",
      },
      { type: "h2", text: "Cómo se trabaja con directores médicos sin invadir lo clínico" },
      {
        type: "p",
        text: "El mayor riesgo de un proyecto de operaciones en un grupo sanitario es el rechazo del cuerpo médico. Se evita con tres reglas que aplico siempre:",
      },
      {
        type: "ol",
        items: [
          "Separar explícitamente los indicadores de gestión de los indicadores clínicos. La ocupación de agenda es gestión; la tasa de complicaciones es clínica. Un consultor de operaciones no toca la segunda.",
          "Construir los KPIs con los directores médicos, no para ellos. Cuando el director médico participa en definir cómo se mide la productividad, defiende la medida en lugar de combatirla.",
          "Mostrar la diferencia entre clínicas con datos, sin juicios. Que dos clínicas con el mismo equipo tengan ocupaciones muy distintas no es una acusación: es una oportunidad de aprender de la mejor.",
        ],
      },
      {
        type: "quote",
        text: "En una red de clínicas, el margen no se gana en el gabinete. Se gana en la agenda que lo llena, en el presupuesto que se acepta y en la plantilla que se ajusta a la demanda real. El acto clínico es lo único que no hay que tocar.",
      },
      { type: "h2", text: "Ejemplo ilustrativo de primer mes" },
      {
        type: "p",
        text: "Supongamos un grupo de 9 clínicas con 11 millones de euros de facturación, cuatro de ellas adquiridas en los últimos tres años y cada una con su propio sistema de agenda. Un primer mes razonable de un consultor healthcare de operaciones sería: dos semanas para construir un P&L por clínica con criterios homogéneos a partir de los cierres contables y las extracciones de los sistemas; una semana de entrevistas con dirección, directores médicos y una muestra de responsables de clínica; y una semana para el ranking, las palancas cuantificadas y el plan a 90 días.",
      },
      {
        type: "p",
        text: "En este ejemplo, la dirección dedicaría entre cuatro y seis horas en total. El entregable del primer mes no es una mejora de EBITDA, sino algo previo: saber por primera vez, con datos comparables, qué clínicas sostienen el grupo y cuáles lo lastran, y por qué. Las cifras de mejora se fijan después, con el P&L delante.",
      },
    ],
    faqs: [
      {
        question: "¿Un consultor healthcare de operaciones necesita formación sanitaria?",
        answer:
          "No. Necesita experiencia dirigiendo redes sanitarias y respetar la frontera con lo clínico. La formación sanitaria la aporta la dirección médica del grupo; la dirección de operaciones aporta P&L, capacidad, productividad y método.",
      },
      {
        question: "¿Cuánto tiempo del equipo médico exige el proyecto?",
        answer:
          "Muy poco: entrevistas de 45 minutos con los directores médicos y una sesión de validación de los KPIs. El trabajo de datos se hace sobre los sistemas de gestión, sin interferir en la actividad asistencial.",
      },
      {
        question: "¿Sirve para una red veterinaria o de fisioterapia, no solo dental?",
        answer:
          "Sí. El método (P&L por clínica, capacidad, conversión, personal, compras y estructura) es el mismo. Cambian la unidad de capacidad, el embudo del paciente y el peso de los consumibles, y por eso el consultor debe conocer el subsector antes de empezar.",
      },
    ],
  },
  {
    slug: "gestion-de-clinicas-dentales-en-red-kpis-y-rentabilidad",
    title: "Gestión de clínicas dentales en red: los KPIs que explican la rentabilidad de cada clínica",
    excerpt:
      "Los ocho KPIs que explican la rentabilidad de una clínica dental dentro de una red, cómo leer el ranking de clínicas y las palancas específicas del sector dental.",
    metaDescription:
      "Gestión de clínicas dentales en red: los 8 KPIs que explican la rentabilidad de cada clínica, cómo leer el ranking y las palancas propias del sector dental.",
    category: "healthcare",
    tags: ["Clínicas dentales", "KPIs", "Healthcare", "Rentabilidad"],
    keywords: ["gestión clínicas dentales", "KPIs clínica dental", "rentabilidad clínica dental", "red de clínicas dentales"],
    publishedAt: "2026-07-02",
    readingMinutes: 8,
    relatedServices: ["multisite-performance-audit", "ebitda-improvement"],
    blocks: [
      {
        type: "p",
        text: "La gestión de clínicas dentales en red tiene una trampa: los indicadores que hacen rentable una clínica no son los que hacen rentable un grupo. Una clínica vive de su odontólogo de referencia y de su cartera de pacientes; una red vive de que 10 o 20 clínicas se dirijan con los mismos datos, la misma agenda y la misma disciplina de cobro. He dirigido redes sanitarias de hasta 25 centros y estos son los KPIs que, en mi experiencia, separan una clínica dental que sostiene el grupo de una que lo lastra.",
      },
      { type: "h2", text: "Por qué una clínica dental rentable no garantiza una red rentable" },
      {
        type: "p",
        text: "En una clínica individual, el propietario es a la vez odontólogo, director y comercial. Compensa los huecos de agenda con horas propias, acepta presupuestos con descuento y conoce el precio de cada implante. Nada de eso escala. Con 12 clínicas, el margen depende de managers y de odontólogos asalariados o por producción que no tienen la misma información ni los mismos incentivos.",
      },
      {
        type: "p",
        text: "Por eso la red necesita lo que la clínica individual no necesitaba: un P&L por clínica comparable, pocos KPIs con la misma definición en todas las unidades y una rutina semanal que los revise. Sin eso, la red es una suma de clínicas que la central contabiliza pero no dirige.",
      },
      { type: "h2", text: "Los KPIs que importan" },
      {
        type: "p",
        text: "El conjunto que explica la rentabilidad de una clínica dental cabe en una tabla. La clave no es la lista, sino que se calcule igual en todas las clínicas y con la frecuencia adecuada.",
      },
      {
        type: "table",
        headers: ["KPI", "Qué mide", "Cómo se calcula", "Frecuencia"],
        rows: [
          ["Ocupación de gabinete", "Capacidad real utilizada", "Horas de gabinete con paciente sobre horas de gabinete disponibles, por franja", "Semanal"],
          ["Facturación por odontólogo y hora", "Productividad clínica", "Facturación atribuida al profesional dividida por horas de agenda trabajadas", "Semanal"],
          ["Conversión de primera visita a plan de tratamiento", "Eficacia comercial de la clínica", "Primeras visitas con presupuesto aceptado sobre primeras visitas realizadas", "Semanal"],
          ["Ticket medio por paciente", "Valor del mix de tratamientos", "Facturación del periodo dividida por pacientes atendidos", "Mensual"],
          ["Presupuestos pendientes", "Ingreso aprobado y no ejecutado", "Importe de tratamientos aceptados sin iniciar o sin terminar, por antigüedad", "Semanal"],
          ["Coste de personal sobre ventas", "Dimensionamiento de la plantilla", "Coste total de personal, clínico y no clínico, dividido por facturación", "Mensual"],
          ["Coste de laboratorio y consumibles sobre ventas", "Margen directo", "Compras de laboratorio y material dividido por facturación", "Mensual"],
          ["EBITDA por clínica", "Resultado operativo comparable", "P&L operativo con imputación homogénea de estructura central", "Mensual"],
        ],
      },
      {
        type: "p",
        text: "Los cuatro primeros son de actividad y los mueve el manager cada semana. Los cuatro últimos son de resultado y se revisan en el cierre mensual con el CFO. Mezclarlos en la misma reunión es la forma más rápida de que nadie actúe sobre ninguno.",
      },
      { type: "h2", text: "Cómo leer el ranking de clínicas" },
      {
        type: "p",
        text: "Con el P&L por clínica construido, ordeno las clínicas por margen EBITDA y después por cada KPI de actividad. El valor no está en saber quién es la primera, sino en entender las diferencias:",
      },
      {
        type: "ul",
        items: [
          "Dos clínicas con la misma facturación y márgenes muy distintos suelen diferir en coste de personal o en laboratorio, no en precios.",
          "Una clínica con alta ocupación y bajo ticket medio tiene un problema de mix: mucha higiene y revisión, poca rehabilitación o implantología.",
          "Una clínica con buena conversión y mucho presupuesto pendiente tiene un problema de agenda o de financiación al paciente, no de ventas.",
          "Una clínica con baja ocupación y plantilla completa es la que más margen destruye y la que más rápido se recupera actuando sobre agenda y turnos.",
        ],
      },
      { type: "h3", text: "La brecha de cuartil" },
      {
        type: "p",
        text: "La diferencia de margen entre el primer y el último cuartil es el potencial real del grupo: más honesto que cualquier benchmark externo, porque la propia red ya lo consigue en algunas unidades.",
      },
      { type: "h2", text: "Las palancas específicas del dental" },
      {
        type: "ol",
        items: [
          "Agenda de gabinetes. Bloques por tipo de tratamiento, franjas de primera visita protegidas y un responsable de llenar huecos con la lista de pacientes con tratamiento pendiente.",
          "Primera visita. Quién la hace, cuánto dura, cómo se presenta el plan de tratamiento y quién sigue el presupuesto a las 48 horas. Es la palanca comercial más potente y la menos medida.",
          "Presupuestos pendientes. Una cartera de tratamientos aceptados sin ejecutar es ingreso aprobado que envejece. Debe revisarse cada semana por antigüedad y con un responsable de reactivación.",
          "Laboratorio y consumibles. Homologar dos o tres laboratorios para toda la red y comparar el coste por tipo de prótesis entre clínicas revela diferencias que nadie había visto.",
          "Retribución de odontólogos. Si cobran por producción, la palanca de productividad está alineada; si cobran fijo, la agenda la tiene que dirigir el manager. En ambos casos hay que medir facturación por hora.",
        ],
      },
      {
        type: "callout",
        title: "Dato que casi nadie mide",
        text: "Las horas de gabinete disponibles sin agenda abierta. Muchas clínicas tienen un gabinete cerrado dos tardes a la semana por falta de profesional y lo cuentan como plena ocupación porque solo miden las horas abiertas.",
      },
      { type: "h2", text: "Ejemplo ilustrativo" },
      {
        type: "p",
        text: "Supongamos dos clínicas dentales de la misma red, A y B, que facturan 1,2 millones de euros al año cada una. A tiene un margen EBITDA del 18 % y B del 6 %. La ocupación de gabinete es similar (74 % y 71 %), pero B tiene un coste de personal del 52 % frente al 41 % de A, y un coste de laboratorio del 11 % frente al 8 %.",
      },
      {
        type: "p",
        text: "La lectura es inmediata: B no tiene un problema de demanda ni de precios, sino de dimensionamiento (un auxiliar más por gabinete que A para la misma actividad) y de laboratorio (trabaja con un proveedor local más caro). Ambas palancas se ejecutan en un trimestre sin tocar lo clínico. Las cifras son ilustrativas: lo que importa es que el P&L por clínica convierte una intuición en una decisión.",
      },
      { type: "h2", text: "Rutina semanal del director de red" },
      {
        type: "p",
        text: "Lo anterior se sostiene con una rutina: una reunión semanal de 45 minutos con los managers, siempre el mismo día, con una página por clínica que muestra ocupación, facturación por hora, conversión de primera visita y presupuestos pendientes frente a objetivo. Cada manager explica su desviación y propone una acción. El director de red no resuelve: decide, prioriza y asegura que la acción se ejecuta. Una vez al mes, con el CFO, se revisan los KPIs de resultado y el ranking.",
      },
      {
        type: "quote",
        text: "Una red dental no se dirige odontólogo a odontólogo. Se dirige agenda a agenda, presupuesto a presupuesto y cierre a cierre. Lo demás es confiar en que cada clínica se gestione sola, y eso deja de funcionar a partir de la quinta.",
      },
    ],
    faqs: [
      {
        question: "¿Cuántos KPIs debe seguir el manager de una clínica dental?",
        answer:
          "Cuatro de actividad cada semana: ocupación de gabinete, facturación por odontólogo y hora, conversión de primera visita y presupuestos pendientes. Los indicadores de resultado (coste de personal, laboratorio, EBITDA) son del cierre mensual y los revisa la dirección.",
      },
      {
        question: "¿Cómo se compara la productividad de odontólogos con retribuciones distintas?",
        answer:
          "Midiendo facturación por hora de agenda trabajada, con independencia del modelo retributivo. El coste del profesional se analiza aparte, en el P&L de la clínica, para no mezclar productividad con precio.",
      },
      {
        question: "¿Qué sistema hace falta para medir estos KPIs?",
        answer:
          "Cualquier software de gestión dental permite extraer agendas, presupuestos y facturación por profesional. El reto no es tecnológico: es definir igual los KPIs en todas las clínicas y revisarlos cada semana.",
      },
    ],
  },
  {
    slug: "gestion-de-clinicas-veterinarias-multicentro",
    title: "Gestión de clínicas veterinarias multicentro: cómo dirigir una red sin perder el control del margen",
    excerpt:
      "Qué hace distinto al negocio veterinario multicentro, cómo construir el P&L por clínica, los KPIs que explican el margen y cómo integrar clínicas adquiridas.",
    metaDescription:
      "Gestión de clínicas veterinarias multicentro: P&L por clínica, KPIs de margen, personal y guardias, farmacia y stock, e integración de clínicas adquiridas.",
    category: "healthcare",
    tags: ["Clínicas veterinarias", "Healthcare", "Buy & Build", "P&L por centro"],
    keywords: ["gestión clínicas veterinarias", "red de clínicas veterinarias", "rentabilidad clínica veterinaria", "integración clínicas veterinarias"],
    publishedAt: "2026-08-20",
    readingMinutes: 7,
    relatedServices: ["multisite-performance-audit", "integration-100", "ebitda-improvement"],
    blocks: [
      {
        type: "p",
        text: "El sector veterinario vive una consolidación acelerada: grupos que compran clínicas independientes, fondos que construyen plataformas y veterinarios propietarios que venden. El resultado son redes de 8, 15 o 40 clínicas con un reto común: dirigirlas con datos sin que el margen se diluya en la integración. He dirigido redes sanitarias multicentro; así es como abordo la gestión de clínicas veterinarias en red.",
      },
      { type: "h2", text: "Qué hace distinto al veterinario multicentro" },
      {
        type: "p",
        text: "Una clínica veterinaria no es una clínica dental con otros pacientes. Su P&L tiene particularidades que condicionan toda la gestión:",
      },
      {
        type: "ul",
        items: [
          "Mix de ingresos heterogéneo: consulta, cirugía, hospitalización, diagnóstico por imagen, laboratorio, tienda y alimentación. Cada línea tiene un margen distinto y una capacidad distinta.",
          "Urgencias y horarios amplios: la cobertura 24 horas o de fines de semana genera un coste de personal que no sigue la curva de demanda.",
          "Escasez de veterinarios: la retención del equipo clínico es una palanca de margen tanto como de servicio, porque una vacante de tres meses es facturación que no se recupera.",
          "Peso elevado de farmacia y consumibles en el coste directo, con stock en cada clínica y compras muy fragmentadas.",
          "Cliente que paga de su bolsillo y compara: la sensibilidad al precio es real y el embudo comercial (consulta, diagnóstico, presupuesto, aceptación) es tan decisivo como en cualquier red sanitaria.",
        ],
      },
      {
        type: "p",
        text: "Ignorar estas cinco diferencias lleva a aplicar recetas de otros sectores que no funcionan.",
      },
      { type: "h2", text: "El P&L por clínica veterinaria: qué imputar y cómo" },
      {
        type: "p",
        text: "Es la herramienta base. Un P&L operativo por clínica con criterios homogéneos, que separe:",
      },
      {
        type: "ol",
        items: [
          "Ingresos por línea: servicios clínicos (consulta, cirugía, hospitalización, diagnóstico), farmacia y tienda. Mezclarlos oculta que una clínica factura mucho pero con un mix de bajo margen.",
          "Coste directo: farmacia, consumibles, laboratorio externo y alimentación vendida, imputados a la línea que los consume.",
          "Coste de personal clínico y no clínico, separados, con horas de guardia y urgencias identificadas.",
          "Costes de local: alquiler, suministros, mantenimiento y equipamiento.",
          "Imputación de estructura central explícita y con un único criterio (por ventas o por número de clínicas), discutible pero igual para todas.",
        ],
      },
      {
        type: "p",
        text: "Lo que no debe imputarse al manager de la clínica es lo que no controla: coste financiero, amortización de la plataforma y nómina del equipo directivo del grupo. Eso se analiza como estructura.",
      },
      { type: "h2", text: "Los KPIs que de verdad explican el margen" },
      {
        type: "ul",
        items: [
          "Facturación por veterinario y hora trabajada, por clínica.",
          "Ocupación de consultas y quirófano por franja horaria.",
          "Conversión de consulta a tratamiento o cirugía presupuestada.",
          "Ticket medio por visita y peso de farmacia y tienda en el mix.",
          "Coste de personal sobre ventas, con y sin guardias.",
          "Coste de farmacia y consumibles sobre ventas, por línea de servicio.",
          "Rotación de stock de farmacia y caducados por clínica.",
          "Rotación de veterinarios y vacantes abiertas en días.",
          "EBITDA por clínica con imputación homogénea.",
        ],
      },
      {
        type: "p",
        text: "Nueve indicadores, cuatro de ellos semanales (los de actividad) y cinco mensuales (los de resultado). Si el cuadro de mando tiene treinta, nadie lo mira.",
      },
      { type: "h2", text: "Capacidad, agendas y turnos: el coste de personal" },
      {
        type: "p",
        text: "El coste de personal es la mayor partida del P&L veterinario y la que más diferencias genera entre clínicas. La causa raíz casi nunca son los salarios: es la relación entre turnos y demanda. Clínicas con dos veterinarios en franjas de mañana vacías y uno solo en las tardes con lista de espera. Guardias de urgencias dimensionadas para un volumen que no llega. Auxiliares que hacen tareas administrativas que un sistema podría resolver.",
      },
      {
        type: "p",
        text: "La palanca es el análisis de demanda por franja horaria frente a plantilla presente, clínica a clínica. Y la decisión no es recortar, sino redistribuir: mover horas a donde están los pacientes antes de pensar en reducir equipo. En un sector con escasez de veterinarios, perder a un profesional por un ajuste mal explicado cuesta más que el ahorro.",
      },
      {
        type: "callout",
        title: "Regla práctica",
        text: "Antes de tocar plantilla en una clínica veterinaria, compara su ocupación por franja con la de la mejor clínica de la red con un equipo similar. Si la brecha está en las agendas, el problema no es de personas.",
      },
      { type: "h2", text: "Compras, farmacia y stock" },
      {
        type: "p",
        text: "La farmacia y los consumibles son la segunda partida del P&L veterinario y la primera oportunidad de grupo. Lo habitual tras varias adquisiciones es encontrar que cada clínica compra a sus proveedores históricos, que un mismo medicamento se paga a precios distintos y que el stock inmovilizado y los caducados no se miden.",
      },
      {
        type: "ul",
        items: [
          "Homologar proveedores y negociar condiciones de grupo con el volumen agregado.",
          "Unificar el catálogo de referencias y fijar un stock objetivo por clínica según su actividad.",
          "Medir cada mes el coste de farmacia sobre ventas por línea y los caducados por clínica.",
          "Revisar la política de precios de venta de farmacia y tienda, que muchas clínicas heredan sin criterio.",
        ],
      },
      { type: "h2", text: "Integración de clínicas adquiridas" },
      {
        type: "p",
        text: "Casi todas las redes veterinarias crecen comprando. Y casi todas sufren lo mismo: la clínica adquirida sigue funcionando como una empresa aparte un año después, con su sistema, sus proveedores y su forma de reportar. Entre tanto, el veterinario propietario que vendió pierde motivación y parte del equipo recibe ofertas.",
      },
      {
        type: "p",
        text: "La integración debe planificarse antes del día 1 y ejecutarse en 100 días: comunicación al equipo, retención de perfiles clave, P&L con criterios del grupo desde el primer cierre, homologación de compras y agenda, y una sola forma de operar en lo que importa. La cultura de servicio que hizo valiosa a esa clínica se respeta; los datos y los procesos clave se unifican. Un grupo que encadena adquisiciones necesita un playbook que haga predecible cada integración.",
      },
      { type: "h2", text: "Ejemplo ilustrativo" },
      {
        type: "p",
        text: "Supongamos una red de 11 clínicas veterinarias con 9 millones de euros de facturación, de las que cinco se adquirieron en los dos últimos años. El P&L por clínica muestra márgenes EBITDA entre el 19 % de la mejor y pérdidas en dos de las adquiridas. Tres causas explican la brecha: coste de personal del 55 % sobre ventas en las adquiridas (guardias sobredimensionadas y turnos de mañana sin demanda), farmacia un 4 % más cara por comprar fuera de las condiciones de grupo, y una clínica con un veterinario menos desde hace cuatro meses que ha perdido cirugía programada.",
      },
      {
        type: "p",
        text: "El plan prioriza tres palancas en 90 días: redistribución de turnos y guardias en las dos clínicas en pérdidas, migración de compras al catálogo de grupo y cobertura de la vacante con un plan de retención. Las cifras son ilustrativas; el método es lo que importa.",
      },
      {
        type: "quote",
        text: "Una red veterinaria no pierde margen en el quirófano. Lo pierde en una guardia que nadie usa, en una farmacia que nadie compara y en una clínica adquirida que nadie ha integrado.",
      },
    ],
    faqs: [
      {
        question: "¿Cuántas clínicas hacen falta para que tenga sentido un P&L por clínica?",
        answer:
          "Desde la tercera. Con dos clínicas el propietario puede compararlas de memoria; con tres o más, las diferencias de mix, personal y compras ya no se ven sin un P&L homogéneo.",
      },
      {
        question: "¿Cómo se gestiona la escasez de veterinarios en una red?",
        answer:
          "Midiendo vacantes y rotación como KPI de dirección, dimensionando turnos por demanda real para no quemar al equipo y tratando la retención como una palanca de margen: una vacante de meses es facturación perdida.",
      },
      {
        question: "¿Cuándo hay que integrar una clínica adquirida?",
        answer:
          "La planificación empieza antes del cierre y la integración debe estar hecha en 100 días: comunicación, retención, P&L con criterios del grupo, compras y agenda. Cuanto más se retrasa, más caro y más conflictivo resulta.",
      },
    ],
  },
  {
    slug: "kpis-para-redes-de-clinicas-cuadro-de-mando-semanal",
    title: "KPIs para redes de clínicas: cómo construir un cuadro de mando semanal que la dirección use de verdad",
    excerpt:
      "Los doce KPIs que caben en una página, qué va en el seguimiento semanal y qué en el mensual, cómo diseñar la reunión de 30 minutos y qué hacer cuando un indicador se desvía.",
    metaDescription:
      "KPIs para redes de clínicas: los 12 indicadores de un cuadro de mando semanal en una página, la reunión de 30 minutos y qué hacer cuando un KPI se desvía.",
    category: "kpis",
    tags: ["KPIs", "Cuadro de mando", "Clínicas", "Dirección de operaciones"],
    keywords: ["KPIs clínicas cuadro de mando", "cuadro de mando clínicas", "KPIs red de clínicas", "reporting semanal clínicas"],
    publishedAt: "2026-09-10",
    readingMinutes: 7,
    relatedServices: ["fractional-coo", "multisite-performance-audit"],
    blocks: [
      {
        type: "p",
        text: "He visto más cuadros de mando abandonados que en uso. Casi todos nacieron con treinta indicadores y un informe mensual de veinte páginas que nadie leía al tercer mes. Así construyo un cuadro de mando semanal para redes de clínicas que dirección y managers usan de verdad: los KPIs que caben en una página y la rutina que los mantiene vivos.",
      },
      { type: "h2", text: "Por qué los cuadros de mando mueren en tres meses" },
      {
        type: "ul",
        items: [
          "Demasiados indicadores: si hay treinta, no hay ninguno. La atención de un director es un recurso escaso.",
          "Sin dueño: un KPI sin responsable con nombre es una estadística, no un instrumento de dirección.",
          "Sin objetivo ni umbral: un número sin referencia no provoca ninguna decisión. ¿El 68 % de ocupación es bueno o malo? Depende del objetivo.",
          "Datos que llegan tarde: un cuadro de mando publicado el día 20 del mes siguiente describe historia, no permite dirigir.",
          "Sin reunión: el cuadro de mando no es un documento, es una conversación semanal con agenda fija. Si la reunión desaparece, el documento muere.",
        ],
      },
      {
        type: "p",
        text: "La solución no es una herramienta más sofisticada. Es menos indicadores, un dueño por indicador, un umbral y una reunión que no se cancela.",
      },
      { type: "h2", text: "Los KPIs que caben en una página" },
      {
        type: "p",
        text: "El cuadro de mando semanal de una red de clínicas se organiza en cuatro bloques: actividad, comercial, personas y resultado. Los umbrales son orientativos y deben fijarse con los datos de la propia red; su función es provocar una conversación, no sustituirla.",
      },
      {
        type: "table",
        headers: ["Bloque", "KPI", "Objetivo o umbral orientativo", "Dueño"],
        rows: [
          ["Actividad", "Ocupación de agendas por clínica", "Objetivo por clínica; alerta si cae más de 5 puntos frente a la media de cuatro semanas", "Manager de clínica"],
          ["Actividad", "Facturación por profesional y hora", "Objetivo por tipología; alerta en el último cuartil de la red", "Manager de clínica"],
          ["Actividad", "Pacientes atendidos frente a semana y año anterior", "Tendencia; alerta si dos semanas consecutivas en descenso", "Manager de clínica"],
          ["Comercial", "Conversión de primera visita", "Objetivo de red; alerta por clínica si está por debajo dos semanas", "Manager de clínica"],
          ["Comercial", "Presupuestos pendientes por antigüedad", "Importe de más de 30 días; objetivo de reducción semanal", "Manager de clínica"],
          ["Comercial", "Cancelaciones y no presentados", "Umbral máximo por clínica", "Responsable de admisión"],
          ["Personas", "Horas trabajadas frente a horas planificadas", "Desviación máxima acordada; alerta por horas extra sin actividad", "Operaciones"],
          ["Personas", "Vacantes abiertas y días de cobertura", "Cero vacantes de más de 60 días", "Operaciones y RRHH"],
          ["Personas", "Bajas y ausencias", "Tendencia por clínica", "Operaciones"],
          ["Resultado", "Facturación acumulada del mes frente a objetivo", "Porcentaje de avance frente a días transcurridos", "Director de red"],
          ["Resultado", "Cobros frente a facturación", "Umbral mínimo de cobro en el periodo", "Administración"],
          ["Resultado", "Coste de personal sobre ventas estimado", "Umbral por tipología de clínica", "Director de red"],
        ],
      },
      {
        type: "p",
        text: "Doce indicadores, una página, una fila por clínica. El EBITDA por clínica no está porque es un dato mensual: aparece en el cierre, no en la reunión del lunes.",
      },
      { type: "h2", text: "Semanal frente a mensual: qué va en cada uno" },
      {
        type: "p",
        text: "La confusión más habitual es mezclar ritmos. Lo semanal es actividad y acción: agendas, conversión, presupuestos, horas; indicadores que el manager puede mover en siete días. Lo mensual es resultado y análisis: P&L por clínica, ranking, coste de personal real, compras, estructura; indicadores que explican el mes y orientan las decisiones del trimestre.",
      },
      { type: "h3", text: "La prueba del lunes" },
      {
        type: "p",
        text: "Si un indicador no puede cambiar en una semana por una acción del manager, no pertenece al cuadro de mando semanal. Es la prueba más sencilla para mantener la página a raya.",
      },
      { type: "h2", text: "Cómo diseñar la reunión semanal de 30 minutos" },
      {
        type: "ol",
        items: [
          "Mismo día, misma hora, sin excepciones. Lunes a primera hora o martes a media mañana, con los datos de la semana cerrada ya publicados.",
          "Una sola página, enviada el día anterior. Nadie descubre los números en la reunión; se viene a decidir, no a leer.",
          "Solo se habla de desviaciones. Las clínicas en objetivo se despachan en una frase.",
          "Cada desviación tiene una acción, un responsable y una fecha. Si no cabe en una frase, no es una acción.",
          "Se revisan las acciones de la semana anterior antes de abrir nuevas. Es lo que convierte la reunión en dirección.",
          "Termina a los 30 minutos. Lo que no se ha resuelto pasa a una conversación individual.",
        ],
      },
      {
        type: "callout",
        title: "La regla de las tres preguntas",
        text: "Para cada clínica desviada, el director solo necesita tres respuestas: qué ha pasado, qué vas a hacer esta semana y qué necesitas de mí. El resto es ruido.",
      },
      { type: "h2", text: "Reglas de calidad del dato" },
      {
        type: "p",
        text: "Un cuadro de mando con datos cuestionables es peor que ninguno: la reunión se convierte en una discusión sobre el número y no sobre la acción. Cuatro reglas:",
      },
      {
        type: "ul",
        items: [
          "Una definición escrita por KPI, con fórmula, fuente y responsable del dato, igual en todas las clínicas.",
          "Una sola fuente por indicador: el sistema de gestión para actividad y comercial, el de personal para horas, el contable para cobros. Nada manual si se puede evitar.",
          "Publicación automática o semiautomática antes de la reunión. Si preparar la página lleva medio día, no sobrevivirá.",
          "Los errores de dato se corrigen fuera de la reunión. En la reunión se asume el dato y se decide.",
        ],
      },
      { type: "h2", text: "Ejemplo ilustrativo de una semana" },
      {
        type: "p",
        text: "Supongamos una red de 10 clínicas. El lunes la página muestra que la clínica 7 ha caído del 76 % al 64 % de ocupación en dos semanas, con conversión estable y 14 cancelaciones frente a las 5 habituales. La clínica 3 acumula 48.000 euros en presupuestos pendientes de más de 30 días, el doble que el mes anterior. El resto está en objetivo.",
      },
      {
        type: "p",
        text: "La reunión dedica cinco minutos a la clínica 7: un profesional está de baja y la agenda no se ha redistribuido; la acción es reasignar franjas y llamar a los pacientes cancelados antes del jueves. Otros cinco a la clínica 3: admisión contacta esta semana a los 20 presupuestos de mayor importe. Las cifras son ilustrativas; la mecánica es la real.",
      },
      { type: "h2", text: "Qué hacer cuando un KPI se desvía" },
      {
        type: "p",
        text: "Una desviación de una semana es información; de dos, una señal; de tres, un problema de dirección. Mi protocolo: la primera semana, el manager explica y propone. La segunda, el director de red visita o llama y revisa la acción. La tercera, el problema sube al comité de dirección con un plan específico. Lo que nunca debe pasar: un indicador dos meses en rojo y, como respuesta, otra fila en la página.",
      },
      {
        type: "quote",
        text: "Un cuadro de mando no sirve para saber cómo va la red. Sirve para decidir, cada lunes, qué va a cambiar esta semana y en qué clínica. Si no provoca decisiones, es un informe.",
      },
    ],
    faqs: [
      {
        question: "¿Cuántos KPIs debe tener un cuadro de mando semanal de una red de clínicas?",
        answer:
          "Entre diez y doce, organizados en actividad, comercial, personas y resultado, con una fila por clínica. Más indicadores diluyen la atención; menos dejan fuera alguna palanca relevante.",
      },
      {
        question: "¿Quién debe preparar el cuadro de mando?",
        answer:
          "Operaciones o control de gestión, con extracción automática o semiautomática de los sistemas de gestión y de personal. Nunca los managers de clínica a mano: su trabajo es actuar sobre los datos, no fabricarlos.",
      },
      {
        question: "¿Qué herramienta hace falta?",
        answer:
          "Ninguna sofisticada al principio. Una hoja de cálculo alimentada desde el sistema de gestión basta durante meses. La herramienta se cambia cuando la rutina ya funciona, no antes.",
      },
    ],
  },
];
