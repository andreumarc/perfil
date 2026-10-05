import type { ComparisonRow } from "@/components/landing/comparison-table";
import type { Pillar } from "@/components/landing/pillars";
import type { SectorItem } from "@/components/landing/sector-grid";
import type { FaqItem } from "@/components/sections/faq";

/** Contenido de la landing /multisite (empresas multicentro en general). */

export const MULTISITE_SYMPTOMS: readonly Pillar[] = [
  {
    title: "Más centros, el mismo EBITDA",
    description:
      "La facturación crece con cada apertura o adquisición, pero el resultado consolidado no acompaña. Los centros nuevos se comen el margen de los que funcionan.",
  },
  {
    title: "La estructura central crece más rápido que la red",
    description:
      "Cada centro nuevo añade excepciones, coordinadores y reuniones. El coste de soporte por centro sube en lugar de bajar con la escala.",
  },
  {
    title: "Nadie puede comparar los centros",
    description:
      "Cada unidad reporta a su manera, con sus definiciones y su calendario. Consolidar lleva semanas y el dato llega cuando ya no se puede corregir nada.",
  },
  {
    title: "Los managers gestionan incidencias, no indicadores",
    description:
      "Los responsables de centro apagan fuegos y no tienen objetivos, KPIs ni rutina de dirección. El CEO sigue siendo el cuello de botella de la operación.",
  },
  {
    title: "El modelo no se replica",
    description:
      "Abrir o integrar un centro depende de dos o tres personas concretas. No hay playbook, y cada apertura o adquisición empieza de cero.",
  },
];

export const MULTISITE_BEFORE_AFTER: readonly ComparisonRow[] = [
  {
    label: "Información",
    before: "Cierre mensual a los 20 días, con criterios distintos en cada centro.",
    after: "P&L por centro comparable y cuadro de mando semanal con una sola definición por KPI.",
  },
  {
    label: "Comparación entre centros",
    before: "Manual, en una hoja de cálculo que nadie termina de creerse.",
    after: "Ranking y cuartiles de la red: se sabe quién sostiene el margen y quién lo destruye.",
  },
  {
    label: "Decisiones",
    before: "Por intuición, por antigüedad o por quien más insiste en el comité.",
    after: "Por impacto en EBITDA y esfuerzo de implantación, con una lista corta de palancas.",
  },
  {
    label: "Managers de centro",
    before: "Gestionan incidencias y escalan al CEO cualquier decisión relevante.",
    after: "Objetivos, KPIs y una rutina semanal de dirección con su responsable.",
  },
  {
    label: "Procesos",
    before: "Tantas formas de operar como centros y como responsables.",
    after: "Una única forma de operar en lo que importa, documentada y auditada.",
  },
  {
    label: "Expansión",
    before: "Cada apertura o adquisición se improvisa y depende de personas concretas.",
    after: "Playbook de apertura e integración replicable, con hitos y responsables.",
  },
];

export const MULTISITE_SECTORS: readonly SectorItem[] = [
  {
    name: "Gimnasios y fitness",
    description: "Ocupación por franja horaria, socios activos por centro, rotación y coste de personal por hora de apertura.",
  },
  {
    name: "Academias y formación",
    description: "Ocupación de aulas, ratio alumno-profesor, conversión de matrícula y margen por programa y por centro.",
  },
  {
    name: "Ópticas",
    description: "Conversión de examen visual a venta, ticket medio, stock por tienda y productividad por óptico.",
  },
  {
    name: "Audiología",
    description: "Conversión de prueba a adaptación, seguimiento de pacientes, recurrencia y margen por centro.",
  },
  {
    name: "Automoción y concesionarios",
    description: "Productividad de taller, absorción de posventa y margen por centro y por línea de negocio.",
  },
  {
    name: "Talleres y servicios técnicos",
    description: "Horas facturadas sobre horas disponibles, ticket medio por orden y productividad por técnico.",
  },
  {
    name: "Restauración organizada",
    description: "Ventas por hora, coste de personal y de materia prima sobre ventas, por local y por turno.",
  },
  {
    name: "Franquicias",
    description: "Estándares operativos, comparabilidad entre franquiciados y cumplimiento del modelo en toda la red.",
  },
  {
    name: "Retail",
    description: "Ventas por metro cuadrado y por hora, conversión, rotación de stock y plantilla por tienda.",
  },
  {
    name: "Hospitality",
    description: "Ocupación, ingreso por habitación disponible, coste de personal por estancia y estándares por establecimiento.",
  },
];

export const MULTISITE_FAQS: readonly FaqItem[] = [
  {
    question: "¿Para qué tamaño de empresa tiene sentido?",
    answer:
      "Redes de 5 a 100 centros y entre 3 y 50 M€ de facturación. Por debajo, los problemas son los de un solo centro; por encima, suele existir ya una dirección de operaciones consolidada. En ese rango es donde más EBITDA se pierde por falta de comparabilidad y de modelo operativo.",
  },
  {
    question: "¿Hay que estar en healthcare para trabajar contigo?",
    answer:
      "No. El método (P&L por centro, benchmarking interno, palancas priorizadas, managers con rutinas) es el mismo en gimnasios, ópticas, academias, talleres o restauración. He dirigido redes en healthcare, dental, veterinaria y retail; lo que cambia de un sector a otro son los KPIs específicos, no la forma de dirigir la red.",
  },
  {
    question: "¿Qué necesito para empezar?",
    answer:
      "Los cierres contables de los últimos 12-24 meses, una extracción del sistema de gestión (ventas, actividad, agendas) y las plantillas por centro. Con eso se construye el P&L por centro comparable en las primeras semanas. No hace falta implantar ningún sistema antes.",
  },
  {
    question: "¿Cuánto tiempo del equipo directivo requiere?",
    answer:
      "Para un diagnóstico, entre 4 y 6 horas en total. Para un sprint de mejora o una dirección operativa continuada, una reunión semanal de seguimiento con dirección y el trabajo con los responsables de centro, que es donde se ejecuta el cambio. La operación no se interrumpe.",
  },
];
