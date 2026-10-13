import { SERVICE_BODIES } from "./service-bodies";
import type { ServiceContent, ServiceGroup, ServiceGroupSlug } from "./types";

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    slug: "viviendas",
    name: "Reformas de viviendas",
    shortName: "Viviendas",
    description: "Reformas integrales y parciales de pisos, casas, cocinas, baños, fachadas y comunidades.",
  },
  {
    slug: "negocios",
    name: "Reformas de locales y negocios",
    shortName: "Negocios",
    description: "Locales comerciales, oficinas, gimnasios, restaurantes, hoteles, clínicas y naves industriales.",
  },
  {
    slug: "instalaciones",
    name: "Instalaciones",
    shortName: "Instalaciones",
    description: "Electricidad, fontanería, climatización, aerotermia, ventilación, telecomunicaciones, PCI y oficios.",
  },
  {
    slug: "proyectos",
    name: "Proyecto y dirección técnica",
    shortName: "Proyecto",
    description: "Diseño, distribución, licencias y dirección de obra con profesionales competentes.",
  },
];

const LICENSED_NOTE_GAS =
  "Las instalaciones de gas solo las ejecuta y certifica un instalador habilitado conforme al Reglamento técnico de distribución y utilización de combustibles gaseosos (RD 919/2006). Coordinamos la intervención con un instalador habilitado; si no es posible acreditarlo, no asumimos el trabajo.";
const LICENSED_NOTE_PCI =
  "Las instalaciones de protección contra incendios las diseñan, instalan y mantienen empresas habilitadas conforme al Reglamento de instalaciones de protección contra incendios (RD 513/2017). Trabajamos con empresas habilitadas; sin esa acreditación no se ejecuta ni se certifica la instalación.";
const LICENSED_NOTE_TECNICA =
  "El proyecto y la dirección técnica solo se prestan cuando interviene un técnico competente (arquitecto, arquitecto técnico o ingeniero) colegiado. No se asumen funciones reservadas sin ese profesional.";

/** Procesos tipo reutilizados en varios servicios. */
const PROCESS_REFORMA = [
  { title: "Visita y toma de datos", description: "Visitamos el espacio, medimos y escuchamos qué quieres conseguir y con qué presupuesto." },
  { title: "Propuesta y presupuesto por partidas", description: "Distribución, materiales y presupuesto detallado por partidas con plazos de ejecución." },
  { title: "Licencias y planificación", description: "Tramitamos la licencia o comunicación de obras que corresponda y planificamos la obra por fases." },
  { title: "Ejecución coordinada", description: "Un responsable coordina todos los gremios y te informa del avance cada semana." },
  { title: "Entrega y garantía", description: "Revisión final contigo, documentación de las instalaciones y garantía legal de obra." },
];

const PROCESS_INSTALACION = [
  { title: "Diagnóstico de la instalación", description: "Revisamos el estado actual, la potencia o caudal necesarios y la normativa aplicable." },
  { title: "Propuesta técnica y presupuesto", description: "Solución dimensionada, marcas propuestas y presupuesto cerrado por partidas." },
  { title: "Ejecución y pruebas", description: "Instalación por profesionales cualificados y pruebas de funcionamiento." },
  { title: "Certificación y documentación", description: "Boletines y certificados que exija la normativa, entregados al finalizar." },
];

const PROCESS_NEGOCIO = [
  { title: "Reunión y análisis de la actividad", description: "Entendemos tu negocio, aforo, horarios y requisitos de la actividad." },
  { title: "Anteproyecto y presupuesto", description: "Distribución, instalaciones necesarias y presupuesto por partidas con calendario de obra." },
  { title: "Licencias de obra y actividad", description: "Coordinamos con el técnico competente la documentación para obra y apertura." },
  { title: "Obra por fases", description: "Planificación para minimizar el tiempo de cierre y cumplir la fecha de apertura." },
  { title: "Entrega y puesta en marcha", description: "Pruebas de instalaciones, documentación y acompañamiento en la apertura." },
];

type Partial = Omit<ServiceContent, "body" | "order" | "status" | "process"> & {
  process?: ServiceContent["process"];
  body?: string;
  status?: ServiceContent["status"];
};

const IMG = (name: string) => `/images/ilustrativas/${name}.webp`;

const RAW: Partial[] = [
  /* ---------------------------------------------------------------- */
  /* Viviendas                                                         */
  /* ---------------------------------------------------------------- */
  {
    slug: "reformas-integrales-viviendas",
    groupSlug: "viviendas",
    name: "Reformas integrales de viviendas",
    shortName: "Reformas integrales",
    headline: "Tu vivienda, reformada de principio a fin con un único interlocutor",
    summary:
      "Reforma completa de pisos y casas: demoliciones, nueva distribución, instalaciones, carpinterías, acabados y limpieza final, con presupuesto cerrado por partidas.",
    features: [
      "Nueva distribución y tabiquería",
      "Instalaciones eléctricas, de fontanería y climatización nuevas",
      "Cocina y baños completos",
      "Suelos, carpintería interior y pintura",
      "Gestión de licencias y residuos",
      "Calendario de obra por fases",
    ],
    forWhom: ["Compradores de vivienda de segunda mano", "Propietarios que quieren actualizar una vivienda antigua", "Inversores que preparan una vivienda para alquiler"],
    faqs: [
      { question: "¿Cuánto dura una reforma integral?", answer: "Depende de la superficie y del alcance. Como referencia orientativa, un piso de 80 a 100 m² suele necesitar entre 8 y 14 semanas de obra; el calendario exacto se fija en el presupuesto." },
      { question: "¿Necesito licencia para una reforma integral?", answer: "Casi siempre, sí. En la mayoría de municipios catalanes una reforma que afecta a distribución o instalaciones requiere comunicación previa o licencia de obras. Nos encargamos de la tramitación con el técnico competente." },
      { question: "¿Puedo vivir en casa durante la obra?", answer: "En una reforma integral no es recomendable: hay cortes de suministros, polvo y ruido. Si solo se reforma una parte, planificamos las fases para reducir las molestias." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-integrales-viviendas"),
    keywords: ["reforma integral piso", "reforma integral vivienda", "empresa reformas integrales"],
  },
  {
    slug: "reformas-pisos",
    groupSlug: "viviendas",
    name: "Reformas de pisos",
    shortName: "Pisos",
    headline: "Reformas de pisos con presupuesto cerrado y plazos acordados",
    summary:
      "Reformas parciales o completas de pisos y apartamentos: redistribución, cocinas, baños, instalaciones y acabados, planificadas para reducir molestias a vecinos y comunidad.",
    features: ["Redistribución y apertura de espacios", "Renovación de instalaciones", "Acabados y carpinterías", "Coordinación con la comunidad de vecinos"],
    forWhom: ["Propietarios de pisos antiguos", "Compradores de obra de segunda mano", "Propietarios que alquilan"],
    faqs: [
      { question: "¿Hay que avisar a la comunidad?", answer: "Sí. Comunicamos a la comunidad el inicio de obra, los horarios y la gestión de escombros, y respetamos las normas del edificio sobre horarios y uso del ascensor." },
      { question: "¿Se puede tirar un tabique?", answer: "Los tabiques no estructurales sí; los muros de carga requieren proyecto y cálculo de un técnico competente. Lo comprobamos en la primera visita." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-pisos"),
  },
  {
    slug: "reformas-casas",
    groupSlug: "viviendas",
    name: "Reformas de casas y chalets",
    shortName: "Casas",
    headline: "Reformas de casas unifamiliares, chalets y masías",
    summary:
      "Reformas integrales y ampliaciones de viviendas unifamiliares: estructura, cubiertas, fachadas, instalaciones, eficiencia energética y exteriores.",
    features: ["Cubiertas, fachadas y aislamiento", "Instalaciones completas y aerotermia", "Ampliaciones y cambios de uso", "Exteriores, porches y piscinas (coordinación)"],
    forWhom: ["Propietarios de casas antiguas o masías", "Familias que amplían su vivienda", "Segundas residencias que se actualizan"],
    faqs: [
      { question: "¿Podéis reformar una casa antigua con humedades?", answer: "Sí. Primero diagnosticamos el origen (capilaridad, filtración o condensación) y proponemos la solución adecuada antes de los acabados." },
      { question: "¿Gestionáis la licencia de ampliación?", answer: "Las ampliaciones requieren proyecto y licencia de obra mayor. Coordinamos la redacción con un técnico competente y tramitamos la licencia." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("hero-villa-piscina"),
  },
  {
    slug: "reformas-cocinas",
    groupSlug: "viviendas",
    name: "Reformas de cocinas",
    shortName: "Cocinas",
    headline: "Cocinas funcionales y bien instaladas, de la distribución al último enchufe",
    summary:
      "Reforma completa de cocinas: distribución, instalaciones eléctricas y de agua, alicatados, mobiliario, encimera, electrodomésticos e iluminación.",
    features: ["Distribución y estudio de triángulo de trabajo", "Instalación eléctrica con circuitos independientes", "Fontanería y desagües nuevos", "Mobiliario, encimera y electrodomésticos", "Iluminación y extracción"],
    forWhom: ["Viviendas con cocina de más de 20 años", "Cocinas cerradas que se abren al salón", "Propietarios que buscan más almacenaje"],
    faqs: [
      { question: "¿Cuánto tarda una reforma de cocina?", answer: "Una cocina completa suele requerir de 3 a 5 semanas de obra, más el plazo de fabricación del mobiliario, que puede ser de 4 a 8 semanas según el fabricante." },
      { question: "¿Puedo abrir la cocina al salón?", answer: "Si el tabique no es estructural, sí. Si lo es, hace falta cálculo y proyecto de un técnico. También revisamos la ventilación y la extracción exigidas por la normativa." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-cocinas"),
    keywords: ["reforma cocina", "precio reforma cocina", "reformar cocina"],
  },
  {
    slug: "reformas-banos",
    groupSlug: "viviendas",
    name: "Reformas de baños",
    shortName: "Baños",
    headline: "Baños completos en pocas semanas, con instalaciones nuevas y acabados cuidados",
    summary:
      "Reforma integral de baños: cambio de bañera por ducha, nuevas instalaciones, alicatado, sanitarios, mamparas, mueble, grifería e iluminación.",
    features: ["Cambio de bañera por plato de ducha", "Fontanería y desagües nuevos", "Alicatado y pavimento", "Sanitarios, grifería y mampara", "Ventilación y extracción"],
    forWhom: ["Baños antiguos con instalaciones obsoletas", "Personas mayores que necesitan un baño accesible", "Propietarios que alquilan y quieren revalorizar"],
    faqs: [
      { question: "¿Cuánto tarda una reforma de baño?", answer: "Un baño completo de tamaño medio suele ejecutarse en 2 a 3 semanas, incluyendo el tiempo de secado de materiales." },
      { question: "¿Hacéis baños accesibles?", answer: "Sí: duchas a ras de suelo, asideros, inodoros de altura confortable, espacio de giro y suelos antideslizantes." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-banos"),
    keywords: ["reforma baño", "precio reforma baño completo", "cambiar bañera por ducha"],
  },
  {
    slug: "rehabilitacion-fachadas",
    groupSlug: "viviendas",
    name: "Rehabilitación de fachadas",
    shortName: "Fachadas",
    headline: "Rehabilitación de fachadas: estanqueidad, aislamiento e imagen del edificio",
    summary:
      "Reparación y rehabilitación de fachadas, patios y medianeras: saneado, grietas, revestimientos, aislamiento térmico exterior (SATE) y pintura, con medios auxiliares y seguridad.",
    features: ["Diagnóstico y saneado de grietas y desprendimientos", "Aislamiento térmico por el exterior (SATE)", "Revestimientos, monocapa y pintura", "Andamios, seguridad y ocupación de vía pública"],
    forWhom: ["Comunidades de propietarios con ITE o IEE pendiente", "Edificios con desprendimientos o humedades", "Propietarios de casas que quieren mejorar la eficiencia"],
    faqs: [
      { question: "¿Qué permisos necesita una rehabilitación de fachada?", answer: "Normalmente licencia de obras con proyecto de un técnico competente, además del permiso de ocupación de vía pública para el andamio. Lo tramitamos con el técnico." },
      { question: "¿Hay ayudas para rehabilitar fachadas?", answer: "Existen programas de ayudas públicas a la rehabilitación energética que cambian cada año. Te indicamos cuáles están abiertos y qué documentación exigen, sin garantizar su concesión." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-naves-industriales"),
  },
  {
    slug: "reformas-comunidades",
    groupSlug: "viviendas",
    name: "Reformas en comunidades de propietarios",
    shortName: "Comunidades",
    headline: "Obras en comunidades: zonas comunes, instalaciones y accesibilidad",
    summary:
      "Reformas de portales, escaleras, patios, cubiertas, instalaciones comunitarias y supresión de barreras arquitectónicas, con interlocución con el administrador de fincas.",
    features: ["Portales, escaleras y vestíbulos", "Cubiertas y bajantes", "Instalaciones comunitarias (electricidad, agua, telecomunicaciones)", "Rampas, ascensores (coordinación) y accesibilidad"],
    forWhom: ["Comunidades con zonas comunes deterioradas", "Administradores de fincas que buscan un único contratista", "Edificios que necesitan mejorar la accesibilidad"],
    faqs: [
      { question: "¿Trabajáis con administradores de fincas?", answer: "Sí. Presentamos presupuestos comparables por partidas, asistimos a juntas si se requiere y emitimos certificaciones de obra para los pagos." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("pladur-albanileria"),
  },
  {
    slug: "rehabilitacion-edificios",
    groupSlug: "viviendas",
    name: "Rehabilitación de edificios y viviendas antiguas",
    shortName: "Rehabilitación",
    headline: "Rehabilitación de edificios y viviendas antiguas con criterio técnico",
    summary:
      "Rehabilitación de edificios residenciales y viviendas antiguas: refuerzos, cubiertas, instalaciones completas, eficiencia energética y conservación de elementos originales.",
    features: ["Refuerzo de forjados y estructura (con proyecto técnico)", "Cubiertas, terrazas e impermeabilización", "Instalaciones completas y eficiencia energética", "Conservación de elementos originales"],
    forWhom: ["Propietarios de fincas antiguas", "Inversores que rehabilitan edificios enteros", "Viviendas con patologías estructurales"],
    faqs: [
      { question: "¿La rehabilitación necesita proyecto?", answer: "Si afecta a estructura, fachada o cubierta, sí: proyecto de técnico competente y licencia de obra mayor. Coordinamos ambas cosas." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-naves-industriales"),
  },

  /* ---------------------------------------------------------------- */
  /* Negocios                                                          */
  /* ---------------------------------------------------------------- */
  {
    slug: "reformas-locales-comerciales",
    groupSlug: "negocios",
    name: "Reformas de locales comerciales",
    shortName: "Locales comerciales",
    headline: "Reformas de locales comerciales pensadas para abrir a tiempo",
    summary:
      "Adecuación y reforma de locales comerciales y tiendas: distribución, escaparates, instalaciones, climatización, iluminación, accesibilidad y licencia de actividad.",
    features: ["Distribución, escaparate e imagen de marca", "Instalaciones eléctricas y de climatización", "Iluminación comercial y rótulos (coordinación)", "Accesibilidad y aseos adaptados", "Documentación para licencia de actividad"],
    forWhom: ["Franquicias y cadenas que abren nuevos puntos de venta", "Comercios que renuevan su imagen", "Emprendedores que adecuan su primer local"],
    faqs: [
      { question: "¿Cuánto tarda la reforma de un local?", answer: "Un local de 80 a 150 m² suele necesitar entre 4 y 10 semanas según el estado inicial y las instalaciones. Planificamos para cumplir la fecha de apertura." },
      { question: "¿Os encargáis de la licencia de actividad?", answer: "Coordinamos con el técnico competente la documentación técnica (proyecto o certificado) y tramitamos la licencia o comunicación de actividad ante el ayuntamiento." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-locales-comerciales"),
    process: PROCESS_NEGOCIO,
    keywords: ["reforma local comercial", "precio reforma local comercial", "adecuación de local"],
  },
  {
    slug: "reformas-oficinas",
    groupSlug: "negocios",
    name: "Reformas de oficinas",
    shortName: "Oficinas",
    headline: "Oficinas modernas, flexibles y bien instaladas",
    summary:
      "Reforma de oficinas y espacios de trabajo: mamparas, salas de reuniones, cableado de datos, climatización, iluminación, acústica y acabados, con obra por fases para mantener la actividad.",
    features: ["Distribución flexible y mamparas", "Cableado estructurado y electricidad", "Climatización y ventilación", "Acústica, iluminación y acabados"],
    forWhom: ["Empresas que crecen o reorganizan su espacio", "Propietarios que adecuan oficinas para alquilar", "Despachos profesionales"],
    faqs: [
      { question: "¿Podemos seguir trabajando durante la obra?", answer: "En muchos casos sí, planificando la obra por fases y en horarios compatibles. Lo definimos en el calendario de obra." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("pladur-albanileria"),
    process: PROCESS_NEGOCIO,
  },
  {
    slug: "reformas-gimnasios",
    groupSlug: "negocios",
    name: "Reformas de gimnasios y centros deportivos",
    shortName: "Gimnasios",
    headline: "Gimnasios bien ventilados, resistentes y listos para abrir",
    summary:
      "Reforma y adecuación de gimnasios, boxes y centros deportivos: pavimentos técnicos, vestuarios y duchas, ventilación y climatización, electricidad para maquinaria, acústica y accesibilidad.",
    features: ["Pavimentos deportivos y zonas de peso libre", "Vestuarios, duchas y ACS de alto caudal", "Ventilación, extracción y climatización dimensionadas al aforo", "Electricidad para maquinaria y salas dirigidas", "Aislamiento acústico"],
    forWhom: ["Cadenas de fitness que abren nuevos centros", "Boxes y estudios de entrenamiento", "Clubes deportivos que renuevan vestuarios"],
    faqs: [
      { question: "¿Qué ventilación necesita un gimnasio?", answer: "El Reglamento de Instalaciones Térmicas en los Edificios (RITE) exige una calidad de aire interior según el uso y el aforo. Dimensionamos la renovación de aire con un instalador térmico habilitado." },
      { question: "¿Qué suelo recomendáis para peso libre?", answer: "Caucho de alta densidad en losetas o rollos de 20 a 40 mm, con base nivelada y, en plantas elevadas, aislamiento acústico de impactos." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-gimnasios"),
    process: PROCESS_NEGOCIO,
    keywords: ["reforma gimnasio", "precio reforma gimnasio", "montar un gimnasio"],
  },
  {
    slug: "reformas-restaurantes",
    groupSlug: "negocios",
    name: "Reformas de restaurantes, bares y cafeterías",
    shortName: "Restaurantes",
    headline: "Restaurantes, bares y cafeterías: cocina, sala, extracción y normativa",
    summary:
      "Reforma integral de restaurantes, bares y cafeterías: cocina industrial, extracción de humos, instalaciones de gas y electricidad, cámaras, sala, barra, aseos e insonorización.",
    features: ["Cocina profesional y zona de lavado", "Extracción de humos y aportación de aire", "Electricidad trifásica y gas con instalador habilitado", "Sala, barra, aseos y accesibilidad", "Aislamiento acústico"],
    forWhom: ["Hosteleros que abren un nuevo local", "Grupos de restauración", "Bares y cafeterías que renuevan sala y cocina"],
    faqs: [
      { question: "¿Qué exige la extracción de humos?", answer: "Las cocinas con fuegos necesitan campana, conducto de extracción hasta cubierta (salvo excepciones municipales) y aportación de aire. El diseño depende de la potencia instalada y de la ordenanza municipal." },
      { question: "¿La instalación de gas la hacéis vosotros?", answer: "La ejecuta y certifica un instalador de gas habilitado con el que coordinamos la obra; sin esa acreditación no se realiza." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-restaurantes"),
    process: PROCESS_NEGOCIO,
    keywords: ["reforma restaurante", "reforma bar", "montar un restaurante"],
  },
  {
    slug: "reformas-hoteles",
    groupSlug: "negocios",
    name: "Reformas de hoteles y alojamientos",
    shortName: "Hoteles",
    headline: "Reformas de hoteles y apartamentos turísticos por fases",
    summary:
      "Renovación de habitaciones, baños, zonas comunes e instalaciones de hoteles, hostales y apartamentos turísticos, planificada por plantas para mantener la ocupación.",
    features: ["Habitaciones y baños en serie", "Zonas comunes, recepción y restauración", "Climatización, ACS y PCI (coordinación con empresas habilitadas)", "Obra por plantas con la actividad abierta"],
    forWhom: ["Hoteles independientes y cadenas", "Apartamentos turísticos", "Hostales y pensiones"],
    faqs: [
      { question: "¿Podéis reformar sin cerrar el hotel?", answer: "Sí, planificando por plantas o por bloques de habitaciones, con horarios de trabajo acordados y protección de las zonas en uso." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-restaurantes"),
    process: PROCESS_NEGOCIO,
  },
  {
    slug: "reformas-clinicas",
    groupSlug: "negocios",
    name: "Reformas de clínicas dentales y médicas",
    shortName: "Clínicas",
    headline: "Clínicas dentales y centros médicos: distribución, instalaciones y requisitos sanitarios",
    summary:
      "Reforma y adecuación de clínicas dentales, centros médicos y consultas: gabinetes, zonas de esterilización, instalaciones específicas, climatización, protección radiológica (coordinación) y accesibilidad.",
    features: ["Gabinetes con instalaciones para sillones y equipos", "Zona de esterilización y circuitos limpio/sucio", "Climatización, ventilación y ACS", "Accesibilidad y aseos adaptados", "Coordinación con requisitos de autorización sanitaria"],
    forWhom: ["Dentistas que abren o amplían clínica", "Grupos de clínicas", "Centros médicos y fisioterapia"],
    faqs: [
      { question: "¿Qué requisitos tiene una clínica dental?", answer: "La autorización sanitaria autonómica fija requisitos de superficie, instalaciones y equipamiento. Coordinamos la obra con la documentación que exige el procedimiento de autorización." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-clinicas"),
    process: PROCESS_NEGOCIO,
    keywords: ["reforma clínica dental", "reforma centro médico"],
  },
  {
    slug: "reformas-naves-industriales",
    groupSlug: "negocios",
    name: "Reformas de naves industriales",
    shortName: "Naves industriales",
    headline: "Naves industriales: adecuación, oficinas anexas e instalaciones",
    summary:
      "Adecuación de naves industriales y logísticas: pavimentos, oficinas y vestuarios, instalaciones eléctricas de potencia, iluminación, protección contra incendios (empresa habilitada) y cerramientos.",
    features: ["Pavimentos industriales y soleras", "Oficinas, vestuarios y aseos dentro de la nave", "Electricidad de potencia e iluminación LED", "PCI con empresa habilitada", "Cerramientos, puertas y muelles"],
    forWhom: ["Empresas que trasladan su actividad", "Propietarios que adecuan naves para alquilar", "Operadores logísticos"],
    faqs: [
      { question: "¿Gestionáis la licencia de actividad industrial?", answer: "Coordinamos con el técnico competente el proyecto de actividad y las instalaciones necesarias para la licencia ambiental o comunicación que corresponda." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-naves-industriales"),
    process: PROCESS_NEGOCIO,
  },
  {
    slug: "adecuacion-locales",
    groupSlug: "negocios",
    name: "Adecuación de locales para otros negocios",
    shortName: "Otros negocios",
    headline: "Adecuación de locales para cualquier actividad: academias, peluquerías, talleres, tiendas…",
    summary:
      "Adecuación y cambio de actividad de locales para academias, peluquerías, centros de estética, lavanderías, talleres, coworkings y otros negocios, con la documentación para la licencia de apertura.",
    features: ["Cambio de actividad y distribución", "Instalaciones según la actividad", "Accesibilidad, aseos y evacuación", "Documentación para la licencia de apertura"],
    forWhom: ["Emprendedores que abren su primer negocio", "Negocios que cambian de local", "Propietarios que adaptan un local para alquilar"],
    faqs: [
      { question: "¿Mi local sirve para la actividad que quiero?", answer: "Depende del planeamiento urbanístico y de la ordenanza municipal. Antes de presupuestar, comprobamos la compatibilidad de la actividad con el técnico competente." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("suelos-carpinteria"),
    process: PROCESS_NEGOCIO,
  },

  /* ---------------------------------------------------------------- */
  /* Instalaciones                                                     */
  /* ---------------------------------------------------------------- */
  {
    slug: "instalaciones-electricas",
    groupSlug: "instalaciones",
    name: "Instalaciones eléctricas",
    shortName: "Electricidad",
    headline: "Instalaciones eléctricas nuevas y renovadas con boletín y certificado",
    summary:
      "Instalaciones eléctricas completas o parciales en viviendas, locales y naves: cuadros, circuitos, tomas, iluminación, aumentos de potencia y legalización con boletín (CIE).",
    features: ["Renovación completa de instalaciones antiguas", "Cuadros eléctricos y protecciones", "Aumento de potencia y trifásica", "Iluminación y tomas de uso específico", "Certificado de instalación eléctrica (boletín)"],
    forWhom: ["Viviendas con instalaciones anteriores al REBT de 2002", "Locales que necesitan más potencia", "Obras nuevas y reformas integrales"],
    faqs: [
      { question: "¿Cuándo hay que renovar la instalación eléctrica?", answer: "Si la vivienda tiene cableado antiguo sin toma de tierra, un cuadro sin diferencial o no admite la potencia que necesitas, conviene renovarla. En una reforma integral se sustituye por completo." },
      { question: "¿Entregáis el boletín eléctrico?", answer: "Sí. Las instalaciones nuevas o ampliadas se certifican con el certificado de instalación eléctrica emitido por instalador habilitado, necesario para contratar o ampliar la potencia." },
    ],
    requiresLicensedPro: true,
    licenseNote: "Las instalaciones eléctricas las ejecuta y certifica un instalador habilitado en baja tensión conforme al Reglamento Electrotécnico para Baja Tensión (RD 842/2002).",
    imagePath: IMG("instalaciones-electricas"),
    process: PROCESS_INSTALACION,
    keywords: ["instalación eléctrica vivienda", "precio instalación eléctrica", "boletín eléctrico"],
  },
  {
    slug: "fontaneria-saneamiento",
    groupSlug: "instalaciones",
    name: "Fontanería y saneamiento",
    shortName: "Fontanería",
    headline: "Fontanería y saneamiento: tuberías, desagües y bajantes sin sorpresas",
    summary:
      "Renovación de instalaciones de agua y desagües en viviendas, locales y comunidades: tuberías de polietileno o multicapa, llaves de corte, bajantes, arquetas y saneamiento.",
    features: ["Sustitución de tuberías de plomo o hierro", "Nuevas redes de agua fría y caliente", "Desagües, bajantes y arquetas", "Llaves de corte y reductores de presión"],
    forWhom: ["Viviendas con tuberías antiguas o fugas", "Comunidades con bajantes deterioradas", "Locales que cambian de distribución"],
    faqs: [
      { question: "¿Cuándo conviene cambiar la fontanería?", answer: "Si hay tuberías de plomo, hierro galvanizado con pérdida de caudal o fugas recurrentes, lo recomendable es sustituir la red completa, normalmente aprovechando una reforma de cocina o baño." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("fontaneria-saneamiento"),
    process: PROCESS_INSTALACION,
    keywords: ["cambiar fontanería piso", "precio fontanería vivienda"],
  },
  {
    slug: "climatizacion-aire-acondicionado",
    groupSlug: "instalaciones",
    name: "Climatización y aire acondicionado",
    shortName: "Climatización",
    headline: "Climatización por conductos, cassette o split, dimensionada para cada espacio",
    summary:
      "Instalación de aire acondicionado y climatización en viviendas, locales y oficinas: equipos split, multisplit, conductos y cassette, con cálculo de cargas y certificación.",
    features: ["Cálculo de cargas térmicas", "Split, multisplit, conductos y cassette", "Equipos de alta eficiencia (A++/A+++)", "Instalación y puesta en marcha certificadas"],
    forWhom: ["Viviendas sin climatización o con equipos antiguos", "Locales comerciales y oficinas", "Negocios con grandes aforos"],
    faqs: [
      { question: "¿Conductos o cassette para un local?", answer: "Los conductos distribuyen el aire de forma homogénea si hay falso techo; los cassettes se instalan por zonas y son más sencillos de ampliar. Depende de la altura libre, el aforo y el presupuesto." },
    ],
    requiresLicensedPro: true,
    licenseNote: "La instalación la ejecuta y certifica una empresa instaladora habilitada en instalaciones térmicas (RITE, RD 1027/2007) y, cuando procede, con la habilitación de gases fluorados.",
    imagePath: IMG("climatizacion-aire-acondicionado"),
    process: PROCESS_INSTALACION,
    keywords: ["aire acondicionado local comercial", "instalación aire acondicionado conductos"],
  },
  {
    slug: "calefaccion-aerotermia",
    groupSlug: "instalaciones",
    name: "Calefacción y aerotermia",
    shortName: "Aerotermia",
    headline: "Calefacción eficiente: aerotermia, suelo radiante y radiadores",
    summary:
      "Sistemas de calefacción y producción de calor para viviendas y negocios: aerotermia con suelo radiante o radiadores, calderas de condensación y sustitución de sistemas antiguos.",
    features: ["Aerotermia para calefacción, refrigeración y ACS", "Suelo radiante y radiadores de baja temperatura", "Sustitución de calderas antiguas", "Estudio de ahorro energético"],
    forWhom: ["Viviendas unifamiliares que quieren reducir la factura", "Reformas integrales que renuevan la calefacción", "Negocios con alta demanda de ACS"],
    faqs: [
      { question: "¿Cuándo merece la pena la aerotermia?", answer: "Especialmente en viviendas bien aisladas, con suelo radiante o radiadores de baja temperatura y en zonas de clima templado como Cataluña. En viviendas mal aisladas conviene mejorar antes la envolvente." },
    ],
    requiresLicensedPro: true,
    licenseNote: "Las instalaciones térmicas las ejecuta y certifica una empresa instaladora habilitada conforme al RITE.",
    imagePath: IMG("calefaccion-aerotermia"),
    process: PROCESS_INSTALACION,
    keywords: ["aerotermia precio", "instalación aerotermia vivienda", "suelo radiante"],
  },
  {
    slug: "ventilacion-extraccion",
    groupSlug: "instalaciones",
    name: "Ventilación y extracción",
    shortName: "Ventilación",
    headline: "Ventilación mecánica y extracción para viviendas, gimnasios, cocinas y locales",
    summary:
      "Sistemas de ventilación con recuperación de calor, renovación de aire en locales con aforo y extracción de humos y olores en cocinas profesionales, conforme a CTE y RITE.",
    features: ["Ventilación mecánica controlada en viviendas", "Renovación de aire según aforo (gimnasios, aulas, salas)", "Extracción de humos en cocinas profesionales", "Recuperadores de calor y filtración"],
    forWhom: ["Gimnasios y centros deportivos", "Restaurantes y cocinas profesionales", "Viviendas de alta eficiencia"],
    faqs: [
      { question: "¿Qué caudal de ventilación necesita un gimnasio?", answer: "El RITE fija categorías de calidad de aire interior según el uso; para gimnasios se dimensiona con el aforo y la actividad. Un instalador térmico habilitado calcula el caudal y el equipo." },
    ],
    requiresLicensedPro: true,
    licenseNote: "Las instalaciones de ventilación de locales las ejecuta y certifica una empresa instaladora habilitada en instalaciones térmicas (RITE).",
    imagePath: IMG("ventilacion-extraccion"),
    process: PROCESS_INSTALACION,
    keywords: ["ventilación gimnasio", "extracción de humos restaurante"],
  },
  {
    slug: "agua-caliente-sanitaria",
    groupSlug: "instalaciones",
    name: "Agua caliente sanitaria (ACS)",
    shortName: "ACS",
    headline: "Agua caliente sanitaria eficiente para viviendas, gimnasios y hoteles",
    summary:
      "Producción y distribución de agua caliente sanitaria: termos, calderas, aerotermia, acumuladores y recirculación para viviendas y negocios con alta demanda.",
    features: ["Termos eléctricos y bombas de calor para ACS", "Acumulación y recirculación", "Prevención de legionela en instalaciones colectivas", "Integración con aerotermia"],
    forWhom: ["Gimnasios y vestuarios colectivos", "Hoteles y alojamientos", "Viviendas que sustituyen el termo"],
    faqs: [
      { question: "¿Qué sistema de ACS para un gimnasio?", answer: "Para duchas simultáneas se dimensiona acumulación suficiente con producción por aerotermia o caldera, y recirculación para evitar esperas. Se calcula con el número de duchas y el patrón de uso." },
    ],
    requiresLicensedPro: true,
    licenseNote: "Las instalaciones térmicas de ACS las ejecuta y certifica una empresa instaladora habilitada conforme al RITE.",
    imagePath: IMG("agua-caliente-sanitaria"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "instalaciones-gas",
    groupSlug: "instalaciones",
    name: "Instalaciones de gas",
    shortName: "Gas",
    headline: "Instalaciones de gas ejecutadas y certificadas por instalador habilitado",
    summary:
      "Nuevas instalaciones y modificaciones de gas natural o propano en viviendas y cocinas profesionales, ejecutadas y certificadas exclusivamente por instaladores de gas habilitados.",
    features: ["Instalaciones receptoras de gas", "Conexión de cocinas profesionales y calderas", "Modificación y legalización de instalaciones", "Certificados de instalación"],
    forWhom: ["Restaurantes con cocina de gas", "Viviendas que cambian la caldera", "Reformas integrales con instalación de gas"],
    faqs: [
      { question: "¿Quién puede hacer una instalación de gas?", answer: "Solo un instalador de gas habilitado, que además emite el certificado necesario para la puesta en servicio. Coordinamos esa intervención dentro de la obra." },
    ],
    requiresLicensedPro: true,
    licenseNote: LICENSED_NOTE_GAS,
    imagePath: IMG("reformas-restaurantes"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "domotica-telecomunicaciones",
    groupSlug: "instalaciones",
    name: "Domótica y telecomunicaciones",
    shortName: "Domótica y telecos",
    headline: "Domótica, redes y telecomunicaciones integradas en la reforma",
    summary:
      "Cableado estructurado, wifi profesional, fibra, videoportero, control de iluminación, climatización y persianas, y sistemas de seguridad coordinados con la obra.",
    features: ["Cableado estructurado y racks", "Wifi profesional para locales y oficinas", "Control de iluminación, persianas y clima", "Videoportero y preinstalación de seguridad"],
    forWhom: ["Viviendas que quieren control desde el móvil", "Oficinas y locales con muchos puestos", "Hoteles y clínicas"],
    faqs: [
      { question: "¿Es caro domotizar una vivienda?", answer: "Depende del alcance. Si se hace durante la reforma, el cableado y los mecanismos conectados suponen un sobrecoste moderado frente a hacerlo después." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("domotica-telecomunicaciones"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "iluminacion",
    groupSlug: "instalaciones",
    name: "Iluminación",
    shortName: "Iluminación",
    headline: "Proyectos de iluminación que mejoran el espacio y reducen el consumo",
    summary:
      "Diseño e instalación de iluminación LED en viviendas, comercios, oficinas y naves: niveles lumínicos adecuados, luz indirecta, escenas y regulación.",
    features: ["Estudio lumínico por estancias", "Iluminación comercial y de escaparate", "Luz indirecta en techos y mobiliario", "Regulación, escenas y sensores"],
    forWhom: ["Comercios y restaurantes", "Viviendas en reforma integral", "Oficinas y naves que renuevan a LED"],
    faqs: [
      { question: "¿Qué iluminación recomendáis para un comercio?", answer: "Una combinación de luz general uniforme, acentos sobre producto y escaparate con buena reproducción cromática. Se diseña con los niveles de lux adecuados a cada zona." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-cocinas"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "proteccion-contra-incendios",
    groupSlug: "instalaciones",
    name: "Protección contra incendios",
    shortName: "PCI",
    headline: "Protección contra incendios con empresas habilitadas",
    summary:
      "Coordinación e integración en la obra de sistemas de protección contra incendios: detección, extintores, BIE, señalización, alumbrado de emergencia y sectorización, ejecutados por empresas habilitadas.",
    features: ["Detección y alarma", "Extintores, BIE y señalización", "Alumbrado de emergencia", "Sectorización y puertas cortafuegos"],
    forWhom: ["Naves industriales y almacenes", "Locales con aforo (gimnasios, restaurantes)", "Comunidades y aparcamientos"],
    faqs: [
      { question: "¿Podéis instalar la PCI de mi local?", answer: "La instalación y el mantenimiento los realiza una empresa habilitada en PCI con la que coordinamos la obra. Nosotros integramos la obra civil y la documentación." },
    ],
    requiresLicensedPro: true,
    licenseNote: LICENSED_NOTE_PCI,
    imagePath: IMG("proteccion-contra-incendios"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "pladur-albanileria",
    groupSlug: "instalaciones",
    name: "Pladur y albañilería",
    shortName: "Pladur y albañilería",
    headline: "Tabiquería, pladur, falsos techos y albañilería de calidad",
    summary:
      "Trabajos de albañilería y placa de yeso laminado: tabiques, trasdosados, falsos techos, aislamiento, derribos, alicatados y reparaciones.",
    features: ["Tabiques y trasdosados de pladur con aislamiento", "Falsos techos registrables y continuos", "Derribos y retirada de escombros", "Alicatados, enfoscados y reparaciones"],
    forWhom: ["Reformas de viviendas y locales", "Oficinas que redistribuyen", "Reparaciones y humedades"],
    faqs: [
      { question: "¿Pladur o ladrillo?", answer: "El pladur es más rápido, limpio y permite integrar aislamiento e instalaciones; el ladrillo se usa en zonas húmedas con cargas o donde se exige mayor resistencia. Lo decidimos según el uso." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("pladur-albanileria"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "pintura-revestimientos",
    groupSlug: "instalaciones",
    name: "Pintura y revestimientos",
    shortName: "Pintura",
    headline: "Pintura, alisado de paredes y revestimientos decorativos",
    summary:
      "Pintura interior y exterior, alisado de gotelé, estucos, papel pintado, microcemento y revestimientos de pared para viviendas y negocios.",
    features: ["Alisado de gotelé y preparación de superficies", "Pintura plástica, esmaltes y lacados", "Microcemento, estucos y papel pintado", "Pintura de fachadas e industrial"],
    forWhom: ["Viviendas que renuevan su imagen", "Locales y oficinas", "Comunidades de propietarios"],
    faqs: [
      { question: "¿Cuánto tarda pintar un piso?", answer: "Un piso de 80 m² con paredes en buen estado se pinta en 3 a 5 días; con alisado de gotelé el plazo se amplía a 1 o 2 semanas." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("pintura-revestimientos"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "carpinteria",
    groupSlug: "instalaciones",
    name: "Carpintería de madera, aluminio y PVC",
    shortName: "Carpintería",
    headline: "Carpintería interior y exterior: puertas, armarios, ventanas y cerramientos",
    summary:
      "Puertas, armarios a medida, revestimientos de madera, ventanas de aluminio o PVC con rotura de puente térmico y cerramientos de terrazas.",
    features: ["Puertas de paso y armarios a medida", "Ventanas de aluminio y PVC de altas prestaciones", "Persianas, mosquiteras y cerramientos", "Revestimientos y mobiliario de madera"],
    forWhom: ["Viviendas que mejoran el aislamiento", "Locales que renuevan fachada y escaparate", "Reformas integrales"],
    faqs: [
      { question: "¿Aluminio o PVC?", answer: "Ambos ofrecen buen aislamiento con rotura de puente térmico. El PVC suele aislar algo más; el aluminio permite perfiles más finos y colores duraderos. Depende del clima, la orientación y la estética." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("suelos-carpinteria"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "cerrajeria",
    groupSlug: "instalaciones",
    name: "Cerrajería y seguridad",
    shortName: "Cerrajería",
    headline: "Cerrajería, puertas de seguridad y estructuras metálicas",
    summary:
      "Puertas blindadas y acorazadas, rejas, barandillas, estructuras metálicas ligeras, puertas de garaje y cierres de local.",
    features: ["Puertas blindadas y acorazadas", "Rejas, barandillas y escaleras metálicas", "Cierres y persianas de local", "Estructuras metálicas ligeras (altillos, refuerzos con proyecto)"],
    forWhom: ["Viviendas que mejoran la seguridad", "Locales comerciales", "Naves y aparcamientos"],
    faqs: [
      { question: "¿Instaláis altillos en locales?", answer: "Sí, con cálculo y proyecto de un técnico competente cuando el altillo es transitable, y con la licencia que corresponda." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-naves-industriales"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "suelos-pavimentos",
    groupSlug: "instalaciones",
    name: "Suelos y pavimentos",
    shortName: "Suelos",
    headline: "Suelos de madera, laminado, vinilo, porcelánico y microcemento",
    summary:
      "Instalación de pavimentos en viviendas y negocios: parquet y tarima, laminados, vinilo SPC, gres porcelánico, microcemento y pavimentos técnicos para gimnasios y naves.",
    features: ["Parquet, tarima y laminados", "Vinilo y SPC para alto tránsito", "Porcelánico de gran formato", "Microcemento y pavimentos técnicos"],
    forWhom: ["Viviendas que cambian el suelo sin obra mayor", "Comercios y oficinas", "Gimnasios y naves"],
    faqs: [
      { question: "¿Se puede poner suelo nuevo sobre el antiguo?", answer: "En muchos casos sí (laminado, vinilo o porcelánico fino sobre un soporte nivelado), lo que ahorra demolición y escombros. Lo valoramos en la visita." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("suelos-carpinteria"),
    process: PROCESS_INSTALACION,
  },
  {
    slug: "techos-aislamientos",
    groupSlug: "instalaciones",
    name: "Techos y aislamientos",
    shortName: "Techos y aislamientos",
    headline: "Falsos techos, aislamiento térmico y acústico",
    summary:
      "Falsos techos de pladur y registrables, aislamiento térmico de cubiertas, fachadas y suelos, y aislamiento acústico entre viviendas y locales.",
    features: ["Falsos techos continuos y registrables", "Aislamiento térmico (lana mineral, XPS, SATE)", "Aislamiento acústico para locales y viviendas", "Integración de iluminación y climatización"],
    forWhom: ["Viviendas con problemas de frío, calor o ruido", "Locales con requisitos acústicos", "Reformas integrales"],
    faqs: [
      { question: "¿Cómo aislar un piso del ruido del bar de abajo?", answer: "Con un techo acústico desolidarizado y lana mineral, además de tratar el suelo del local si es posible. Un estudio acústico define la solución." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("pladur-albanileria"),
    process: PROCESS_INSTALACION,
  },

  /* ---------------------------------------------------------------- */
  /* Proyecto y dirección técnica                                      */
  /* ---------------------------------------------------------------- */
  {
    slug: "proyectos-diseno",
    groupSlug: "proyectos",
    name: "Proyecto, diseño y distribución",
    shortName: "Diseño",
    headline: "Diseño y distribución antes de la obra: planos, materiales y presupuesto realista",
    summary:
      "Estudio de distribución, propuesta de materiales, planos y modelado del espacio para decidir con criterio antes de empezar, en viviendas y negocios.",
    features: ["Estudio de distribución y alternativas", "Planos de estado actual y reformado", "Selección de materiales y acabados", "Presupuesto estimado por partidas"],
    forWhom: ["Propietarios que quieren ver el resultado antes de decidir", "Negocios que diseñan su imagen de local", "Reformas integrales"],
    faqs: [
      { question: "¿El diseño tiene coste?", answer: "El anteproyecto de distribución se incluye en la propuesta cuando ejecutamos la obra; el proyecto técnico visado, cuando es necesario, lo redacta un técnico competente y se presupuesta aparte." },
    ],
    requiresLicensedPro: false,
    imagePath: IMG("reformas-cocinas"),
    process: PROCESS_REFORMA,
  },
  {
    slug: "licencias-direccion-tecnica",
    groupSlug: "proyectos",
    name: "Licencias y dirección técnica",
    shortName: "Licencias",
    headline: "Licencias de obra y actividad, proyectos y dirección de obra con técnicos competentes",
    summary:
      "Tramitación de licencias y comunicaciones de obra y de actividad, redacción de proyectos y dirección técnica de la obra, siempre a través de técnicos competentes colegiados.",
    features: ["Licencias y comunicaciones de obra", "Licencias de actividad y apertura", "Proyectos técnicos y certificados", "Dirección de obra y coordinación de seguridad"],
    forWhom: ["Negocios que necesitan licencia de apertura", "Reformas que afectan a estructura o fachada", "Comunidades con obras mayores"],
    faqs: [
      { question: "¿Cuándo es obra mayor?", answer: "Cuando afecta a estructura, fachada, cubierta, cambio de uso o aumento de volumen. Requiere proyecto de técnico competente y licencia; el resto suele tramitarse como comunicación previa, según el municipio." },
    ],
    requiresLicensedPro: true,
    licenseNote: LICENSED_NOTE_TECNICA,
    imagePath: IMG("pladur-albanileria"),
    process: PROCESS_REFORMA,
  },
];

export const SERVICES: ServiceContent[] = RAW.map((s, index) => ({
  ...s,
  body: s.body ?? SERVICE_BODIES[s.slug]?.body ?? "",
  process: s.process ?? PROCESS_REFORMA,
  order: index + 1,
  status: s.status ?? "published",
}));

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

export function getServiceContent(slug: string): ServiceContent | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function getServiceGroup(slug: ServiceGroupSlug): ServiceGroup {
  return SERVICE_GROUPS.find((g) => g.slug === slug) ?? SERVICE_GROUPS[0];
}

export function servicesByGroup(services: ServiceContent[] = SERVICES) {
  return SERVICE_GROUPS.map((group) => ({
    group,
    services: services.filter((s) => s.groupSlug === group.slug && s.status === "published"),
  }));
}
