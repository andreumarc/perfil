import type { ServiceSlug } from "@/content/services";
import type { sectors } from "@/lib/site";

/**
 * Casos de intervención HIPOTÉTICOS. Construidos a partir de situaciones
 * habituales en redes multicentro; no corresponden a clientes concretos y no
 * incluyen resultados económicos (ni porcentajes ni cifras de ahorro).
 * Fuente única para /casos, sitemap y schema.org.
 */

export type CaseSector = (typeof sectors)[number];

/** Palancas de gestión sobre las que actúa cada intervención (chips de lectura rápida). */
export type CaseLever =
  | "P&L por centro"
  | "KPIs"
  | "Benchmarking interno"
  | "Plantilla"
  | "Procesos"
  | "Compras"
  | "Agendas y turnos"
  | "Capacidad"
  | "Integración"
  | "Gobernanza";

export interface Case {
  slug: string;
  sector: CaseSector;
  /** Titular del caso, en lenguaje del CEO. */
  title: string;
  /** Fotografía de la red (p. ej. "Red de 12 clínicas dentales, 9 M€"). */
  context: string;
  /** Situación de partida, en un párrafo. */
  situation: string;
  /** Problemas detectados. */
  problems: string[];
  /** Qué se hace: P&L, KPIs, benchmarking, plantilla, procesos… */
  intervention: string[];
  /** Resultado esperado, cualitativo: gaps identificados, plan de acción, cuadro de mando… */
  expectedOutcome: string;
  /** Servicio con el que se abordaría la situación. */
  relatedService: ServiceSlug;
  /** Palancas principales (lectura rápida). */
  levers: CaseLever[];
  /** Horizonte temporal orientativo de la intervención. */
  horizon: string;
}

/** Nota obligatoria que encabeza la página de casos. */
export const CASES_DISCLAIMER =
  "Los casos siguientes son ejemplos de intervención construidos a partir de situaciones habituales en redes multicentro. No corresponden a clientes concretos ni incluyen resultados económicos reales.";

export const CASE_BADGE_LABEL = "Ejemplo de intervención";

export const CASES: readonly Case[] = [
  {
    slug: "red-dental-12-clinicas-procesos-distintos",
    sector: "Dental",
    title: "Doce clínicas, doce formas de trabajar: estandarizar sin frenar la actividad",
    context: "Red de 12 clínicas dentales, 9 M€ de facturación, crecimiento por aperturas propias",
    situation:
      "La red ha crecido abriendo clínicas durante una década. Cada directora de clínica ha heredado o creado sus propios protocolos: primera visita, presentación de presupuestos, configuración de agenda, compra de consumibles y seguimiento de los tratamientos aceptados. La dirección no puede comparar el rendimiento de las clínicas porque los indicadores no se miden igual, y formar a una nueva responsable lleva meses porque no existe un modelo que enseñar.",
    problems: [
      "La tasa de aceptación de presupuestos se calcula de cinco maneras distintas: es imposible saber qué clínicas venden bien y cuáles no.",
      "Agendas configuradas por cada clínica, con huecos de 15, 20 y 30 minutos para el mismo tratamiento.",
      "Consumibles e implantes negociados clínica a clínica, con proveedores y precios distintos.",
      "La incorporación de una nueva directora depende de quién la forme y en qué clínica empiece.",
      "Las prácticas de las dos clínicas más rentables no se transfieren al resto de la red.",
    ],
    intervention: [
      "P&L comparable por clínica, con una única imputación de la estructura central.",
      "Diccionario de KPIs: una sola definición de primera visita, presupuesto presentado, aceptado e iniciado.",
      "Benchmarking interno: ranking por productividad por sillón, por hora clínica y por profesional.",
      "Modelo operativo único: protocolo de primera visita, presentación de presupuesto y agenda tipo por box.",
      "Homologación de proveedores y catálogo de compras del grupo.",
      "Rutina semanal de dirección con las directoras de clínica sobre cinco indicadores.",
    ],
    expectedOutcome:
      "Una red que opera con una sola forma de hacer las cosas en lo que importa. La dirección compara las doce clínicas con los mismos criterios, identifica dónde está el gap frente a las mejores y dispone de un modelo operativo documentado para formar nuevas responsables y abrir la clínica número trece sin reinventar nada.",
    relatedService: "multisite-performance-audit",
    levers: ["P&L por centro", "KPIs", "Benchmarking interno", "Procesos", "Compras"],
    horizon: "3-4 semanas de diagnóstico y plan a 90 días",
  },
  {
    slug: "grupo-veterinario-4-clinicas-adquiridas-sin-integrar",
    sector: "Veterinaria",
    title: "Cuatro clínicas compradas que siguen funcionando como cuatro empresas",
    context: "Grupo veterinario de 9 centros: 5 propios y 4 adquiridos en los últimos 18 meses",
    situation:
      "Un grupo veterinario ha comprado cuatro clínicas independientes para ganar tamaño. Más de un año después, cada una conserva su software de gestión, su tarifa, sus proveedores y su forma de cerrar el mes. Los antiguos propietarios siguen al frente con contratos de permanencia, pero sin objetivos ni reporting homogéneo. El grupo consolida la contabilidad, aunque no sabe si las clínicas adquiridas rinden mejor o peor que antes de la compra.",
    problems: [
      "Cuatro sistemas de gestión distintos: la información consolidada llega tarde y se prepara a mano.",
      "Tarifas y catálogo de servicios diferentes en cada clínica; dos centros cercanos cobran precios distintos por el mismo servicio.",
      "Las sinergias previstas en el plan de compra (compras, laboratorio, guardias) no tienen responsable ni calendario.",
      "Los veterinarios clave de las clínicas adquiridas no saben qué va a cambiar ni cuándo.",
      "El equipo central dedica su tiempo a resolver incidencias de integración en lugar de a dirigir el grupo.",
    ],
    intervention: [
      "Plan de integración a 100 días para las cuatro clínicas, con hitos a 30, 60 y 100 días.",
      "P&L por clínica con criterios del grupo desde el primer cierre, comparable con la situación previa a la compra.",
      "Decisión explícita sobre qué se unifica (datos, compras, tarifas, guardias) y qué se respeta de cada clínica.",
      "Plan de comunicación y de retención para veterinarios y responsables clave.",
      "Homologación de proveedores, laboratorio y compras bajo condiciones de grupo.",
      "Comité de integración quincenal con dirección y antiguos propietarios.",
      "Playbook documentado para la siguiente adquisición.",
    ],
    expectedOutcome:
      "Las cuatro clínicas reportan como el resto del grupo, operan con las mismas reglas en lo esencial y cada sinergia tiene nombre, responsable y fecha. El grupo recupera el control de la operación y dispone de un playbook para que la quinta adquisición sea un proceso predecible y no un proyecto nuevo.",
    relatedService: "integration-100",
    levers: ["Integración", "P&L por centro", "Procesos", "Compras", "Gobernanza"],
    horizon: "100 días de integración dirigida",
  },
  {
    slug: "cadena-retail-30-tiendas-coste-personal",
    sector: "Retail",
    title: "Treinta tiendas y un coste de personal que crece más deprisa que las ventas",
    context: "Cadena retail de 30 tiendas, 24 M€ de facturación, en centros comerciales y a pie de calle",
    situation:
      "Las ventas crecen, pero el coste de personal crece más rápido y el margen de la cadena se estrecha. La dirección no sabe si el problema está en las plantillas, en la distribución de los turnos o en la caída de ventas por hora de determinadas tiendas. Cada responsable decide su cuadrante y las horas extra se aprueban por costumbre. La central ve el coste total, no el coste por hora vendida de cada tienda.",
    problems: [
      "El ratio de coste de personal sobre ventas no se sigue por tienda ni por semana.",
      "Cuadrantes hechos a mano por cada responsable, sin relación con el tráfico ni con las ventas por franja horaria.",
      "Horas extra y refuerzos aprobados sin un criterio común.",
      "Plantillas dimensionadas por histórico, no por tipología de tienda.",
      "La central compara tiendas por ventas totales, no por productividad por hora trabajada.",
    ],
    intervention: [
      "P&L por tienda con el coste de personal desglosado: fijo, variable, horas extra y absentismo.",
      "Benchmarking de productividad: ventas por hora trabajada, tickets por empleado y cobertura por franja.",
      "Plantilla objetivo por tipología de tienda según superficie, tráfico y horario comercial.",
      "Cuadrantes alineados con las curvas de tráfico y de ventas por hora.",
      "Criterio único de aprobación de horas extra y refuerzos, con un responsable de zona por decisión.",
      "Cuadro de mando semanal de coste de personal por tienda para los responsables de zona.",
    ],
    expectedOutcome:
      "La dirección sabe en qué tiendas el coste de personal es un problema de dimensionamiento, en cuáles lo es de distribución de turnos y en cuáles de ventas. Los responsables de zona dirigen con un indicador semanal y un criterio común, y la plantilla objetivo se convierte en la referencia para aperturas y renovaciones de equipo.",
    relatedService: "ebitda-improvement",
    levers: ["P&L por centro", "Plantilla", "Agendas y turnos", "Benchmarking interno", "KPIs"],
    horizon: "6-8 semanas de ejecución acompañada",
  },
  {
    slug: "red-8-gimnasios-sin-pl-por-centro",
    sector: "Fitness",
    title: "Ocho gimnasios y una sola cuenta de resultados: nadie sabe cuál gana dinero",
    context: "Red de 8 gimnasios, 6 M€ de facturación, dos socios fundadores al frente de la operación",
    situation:
      "La red tiene una contabilidad única y una cuenta de resultados consolidada. Los socios saben que la empresa es rentable, pero no cuánto aporta cada centro. Las decisiones sobre renovar un local, invertir en maquinaria o actuar sobre un centro con muchas bajas se toman por intuición. El coste de personal, el marketing y la estructura central no están imputados por centro, y la cuota media varía de un gimnasio a otro sin control.",
    problems: [
      "Una sola cuenta de resultados: es imposible saber qué centros sostienen al resto.",
      "Altas, bajas y cuota media por centro sin seguimiento mensual.",
      "Ocupación por franja horaria y por sala desconocida; las clases colectivas se programan por costumbre.",
      "Estructura central y marketing sin imputar a los centros.",
      "Decisiones de inversión y de renovación de alquileres sin datos de rentabilidad por centro.",
    ],
    intervention: [
      "Construcción del P&L por centro a partir de la contabilidad existente: ingresos, personal directo, alquiler, suministros, mantenimiento e imputación de central.",
      "KPIs por centro: socios activos, altas, bajas, cuota media y ocupación por franja.",
      "Ranking de centros por rentabilidad y por rendimiento de la superficie.",
      "Revisión de la parrilla de actividades según la ocupación real de cada sala.",
      "Cuadro de mando mensual para los socios y semanal para los responsables de centro.",
      "Plan de acción a 90 días priorizado centro a centro.",
    ],
    expectedOutcome:
      "Los socios conocen la aportación real de cada gimnasio y deciden sobre inversiones, renovaciones y cierres con datos. Los responsables de centro trabajan con un cuadro de mando sencillo, y la red cuenta con una estructura de P&L que sirve para los ocho centros actuales y para cualquier apertura futura.",
    relatedService: "multisite-performance-audit",
    levers: ["P&L por centro", "KPIs", "Benchmarking interno", "Capacidad"],
    horizon: "3-4 semanas de diagnóstico",
  },
  {
    slug: "plataforma-private-equity-tercera-adquisicion-playbook",
    sector: "Private Equity",
    title: "Tercera adquisición en dos años: convertir la integración en un proceso repetible",
    context:
      "Plataforma healthcare participada por un fondo, 14 centros tras dos add-ons, tercera operación en due diligence",
    situation:
      "Un fondo ha construido una plataforma healthcare con una compra inicial y dos add-ons. Las dos integraciones anteriores se hicieron a medida, con un esfuerzo considerable del CEO y del CFO, y cada una tardó más de lo previsto. El plan de negocio prevé una adquisición al año. El fondo quiere que la tercera integración se ejecute con un método, con menos dependencia del equipo directivo y con un reporting de sinergias estable para el consejo.",
    problems: [
      "Cada integración anterior se diseñó desde cero; nada quedó documentado.",
      "El CEO y el CFO dedican meses a cada add-on en detrimento de la operación de la plataforma.",
      "Los centros ya integrados conservan diferencias en reporting, catálogo y procesos clave.",
      "El consejo recibe la información de sinergias de forma irregular y sin un formato estable.",
      "La due diligence operativa del nuevo target se apoya en la intuición del equipo, no en una lista de riesgos contrastada.",
    ],
    intervention: [
      "Revisión de las dos integraciones anteriores: qué funcionó, qué se retrasó y por qué.",
      "Playbook de integración: fases, hitos a 30, 60 y 100 días, responsables, checklist por área y plantillas de comunicación.",
      "Aportación operativa a la due diligence del tercer target: riesgos de personas, sistemas, clientes y calidad del EBITDA.",
      "Modelo de reporting de sinergias para el consejo: identificadas, en curso y conseguidas.",
      "Definición del equipo de integración y de la gobernanza: comité, decisiones y escalado.",
      "Dirección del plan de 100 días de la tercera adquisición aplicando el playbook.",
    ],
    expectedOutcome:
      "La plataforma dispone de un método de integración documentado y probado en la tercera operación, un reporting de sinergias estable para el consejo y un equipo directivo que dedica a cada add-on una parte del tiempo que antes consumía. La cuarta adquisición parte de un playbook, no de una hoja en blanco.",
    relatedService: "integration-100",
    levers: ["Integración", "Gobernanza", "KPIs", "Procesos"],
    horizon: "Preparación previa al cierre y 100 días de integración",
  },
  {
    slug: "grupo-15-centros-medicos-informacion-30-dias-tarde",
    sector: "Healthcare",
    title: "Quince centros y una información que llega cuando ya no sirve para decidir",
    context:
      "Grupo de 15 centros médicos y residenciales, 28 M€ de facturación, dirección general y tres directores de zona",
    situation:
      "El grupo cierra el mes contable alrededor del día 25 del mes siguiente. Cuando la dirección detecta que un centro ha desviado su coste de personal o su ocupación, han pasado cuatro o cinco semanas y el mes siguiente ya está comprometido. Los directores de zona gestionan por incidencias y los directores de centro envían informes en hojas de cálculo con formatos distintos. No existe un indicador operativo semanal: todo se mira en el cierre.",
    problems: [
      "Cierre mensual a 25 días y ningún indicador operativo disponible antes.",
      "Quince plantillas de reporte distintas, consolidadas a mano por el equipo central.",
      "Ocupación, horas de personal y actividad no se revisan hasta el cierre contable.",
      "Los directores de zona reaccionan a problemas de hace un mes.",
      "Las reuniones de dirección se dedican a explicar el pasado, no a decidir el mes siguiente.",
    ],
    intervention: [
      "Separación entre información operativa (semanal) y cierre contable (mensual): dos ritmos y dos herramientas.",
      "Selección de seis a ocho indicadores operativos semanales por centro: ocupación, horas trabajadas, ratio de personal, actividad e incidencias.",
      "Plantilla única de reporte y calendario de entrega: los lunes antes de las 12 h.",
      "Cuadro de mando por centro, zona y grupo con desviaciones frente a presupuesto y frente a la media de la red.",
      "Rutina semanal de dirección: 45 minutos por zona sobre desviaciones y decisiones.",
      "Rediseño del cierre mensual para acercarlo al día 10, con un P&L por centro comparable.",
    ],
    expectedOutcome:
      "La dirección decide con información de la semana pasada, no del mes anterior. Los directores de zona dirigen con un cuadro de mando común y los directores de centro saben qué se les mide y cuándo. El cierre contable deja de ser la única fuente de información y pasa a confirmar lo que ya se vio en las semanas previas.",
    relatedService: "fractional-coo",
    levers: ["KPIs", "P&L por centro", "Gobernanza", "Procesos"],
    horizon: "Primer trimestre de dirección operativa externa",
  },
] as const;

export function getCase(slug: string): Case | undefined {
  return CASES.find((c) => c.slug === slug);
}

export const CASE_SLUGS = CASES.map((c) => c.slug);

/** Ruta pública de la página de casos (con ancla opcional a un caso). */
export function casePath(slug?: string) {
  return slug ? `/casos#${slug}` : "/casos";
}
