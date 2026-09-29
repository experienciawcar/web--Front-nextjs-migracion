import type { FaqItem } from "../types/faq-item";

/**
 * Respuesta de relleno del diseño. Con sus erratas: "ttitore  ismod" (con doble
 * espacio) y una "м" cirílica en "Potentiмnibh".
 */
const LOREM_ANSWER =
  "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla. Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.";

/**
 * Las seis preguntas frecuentes (Figma, "& Accordion / v4-m1" 193:8374). Contenido
 * fijo: no hay endpoint.
 *
 * TODO: **son datos de prueba** (el mismo lorem que el sitio anterior traía de
 * ejemplo). El diseño solo muestra la respuesta de la primera; las otras cinco
 * usan ese mismo párrafo para que se puedan abrir. Las preguntas reales del sitio
 * anterior (¿De cuánto queda mi cuota?, ¿Cuál es la tasa de interés que me aplica?,
 * ¿Con cuáles bancos tienen convenio?, ¿Qué documentos necesito…?) están en
 * `docs/planes/financiacion/referencia-sitio-anterior.md`: cambiar este archivo
 * cuando diseño o negocio confirmen cuáles van.
 * TODO: la pregunta 4 lleva un espacio delante en el diseño (se conserva).
 */
export const FAQ_ITEMS: FaqItem[] = [
  { id: "oferta", question: "¿Cómo recibo una oferta por mi carro?", answer: LOREM_ANSWER },
  { id: "pregunta-2", question: "Augue in nibh urna volutpat mattis?", answer: LOREM_ANSWER },
  { id: "pregunta-3", question: "Eu egestas sed sed posuere ultrices", answer: LOREM_ANSWER },
  { id: "pregunta-4", question: " Elementum facilisi aliquam, nisi, orci vulputate?", answer: LOREM_ANSWER },
  { id: "pregunta-5", question: "Nibh at odio dolor etiam neque in vel id orci?", answer: LOREM_ANSWER },
  { id: "pregunta-6", question: "Non dolor at velit lorem erat maecenas?", answer: LOREM_ANSWER },
];
