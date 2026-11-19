import { ROUTES } from "@/modules/shared/constants/routes";

export type HomeService = {
  id: "seguros" | "taller" | "financiacion" | "wcoffee";
  /** Título sobre la foto, centrado (18 bold); vacío si el diseño no trae uno (Taller). */
  photoTitle: string;
  photo: string;
  /** Nombre bajo la foto: esta parte va en negro y `brand` en naranja. */
  name: string;
  brand: string;
  description: string;
  href: string;
};

/**
 * Las cuatro tarjetas de "Nuestros servicios" (Figma 671:14229..671:14232). El
 * logo o lockup que va sobre cada foto se arma en `FeatureServicesComponent`
 * (cada uno es distinto: un wordmark, un isotipo + texto, o dos logos con
 * separador) y no está aquí.
 *
 * El diseño trae lorem en tres de las cuatro descripciones ("Nibh quisque
 * suscipit fermentum netus nulla cras"): se reproduce tal cual.
 * TODO: confirmar el copy de Taller, Financiación y wcoffee con diseño; y el
 * destino de wcoffee, que no tiene página ni ruta en el sitio anterior.
 */
export const HOME_SERVICES: HomeService[] = [
  {
    id: "seguros",
    photoTitle: "Seguros para tu tranquilidad",
    photo: "/assets/home/servicios/seguros.webp",
    name: "Seguros ",
    brand: "wcar",
    description: "Paga tu seguro en cómodas cuotas mensuales ajustadas a ti",
    href: ROUTES.insurance,
  },
  {
    id: "taller",
    photoTitle: "",
    photo: "/assets/home/servicios/taller.webp",
    name: "Taller ",
    brand: "wcar",
    description: "Ofrecemos soluciones para cualquier problema mecánico",
    href: ROUTES.workshop,
  },
  {
    id: "financiacion",
    photoTitle: "Financia hasta el 100 %\nde tu vehículo",
    photo: "/assets/home/servicios/financiacion.webp",
    name: "Financiación con ",
    brand: "wcar",
    description: "Solicita tu crédito en minutos desde nuestra web",
    href: ROUTES.financing,
  },
  {
    id: "wcoffee",
    photoTitle: "Un café con aroma a transparencia",
    photo: "/assets/home/servicios/wcoffee.webp",
    name: "",
    brand: "wcoffee",
    description: "Disfruta un café mientras conoces nuestros vehículos",
    // El sitio anterior no tiene página propia de wcoffee.
    // TODO: confirmar el destino con diseño.
    href: ROUTES.contact,
  },
];
