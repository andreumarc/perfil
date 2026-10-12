import type { FaqItem, FormVariant } from "@/content/types";

/**
 * Calculadoras de captación: estimaciones orientativas por m² y partidas.
 *
 * Los rangos (€/unidad) son valores de mercado orientativos para España y se
 * pueden ajustar desde /admin/ajustes (sección "Calculadoras"). Ninguna cifra
 * es un presupuesto: la calculadora sirve para orientar y para abrir la
 * conversación con un formulario precargado con los datos del cálculo.
 *
 * Este módulo no tiene dependencias de servidor: lo usan la página (servidor)
 * y el componente interactivo (cliente).
 */

export const CALCULATOR_IDS = [
  "reforma-integral",
  "pintura",
  "pladur",
  "bano",
  "cocina",
  "electricidad",
  "climatizacion",
  "suelos",
  "local-comercial",
] as const;

export type CalculatorId = (typeof CALCULATOR_IDS)[number];

export type InputValue = number | string | boolean;
export type Inputs = Record<string, InputValue>;

export interface SelectOption {
  value: string;
  label: string;
}

export interface InputDefinition {
  key: string;
  label: string;
  kind: "number" | "select" | "boolean";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  default: InputValue;
  options?: SelectOption[];
  hint?: string;
  /** Solo se muestra cuando otro campo tiene uno de estos valores. */
  showWhen?: { key: string; values: InputValue[] };
}

/** Tarifa editable: rango min–max en euros por unidad. */
export interface RateDefinition {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
}

export type RateRange = { min: number; max: number };
export type Rates = Record<string, RateRange>;

export interface EstimateLine {
  label: string;
  min: number;
  max: number;
}

export interface Estimate {
  min: number;
  max: number;
  lines: EstimateLine[];
  notes: string[];
}

export interface CalculatorDefinition {
  id: CalculatorId;
  name: string;
  shortName: string;
  headline: string;
  description: string;
  /** Servicio relacionado (para enlazar y preseleccionar en el formulario). */
  serviceSlug: string;
  formVariant: FormVariant;
  inputs: InputDefinition[];
  rates: RateDefinition[];
  compute: (inputs: Inputs, rates: Rates) => Estimate;
  /** Qué incluye y qué no, en lenguaje claro. */
  includes: string[];
  excludes: string[];
  faqs: FaqItem[];
  imagePath?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

/* ------------------------------------------------------------------ */
/* utilidades                                                          */
/* ------------------------------------------------------------------ */

export const QUALITY_OPTIONS: SelectOption[] = [
  { value: "basica", label: "Básica: materiales funcionales de gama media-baja" },
  { value: "media", label: "Media: marcas reconocidas, buena relación calidad-precio" },
  { value: "alta", label: "Alta: materiales de diseño y acabados premium" },
];

export const QUALITY_FACTORS: Record<string, number> = { basica: 0.85, media: 1, alta: 1.3 };

export const IVA_NOTE = "Precios orientativos sin IVA (10 % en reformas de vivienda que cumplan los requisitos legales; 21 % en el resto).";
export const ESTIMATE_NOTE = "La estimación se basa en rangos de mercado orientativos. El presupuesto real depende del estado del inmueble, los accesos, los materiales elegidos y la ciudad.";

/** Superficie a pintar (paredes + techos) por m² útil de vivienda, regla habitual. */
export const PAINT_SURFACE_FACTOR = 2.6;
/** Metros lineales de rodapié por m² de suelo, regla habitual para viviendas. */
export const SKIRTING_FACTOR = 0.85;

export function num(inputs: Inputs, key: string, fallback = 0): number {
  const v = inputs[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return fallback;
}

export function str(inputs: Inputs, key: string, fallback = ""): string {
  const v = inputs[key];
  return typeof v === "string" ? v : fallback;
}

export function bool(inputs: Inputs, key: string): boolean {
  return inputs[key] === true;
}

export function quality(inputs: Inputs): number {
  return QUALITY_FACTORS[str(inputs, "quality", "media")] ?? 1;
}

export function round50(n: number): number {
  return Math.max(0, Math.round(n / 50) * 50);
}

function line(label: string, qty: number, rate: RateRange | undefined, factor = 1): EstimateLine | null {
  if (!rate || qty <= 0) return null;
  return { label, min: round50(qty * rate.min * factor), max: round50(qty * rate.max * factor) };
}

function fixed(label: string, rate: RateRange | undefined, factor = 1): EstimateLine | null {
  return line(label, 1, rate, factor);
}

function total(lines: (EstimateLine | null)[], notes: string[]): Estimate {
  const valid = lines.filter((l): l is EstimateLine => Boolean(l));
  return {
    min: valid.reduce((acc, l) => acc + l.min, 0),
    max: valid.reduce((acc, l) => acc + l.max, 0),
    lines: valid,
    notes,
  };
}

const m2Input = (label: string, def: number, hint?: string): InputDefinition => ({
  key: "m2",
  label,
  kind: "number",
  unit: "m²",
  min: 1,
  max: 5000,
  step: 1,
  default: def,
  hint,
});

const qualityInput: InputDefinition = { key: "quality", label: "Nivel de acabados", kind: "select", default: "media", options: QUALITY_OPTIONS };

/* ------------------------------------------------------------------ */
/* definiciones                                                        */
/* ------------------------------------------------------------------ */

const IMG = (name: string) => `/images/ilustrativas/${name}.webp`;

export const CALCULATORS: CalculatorDefinition[] = [
  {
    id: "reforma-integral",
    name: "Calculadora de reforma integral por m²",
    shortName: "Reforma integral",
    headline: "¿Cuánto cuesta reformar tu piso o casa? Calcula un rango orientativo en un minuto",
    description:
      "Introduce los metros cuadrados, el nivel de acabados y qué quieres renovar. Obtendrás un rango orientativo por partidas: obra general, instalaciones, baños y cocina.",
    serviceSlug: "reformas-integrales-viviendas",
    formVariant: "vivienda",
    imagePath: IMG("reformas-integrales-viviendas"),
    inputs: [
      m2Input("Superficie útil de la vivienda", 80, "La superficie útil suele ser un 10-15 % menor que la construida."),
      qualityInput,
      { key: "bathrooms", label: "Baños a reformar", kind: "number", min: 0, max: 6, step: 1, default: 1 },
      { key: "kitchen", label: "Reformar la cocina (obra y mobiliario)", kind: "boolean", default: true },
      { key: "installations", label: "Renovar instalaciones completas (electricidad y fontanería)", kind: "boolean", default: true },
    ],
    rates: [
      { key: "base_m2", label: "Obra general por m² (demoliciones, tabiquería, pavimentos, carpintería, pintura)", unit: "€/m²", min: 450, max: 750 },
      { key: "install_m2", label: "Instalaciones eléctrica y de fontanería por m²", unit: "€/m²", min: 90, max: 150 },
      { key: "bathroom", label: "Baño completo (obra, sanitarios y grifería)", unit: "€/ud", min: 5000, max: 9000 },
      { key: "kitchen", label: "Cocina completa (obra y mobiliario)", unit: "€/ud", min: 4000, max: 7500 },
    ],
    compute(inputs, rates) {
      const m2 = num(inputs, "m2", 0);
      const q = quality(inputs);
      return total(
        [
          line("Obra general y acabados", m2, rates.base_m2, q),
          bool(inputs, "installations") ? line("Instalaciones eléctrica y de fontanería", m2, rates.install_m2) : null,
          line("Baños completos", num(inputs, "bathrooms", 0), rates.bathroom, q),
          bool(inputs, "kitchen") ? fixed("Cocina completa", rates.kitchen, q) : null,
        ],
        [ESTIMATE_NOTE, "No incluye licencia de obras, tasas municipales, proyecto técnico ni mobiliario no fijo.", IVA_NOTE],
      );
    },
    includes: ["Demoliciones y retirada de escombros", "Tabiquería, pavimentos y revestimientos", "Carpintería interior y pintura", "Instalaciones y baños/cocina si los marcas"],
    excludes: ["Licencia de obras y tasas municipales", "Proyecto y dirección técnica cuando la obra lo exige", "Mobiliario, electrodomésticos y decoración", "Fachadas, cubiertas y elementos comunes"],
    faqs: [
      { question: "¿Por qué el rango es tan amplio?", answer: "Una reforma integral depende del estado del inmueble, de cuántas instalaciones se renuevan y de los materiales. El rango bajo corresponde a acabados básicos y pocas modificaciones de distribución; el alto, a cambios de distribución, instalaciones completas y acabados de gama alta." },
      { question: "¿El precio por m² incluye baños y cocina?", answer: "No. Baños y cocina se calculan aparte porque concentran la mayor parte de las instalaciones y de los materiales. Por eso la calculadora los pide como partidas independientes." },
      { question: "¿Cómo paso de la estimación a un presupuesto real?", answer: "Pide presupuesto con los datos del cálculo: visitamos el inmueble, medimos y preparamos un presupuesto cerrado por partidas." },
    ],
    metaTitle: "Calculadora de reforma integral: precio por m² orientativo",
    metaDescription: "Calcula cuánto cuesta reformar tu piso o casa por m²: obra general, instalaciones, baños y cocina. Rango orientativo al instante y presupuesto sin compromiso.",
    keywords: ["calculadora reforma integral", "precio reforma integral m2", "cuánto cuesta reformar un piso"],
  },

  {
    id: "pintura",
    name: "Calculadora de pintura por m²",
    shortName: "Pintura",
    headline: "Calcula cuánto cuesta pintar tu piso o local por metro cuadrado",
    description:
      "Indica la superficie útil y el estado de las paredes. La calculadora estima la superficie real a pintar (paredes y techos) y el coste de pintura plástica, alisado de gotelé, pintura lavable y lacado de puertas.",
    serviceSlug: "pintura-revestimientos",
    formVariant: "vivienda",
    imagePath: IMG("pintura-revestimientos"),
    inputs: [
      m2Input("Superficie útil a pintar", 80, "Se estima la superficie de paredes y techos multiplicando por 2,6."),
      {
        key: "state",
        label: "Estado de las paredes",
        kind: "select",
        default: "buen_estado",
        options: [
          { value: "buen_estado", label: "Lisas y en buen estado: solo pintar" },
          { value: "alisar", label: "Con gotelé o desperfectos: alisar y pintar" },
        ],
      },
      { key: "washable", label: "Pintura lavable o antimoho en cocina y baños", kind: "boolean", default: false },
      { key: "doors", label: "Puertas a lacar", kind: "number", min: 0, max: 40, step: 1, default: 0 },
    ],
    rates: [
      { key: "paint_m2", label: "Pintura plástica, dos manos, sobre superficie lisa", unit: "€/m²", min: 7, max: 11 },
      { key: "smooth_m2", label: "Alisar gotelé o reparar y pintar", unit: "€/m²", min: 12, max: 20 },
      { key: "washable_extra", label: "Suplemento pintura lavable o antimoho", unit: "€/m²", min: 2, max: 4 },
      { key: "door", label: "Lacado de puerta (dos caras y marco)", unit: "€/ud", min: 90, max: 160 },
    ],
    compute(inputs, rates) {
      const surface = Math.round(num(inputs, "m2", 0) * PAINT_SURFACE_FACTOR);
      const smooth = str(inputs, "state") === "alisar";
      return total(
        [
          line(smooth ? "Alisar y pintar paredes y techos" : "Pintar paredes y techos", surface, smooth ? rates.smooth_m2 : rates.paint_m2),
          bool(inputs, "washable") ? line("Suplemento pintura lavable", Math.round(surface * 0.25), rates.washable_extra) : null,
          line("Lacado de puertas", num(inputs, "doors", 0), rates.door),
        ],
        [`Superficie estimada de paredes y techos: ${surface} m² (${PAINT_SURFACE_FACTOR} × superficie útil).`, "Incluye protección de mobiliario y suelos y pequeñas reparaciones. No incluye vaciar la vivienda.", IVA_NOTE],
      );
    },
    includes: ["Protección de suelos y mobiliario", "Pequeñas reparaciones y masillado", "Dos manos de pintura plástica de calidad"],
    excludes: ["Retirada de papel pintado o revestimientos", "Pintura de fachadas o exteriores", "Vaciado y mudanza del mobiliario"],
    faqs: [
      { question: "¿Cómo se calcula la superficie a pintar?", answer: "Se multiplica la superficie útil por 2,6, que es la proporción habitual entre paredes más techos y suelo en una vivienda. En locales diáfanos con techos altos la proporción puede ser distinta: lo ajustamos en la visita." },
      { question: "¿Cuánto más cuesta quitar el gotelé?", answer: "Alisar el gotelé con pasta y lijado suele multiplicar por 1,5-2 el precio de solo pintar, porque exige varias capas y más horas de trabajo. Se incluye en la opción 'alisar y pintar'." },
      { question: "¿Pintáis también locales y oficinas?", answer: "Sí. Para locales con techos altos o grandes superficies el precio por m² suele bajar; pide presupuesto con los metros reales." },
    ],
    metaTitle: "Calculadora de pintura: precio por m² de pintar un piso",
    metaDescription: "Calcula el precio de pintar un piso o local por m²: pintura plástica, alisar gotelé, pintura lavable y lacado de puertas. Estimación al instante.",
    keywords: ["precio pintar piso m2", "calculadora pintura", "cuánto cuesta pintar un piso", "quitar gotelé precio"],
  },

  {
    id: "pladur",
    name: "Calculadora de pladur",
    shortName: "Pladur",
    headline: "Calcula el precio de tabiques, trasdosados y falsos techos de pladur",
    description:
      "Introduce los metros cuadrados de tabique, trasdosado y falso techo. La calculadora estima el coste de la placa de yeso laminado con estructura, aislamiento y acabado pintado.",
    serviceSlug: "pladur-albanileria",
    formVariant: "vivienda",
    imagePath: IMG("pladur-albanileria"),
    inputs: [
      { key: "partition", label: "Tabiques de pladur (doble placa y estructura)", kind: "number", unit: "m²", min: 0, max: 2000, step: 1, default: 20, hint: "Alto × largo de cada tabique nuevo." },
      { key: "lining", label: "Trasdosados sobre pared existente", kind: "number", unit: "m²", min: 0, max: 2000, step: 1, default: 0 },
      { key: "ceiling", label: "Falso techo continuo", kind: "number", unit: "m²", min: 0, max: 2000, step: 1, default: 0 },
      { key: "insulation", label: "Aislamiento de lana mineral en tabiques y trasdosados", kind: "boolean", default: true },
      { key: "paint", label: "Acabado pintado incluido", kind: "boolean", default: true },
    ],
    rates: [
      { key: "partition", label: "Tabique de pladur con estructura y doble placa", unit: "€/m²", min: 38, max: 55 },
      { key: "lining", label: "Trasdosado directo o autoportante", unit: "€/m²", min: 28, max: 42 },
      { key: "ceiling", label: "Falso techo continuo de pladur", unit: "€/m²", min: 30, max: 45 },
      { key: "insulation", label: "Aislamiento de lana mineral", unit: "€/m²", min: 5, max: 9 },
      { key: "paint", label: "Pintura sobre pladur (dos manos)", unit: "€/m²", min: 7, max: 11 },
    ],
    compute(inputs, rates) {
      const partition = num(inputs, "partition", 0);
      const lining = num(inputs, "lining", 0);
      const ceiling = num(inputs, "ceiling", 0);
      const paintSurface = partition * 2 + lining + ceiling;
      return total(
        [
          line("Tabiques de pladur", partition, rates.partition),
          line("Trasdosados", lining, rates.lining),
          line("Falso techo", ceiling, rates.ceiling),
          bool(inputs, "insulation") ? line("Aislamiento de lana mineral", partition + lining, rates.insulation) : null,
          bool(inputs, "paint") ? line("Pintura (tabiques por ambas caras)", paintSurface, rates.paint) : null,
        ],
        ["Incluye estructura metálica, placas estándar, tornillería, encintado y pasta de juntas.", "Placas hidrófugas (baños), ignífugas o de alta dureza tienen un suplemento que concretamos en el presupuesto.", IVA_NOTE],
      );
    },
    includes: ["Estructura de perfiles galvanizados", "Placa de yeso laminado estándar", "Encintado, pasta de juntas y lijado"],
    excludes: ["Instalaciones empotradas (cajas, tubos)", "Puertas y premarcos", "Placas especiales si no se indican"],
    faqs: [
      { question: "¿Pladur o ladrillo?", answer: "El pladur es más rápido y limpio, admite aislamiento en su interior y pesa menos. El ladrillo es más resistente a golpes y cargas colgadas. En reformas de pisos el pladur es la opción habitual para tabiques y trasdosados." },
      { question: "¿Qué grosor de tabique se calcula?", answer: "Un tabique estándar de 46 mm de estructura con placa de 15 mm a cada cara (unos 76 mm en total). Para colgar muebles pesados o aislar más, se usan estructuras de 70 mm o doble placa por cara." },
      { question: "¿Se puede poner pladur en baños?", answer: "Sí, con placa hidrófuga (verde) y, en zonas de ducha, con placa de cemento o impermeabilización. Tiene un pequeño suplemento sobre la placa estándar." },
    ],
    metaTitle: "Calculadora de pladur: precio por m² de tabiques, trasdosados y techos",
    metaDescription: "Calcula el precio del pladur por m²: tabiques, trasdosados, falsos techos, aislamiento y pintura. Estimación orientativa al instante.",
    keywords: ["precio pladur m2", "calculadora pladur", "tabique pladur precio", "falso techo pladur precio"],
  },

  {
    id: "bano",
    name: "Calculadora de reforma de baño",
    shortName: "Baño",
    headline: "¿Cuánto cuesta reformar un baño completo? Calcula un rango por partidas",
    description:
      "Indica los metros cuadrados, el nivel de acabados y qué quieres cambiar: plato de ducha, sanitarios, instalaciones o accesibilidad. Obtendrás un rango orientativo por partidas.",
    serviceSlug: "reformas-banos",
    formVariant: "vivienda",
    imagePath: IMG("reformas-banos"),
    inputs: [
      m2Input("Superficie del baño", 5, "Un baño estándar mide entre 4 y 6 m²."),
      qualityInput,
      { key: "shower", label: "Cambiar bañera por plato de ducha con mampara", kind: "boolean", default: true },
      { key: "sanitary", label: "Renovar sanitarios, mueble y grifería", kind: "boolean", default: true },
      { key: "plumbing", label: "Renovar instalación de fontanería y electricidad del baño", kind: "boolean", default: true },
      { key: "accessible", label: "Baño accesible (ducha a ras de suelo, barras, puerta ancha)", kind: "boolean", default: false },
    ],
    rates: [
      { key: "base", label: "Obra de baño hasta 5 m² (demolición, alicatado y solado, mano de obra)", unit: "€/ud", min: 2800, max: 4200 },
      { key: "extra_m2", label: "Cada m² adicional a partir de 5 m²", unit: "€/m²", min: 350, max: 550 },
      { key: "sanitary", label: "Sanitarios, mueble con lavabo y grifería", unit: "€/ud", min: 1500, max: 3500 },
      { key: "shower", label: "Plato de ducha y mampara (incluye cambio de bañera)", unit: "€/ud", min: 700, max: 1500 },
      { key: "plumbing", label: "Instalación de fontanería y electricidad del baño", unit: "€/ud", min: 800, max: 1400 },
      { key: "accessible", label: "Adaptación de accesibilidad", unit: "€/ud", min: 500, max: 1200 },
    ],
    compute(inputs, rates) {
      const m2 = num(inputs, "m2", 0);
      const q = quality(inputs);
      return total(
        [
          fixed("Obra: demolición, alicatado y solado", rates.base, q),
          line("Superficie adicional", Math.max(0, m2 - 5), rates.extra_m2, q),
          bool(inputs, "shower") ? fixed("Plato de ducha y mampara", rates.shower, q) : null,
          bool(inputs, "sanitary") ? fixed("Sanitarios, mueble y grifería", rates.sanitary, q) : null,
          bool(inputs, "plumbing") ? fixed("Fontanería y electricidad del baño", rates.plumbing) : null,
          bool(inputs, "accessible") ? fixed("Accesibilidad", rates.accessible) : null,
        ],
        [ESTIMATE_NOTE, "Incluye retirada de escombros y limpieza final. No incluye mamparas a medida especiales ni grifería empotrada de diseño.", IVA_NOTE],
      );
    },
    includes: ["Demolición y retirada de escombros", "Alicatado y solado con material de gama elegida", "Instalación de sanitarios y grifería", "Limpieza final"],
    excludes: ["Licencia o comunicación de obras si procede", "Calentador o termo si hay que sustituirlo", "Ventilación forzada nueva en baños sin ventana"],
    faqs: [
      { question: "¿Cuánto se tarda en reformar un baño?", answer: "Un baño completo estándar suele tardar entre 10 y 15 días laborables, según el secado de materiales y si se cambian instalaciones." },
      { question: "¿Es mejor ducha que bañera?", answer: "La ducha ahorra espacio, es más accesible y suele ser más barata de mantener. La bañera sigue siendo útil con niños pequeños. En reformas de baño pequeño la ducha es la opción habitual." },
      { question: "¿Hay que cambiar las tuberías?", answer: "Si el baño tiene más de 25-30 años o tuberías de hierro o plomo, conviene renovarlas durante la obra: es el momento en que están accesibles." },
    ],
    metaTitle: "Calculadora de reforma de baño: precio orientativo por partidas",
    metaDescription: "Calcula cuánto cuesta reformar un baño completo: obra, plato de ducha, sanitarios, instalaciones y accesibilidad. Rango orientativo al instante.",
    keywords: ["cuánto cuesta reformar un baño", "calculadora reforma baño", "precio reforma baño completo", "cambiar bañera por ducha precio"],
  },

  {
    id: "cocina",
    name: "Calculadora de reforma de cocina",
    shortName: "Cocina",
    headline: "Calcula cuánto cuesta reformar tu cocina: obra, mobiliario e instalaciones",
    description:
      "Indica los metros cuadrados, los metros lineales de muebles y si quieres abrirla al salón. La calculadora estima obra, mobiliario, electrodomésticos y la apertura del tabique.",
    serviceSlug: "reformas-cocinas",
    formVariant: "vivienda",
    imagePath: IMG("reformas-cocinas"),
    inputs: [
      m2Input("Superficie de la cocina", 10, "Una cocina estándar mide entre 8 y 12 m²."),
      qualityInput,
      { key: "furniture", label: "Metros lineales de mobiliario (muebles bajos y altos)", kind: "number", unit: "ml", min: 0, max: 40, step: 0.5, default: 6, hint: "Suma la longitud de cada frente de muebles." },
      { key: "open", label: "Abrir la cocina al salón (derribo de tabique y refuerzo)", kind: "boolean", default: false },
      { key: "appliances", label: "Incluir electrodomésticos de gama media", kind: "boolean", default: false },
    ],
    rates: [
      { key: "work_m2", label: "Obra de cocina por m² (demolición, alicatado, solado, instalaciones)", unit: "€/m²", min: 350, max: 550 },
      { key: "furniture_ml", label: "Mobiliario con encimera por metro lineal", unit: "€/ml", min: 600, max: 1400 },
      { key: "open", label: "Apertura al salón (derribo, dintel y acabados)", unit: "€/ud", min: 900, max: 2000 },
      { key: "appliances", label: "Pack de electrodomésticos de gama media", unit: "€/ud", min: 2000, max: 4500 },
    ],
    compute(inputs, rates) {
      const q = quality(inputs);
      return total(
        [
          line("Obra e instalaciones de cocina", num(inputs, "m2", 0), rates.work_m2, q),
          line("Mobiliario y encimera", num(inputs, "furniture", 0), rates.furniture_ml, q),
          bool(inputs, "open") ? fixed("Apertura al salón", rates.open) : null,
          bool(inputs, "appliances") ? fixed("Electrodomésticos", rates.appliances, q) : null,
        ],
        [ESTIMATE_NOTE, "Si se abre al salón conviene comprobar que el tabique no es de carga: lo verificamos en la visita.", IVA_NOTE],
      );
    },
    includes: ["Demolición y retirada de escombros", "Alicatado, solado y pintura", "Puntos de agua, desagües y electricidad de cocina", "Montaje del mobiliario"],
    excludes: ["Modificación de la instalación de gas (solo instalador habilitado)", "Campanas con salida de humos nueva por fachada", "Electrodomésticos si no se marcan"],
    faqs: [
      { question: "¿Cómo mido los metros lineales de muebles?", answer: "Suma la longitud de cada tramo de muebles bajos. Si hay muebles altos sobre todo el frente, cuenta el mismo tramo una sola vez: la tarifa por metro lineal ya incluye bajos, altos y encimera." },
      { question: "¿Puedo mantener el suelo?", answer: "Sí, si está en buen estado y no cambia la distribución. En ese caso la partida de obra baja; lo ajustamos en el presupuesto." },
      { question: "¿Cuánto tarda una reforma de cocina?", answer: "Entre 3 y 5 semanas desde el inicio de la obra hasta el montaje del mobiliario, más el plazo de fabricación de los muebles." },
    ],
    metaTitle: "Calculadora de reforma de cocina: precio orientativo",
    metaDescription: "Calcula el precio de reformar tu cocina: obra por m², mobiliario por metro lineal, apertura al salón y electrodomésticos. Rango orientativo al instante.",
    keywords: ["cuánto cuesta reformar una cocina", "calculadora reforma cocina", "precio reforma cocina", "cocina abierta al salón precio"],
  },

  {
    id: "electricidad",
    name: "Calculadora de instalación eléctrica",
    shortName: "Electricidad",
    headline: "Calcula el precio de renovar la instalación eléctrica de tu vivienda o local",
    description:
      "Indica los metros cuadrados y los puntos de luz y enchufes. La calculadora estima cableado, mecanismos, cuadro eléctrico y certificado de instalación (boletín).",
    serviceSlug: "instalaciones-electricas",
    formVariant: "instalaciones",
    imagePath: IMG("instalaciones-electricas"),
    inputs: [
      m2Input("Superficie de la vivienda o local", 80),
      { key: "points", label: "Puntos de luz, enchufes e interruptores", kind: "number", unit: "ud", min: 0, max: 500, step: 1, default: 40, hint: "Una vivienda de 80 m² suele tener entre 35 y 50 puntos." },
      { key: "panel", label: "Cuadro eléctrico nuevo con protecciones", kind: "boolean", default: true },
      { key: "certificate", label: "Certificado de instalación (boletín) y legalización", kind: "boolean", default: true },
      { key: "three_phase", label: "Instalación trifásica (locales y naves)", kind: "boolean", default: false },
    ],
    rates: [
      { key: "point", label: "Punto de luz, enchufe o interruptor (mecanismo incluido)", unit: "€/ud", min: 45, max: 75 },
      { key: "wiring_m2", label: "Canalizaciones y cableado por m²", unit: "€/m²", min: 12, max: 22 },
      { key: "panel", label: "Cuadro eléctrico con protecciones", unit: "€/ud", min: 450, max: 900 },
      { key: "certificate", label: "Certificado de instalación y tramitación", unit: "€/ud", min: 150, max: 350 },
      { key: "three_phase", label: "Suplemento instalación trifásica", unit: "€/ud", min: 400, max: 1200 },
    ],
    compute(inputs, rates) {
      return total(
        [
          line("Canalizaciones y cableado", num(inputs, "m2", 0), rates.wiring_m2),
          line("Puntos de luz y mecanismos", num(inputs, "points", 0), rates.point),
          bool(inputs, "panel") ? fixed("Cuadro eléctrico", rates.panel) : null,
          bool(inputs, "three_phase") ? fixed("Instalación trifásica", rates.three_phase) : null,
          bool(inputs, "certificate") ? fixed("Certificado y legalización", rates.certificate) : null,
        ],
        ["Instalación ejecutada por instalador habilitado conforme al Reglamento Electrotécnico de Baja Tensión.", "No incluye rozas y reposición de yeso en instalaciones empotradas en paredes de ladrillo (se presupuestan con la obra), ni luminarias.", IVA_NOTE],
      );
    },
    includes: ["Cableado nuevo con secciones reglamentarias", "Mecanismos de gama media", "Cuadro con diferenciales y magnetotérmicos", "Boletín y legalización si se marca"],
    excludes: ["Luminarias y domótica", "Rozas y tapado en paredes de obra", "Ampliación de potencia con la distribuidora (tasas)"],
    faqs: [
      { question: "¿Cuándo hace falta renovar toda la instalación?", answer: "Si la vivienda tiene más de 25-30 años, no tiene toma de tierra, el cableado es de aluminio o de secciones pequeñas, o el cuadro no tiene diferencial. Durante una reforma integral es el momento de hacerlo." },
      { question: "¿Qué es el boletín eléctrico?", answer: "Es el certificado de instalación que emite el instalador habilitado y que registra la instalación ante la administración. Hace falta para dar de alta o ampliar la potencia." },
      { question: "¿Cuánta potencia necesito?", answer: "Una vivienda con cocina eléctrica y aire acondicionado suele necesitar entre 5,75 y 9,2 kW. Lo calculamos en función de los equipos previstos." },
    ],
    metaTitle: "Calculadora de instalación eléctrica: precio orientativo",
    metaDescription: "Calcula el precio de renovar la instalación eléctrica de una vivienda o local: cableado, puntos de luz, cuadro y boletín. Estimación orientativa al instante.",
    keywords: ["precio instalación eléctrica vivienda", "calculadora instalación eléctrica", "renovar instalación eléctrica precio", "boletín eléctrico precio"],
  },

  {
    id: "climatizacion",
    name: "Calculadora de climatización",
    shortName: "Climatización",
    headline: "Calcula el precio de instalar aire acondicionado: split, multisplit, conductos o cassette",
    description:
      "Elige el tipo de sistema y las unidades o los metros cuadrados. La calculadora estima el coste de equipos e instalación con puesta en marcha.",
    serviceSlug: "climatizacion-aire-acondicionado",
    formVariant: "instalaciones",
    imagePath: IMG("climatizacion-aire-acondicionado"),
    inputs: [
      {
        key: "system",
        label: "Tipo de sistema",
        kind: "select",
        default: "split",
        options: [
          { value: "split", label: "Split de pared (una unidad interior por exterior)" },
          { value: "multisplit", label: "Multisplit (varias unidades interiores, una exterior)" },
          { value: "conductos", label: "Conductos con rejillas (vivienda o local)" },
          { value: "cassette", label: "Cassette de techo (locales y oficinas)" },
        ],
      },
      { key: "units", label: "Unidades interiores", kind: "number", unit: "ud", min: 1, max: 20, step: 1, default: 1, showWhen: { key: "system", values: ["split", "multisplit", "cassette"] } },
      m2Input("Superficie a climatizar", 80),
    ],
    rates: [
      { key: "split", label: "Split de pared instalado (equipo de gama media)", unit: "€/ud", min: 900, max: 1600 },
      { key: "multisplit", label: "Unidad interior de multisplit instalada (incluye parte de la exterior)", unit: "€/ud", min: 1200, max: 2000 },
      { key: "ducts_m2", label: "Sistema por conductos por m² climatizado", unit: "€/m²", min: 55, max: 95 },
      { key: "cassette", label: "Cassette de techo instalado", unit: "€/ud", min: 2200, max: 3800 },
    ],
    compute(inputs, rates) {
      const system = str(inputs, "system", "split");
      const units = num(inputs, "units", 1);
      const m2 = num(inputs, "m2", 0);
      const lines: (EstimateLine | null)[] = [];
      if (system === "split") lines.push(line("Splits de pared instalados", units, rates.split));
      if (system === "multisplit") lines.push(line("Multisplit: unidades interiores instaladas", units, rates.multisplit));
      if (system === "conductos") lines.push(line("Sistema por conductos instalado", m2, rates.ducts_m2));
      if (system === "cassette") lines.push(line("Cassettes de techo instalados", units, rates.cassette));
      return total(lines, [
        "Incluye equipo, hasta 3-5 m de tubería frigorífica, soportes, desagüe y puesta en marcha.",
        "Los conductos requieren falso techo: si no existe, se presupuesta aparte. En locales puede ser necesario un cálculo de cargas térmicas y ventilación conforme al RITE.",
        IVA_NOTE,
      ]);
    },
    includes: ["Equipos de marcas reconocidas", "Tubería frigorífica y desagüe estándar", "Puesta en marcha y comprobación", "Registro de la instalación cuando procede"],
    excludes: ["Falso techo para conductos", "Línea eléctrica dedicada si el cuadro no la admite", "Ventilación y renovación de aire en locales"],
    faqs: [
      { question: "¿Split o conductos?", answer: "El split es más barato y rápido de instalar. Los conductos reparten el aire por toda la vivienda sin aparatos a la vista, pero necesitan falso techo. Para locales y oficinas suele compensar conductos o cassettes." },
      { question: "¿Qué potencia necesito?", answer: "Como orientación, 100-130 W por m² en vivienda bien aislada. En locales con escaparates o mucho público puede ser bastante más: lo calculamos con una carga térmica." },
      { question: "¿Instaláis aerotermia?", answer: "Sí. Si buscas calefacción y agua caliente además de frío, la aerotermia puede ser más eficiente; tiene su propia calculadora en preparación y te orientamos en el presupuesto." },
    ],
    metaTitle: "Calculadora de aire acondicionado: precio de instalación",
    metaDescription: "Calcula el precio de instalar aire acondicionado: split, multisplit, conductos o cassette, con equipo e instalación. Estimación orientativa al instante.",
    keywords: ["precio instalar aire acondicionado", "calculadora aire acondicionado", "aire acondicionado por conductos precio", "multisplit precio instalado"],
  },

  {
    id: "suelos",
    name: "Calculadora de suelos y pavimentos",
    shortName: "Suelos",
    headline: "Calcula el precio de cambiar el suelo: laminado, vinilo, porcelánico, tarima o microcemento",
    description:
      "Indica los metros cuadrados y el material. La calculadora estima suministro y colocación, retirada del suelo actual y rodapié.",
    serviceSlug: "suelos-pavimentos",
    formVariant: "vivienda",
    imagePath: IMG("suelos-pavimentos"),
    inputs: [
      m2Input("Superficie de suelo", 60),
      {
        key: "material",
        label: "Material",
        kind: "select",
        default: "laminado",
        options: [
          { value: "laminado", label: "Laminado AC4/AC5" },
          { value: "vinilo", label: "Vinílico SPC o LVT" },
          { value: "porcelanico", label: "Porcelánico (incluye colocación con mortero)" },
          { value: "tarima", label: "Tarima de madera natural" },
          { value: "microcemento", label: "Microcemento continuo" },
        ],
      },
      { key: "demolition", label: "Retirar el suelo actual (no se puede instalar encima)", kind: "boolean", default: false },
      { key: "skirting", label: "Rodapié nuevo a juego", kind: "boolean", default: true },
    ],
    rates: [
      { key: "laminado", label: "Laminado AC4/AC5 instalado con base aislante", unit: "€/m²", min: 25, max: 45 },
      { key: "vinilo", label: "Vinílico SPC/LVT instalado", unit: "€/m²", min: 30, max: 55 },
      { key: "porcelanico", label: "Porcelánico instalado con mortero y rejuntado", unit: "€/m²", min: 45, max: 90 },
      { key: "tarima", label: "Tarima de madera natural instalada", unit: "€/m²", min: 60, max: 120 },
      { key: "microcemento", label: "Microcemento continuo aplicado", unit: "€/m²", min: 70, max: 120 },
      { key: "demolition", label: "Retirada del pavimento existente y escombros", unit: "€/m²", min: 12, max: 25 },
      { key: "skirting_ml", label: "Rodapié instalado por metro lineal", unit: "€/ml", min: 8, max: 18 },
    ],
    compute(inputs, rates) {
      const m2 = num(inputs, "m2", 0);
      const material = str(inputs, "material", "laminado");
      const labels: Record<string, string> = { laminado: "Suelo laminado", vinilo: "Suelo vinílico", porcelanico: "Suelo porcelánico", tarima: "Tarima de madera", microcemento: "Microcemento" };
      const skirting = Math.round(m2 * SKIRTING_FACTOR);
      return total(
        [
          bool(inputs, "demolition") ? line("Retirada del suelo actual", m2, rates.demolition) : null,
          line(`${labels[material] ?? "Pavimento"} instalado`, m2, rates[material]),
          bool(inputs, "skirting") ? line(`Rodapié (${skirting} ml estimados)`, skirting, rates.skirting_ml) : null,
        ],
        ["Laminado y vinílico pueden instalarse sobre el suelo existente si está nivelado; porcelánico, tarima y microcemento requieren comprobar el soporte.", "No incluye nivelación del soporte con mortero autonivelante ni cepillado de puertas, que se valoran en la visita.", IVA_NOTE],
      );
    },
    includes: ["Suministro del material de gama media", "Base aislante o mortero según el material", "Colocación y remates", "Retirada de restos"],
    excludes: ["Nivelación del soporte", "Cepillado o sustitución de puertas", "Mudanza del mobiliario"],
    faqs: [
      { question: "¿Laminado o vinílico?", answer: "El vinílico (SPC) resiste la humedad y es más silencioso, por lo que vale para cocinas y baños. El laminado es algo más barato y ofrece más variedad de acabados. Ambos se instalan flotantes sin obra." },
      { question: "¿Se puede instalar suelo nuevo sobre el antiguo?", answer: "Laminado y vinílico sí, si el suelo actual está nivelado y bien adherido. Así se evita la demolición y los escombros. El porcelánico puede colocarse sobre terrazo o gres en buen estado con el adhesivo adecuado." },
      { question: "¿Cómo se calcula el rodapié?", answer: "Se estiman 0,85 metros lineales por m² de suelo, una regla habitual en viviendas. En la visita lo medimos con exactitud." },
    ],
    metaTitle: "Calculadora de suelos: precio por m² de cambiar el suelo",
    metaDescription: "Calcula el precio de cambiar el suelo por m²: laminado, vinilo, porcelánico, tarima o microcemento, con retirada y rodapié. Estimación al instante.",
    keywords: ["precio cambiar suelo m2", "calculadora suelos", "suelo laminado precio instalado", "microcemento precio m2"],
  },

  {
    id: "local-comercial",
    name: "Calculadora de reforma de local comercial",
    shortName: "Local comercial",
    headline: "¿Cuánto cuesta reformar un local, oficina, restaurante, gimnasio o clínica? Calcula por m²",
    description:
      "Elige la actividad, el estado del local y los metros cuadrados. La calculadora estima la obra y las instalaciones típicas de cada actividad, más el proyecto y la licencia si los necesitas.",
    serviceSlug: "reformas-locales-comerciales",
    formVariant: "local",
    imagePath: IMG("reformas-locales-comerciales"),
    inputs: [
      m2Input("Superficie del local", 120),
      {
        key: "activity",
        label: "Actividad",
        kind: "select",
        default: "comercio",
        options: [
          { value: "comercio", label: "Tienda o comercio" },
          { value: "oficina", label: "Oficina o despacho" },
          { value: "hosteleria", label: "Restaurante, bar o cafetería" },
          { value: "gimnasio", label: "Gimnasio o centro deportivo" },
          { value: "clinica", label: "Clínica dental o centro médico" },
        ],
      },
      {
        key: "state",
        label: "Estado actual del local",
        kind: "select",
        default: "reformar",
        options: [
          { value: "bruto", label: "En bruto: sin instalaciones ni acabados" },
          { value: "reformar", label: "Acondicionado pero hay que reformarlo" },
          { value: "buen_estado", label: "En buen estado: actualización y cambios puntuales" },
        ],
      },
      { key: "license", label: "Proyecto técnico y licencia de actividad y obras", kind: "boolean", default: true },
    ],
    rates: [
      { key: "comercio", label: "Tienda o comercio, obra e instalaciones", unit: "€/m²", min: 350, max: 650 },
      { key: "oficina", label: "Oficina, obra e instalaciones", unit: "€/m²", min: 300, max: 600 },
      { key: "hosteleria", label: "Hostelería, obra e instalaciones (sin equipamiento de cocina)", unit: "€/m²", min: 700, max: 1200 },
      { key: "gimnasio", label: "Gimnasio, obra e instalaciones (sin máquinas)", unit: "€/m²", min: 450, max: 850 },
      { key: "clinica", label: "Clínica, obra e instalaciones (sin equipamiento clínico)", unit: "€/m²", min: 650, max: 1100 },
      { key: "license", label: "Proyecto técnico y tramitación de licencias", unit: "€/ud", min: 1500, max: 4500 },
    ],
    compute(inputs, rates) {
      const m2 = num(inputs, "m2", 0);
      const activity = str(inputs, "activity", "comercio");
      const factors: Record<string, number> = { bruto: 1.15, reformar: 1, buen_estado: 0.55 };
      const f = factors[str(inputs, "state", "reformar")] ?? 1;
      const labels: Record<string, string> = { comercio: "Tienda o comercio", oficina: "Oficina", hosteleria: "Hostelería", gimnasio: "Gimnasio", clinica: "Clínica" };
      return total(
        [
          line(`Obra e instalaciones: ${labels[activity] ?? "local"}`, m2, rates[activity], f),
          bool(inputs, "license") ? fixed("Proyecto técnico y licencias", rates.license) : null,
        ],
        [
          "El precio por m² incluye distribución, instalaciones eléctrica, climatización e iluminación básicas, aseos y acabados; no incluye equipamiento de la actividad (cocina industrial, máquinas, sillones clínicos, mobiliario).",
          "Las tasas municipales de licencia no están incluidas y varían según el municipio.",
          IVA_NOTE,
        ],
      );
    },
    includes: ["Distribución, tabiquería y acabados", "Instalación eléctrica y de iluminación", "Climatización básica", "Aseos adaptados a la actividad", "Coordinación con el técnico para la licencia (si se marca)"],
    excludes: ["Equipamiento propio de la actividad", "Extracción de humos y gas en hostelería (se valoran aparte)", "Tasas municipales", "Rótulos e imagen corporativa"],
    faqs: [
      { question: "¿Por qué hostelería y clínicas cuestan más por m²?", answer: "Concentran más instalaciones: extracción, ventilación, fontanería, electricidad de mayor potencia, requisitos sanitarios y materiales lavables. Un comercio o una oficina tienen una obra más sencilla por m²." },
      { question: "¿Necesito licencia de actividad y de obras?", answer: "Casi siempre: la licencia o comunicación de actividad para abrir, y la de obras si hay cambios de distribución o instalaciones. El proyecto técnico lo redacta un técnico competente; nosotros coordinamos la obra con él." },
      { question: "¿Cuánto tarda la reforma de un local?", answer: "Entre 4 y 10 semanas de obra según la superficie y las instalaciones, más el plazo de tramitación de licencias, que depende del ayuntamiento." },
    ],
    metaTitle: "Calculadora de reforma de local comercial: precio por m²",
    metaDescription: "Calcula el precio de reformar un local, oficina, restaurante, gimnasio o clínica por m², según el estado del local, con proyecto y licencia. Estimación al instante.",
    keywords: ["precio reforma local comercial m2", "calculadora reforma local", "cuánto cuesta reformar un local", "reforma oficina precio m2"],
  },
];

export function getCalculator(id: string): CalculatorDefinition | undefined {
  return CALCULATORS.find((c) => c.id === id);
}

export function isCalculatorId(id: string): id is CalculatorId {
  return (CALCULATOR_IDS as readonly string[]).includes(id);
}

/** Tarifas por defecto de una calculadora (desde sus definiciones). */
export function defaultRates(def: CalculatorDefinition): Rates {
  return Object.fromEntries(def.rates.map((r) => [r.key, { min: r.min, max: r.max }]));
}

/** Tarifas por defecto de todas las calculadoras, con la forma que guarda `site_settings.calculators.rates`. */
export function allDefaultRates(): Record<string, Rates> {
  return Object.fromEntries(CALCULATORS.map((c) => [c.id, defaultRates(c)]));
}

/** Fusiona tarifas guardadas (parciales) con las de la definición. Descarta rangos invertidos. */
export function resolveRates(def: CalculatorDefinition, stored?: Rates): Rates {
  const base = defaultRates(def);
  if (!stored) return base;
  for (const key of Object.keys(base)) {
    const s = stored[key];
    if (s && Number.isFinite(s.min) && Number.isFinite(s.max) && s.min >= 0 && s.max >= s.min) base[key] = { min: s.min, max: s.max };
  }
  return base;
}

export function defaultInputs(def: CalculatorDefinition): Inputs {
  return Object.fromEntries(def.inputs.map((i) => [i.key, i.default]));
}

/** Sanea entradas del cliente contra la definición (tipos, rangos, opciones). */
export function sanitizeInputs(def: CalculatorDefinition, raw: Inputs): Inputs {
  const out: Inputs = {};
  for (const input of def.inputs) {
    const v = raw[input.key];
    if (input.kind === "number") {
      const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : Number.NaN;
      const min = input.min ?? 0;
      const max = input.max ?? 1_000_000;
      out[input.key] = Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : (input.default as number);
    } else if (input.kind === "select") {
      out[input.key] = input.options?.some((o) => o.value === v) ? (v as string) : (input.default as string);
    } else {
      out[input.key] = v === true;
    }
  }
  return out;
}

/** Resumen legible de las entradas (para el mensaje del lead y el panel). */
export function describeInputs(def: CalculatorDefinition, inputs: Inputs): string {
  return def.inputs
    .filter((i) => !i.showWhen || i.showWhen.values.includes(inputs[i.showWhen.key]))
    .map((i) => {
      const v = inputs[i.key];
      if (i.kind === "boolean") return `${i.label}: ${v === true ? "sí" : "no"}`;
      if (i.kind === "select") return `${i.label}: ${i.options?.find((o) => o.value === v)?.label ?? String(v)}`;
      return `${i.label}: ${String(v)}${i.unit ? ` ${i.unit}` : ""}`;
    })
    .join(" · ");
}
