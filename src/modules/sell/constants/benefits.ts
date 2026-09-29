import type { StaticImageData } from "next/image";

import iconCarro from "../assets/beneficios/icon-carro.svg";
import iconPrecio from "../assets/beneficios/icon-precio.svg";
import iconTecnologia from "../assets/beneficios/icon-tecnologia.svg";

export type SellBenefit = {
  id: string;
  icon: StaticImageData;
  title: string;
  description: string;
};

/**
 * Las 3 tarjetas de "Vende tu carro fácil y seguro", tal cual el texto del
 * sitio anterior (medido con `cdp.py` contra `https://wcar.co/vende-tu-carro`,
 * sin lorem ni erratas). Los íconos no tienen original vectorial (el sitio
 * anterior probablemente usaba una fuente de íconos): se dibujaron nuevos.
 * TODO: confirmar el trazo exacto con diseño si llega un Figma.
 */
export const SELL_BENEFITS: SellBenefit[] = [
  {
    id: "soluciones-integrales",
    icon: iconCarro,
    title: "Soluciones integrales a la medida",
    description: "Te contamos las cosas importantes del carro tal y como son.",
  },
  {
    id: "alternativa-honesta",
    icon: iconPrecio,
    title: "Alternativa honesta y con precios justos",
    description: "A través de nuestro algoritmo calculamos precios de venta reales de mercado.",
  },
  {
    id: "tecnologia",
    icon: iconTecnologia,
    title: "Uso de la tecnología para facilitar procesos",
    description:
      "La tecnología es para nosotros un camino para mejorar el servicio, no para reemplazar las interacciones.",
  },
];
