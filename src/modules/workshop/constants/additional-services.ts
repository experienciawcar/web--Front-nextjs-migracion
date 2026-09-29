import iconWash from "../assets/adicionales/icon-lavado.svg";
import iconParts from "../assets/adicionales/icon-repuestos.svg";
import iconPlans from "../assets/adicionales/icon-planes.svg";
import type { AdditionalService } from "../types/additional-service";

/**
 * Las tarjetas de "Servicios adicionales", tal cual del diseño (captura 4). El
 * diseño corta la tercera por el borde derecho y no se sabe si hay más.
 *
 * Textos verificados contra Figma (nodo 192:6200): la tercera tarjeta acaba como se
 * había supuesto ("...para que tu auto luzca siempre impecable, tanto por dentro
 * como por fuera") y "vehículo" lleva tilde (en la captura se leía sin ella).
 * "Lavado y Detailing" va sin parte en cursiva, como en Figma.
 *
 * TODO: confirmar con diseño: en Figma el carrusel tiene DOS tarjetas más, fuera
 * del marco de 1440 (x=1500 y 1805), y NO se agregaron porque el diseño las trae
 * a medias:
 *   4. icono de billetes · "Precio realmente" + cursiva "razonable" · "No
 *      especulamos. A través de nuestro algoritmo calculamos precios de venta
 *      reales de mercado. Así que puedes " (el texto acaba ahí, sin punto).
 *   5. icono de cuenta (`Icons/account`, 192:6224) · "Tecnología para brindar
 *      servicio personalizado." · "La tecnología es para nosotros un camino para
 *      mejorar el servicio, no para reemplazar las interacciones."
 * En las dos la descripción va en `#666C89` (gris) sobre el fondo oscuro, no en
 * blanco al 80 % como las tres primeras: parece contenido a medio hacer. Con ellas
 * el carrusel tendría 5 posiciones.
 */
export const ADDITIONAL_SERVICES: AdditionalService[] = [
  {
    id: "repuestos-originales",
    icon: iconParts,
    title: "Venta de",
    titleItalic: "Repuestos Originales",
    description:
      "Como distribuidores autorizados, garantizamos la venta de repuestos originales de alta calidad para tu vehículo.",
  },
  {
    id: "planes-de-mantenimiento",
    icon: iconPlans,
    title: "Planes de",
    titleItalic: "Mantenimiento",
    description:
      "Nuestros contratos de mantenimiento prepagos te permiten disfrutar de servicios a precio fijo.",
  },
  {
    id: "lavado-y-detailing",
    icon: iconWash,
    title: "Lavado y Detailing",
    description:
      "Ofrecemos servicios de lavado y detailing para que tu auto luzca siempre impecable, tanto por dentro como por fuera.",
  },
];
