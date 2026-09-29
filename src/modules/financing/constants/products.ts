import type { FinancingProduct } from "../types/financing-product";

import iconCredifacil from "../assets/productos/icon-credifacil.svg";
import iconCredirapido from "../assets/productos/icon-credirapido.svg";

const BOLD = "font-bold";

/**
 * Los dos productos de "Financia tu Vehículo": Credirápido y Credifácil (Figma,
 * marcos 204:5654 y 204:5622). Contenido fijo: no hay endpoint. Los números son
 * medidas de Figma en px de la tarjeta de 482 x 489.
 *
 * TODO: erratas y asteriscos sin nota al pie del diseño: "Desembolso directo al
 * aliado*" y "has tu Solicitud desde donde quieras desde nuestra web*" (lleva
 * "has" por "haz" y "Solicitud" en mayúscula) se dejan tal cual; ningún asterisco
 * tiene su aclaración en el diseño.
 */
export const FINANCING_PRODUCTS: FinancingProduct[] = [
  {
    id: "credirapido",
    accent: "orange",
    icon: iconCredirapido,
    iconBox: { left: 47, top: 21, width: 80.482, height: 57.223 },
    nameLead: "Credi",
    nameTail: "rápido",
    nameClassName: "leading-[normal] font-bold",
    nameTailClassName: "font-bold italic text-white",
    namePosition: { left: 142, top: 17 },
    subtitle: "Financiación hasta $25 Millones",
    subtitlePosition: { left: 143, top: 58 },
    linesPosition: { right: -74.68, top: 10 },
    buttonLabel: "FINANCIAR SEPARACIÓN",
    items: [
      {
        id: "aprobacion",
        rowHeight: 60,
        textTop: 9,
        mainClassName: "text-[20px] leading-6",
        main: [{ text: "Aprobación inmediata en " }, { text: "5 minutos", className: BOLD }],
        note: [{ text: "Desembolso directo al aliado*" }],
        noteClassName: "text-small leading-6 font-semibold",
      },
      {
        id: "cupo",
        rowHeight: 58,
        textTop: 8,
        mainClassName: "text-[20px] leading-6",
        main: [{ text: "Cupo aprobado Hasta " }, { text: "25 millones", className: BOLD }],
        note: [
          { text: "y ", className: "text-body font-semibold" },
          { text: "empieza ", className: "text-body" },
          { text: "desde ", className: "text-small" },
          { text: "$400.000", className: "text-small" },
        ],
        noteClassName: "leading-6",
      },
      {
        id: "plazo",
        rowHeight: 39,
        textTop: 0,
        iconTop: 1,
        mainClassName: "text-[20px] leading-[38px]",
        main: [{ text: "Plazo de pago de" }, { text: " 12 a 72 Meses", className: BOLD }],
      },
    ],
  },
  {
    id: "credifacil",
    accent: "cyan",
    icon: iconCredifacil,
    iconBox: { left: 43, top: 23, width: 56, height: 56 },
    nameLead: "Credi",
    nameTail: "fácil",
    nameClassName: "leading-[normal] font-bold",
    nameTailClassName: "font-semibold italic text-white",
    namePosition: { left: 115, top: 16 },
    subtitle: "Financia hasta el 100% de tu vehículo",
    subtitlePosition: { left: 117, top: 57 },
    linesPosition: { right: -67.68, top: 14 },
    buttonLabel: "SOLICITAR",
    items: [
      {
        id: "solicitud",
        rowHeight: 60,
        textTop: 9,
        mainClassName: "text-[20px] leading-6",
        main: [{ text: "Solicitud digital" }],
        note: [{ text: "has tu Solicitud desde donde quieras desde nuestra web*" }],
        noteClassName: "text-small leading-6",
      },
      {
        id: "preaprobado",
        rowHeight: 38,
        textTop: 8,
        mainClassName: "text-[20px] leading-6",
        main: [{ text: "Pre-aprobado en menos de 15 minutos" }],
      },
      {
        id: "atencion",
        rowHeight: 39,
        textTop: 0,
        iconTop: 1,
        mainClassName: "text-[20px] leading-[38px]",
        main: [{ text: "Atención personalizada" }],
      },
    ],
  },
];
