/**
 * Catálogo de servicios. Fuente única para /servicios, páginas individuales,
 * cards de la home, sitemap y schema.org.
 */
export type ServiceSlug =
  | "multisite-performance-audit"
  | "ebitda-improvement"
  | "integration-100"
  | "fractional-coo";

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface Service {
  slug: ServiceSlug;
  /** Nombre comercial (inglés, como en el posicionamiento). */
  name: string;
  /** Nombre corto para cards y menús. */
  shortName: string;
  /** Titular de la página (H1). */
  headline: string;
  /** Subtítulo / propuesta de valor. */
  subheadline: string;
  /** Resumen de una línea para cards. */
  summary: string;
  /** Meta description SEO (≤160 caracteres). */
  metaDescription: string;
  keywords: string[];
  /** Duración / formato. */
  format: string;
  /** Precio orientativo. */
  priceFrom: number;
  priceLabel: string;
  priceUnit?: string;
  priceNote: string;
  cta: string;
  /** Para quién es. */
  forWhom: string[];
  /** Situaciones típicas que lo motivan (copy de dolor). */
  triggers: string[];
  /** Qué se analiza / qué incluye. */
  scope: { title: string; items: string[] };
  /** Entregables. */
  deliverables: string[];
  /** Cómo se trabaja. */
  process: ServiceStep[];
  /** Resultado esperado (sin cifras inventadas). */
  outcome: string;
  faqs: ServiceFaq[];
  /** Servicio con el que suele continuar. */
  nextStep?: { slug: ServiceSlug; text: string };
}

export const SERVICES: readonly Service[] = [
  {
    slug: "multisite-performance-audit",
    name: "Multisite Performance Audit",
    shortName: "Performance Audit",
    headline: "Sabe exactamente dónde gana y dónde pierde dinero cada uno de tus centros.",
    subheadline:
      "Un diagnóstico ejecutivo de la situación operativa y económica de tu red: P&L por centro, ranking, desviaciones y un plan de acción priorizado. En 3-4 semanas.",
    summary:
      "Diagnóstico ejecutivo de la red: P&L por centro, ranking, desviaciones, quick wins y plan de acción priorizado.",
    metaDescription:
      "Auditoría operativa y económica para redes de centros: P&L por centro, ranking, desviaciones, quick wins y plan de acción EBITDA. Desde 1.950 €.",
    keywords: [
      "auditoría operativa multicentro",
      "P&L por centro",
      "rentabilidad por centro",
      "ranking de centros",
      "diagnóstico operaciones",
    ],
    format: "3-4 semanas · análisis + sesión ejecutiva",
    priceFrom: 1950,
    priceLabel: "desde 1.950 €",
    priceNote: "Precio orientativo según número de centros y disponibilidad de datos. Presupuesto cerrado antes de empezar.",
    cta: "Solicitar diagnóstico",
    forWhom: [
      "CEOs y Directores Generales de redes de 5 a 100 centros que no pueden comparar la rentabilidad de sus unidades en menos de cinco minutos.",
      "CFOs que tienen la contabilidad al día pero no un P&L operativo por centro con criterios homogéneos.",
      "Inversores y Operating Partners que necesitan una fotografía operativa fiable de una participada o de un target.",
    ],
    triggers: [
      "La facturación crece pero el EBITDA no acompaña y nadie sabe explicar exactamente por qué.",
      "Cada centro reporta de una forma distinta y consolidar la información lleva semanas.",
      "El coste de personal se ha disparado en algunos centros y no está claro si es un problema de plantilla, de agenda o de ventas.",
      "Se sospecha que dos o tres centros destruyen margen, pero no hay datos para decidir qué hacer con ellos.",
    ],
    scope: {
      title: "Qué analizamos",
      items: [
        "P&L por centro con criterios homogéneos",
        "Ventas, mix de servicios y ticket medio",
        "Margen y EBITDA por centro",
        "Coste de personal y dimensionamiento",
        "Productividad por profesional y por hora",
        "Ocupación, capacidad y agendas",
        "Conversión comercial por centro",
        "Compras y condiciones con proveedores",
        "Estructura central y costes de soporte",
        "KPIs actuales: definición, fiabilidad y uso",
        "Desviaciones frente a presupuesto y frente a la media de la red",
      ],
    },
    deliverables: [
      "Diagnóstico ejecutivo (documento de 20-30 páginas, pensado para comité de dirección o consejo)",
      "Ranking de centros por rentabilidad y por eficiencia",
      "Mapa de desviaciones: dónde, cuánto y por qué",
      "Quick wins ejecutables en 30 días",
      "Oportunidades de EBITDA cuantificadas por palanca",
      "Prioridades por impacto y esfuerzo",
      "Plan de acción a 90 días con responsables",
      "Sesión de presentación con el equipo directivo",
    ],
    process: [
      {
        title: "Recogida de datos",
        description:
          "Cierres contables, extracciones del sistema de gestión, plantillas y agendas. Se trabaja con lo que existe: no se exige implantar nada antes.",
      },
      {
        title: "Normalización y P&L por centro",
        description:
          "Se construye un P&L comparable para todos los centros, imputando estructura con el mismo criterio y corrigiendo las diferencias contables entre unidades.",
      },
      {
        title: "Benchmarking interno y entrevistas",
        description:
          "Ranking, cuartiles y análisis de las diferencias entre los mejores y los peores centros. Entrevistas con dirección y una muestra de responsables de centro.",
      },
      {
        title: "Diagnóstico y plan de acción",
        description:
          "Priorización de palancas por impacto y esfuerzo, quick wins y plan a 90 días. Presentación ejecutiva y sesión de preguntas con el equipo directivo.",
      },
    ],
    outcome:
      "Una visión única y comparable de la rentabilidad real de cada centro, con las desviaciones identificadas y un plan de acción priorizado para corregirlas. Es el punto de partida objetivo para cualquier decisión de mejora, cierre, inversión o integración.",
    faqs: [
      {
        question: "¿Qué datos necesitáis para empezar?",
        answer:
          "Los cierres contables de los últimos 12-24 meses, una extracción del sistema de gestión (ventas, agendas, actividad) y las plantillas por centro. Si la información está dispersa o incompleta, parte del trabajo consiste precisamente en normalizarla.",
      },
      {
        question: "¿Cuánto tiempo del equipo directivo requiere?",
        answer:
          "Entre 4 y 6 horas en total: una reunión de arranque, entrevistas de 45 minutos con 3-5 personas y la sesión final de presentación. El resto del trabajo se hace sin interrumpir la operación.",
      },
      {
        question: "¿Sirve para una due diligence operativa?",
        answer:
          "Sí. El mismo enfoque se adapta a un proceso de compra: análisis de la calidad del EBITDA, riesgos operativos, dependencia de personas clave y potencial de mejora post-adquisición.",
      },
      {
        question: "¿Qué pasa después del audit?",
        answer:
          "El plan de acción es ejecutable por el equipo interno. Si se quiere acelerar, el paso natural es un EBITDA Improvement Sprint de 6-8 semanas sobre las palancas priorizadas.",
      },
    ],
    nextStep: {
      slug: "ebitda-improvement",
      text: "Convierte las palancas identificadas en EBITDA con un sprint de 6-8 semanas.",
    },
  },
  {
    slug: "ebitda-improvement",
    name: "EBITDA Improvement Sprint",
    shortName: "EBITDA Sprint",
    headline: "Seis a ocho semanas para mover el EBITDA, no para escribir otro informe.",
    subheadline:
      "Un programa intensivo que actúa sobre las palancas de rentabilidad de tu red: ingresos, margen, costes, productividad, plantilla, compras, agendas y capacidad. Con ejecución, no solo recomendaciones.",
    summary:
      "Programa de 6-8 semanas para mejorar rentabilidad: ingresos, margen, costes, productividad, plantilla, compras y capacidad.",
    metaDescription:
      "Programa de 6-8 semanas para mejorar el EBITDA de empresas multicentro: ingresos, margen, costes de personal, compras, agendas y capacidad. Desde 4.500 €.",
    keywords: [
      "mejorar EBITDA empresa",
      "consultor EBITDA",
      "mejora de rentabilidad multicentro",
      "optimización de costes centros",
      "productividad por centro",
    ],
    format: "6-8 semanas · ejecución acompañada",
    priceFrom: 4500,
    priceLabel: "desde 4.500 €",
    priceNote: "Precio orientativo según alcance y número de centros. Se define un objetivo de EBITDA y un plan cerrado antes de empezar.",
    cta: "Analizar potencial EBITDA",
    forWhom: [
      "Redes que ya saben que tienen potencial de mejora y necesitan convertirlo en resultados en un trimestre.",
      "Directores Generales que no pueden dedicar su tiempo a dirigir el proyecto de rentabilidad y necesitan a alguien que lo ejecute con el equipo.",
      "Participadas de Private Equity con un objetivo de EBITDA comprometido en el plan de negocio.",
    ],
    triggers: [
      "El margen EBITDA está por debajo del de redes comparables y las medidas tomadas hasta ahora no han movido la aguja.",
      "El coste de personal supera el 50 % de las ventas en varios centros sin que la actividad lo justifique.",
      "Las agendas tienen huecos y a la vez hay listas de espera: la capacidad está mal distribuida.",
      "Las compras se negocian centro a centro y nadie conoce el precio real que paga el grupo.",
    ],
    scope: {
      title: "Palancas sobre las que se trabaja",
      items: [
        "Crecimiento de ingresos: conversión, ticket medio, mix de servicios y recurrencia",
        "Margen por servicio y por centro",
        "Costes de personal: dimensionamiento, turnos y horas no productivas",
        "Productividad por profesional, por sala y por hora",
        "Plantilla objetivo por tipología de centro",
        "Compras centralizadas y renegociación con proveedores",
        "Agendas, ocupación y capacidad real",
        "Procesos que generan coste sin aportar valor",
        "Estructura central y servicios de soporte",
        "KPIs de seguimiento semanal de cada palanca",
      ],
    },
    deliverables: [
      "Objetivo de EBITDA y plan de palancas acordado con dirección en la semana 1",
      "Seguimiento semanal con el equipo: avance, bloqueos y decisiones",
      "Implantación de los cambios en agenda, plantilla, compras y procesos junto con los responsables",
      "Cuadro de mando de palancas con impacto estimado y real",
      "Rutinas de gestión para que la mejora se mantenga tras el sprint",
      "Informe final: EBITDA conseguido, EBITDA pendiente y plan de continuidad",
    ],
    process: [
      {
        title: "Semana 1 · Objetivo y palancas",
        description:
          "Se fija el objetivo de EBITDA, se seleccionan 5-7 palancas por impacto y esfuerzo y se asigna un responsable interno a cada una.",
      },
      {
        title: "Semanas 2-6 · Ejecución",
        description:
          "Cada semana se implantan acciones concretas: rediseño de agendas, ajuste de turnos, renegociación de compras, cambios de proceso. Se mide el efecto en el cuadro de mando.",
      },
      {
        title: "Semanas 7-8 · Consolidación",
        description:
          "Se fijan las rutinas (reunión semanal, KPIs, responsables) que mantienen la mejora y se entrega el plan de continuidad para el siguiente trimestre.",
      },
    ],
    outcome:
      "Las palancas de rentabilidad convertidas en acciones ejecutadas, un cuadro de mando que mide su efecto semana a semana y un equipo que sabe cómo sostener la mejora. Sin promesas de porcentajes: el objetivo se fija con datos propios en la primera semana.",
    faqs: [
      {
        question: "¿Garantizáis una mejora concreta de EBITDA?",
        answer:
          "No se prometen porcentajes antes de ver los datos: sería poco serio. En la primera semana se fija un objetivo realista a partir del P&L por centro y del benchmarking interno, y a partir de ahí se mide el avance cada semana.",
      },
      {
        question: "¿Necesitamos haber hecho antes el Performance Audit?",
        answer:
          "No es imprescindible, pero acelera el sprint porque las palancas ya están identificadas y cuantificadas. Sin audit previo, las dos primeras semanas se dedican a construir el P&L por centro.",
      },
      {
        question: "¿Cómo se involucra al equipo?",
        answer:
          "Cada palanca tiene un responsable interno. El sprint se diseña para que el equipo ejecute con acompañamiento, no para que un consultor haga el trabajo y se marche con el conocimiento.",
      },
    ],
    nextStep: {
      slug: "fractional-coo",
      text: "Si la red necesita dirección operativa continua, el Fractional COO mantiene el ritmo tras el sprint.",
    },
  },
  {
    slug: "integration-100",
    name: "Integration 100",
    shortName: "Integration 100",
    headline: "Los primeros 100 días deciden si una adquisición crea valor o añade complejidad.",
    subheadline:
      "Plan de integración post-adquisición para grupos multicentro y participadas de Private Equity: organización, personas, reporting, sistemas, compras, precios, procesos y gobernanza. Una sola forma de operar desde el primer trimestre.",
    summary:
      "Plan de integración post-adquisición de 100 días: organización, personas, reporting, sistemas, compras, procesos, KPIs y gobernanza.",
    metaDescription:
      "Plan de integración post-adquisición (100 días) para Private Equity, Buy & Build y grupos de clínicas: organización, reporting, compras, procesos y KPIs. Desde 5.000 €.",
    keywords: [
      "integración post adquisición",
      "post merger integration",
      "buy and build operations",
      "plan 100 días",
      "integración de clínicas adquiridas",
    ],
    format: "100 días · dirección del plan de integración",
    priceFrom: 5000,
    priceLabel: "desde 5.000 €",
    priceNote: "Precio orientativo según tamaño de la adquisición y número de centros integrados. Alcance cerrado antes del día 1.",
    cta: "Preparar integración",
    forWhom: [
      "Fondos de Private Equity con estrategia Buy & Build que integran add-ons sobre una plataforma.",
      "Grupos de clínicas, centros veterinarios o redes de servicios que compran competidores y necesitan integrarlos sin perder facturación ni equipo.",
      "CEOs que han cerrado una adquisición y todavía no tienen un plan concreto para el día 1 y los 100 primeros días.",
    ],
    triggers: [
      "La última adquisición sigue funcionando como una empresa aparte seis meses después de la compra.",
      "Los centros adquiridos reportan con otro sistema, otros KPIs y otro calendario de cierre.",
      "El equipo adquirido no sabe qué va a cambiar y los mejores profesionales empiezan a recibir ofertas.",
      "Las sinergias del plan de inversión no tienen responsable, calendario ni seguimiento.",
    ],
    scope: {
      title: "Qué se integra",
      items: [
        "Organización: organigrama objetivo, roles y líneas de reporte",
        "Personas: comunicación, retención de perfiles clave y gestión del cambio",
        "Reporting: P&L por centro y KPIs homogéneos desde el primer cierre",
        "Sistemas: gestión, agendas, caja y datos",
        "Compras: homologación de proveedores y condiciones de grupo",
        "Precios y catálogo de servicios",
        "Procesos operativos: una única forma de operar",
        "KPIs y cuadro de mando de integración",
        "Cultura: qué se mantiene, qué cambia y cómo se comunica",
        "Estructura: servicios centrales y funciones duplicadas",
        "Gobernanza: comité de integración, decisiones y escalado",
      ],
    },
    deliverables: [
      "Plan de integración a 100 días con hitos a 30, 60 y 100 días",
      "Plan de comunicación para equipos, pacientes/clientes y proveedores",
      "Organigrama objetivo y mapa de roles",
      "P&L por centro y KPIs homogéneos operativos desde el primer cierre",
      "Playbook de integración reutilizable para las siguientes adquisiciones",
      "Seguimiento de sinergias: identificadas, en curso y conseguidas",
      "Comité de integración quincenal con dirección e inversores",
    ],
    process: [
      {
        title: "Antes del día 1 · Preparación",
        description:
          "Diagnóstico rápido de la empresa adquirida, mapa de riesgos (personas, sistemas, clientes) y plan de comunicación del día 1.",
      },
      {
        title: "Días 1-30 · Control",
        description:
          "Comunicación a equipos, retención de perfiles clave, acceso a datos y primer P&L por centro con criterios del grupo. Nada se rompe; todo se mide.",
      },
      {
        title: "Días 31-60 · Integración",
        description:
          "Homologación de procesos, compras y precios. Migración o conexión de sistemas. Formación de responsables de centro en el modelo operativo del grupo.",
      },
      {
        title: "Días 61-100 · Captura de valor",
        description:
          "Sinergias ejecutadas y medidas, estructura ajustada, cuadro de mando consolidado y playbook documentado para la siguiente adquisición.",
      },
    ],
    outcome:
      "Una adquisición que al día 100 reporta como el resto del grupo, opera con los mismos procesos y tiene las sinergias identificadas con responsable y calendario. Y un playbook que convierte la siguiente integración en un proceso predecible.",
    faqs: [
      {
        question: "¿Cuándo hay que empezar a trabajar el plan?",
        answer:
          "Idealmente antes del cierre: las semanas previas al día 1 son las más baratas para preparar comunicación, datos y retención. Si la operación ya está cerrada, se arranca con un diagnóstico de dos semanas y se construye el plan de 100 días desde ahí.",
      },
      {
        question: "¿Trabajáis con los equipos del fondo?",
        answer:
          "Sí. El comité de integración incluye a dirección de la plataforma y al equipo de inversión u Operating Partner. El reporting está pensado para que el fondo tenga visibilidad sin tener que operar.",
      },
      {
        question: "¿Qué pasa con la cultura de la empresa adquirida?",
        answer:
          "Se decide de forma explícita qué se mantiene y qué cambia. Integrar no es uniformizar todo: es tener una única forma de operar en lo que importa (datos, procesos clave, estándares de servicio) y respetar lo que hace valiosa a la empresa adquirida.",
      },
    ],
    nextStep: {
      slug: "fractional-coo",
      text: "Para grupos que encadenan adquisiciones, un Fractional COO da continuidad al modelo operativo entre integraciones.",
    },
  },
  {
    slug: "fractional-coo",
    name: "Fractional COO",
    shortName: "Fractional COO",
    headline: "Un Director de Operaciones con experiencia en redes de 25 centros, a tiempo parcial.",
    subheadline:
      "Dirección operativa externa para empresas de 5 a 50 M€ en fase de crecimiento, expansión, profesionalización o transformación. Cuadro de mando, P&L, managers, productividad, procesos y ejecución. Sin el coste fijo de un COO a jornada completa.",
    summary:
      "Dirección de operaciones externa para empresas de 5-50 M€: cuadro de mando, P&L, managers, productividad, expansión y ejecución.",
    metaDescription:
      "Fractional COO en España y Barcelona para empresas multicentro de 5-50 M€: dirección operativa, cuadro de mando, P&L, managers y expansión. Desde 3.000 €/mes.",
    keywords: [
      "fractional COO España",
      "fractional COO Barcelona",
      "director de operaciones externo",
      "COO a tiempo parcial",
      "director operaciones multicentro",
    ],
    format: "2-3 días/semana · compromiso mínimo 6 meses",
    priceFrom: 3000,
    priceLabel: "desde 3.000 €/mes",
    priceUnit: "al mes",
    priceNote: "Precio orientativo según dedicación semanal y tamaño de la red. Compromiso inicial de 6 meses con revisión trimestral de objetivos.",
    cta: "Valorar Fractional COO",
    forWhom: [
      "Empresas de 5 a 50 M€ de facturación que han crecido más rápido que su estructura de dirección.",
      "CEOs fundadores que siguen llevando la operación del día a día y necesitan recuperar tiempo para estrategia, ventas o inversores.",
      "Participadas de Private Equity que necesitan profesionalizar operaciones antes de contratar un COO a jornada completa.",
    ],
    triggers: [
      "El CEO es el cuello de botella: todas las decisiones operativas pasan por él.",
      "Hay managers de centro, pero nadie los dirige con objetivos, KPIs y rutinas.",
      "Se abren o adquieren centros nuevos sin un modelo operativo replicable.",
      "La empresa necesita un COO pero no justifica todavía un coste fijo de 120-150 k€ al año.",
    ],
    scope: {
      title: "Qué asume el Fractional COO",
      items: [
        "Dirección operativa de la red y de los responsables de centro",
        "Cuadro de mando semanal y mensual",
        "P&L por centro y seguimiento de desviaciones",
        "Dirección y desarrollo de managers",
        "Productividad, dimensionamiento y agendas",
        "Expansión: aperturas, adquisiciones y playbook de integración",
        "Estandarización de procesos",
        "Reporting a dirección general, consejo e inversores",
        "Ejecución de los proyectos operativos prioritarios",
      ],
    },
    deliverables: [
      "Objetivos operativos trimestrales acordados con dirección",
      "Cuadro de mando operativo implantado y revisado cada semana",
      "Rutina de dirección con los responsables de centro",
      "P&L por centro mensual con análisis de desviaciones",
      "Plan de expansión / integración cuando aplica",
      "Reporting mensual para consejo o inversores",
      "Transición ordenada a un COO interno cuando la empresa lo justifique",
    ],
    process: [
      {
        title: "Mes 1 · Diagnóstico y cuadro de mando",
        description:
          "Fotografía de la red, P&L por centro, KPIs y rutinas. Se fijan los objetivos del primer trimestre con dirección.",
      },
      {
        title: "Meses 2-3 · Modelo operativo",
        description:
          "Rutinas de dirección con los managers, estandarización de los procesos clave y plan de productividad y plantilla.",
      },
      {
        title: "Meses 4-6 · Ejecución y escala",
        description:
          "Proyectos prioritarios (rentabilidad, expansión, integración), desarrollo de managers y reporting consolidado para consejo e inversores. Revisión trimestral de objetivos.",
      },
    ],
    outcome:
      "Una red dirigida con datos, managers con objetivos y rutinas, y un CEO liberado de la operación diaria. Con la flexibilidad de ajustar la dedicación y de transferir el modelo a un COO interno cuando llegue el momento.",
    faqs: [
      {
        question: "¿Cuántos días a la semana?",
        answer:
          "Habitualmente 2 o 3 días por semana, combinando presencia en los centros y trabajo remoto. La dedicación se ajusta por trimestre según los proyectos en curso.",
      },
      {
        question: "¿En qué se diferencia de un consultor?",
        answer:
          "En la responsabilidad. Un Fractional COO forma parte del comité de dirección, dirige a los responsables de centro, toma decisiones y responde por los resultados operativos. No entrega recomendaciones: ejecuta.",
      },
      {
        question: "¿Hay compromiso mínimo?",
        answer:
          "Seis meses. Es el tiempo mínimo para implantar el cuadro de mando, las rutinas y ver resultados en el P&L. Después se revisa trimestralmente.",
      },
      {
        question: "¿Trabajáis fuera de Barcelona?",
        answer:
          "Sí. La base es Barcelona, pero la mayoría de redes multicentro tienen centros en varias provincias. Se combina presencia periódica en los centros con dirección remota.",
      },
    ],
  },
] as const;

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
