import type { FaqItem } from "./types";

/** FAQ global de la home (editable desde /admin/faqs). */
export const GLOBAL_FAQS: FaqItem[] = [
  {
    question: "¿El presupuesto tiene coste o compromiso?",
    answer:
      "No. La primera visita y el presupuesto son gratuitos y sin compromiso. Te entregamos un documento detallado por partidas para que puedas compararlo con calma.",
  },
  {
    question: "¿Trabajáis con particulares y con empresas?",
    answer:
      "Sí. Reformamos viviendas de particulares y también locales, oficinas, gimnasios, restaurantes, clínicas y naves para empresas, franquicias y propietarios.",
  },
  {
    question: "¿Qué zonas cubrís?",
    answer:
      "Principalmente Barcelona y provincia, Igualada y la comarca de l'Anoia. Para otras zonas de Cataluña consúltanos: dependerá del tipo y tamaño del proyecto.",
  },
  {
    question: "¿Quién ejecuta las instalaciones que requieren habilitación?",
    answer:
      "Electricidad, climatización, gas y protección contra incendios las ejecutan y certifican instaladores o empresas habilitados conforme a la normativa vigente. Coordinamos su intervención dentro de la obra y no asumimos trabajos que no se puedan acreditar.",
  },
  {
    question: "¿Gestionáis licencias y permisos?",
    answer:
      "Sí. Tramitamos la comunicación o licencia de obras y, en negocios, la licencia de actividad, con la documentación de un técnico competente cuando el ayuntamiento lo exige.",
  },
  {
    question: "¿Cómo se paga una reforma?",
    answer:
      "Normalmente por certificaciones según el avance de la obra: una cantidad inicial al empezar y pagos parciales al completar cada fase, con un último pago a la entrega. Las condiciones se detallan en el presupuesto.",
  },
  {
    question: "¿Qué garantía tiene la obra?",
    answer:
      "La que establece la Ley de Ordenación de la Edificación para los trabajos de edificación (acabados, instalaciones y estructura según su plazo legal), además de las garantías de los fabricantes de materiales y equipos.",
  },
];
