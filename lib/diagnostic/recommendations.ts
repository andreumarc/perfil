import type { OperationalPainSignals } from "@/lib/lead-scoring";

import { DIMENSION_LABELS, type Dimension } from "./questions";
import type { DiagnosticAnswers, DiagnosticProfile } from "./calculate";

export interface Recommendations {
  /** Frase principal: "Vuestro mayor potencial de mejora está en…" */
  headline: string;
  /** Los dos bloques con mayor potencial de mejora. */
  focusDimensions: Dimension[];
  problems: string[];
  opportunities: string[];
  actions: string[];
  /** Servicio recomendado según el patrón de respuestas. */
  recommendedService: {
    slug: "multisite-performance-audit" | "ebitda-improvement" | "integration-100" | "fractional-coo";
    reason: string;
  };
}

interface Insight {
  problem: string;
  opportunity: string;
  action: string;
}

/**
 * Biblioteca de insights por bloque. Se seleccionan en función de las
 * respuestas concretas para que el resultado sea específico, no genérico.
 */
const LIBRARY: Record<Dimension, Insight[]> = {
  finance: [
    {
      problem: "No conocéis el EBITDA real de cada centro: las decisiones se toman sobre facturación, no sobre resultado.",
      opportunity: "Un P&L mensual por centro con criterios homogéneos permite identificar qué unidades destruyen margen y cuáles lo sostienen.",
      action: "Construir el P&L por centro (ingresos, coste de personal, compras, alquiler, estructura) y publicarlo mensualmente antes del día 10.",
    },
    {
      problem: "El coste de personal óptimo por centro no está definido: la plantilla se ajusta por inercia, no por actividad.",
      opportunity: "Dimensionar la plantilla por actividad y capacidad suele ser la palanca de EBITDA más rápida en redes de servicios.",
      action: "Definir el ratio objetivo de coste de personal sobre ventas por tipología de centro y revisarlo mensualmente contra agenda y ocupación.",
    },
    {
      problem: "No existe un plan de mejora de EBITDA con objetivos, responsables y calendario.",
      opportunity: "Un plan de 90 días con 5-7 palancas priorizadas convierte el EBITDA en un proyecto gestionable, no en un resultado que se espera.",
      action: "Priorizar las palancas por impacto y esfuerzo, asignar un responsable a cada una y revisar el avance en un comité mensual de rentabilidad.",
    },
  ],
  operations: [
    {
      problem: "Cada centro funciona de forma distinta: hay tantas maneras de operar como responsables de centro.",
      opportunity: "Una única forma de operar reduce excepciones, simplifica la supervisión y hace replicable el modelo en nuevos centros.",
      action: "Documentar el modelo operativo estándar (agenda, atención, compras, caja, cierre) y auditarlo trimestralmente en cada centro.",
    },
    {
      problem: "Los responsables de centro se gestionan por incidencias, no por indicadores ni rutinas.",
      opportunity: "Una rutina de dirección (KPIs semanales + reunión mensual de centro) multiplica la capacidad de gestión de la dirección regional.",
      action: "Implantar una reunión semanal de 30 minutos por centro con 6-8 KPIs fijos y un plan de acción vivo por centro.",
    },
    {
      problem: "No existe un cuadro de mando operativo que se revise de forma sistemática.",
      opportunity: "Un cuadro de mando semanal convierte la información en decisiones y detecta desviaciones antes de que lleguen al cierre.",
      action: "Diseñar un cuadro de mando de una página por centro con ventas, ocupación, productividad, coste de personal y conversión.",
    },
  ],
  people: [
    {
      problem: "Se desconoce la productividad por empleado: no es posible saber qué equipos están sobredimensionados o saturados.",
      opportunity: "Medir productividad por profesional y por hora permite redistribuir capacidad sin aumentar la plantilla.",
      action: "Calcular facturación por profesional y por hora disponible en cada centro y compararla con el percentil 75 de la red.",
    },
    {
      problem: "Los managers de centro no tienen objetivos, rutinas ni herramientas claras para dirigir su unidad.",
      opportunity: "Profesionalizar al responsable de centro es la inversión con mayor efecto multiplicador en una red.",
      action: "Definir el rol del responsable de centro (objetivos, KPIs, rutinas, decisiones delegadas) y formarlo en lectura de su P&L.",
    },
    {
      problem: "La plantilla no está dimensionada por actividad ni por capacidad real de cada centro.",
      opportunity: "Un modelo de dimensionamiento objetivo evita tanto el coste de personal excesivo como la pérdida de ventas por falta de capacidad.",
      action: "Construir una matriz de plantilla objetivo por centro en función de horas de apertura, ocupación y mix de servicios.",
    },
  ],
  data: [
    {
      problem: "Los centros no comparten los mismos KPIs ni las mismas definiciones: los datos no son comparables.",
      opportunity: "Un diccionario de KPIs común hace posible el benchmarking interno y la toma de decisiones basada en datos.",
      action: "Fijar 10-12 KPIs de red con definición, fuente y responsable únicos, y eliminar los informes que no los usen.",
    },
    {
      problem: "La dirección tarda demasiado en obtener información fiable: cuando llega, ya no sirve para corregir.",
      opportunity: "Reducir el tiempo de obtención de datos a días (no semanas) permite gestionar el mes en curso en lugar de explicar el anterior.",
      action: "Automatizar la extracción de los KPIs clave desde los sistemas de gestión y fijar un cierre operativo semanal.",
    },
    {
      problem: "No existe comparativa sistemática entre centros: los mejores no se identifican y los peores no se detectan a tiempo.",
      opportunity: "El ranking de centros revela de forma inmediata dónde está el potencial de mejora y qué prácticas hay que replicar.",
      action: "Publicar un ranking mensual de centros con 5 indicadores y analizar en cada comité el primer y el último cuartil.",
    },
  ],
  scalability: [
    {
      problem: "El modelo operativo no está estandarizado: cada nuevo centro o adquisición añade complejidad en lugar de escala.",
      opportunity: "Un modelo replicable permite abrir o integrar centros con un playbook definido y tiempos predecibles.",
      action: "Crear un playbook de apertura/integración con hitos a 30, 60 y 100 días y responsables por área.",
    },
    {
      problem: "Faltan KPIs comunes y comparativa entre centros: la red no aprende de sus mejores unidades.",
      opportunity: "El benchmarking interno es la forma más barata de mejorar: las mejores prácticas ya existen dentro de la red.",
      action: "Identificar los 3 centros de referencia por indicador y documentar qué hacen diferente para replicarlo.",
    },
    {
      problem: "No hay un plan claro de rentabilidad que acompañe el crecimiento: se crece en centros, no necesariamente en EBITDA.",
      opportunity: "Alinear expansión y rentabilidad evita la trampa habitual de redes grandes con márgenes decrecientes.",
      action: "Definir criterios mínimos de rentabilidad por centro antes de cada apertura o adquisición y revisarlos a los 6 y 12 meses.",
    },
  ],
};

interface BuildInput {
  scores: Record<Dimension, number>;
  answers: DiagnosticAnswers;
  pain: OperationalPainSignals;
  profile: DiagnosticProfile;
}

function pickInsights(dimension: Dimension, answers: DiagnosticAnswers): Insight[] {
  const all = LIBRARY[dimension];
  // Prioriza el insight más vinculado a las respuestas negativas concretas.
  const prioritized: Insight[] = [];
  const push = (i: Insight | undefined) => {
    if (i && !prioritized.includes(i)) prioritized.push(i);
  };

  switch (dimension) {
    case "finance":
      if (answers.q2 !== "yes") push(all[0]);
      if (answers.q11 !== "yes") push(all[1]);
      if (answers.q12 !== "yes") push(all[2]);
      break;
    case "operations":
      if (answers.q5 !== "yes") push(all[0]);
      if (answers.q10 !== "kpis") push(all[1]);
      if (answers.q4 !== "yes") push(all[2]);
      break;
    case "people":
      if (answers.q6 !== "yes") push(all[0]);
      if (answers.q10 !== "kpis") push(all[1]);
      if (answers.q11 !== "yes") push(all[2]);
      break;
    case "data":
      if (answers.q3 !== "yes") push(all[0]);
      if (answers.q8 === "8-30" || answers.q8 === "30+") push(all[1]);
      if (answers.q7 !== "yes") push(all[2]);
      break;
    case "scalability":
      if (answers.q5 !== "yes") push(all[0]);
      if (answers.q3 !== "yes" || answers.q7 !== "yes") push(all[1]);
      if (answers.q12 !== "yes") push(all[2]);
      break;
  }
  for (const i of all) push(i);
  return prioritized;
}

function recommendService(input: BuildInput): Recommendations["recommendedService"] {
  const { pain, profile, scores } = input;
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5;

  if (pain.acquisitions === "yes") {
    return {
      slug: "integration-100",
      reason:
        "Habéis adquirido centros recientemente: el plan de 100 días evita que cada adquisición añada una forma más de operar y fija responsables y calendario para las sinergias.",
    };
  }
  if (profile.mainProblem === "integracion") {
    return {
      slug: "integration-100",
      reason:
        "La integración es vuestro problema principal: antes de la siguiente adquisición conviene un playbook con hitos a 30, 60 y 100 días y una única forma de operar.",
    };
  }
  if (profile.sector === "private_equity" && pain.acquisitions === "considering") {
    return {
      slug: "integration-100",
      reason:
        "Estáis estudiando una adquisición: preparar la integración antes del día 1 es la forma más barata de proteger el EBITDA del plan de inversión.",
    };
  }
  if (profile.sector === "private_equity") {
    return {
      slug: "multisite-performance-audit",
      reason:
        "Para una participada o un target, el primer paso es saber si el EBITDA es real y replicable centro a centro: el audit entrega ese diagnóstico con ranking, desviaciones y plan de acción.",
    };
  }
  if (avg >= 60 && (profile.mainProblem === "rentabilidad" || profile.mainProblem === "costes")) {
    return {
      slug: "ebitda-improvement",
      reason:
        "Tenéis una base de información razonable y el foco está en rentabilidad: un sprint de 6-8 semanas convierte esa información en EBITDA.",
    };
  }
  if (
    avg >= 55 &&
    (profile.numberLocations === "11-25" || profile.numberLocations === "26-50" || profile.numberLocations === "50+") &&
    (profile.mainProblem === "crecimiento" || profile.mainProblem === "expansion" || profile.mainProblem === "equipos")
  ) {
    return {
      slug: "fractional-coo",
      reason:
        "Una red de este tamaño en fase de crecimiento necesita dirección operativa continua, no proyectos puntuales.",
    };
  }
  return {
    slug: "multisite-performance-audit",
    reason:
      "Antes de actuar conviene saber exactamente dónde se pierde rentabilidad: el audit entrega el ranking de centros, las desviaciones y el plan de acción priorizado.",
  };
}

export function buildRecommendations(input: BuildInput): Recommendations {
  const { scores, answers } = input;

  // Bloques ordenados de menor a mayor madurez (mayor potencial primero).
  const ordered = (Object.keys(scores) as Dimension[]).sort((a, b) => scores[a] - scores[b]);
  const focus = ordered.slice(0, 2);
  const third = ordered[2];

  const first = pickInsights(focus[0], answers);
  const second = pickInsights(focus[1], answers);
  const backup = pickInsights(third, answers);

  const chosen: Insight[] = [first[0], second[0], first[1] ?? backup[0]].filter(
    (i, idx, arr): i is Insight => Boolean(i) && arr.indexOf(i) === idx,
  );
  while (chosen.length < 3) {
    const extra = [...first, ...second, ...backup].find((i) => !chosen.includes(i));
    if (!extra) break;
    chosen.push(extra);
  }

  const focusLabels = focus.map((d) => `${DIMENSION_LABELS[d].toLowerCase()} (${scores[d]}/100)`);
  const headline = `Vuestro mayor potencial de mejora está en ${focusLabels[0]} y ${focusLabels[1]}. Por ahí empezaría.`;

  return {
    headline,
    focusDimensions: focus,
    problems: chosen.map((i) => i.problem),
    opportunities: chosen.map((i) => i.opportunity),
    actions: chosen.map((i) => i.action),
    recommendedService: recommendService(input),
  };
}
