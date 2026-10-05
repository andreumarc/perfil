import type { Metric } from "@/components/landing/metric-grid";
import type { Pillar } from "@/components/landing/pillars";
import type { SectorItem } from "@/components/landing/sector-grid";
import type { FaqItem } from "@/components/sections/faq";

/** Contenido de la landing /healthcare (grupos de clínicas). Sin clientes ni cifras inventadas. */

export const HEALTHCARE_PROBLEMS: readonly Pillar[] = [
  {
    title: "Agenda y ocupación de gabinetes",
    description:
      "Gabinetes vacíos a media mañana y lista de espera por la tarde. La capacidad existe; lo que falla es cómo se distribuye y quién la gestiona cada semana.",
  },
  {
    title: "Productividad por profesional",
    description:
      "Dos profesionales con la misma agenda facturan cantidades muy distintas y nadie analiza por qué. Sin facturación por hora clínica no hay conversación posible.",
  },
  {
    title: "Coste de personal clínico",
    description:
      "El coste de personal crece más que la facturación y no está claro si es dimensionamiento, turnos, horas no productivas o un problema comercial.",
  },
  {
    title: "Primeras visitas y conversión a tratamiento",
    description:
      "Se invierte en captar primeras visitas y el presupuesto se pierde al presentar el tratamiento. La conversión varía por clínica y por profesional, y casi nunca se mide.",
  },
  {
    title: "Compras de material",
    description:
      "Cada clínica compra a su proveedor, a su precio y cuando le conviene. El grupo no conoce el precio real que paga por un implante, un fármaco o el material fungible.",
  },
  {
    title: "Integración de clínicas adquiridas",
    description:
      "La clínica comprada hace un año sigue con su software, sus precios y su forma de trabajar. Y el fundador que se quedó sigue marcando el ritmo del equipo.",
  },
];

export const HEALTHCARE_METRICS: readonly Metric[] = [
  {
    name: "Ocupación de gabinete",
    unit: "%",
    definition:
      "Horas de gabinete con paciente sobre horas de gabinete disponibles, por clínica, por profesional y por franja horaria.",
    why: "Es la capacidad real de la clínica. Ocupación baja con lista de espera es un problema de agenda, no de demanda.",
  },
  {
    name: "Facturación por profesional y hora",
    unit: "€/h",
    definition:
      "Facturación generada por cada profesional dividida por sus horas clínicas efectivas, con el mismo criterio en toda la red.",
    why: "Permite comparar profesionales y clínicas de forma justa y dimensionar la plantilla clínica con datos, no con percepciones.",
  },
  {
    name: "Conversión de primera visita",
    unit: "%",
    definition:
      "Primeras visitas que aceptan e inician el tratamiento presupuestado, por clínica, por profesional y por tipo de tratamiento.",
    why: "El retorno de la inversión en captación se decide aquí. La dispersión entre clínicas señala dónde falla el proceso de presentación.",
  },
  {
    name: "Ticket medio",
    unit: "€",
    definition:
      "Facturación por paciente activo y por tratamiento, segmentada por especialidad y por clínica.",
    why: "Indica si la cartera de servicios y los planes de tratamiento se presentan y ejecutan de forma homogénea en toda la red.",
  },
  {
    name: "Coste de personal sobre ventas",
    unit: "%",
    definition:
      "Coste total de personal, clínico y no clínico, sobre facturación neta, por clínica y por mes.",
    why: "Es la primera partida del P&L de una clínica. Su dispersión entre centros dice dónde está el problema de dimensionamiento.",
  },
  {
    name: "EBITDA por clínica",
    unit: "€",
    definition:
      "Resultado operativo de cada clínica con la estructura central imputada con el mismo criterio en todas las unidades.",
    why: "La única cifra que permite decidir dónde invertir, qué corregir y qué cerrar. Y la que mira cualquier comprador.",
  },
];

export const HEALTHCARE_SUBSECTORS: readonly SectorItem[] = [
  {
    name: "Dental",
    description:
      "Ocupación de gabinetes, conversión de primera visita y productividad por odontólogo: las tres palancas que separan a las clínicas rentables del resto.",
  },
  {
    name: "Veterinaria",
    description:
      "Agendas de consulta y quirófano, compras de medicamento y productividad por veterinario en redes que crecen por adquisición.",
  },
  {
    name: "Oftalmología",
    description:
      "Capacidad de consultas y quirófanos, conversión de diagnóstico a cirugía y rotación de equipamiento de alto coste.",
  },
  {
    name: "Capilar",
    description:
      "Conversión de valoración a intervención, planificación de quirófanos y coste de equipo por procedimiento.",
  },
  {
    name: "Fisioterapia",
    description:
      "Ocupación de salas y profesionales, recurrencia de pacientes y mix entre tratamiento privado y aseguradoras.",
  },
  {
    name: "Estética",
    description:
      "Conversión de valoración a tratamiento, ticket medio por paciente y amortización de la aparatología por centro.",
  },
  {
    name: "Centros médicos",
    description:
      "Agendas multiespecialidad, productividad por consulta y margen por especialidad y por aseguradora.",
  },
  {
    name: "Residencias",
    description:
      "Ocupación de plazas, ratio de personal por residente y coste de personal por plaza ocupada en grupos con varios centros.",
  },
];

export const HEALTHCARE_FAQS: readonly FaqItem[] = [
  {
    question: "¿Hace falta cambiar el software de gestión para medir todo esto?",
    answer:
      "No. Se trabaja con las extracciones del sistema actual (agendas, facturación, pacientes) y con los cierres contables. Si la información está repartida entre varios programas, parte del trabajo consiste precisamente en normalizarla. La decisión de cambiar de sistema, si llega, se toma después y con datos.",
  },
  {
    question: "¿Trabajas con los equipos clínicos o solo con dirección?",
    answer:
      "Con ambos. Las decisiones se toman con dirección; la ejecución (agendas, protocolo de presentación de tratamientos, dimensionamiento, compras) se trabaja con los responsables de clínica y, cuando aplica, con los directores clínicos. Sin su implicación los cambios no se sostienen más allá del primer mes.",
  },
  {
    question: "¿A partir de cuántas clínicas tiene sentido?",
    answer:
      "A partir de 5 clínicas los problemas de comparabilidad, estandarización y dirección de managers ya pesan en el EBITDA. He dirigido redes de hasta 25 centros y trabajo con grupos de 5 a 100 clínicas, incluidos los que crecen por adquisición y los participados por Private Equity.",
  },
  {
    question: "¿Cómo se respeta la autonomía clínica?",
    answer:
      "El criterio clínico es del profesional. La operación (agenda, capacidad, compras, presentación de presupuestos, datos) es de la empresa. Separar ambas cosas de forma explícita es lo que permite estandarizar sin fricción con los equipos sanitarios y sin interferir en la calidad asistencial.",
  },
];
