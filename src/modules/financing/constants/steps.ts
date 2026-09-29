import type { FinancingStep } from "../types/financing-step";

import iconCredito from "../assets/pasos/icon-credito.svg";
import iconDesembolso from "../assets/pasos/icon-desembolso.svg";
import iconDocumentacion from "../assets/pasos/icon-documentacion.svg";
import iconSimulacion from "../assets/pasos/icon-simulacion.svg";
import iconSolicitud from "../assets/pasos/icon-solicitud.svg";

/**
 * Los cinco pasos del proceso de financiación (Figma, nodo "items carrousel"
 * 193:8216). Contenido fijo: no hay endpoint (ver `page.tsx`). Los textos son los
 * del diseño, con su errata; los del sitio anterior (wcar.co/financiacion) son
 * los mismos salvo esa errata.
 *
 * TODO: confirmar con diseño la tilde de "estás" en el paso 1 (el diseño trae
 * "estas") y el ícono del paso 5: en Figma es el mismo de "Documentación" (un
 * marcador de posición, casi seguro); `icon-desembolso.svg` es una copia de
 * `icon-documentacion.svg`, listo para reemplazar por el definitivo sin tocar
 * código.
 */
export const FINANCING_STEPS: FinancingStep[] = [
  {
    id: "simulacion",
    title: "Simulación",
    description: "Haz la simulación de las cuotas del crédito para el carro que estas comprando.",
    icon: iconSimulacion,
  },
  {
    id: "solicitud",
    title: "Diligencia solicitud",
    description: "Diligencia y firma la solicitud del crédito en línea.",
    icon: iconSolicitud,
  },
  {
    id: "documentacion",
    title: "Documentación",
    description: "Completa los documentos para enviar a estudio de crédito.",
    icon: iconDocumentacion,
  },
  {
    id: "credito",
    title: "Crédito",
    description: "Escoge el crédito que más te convenga y firma la documentación.",
    icon: iconCredito,
  },
  {
    id: "desembolso",
    title: "Desembolso",
    description: "Espera el desembolso del banco, y empieza a disfrutar de tu nuevo carro.",
    icon: iconDesembolso,
  },
];
