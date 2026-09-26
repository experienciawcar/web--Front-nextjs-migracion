import type { CompanyValue } from "../types/values";

/**
 * Los valores de WCAR, para la sección "Nuestros valores". El texto es el que
 * entregó el equipo y va tal cual: no viene de ningún endpoint, así que vive
 * aquí y no en un servicio.
 */
export const COMPANY_VALUES: CompanyValue[] = [
  {
    id: "transparencia-brutal",
    title: "Transparencia brutal",
    description:
      "Nos comprometemos a ser implacablemente honestos en todas nuestras interacciones, fomentando la confianza en cada transacción y garantizando que nuestros clientes siempre tengan acceso a la información precisa y relevante para tomar decisiones informadas.",
  },
  {
    id: "innovacion-disruptiva",
    title: "Innovación disruptiva",
    description:
      "Buscamos revolucionar el mercado de autos usados al adoptar y desarrollar tecnologías de vanguardia, como la inteligencia artificial y la blockchain, para ofrecer una experiencia phygital única que transforme la forma en que las personas compran y venden vehículos.",
  },
  {
    id: "servicio-personalizado",
    title: "Servicio personalizado",
    description:
      "Nos enorgullecemos de ofrecer experiencias hechas a medida para cada cliente, adaptando nuestras soluciones y recomendaciones a sus necesidades individuales y asegurando que cada interacción con WCAR sea única, memorable y enriquecedora.",
  },
  {
    id: "precios-razonables",
    title: "Precios razonables",
    description:
      "Creemos en ofrecer un valor excepcional y justo en cada transacción, asegurando que nuestros clientes reciban precios de mercado competitivos y que nuestros servicios sean accesibles para todos, sin sacrificar la calidad o la experiencia.",
  },
  {
    id: "sostenibilidad-y-responsabilidad",
    title: "Sostenibilidad y responsabilidad",
    description:
      "Estamos comprometidos con un enfoque consciente y responsable en la industria automotriz, promoviendo prácticas sostenibles, fomentando la reutilización de autos, dándoles una nueva oportunidad, garantizando que nuestro impacto en el medio ambiente sea mínimo.",
  },
  {
    id: "comunidad-y-conexion",
    title: "Comunidad y conexión",
    description:
      "Trabajamos para construir una comunidad global de entusiastas del automóvil que compartan nuestros valores, celebren la innovación y se apoyen mutuamente en la búsqueda de una experiencia más gratificante y sostenible en el mercado de autos usados.",
  },
  {
    id: "bienestar-y-desarrollo-integral",
    title: "Bienestar y desarrollo integral",
    description:
      "Estamos profundamente comprometidos con el crecimiento y bienestar de nuestros empleados, clientes y otros stakeholders. Fomentamos un ambiente laboral inclusivo, equitativo y colaborativo, donde cada miembro de nuestro equipo pueda desarrollarse y prosperar. Además, nos esforzamos por mejorar continuamente la vida de nuestros clientes, ofreciendo soluciones que simplifiquen y enriquezcan su experiencia en el mercado de autos usados, y generando un impacto positivo en nuestras comunidades a través de nuestras acciones y responsabilidad social.",
  },
];
