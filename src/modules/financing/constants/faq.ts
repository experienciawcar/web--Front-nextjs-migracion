import type { FaqItem } from "../types/faq-item";

/**
 * Preguntas frecuentes de Financiación.
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "cuota",
    question: "¿De cuánto queda mi cuota mensual?",
    answer:
      "El valor de la cuota depende del precio del vehículo, la cuota inicial y el plazo que elijas (entre 12 y 84 meses). Puedes calcular un estimado al instante en nuestro simulador de crédito.",
  },
  {
    id: "porcentaje",
    question: "¿Qué porcentaje del vehículo puedo financiar?",
    answer:
      "Con nuestros bancos y entidades financieras aliadas puedes financiar hasta el 100 % del valor del vehículo usado, sujeto a estudio y aprobación de crédito.",
  },
  {
    id: "tasa",
    question: "¿Cuál es la tasa de interés que me aplica?",
    answer:
      "La tasa de interés es definida por la entidad financiera según tu perfil crediticio, plazo y monto solicitado. Nuestros asesores comparan opciones para ofrecerte la alternativa más conveniente.",
  },
  {
    id: "tiempo",
    question: "¿Cuánto tarda la respuesta de mi solicitud?",
    answer:
      "El estudio preliminar es 100 % digital y te damos respuesta en minutos, sujeto a validación de documentos y políticas de la entidad financiera.",
  },
  {
    id: "documentos",
    question: "¿Qué documentos necesito para solicitar el crédito?",
    answer:
      "Por lo general solo necesitas tu documento de identidad y soportes de ingresos (certificado laboral, desprendibles de pago o extractos bancarios, según tu actividad económica).",
  },
  {
    id: "parte-pago",
    question: "¿Puedo dar mi carro actual como parte de pago?",
    answer:
      "Sí. Evaluamos tu vehículo actual y puedes usarlo como cuota inicial para financiar el saldo restante de tu próximo carro en WCAR.",
  },
];
