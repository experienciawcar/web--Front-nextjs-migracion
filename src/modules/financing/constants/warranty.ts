import type { FinancingFeature } from "../types/financing-feature";

import iconAprobacion from "../assets/garantia/icon-aprobacion.svg";
import iconCompraGarantia from "../assets/garantia/icon-compra-garantia.svg";
import iconCubreReparacion from "../assets/garantia/icon-cubre-reparacion.svg";

/**
 * Las tres tarjetas de "Financia tu garantía y cubre la reparación" (Figma, marco
 * "items" 204:5200). Contenido fijo: no hay endpoint.
 *
 * TODO: las descripciones son lorem en el diseño ("Nibh quisque suscipit…"), se dejan
 * tal cual. El sitio anterior trae el texto real de la garantía: "Cubre la
 * reparación o sustitución de todas las piezas o componentes que presenten
 * defectos como consecuencia de una avería fortuita en los elementos mecánicos,
 * eléctricos o electrónicos. Incluye términos y condiciones." (ver
 * `docs/planes/financiacion/referencia-sitio-anterior.md`).
 * TODO: erratas del diseño en la tercera tarjeta: "reparacion" sin tilde y
 * "sutitución" por "sustitución".
 */
export const WARRANTY_FEATURES: FinancingFeature[] = [
  {
    id: "compra",
    icon: iconCompraGarantia,
    title: "Compra tu garantía",
    titleItalic: "con pocos clics",
    description: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla.",
  },
  {
    id: "aprobacion",
    icon: iconAprobacion,
    title: "Aprobación en",
    titleItalic: "10 minutos",
    description: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci,",
  },
  {
    id: "cubre",
    icon: iconCubreReparacion,
    title: "Cubre la reparacion",
    titleItalic: "o sutitución de piezas",
    description: "Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id",
  },
];
