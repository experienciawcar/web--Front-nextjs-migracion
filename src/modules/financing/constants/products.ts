import type { FinancingProduct } from "../types/financing-product";

import iconCredifacil from "../assets/productos/icon-credifacil.svg";
import iconCredirapido from "../assets/productos/icon-credirapido.svg";

const BOLD = "font-bold";

/**
 * Los dos productos de "Financia tu Vehículo": Credirápido y Credifácil (Figma,
 * marcos 204:5654 y 204:5622). Contenido fijo: no hay endpoint. Los números son
 * medidas de Figma en px de la tarjeta de 482 x 489.
 *
 * En teléfono (marcos "Frame 298" 204:7906 y "Frame 299" 204:7947, tarjeta de 367 x
 * 80 de cabecera) la geometría de la cabecera y de las filas es otra y va en px
 * reales (`mobile`); los tamaños de letra de las filas salen de las clases
 * responsivas de cada renglón (16 y 12 en teléfono; 20, 16 y 14 en desktop).
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
    mobile: {
      iconBox: { left: 35, top: 16, width: 67.396, height: 47.033 },
      namePosition: { left: 119, top: 15 },
      subtitle: "Financiación hasta $25 Millones",
      subtitlePosition: { left: 119, top: 46 },
      linesPosition: { right: -68.68, top: -5 },
    },
    buttonLabel: "FINANCIAR SEPARACIÓN",
    items: [
      {
        id: "aprobacion",
        mobile: { rowHeight: 52, textTop: 1, iconTop: 0 },
        rowHeight: 60,
        textTop: 9,
        mainClassName: "text-[16px] leading-6 xl:text-[20px]",
        main: [{ text: "Aprobación inmediata en " }, { text: "5 minutos", className: BOLD }],
        note: [{ text: "Desembolso directo al aliado*" }],
        noteClassName: "text-[12px] leading-6 font-semibold xl:text-small",
      },
      {
        id: "cupo",
        mobile: { rowHeight: 51, textTop: 4, iconTop: 0 },
        rowHeight: 58,
        textTop: 8,
        mainClassName: "text-[16px] leading-6 xl:text-[20px]",
        main: [{ text: "Cupo aprobado Hasta " }, { text: "25 millones", className: BOLD }],
        note: [
          { text: "y ", className: "text-[12px] font-semibold xl:text-body" },
          { text: "empieza ", className: "text-[12px] xl:text-body" },
          { text: "desde ", className: "text-[12px] xl:text-small" },
          { text: "$400.000", className: "text-[12px] xl:text-small" },
        ],
        noteClassName: "leading-6",
      },
      {
        id: "plazo",
        mobile: { rowHeight: 38, textTop: 0, iconTop: 4 },
        rowHeight: 39,
        textTop: 0,
        iconTop: 1,
        mainClassName: "text-[16px] leading-[38px] xl:text-[20px]",
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
    mobile: {
      iconBox: { left: 52, top: 14, width: 48, height: 48 },
      namePosition: { left: 119, top: 15 },
      subtitle: "Financiación hasta el 100%",
      subtitlePosition: { left: 119, top: 46 },
      linesPosition: { right: -68.68, top: -5 },
    },
    buttonLabel: "SOLICITAR",
    items: [
      {
        id: "solicitud",
        mobile: { rowHeight: 52, textTop: 1, iconTop: 0 },
        rowHeight: 60,
        textTop: 9,
        mainClassName: "text-[16px] leading-6 xl:text-[20px]",
        main: [{ text: "Solicitud digital" }],
        note: [{ text: "has tu Solicitud desde donde quieras desde nuestra web*" }],
        noteClassName: "text-[12px] leading-6 min-[380px]:whitespace-nowrap xl:text-small",
      },
      {
        id: "preaprobado",
        mobile: { rowHeight: 28, textTop: 4, iconTop: 0 },
        rowHeight: 38,
        textTop: 8,
        mainClassName: "text-[16px] leading-6 xl:text-[20px]",
        main: [{ text: "Pre-aprobado en menos de 15 minutos" }],
      },
      {
        id: "atencion",
        mobile: { rowHeight: 38, textTop: 0, iconTop: 4 },
        rowHeight: 39,
        textTop: 0,
        iconTop: 1,
        mainClassName: "text-[16px] leading-[38px] xl:text-[20px]",
        main: [{ text: "Atención personalizada" }],
      },
    ],
  },
];
