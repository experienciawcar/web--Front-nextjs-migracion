import { PROMISE_CONDITION, PROMISE_DETAIL } from "@/modules/financing/constants/promise";
import type { StaticImageData } from "next/image";

import iconCompraOnline from "../assets/transparencia/icon-compra-online.svg";
import iconEnvio from "../assets/transparencia/icon-envio.svg";
import iconFinanciacion from "../assets/transparencia/icon-financiacion.svg";
import iconSeguros from "../assets/transparencia/icon-seguros.svg";
import iconTaller from "../assets/transparencia/icon-taller.svg";
import iconTecnologia from "../assets/transparencia/icon-tecnologia.svg";

export type TransparencyFeature = {
  id: string;
  icon: StaticImageData;
  title: string;
  /** Segunda parte del título, en cursiva y en su propio renglón. */
  titleItalic?: string;
  description: string;
};

/**
 * Las seis cualidades de "Transparencia brutal" (Figma 671:14130 a 671:14159),
 * en el orden del diseño (dos columnas de tres). Las últimas dos comparten la
 * misma descripción ("Aplica para un crédito..."): así está en Figma, parece un
 * copiar y pegar sin terminar.
 * TODO: confirmar con diseño la descripción de "Taller y Servicio Postventa".
 */
export const TRANSPARENCY_FEATURES: TransparencyFeature[] = [
  {
    id: "compra-online",
    icon: iconCompraOnline,
    title: "Compras tu auto online.",
    description:
      "Puedes reservarlo o pagarlo totalmente a través de nuestra plataforma.",
  },
  {
    id: "tecnologia",
    icon: iconTecnologia,
    title: "Tecnología para acercar a las personas.",
    description:
      "Obtén atención personalizada a través de WCAR para resolver cualquier duda.",
  },
  {
    id: "envio",
    icon: iconEnvio,
    title: "Enviamos tu auto a tu casa.",
    description:
      "Compra a través de nuestra plataforma y enviamos el auto a la comodidad de tu hogar.",
  },
  {
    id: "financiacion",
    icon: iconFinanciacion,
    title: "Financiación en unos ",
    titleItalic: "cuantos clics.",
    description: `${PROMISE_DETAIL} ${PROMISE_CONDITION.replace(/^s/, "S")}.`,
  },
  {
    id: "seguros",
    icon: iconSeguros,
    title: "Seguros WCAR. ",
    titleItalic: "confianza y bienestar",
    description:
      "La confianza y el bienestar de nuestros clientes son nuestra principal prioridad",
  },
  {
    id: "taller",
    icon: iconTaller,
    title: "Taller y Servicio ",
    titleItalic: "Postventa en WCAR",
    description:
      "Mantenimiento preventivo, reparaciones y respaldo experto para tu vehículo.",
  },
];
