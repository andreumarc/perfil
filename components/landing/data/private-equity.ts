import type { Advantage } from "@/components/landing/operator-advantage";
import type { Phase } from "@/components/landing/phase-timeline";
import type { Pillar } from "@/components/landing/pillars";
import type { Profile } from "@/components/landing/who-is-it-for";
import type { FaqItem } from "@/components/sections/faq";

/** Contenido de la landing /private-equity. Sin clientes, fondos ni resultados inventados. */

export const PE_PROFILES: readonly Profile[] = [
  {
    role: "Investment Director · Partner",
    situation:
      "Estás evaluando un target multicentro y necesitas saber si el EBITDA es real, replicable y escalable antes de firmar.",
  },
  {
    role: "Operating Partner",
    situation:
      "Tienes una participada con un plan de value creation aprobado y necesitas a alguien que lo ejecute con el equipo, no otro informe.",
  },
  {
    role: "Portfolio Manager",
    situation:
      "Necesitas un reporting operativo homogéneo de las participadas: P&L por centro, KPIs y sinergias, cada mes y con el mismo criterio.",
  },
  {
    role: "CEO de participada",
    situation:
      "Tienes un objetivo de EBITDA comprometido con el fondo y una red de centros que todavía no opera de la misma forma.",
  },
];

export const PE_PILLARS: readonly Pillar[] = [
  {
    title: "Due diligence operativa",
    description:
      "Calidad del EBITDA centro a centro, dependencia de personas clave, capacidad real y riesgos operativos del target. Lo que no sale en el data room y condiciona el múltiplo de salida.",
  },
  {
    title: "Integración post-adquisición",
    description:
      "Organización, reporting, compras, sistemas y procesos del add-on alineados con la plataforma. La empresa adquirida reporta como el grupo desde el primer cierre mensual.",
  },
  {
    title: "Plan 100 días",
    description:
      "Hitos a 30, 60 y 100 días con responsables y comité de seguimiento. Control primero, integración después, captura de valor al final. Nada se rompe; todo se mide.",
  },
  {
    title: "KPIs",
    description:
      "Una sola definición de cada indicador para toda la plataforma: ocupación, productividad, conversión, coste de personal. Dato semanal para gestionar, no cierre trimestral para informar.",
  },
  {
    title: "P&L por centro",
    description:
      "Cuenta de resultados comparable por unidad, con estructura central imputada con el mismo criterio. Ranking de la red y cuartiles para saber exactamente dónde actuar.",
  },
  {
    title: "Mejora de EBITDA",
    description:
      "Palancas de ingresos, margen, personal, compras y capacidad priorizadas por impacto y esfuerzo. Ejecución con el equipo de la participada y medición en el P&L, no en una presentación.",
  },
  {
    title: "Estandarización",
    description:
      "Una única forma de operar en lo que importa: procesos clave, estándares de servicio y datos. Es lo que hace replicable la plataforma para el siguiente add-on.",
  },
  {
    title: "Estructura de management",
    description:
      "Organigrama objetivo, responsables de centro con objetivos y rutinas, servicios centrales dimensionados. La diferencia entre construir una plataforma y acumular centros.",
  },
  {
    title: "Reporting al fondo",
    description:
      "Cuadro de mando mensual para el equipo de inversión: P&L por centro, KPIs, estado de sinergias y riesgos. Visibilidad completa sin tener que operar la participada.",
  },
  {
    title: "Preparación de nuevas adquisiciones",
    description:
      "Playbook de integración documentado, criterios operativos para evaluar targets y una estructura capaz de absorber el siguiente centro sin perder control.",
  },
];

export const PE_PHASES: readonly Phase[] = [
  {
    step: "01",
    period: "Pre-deal",
    title: "Due diligence operativa",
    items: [
      "Calidad del EBITDA por centro y normalización de criterios contables entre unidades",
      "Dependencia de personas clave, rotación y solidez de la estructura de management",
      "Capacidad real (agendas, salas, horas) y potencial de mejora cuantificado para el modelo",
      "Riesgos operativos y plan de integración preliminar antes de la firma",
    ],
  },
  {
    step: "02",
    period: "Días 1-100",
    title: "Integración y control",
    items: [
      "Comunicación del día 1 y retención de los perfiles clave de la empresa adquirida",
      "P&L por centro con criterios del grupo desde el primer cierre mensual",
      "Homologación de compras, precios, sistemas y procesos operativos",
      "Comité de integración quincenal con dirección de la participada y el fondo",
    ],
  },
  {
    step: "03",
    period: "Value creation",
    title: "Mejora de EBITDA y escala",
    items: [
      "Palancas priorizadas por impacto y esfuerzo, cada una con responsable interno",
      "Cuadro de mando semanal y rutinas de dirección con los responsables de centro",
      "Modelo operativo estandarizado y estructura central dimensionada al tamaño de la red",
      "Playbook para absorber los siguientes add-ons sin reinventar el proceso",
    ],
  },
  {
    step: "04",
    period: "Exit readiness",
    title: "Preparación de la salida",
    items: [
      "Historia operativa demostrable: KPIs homogéneos y P&L por centro de varios ejercicios",
      "Modelo operativo documentado y equipo de management que no depende del fundador",
      "Pipeline de mejora identificado y cuantificado para el siguiente propietario",
      "Soporte al equipo en la vendor due diligence operativa",
    ],
  },
];

export const PE_ADVANTAGES: readonly Advantage[] = [
  {
    title: "Decisiones con nombre y apellido, no recomendaciones",
    text:
      "He ajustado plantillas, rediseñado agendas, renegociado compras e integrado centros adquiridos siendo el responsable del resultado. Sé qué medidas funcionan en un centro real y cuáles solo funcionan en una presentación.",
  },
  {
    title: "Un interlocutor senior, de principio a fin",
    text:
      "Trabajo directamente con el equipo de inversión y con el CEO de la participada. Sin equipos de analistas que aprenden el sector en tu participada y rotan a mitad de proyecto.",
  },
  {
    title: "Velocidad compatible con un proceso",
    text:
      "Due diligence operativa en 2-3 semanas, diagnóstico de participada en 3-4 semanas, plan de integración operativo antes del día 1. Alcance y honorarios cerrados antes de empezar.",
  },
  {
    title: "El lenguaje del comité de inversión",
    text:
      "EBITDA, calidad del resultado, sinergias, múltiplo, exit. El reporting está diseñado para que el fondo decida con él, no para archivarlo tras la presentación.",
  },
];

export const PE_FAQS: readonly FaqItem[] = [
  {
    question: "¿Cómo se gestiona la confidencialidad en un proceso de compra o en una participada?",
    answer:
      "Con acuerdo de confidencialidad firmado antes de acceder a cualquier información, trabajo sobre el data room o el entorno que defina el fondo y sin contacto con el target salvo en las sesiones que el equipo de inversión autorice. No se publican nombres de fondos, participadas ni targets: los casos de esta web son ejemplos de intervención, no referencias.",
  },
  {
    question: "¿Con qué velocidad podéis arrancar y entregar?",
    answer:
      "Una due diligence operativa se entrega en 2-3 semanas, en línea con los plazos de un proceso competitivo. Un diagnóstico de participada (Multisite Performance Audit) en 3-4 semanas. Un plan de integración puede estar operativo antes del día 1 si se arranca en las semanas previas al cierre. La disponibilidad se confirma en la primera conversación.",
  },
  {
    question: "¿Cómo se reporta al fondo?",
    answer:
      "Con un cuadro de mando mensual y una reunión de seguimiento con el equipo de inversión u Operating Partner: P&L por centro, KPIs homogéneos, estado de sinergias (identificadas, en curso, conseguidas) y riesgos abiertos. En integraciones, comité quincenal con dirección de la participada y el fondo. El formato se adapta al reporting interno de cada fondo.",
  },
  {
    question: "¿Cómo funcionan los honorarios?",
    answer:
      "Presupuesto cerrado por proyecto para due diligence, audit e integración (orientativamente desde 1.950 € el Multisite Performance Audit y desde 5.000 € el Integration 100) y cuota mensual para la dirección operativa continuada (Fractional COO, desde 3.000 €/mes). Se puede acordar un componente variable ligado a hitos operativos verificables. Sin retainers abiertos ni facturación por horas.",
  },
];
