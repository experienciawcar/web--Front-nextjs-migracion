import { ROUTES } from "@/modules/shared/constants/routes";

export type IntroFeature = {
  id: string;
  title: string;
  /**
   * Primera parte de `titleItalic` que solo se ve desde `xl`: el diseño mobile dice
   * "Peritaje gratis online" y el de desktop "Peritaje gratis disponible online".
   */
  titleItalicDesktopOnly?: string;
  /** Segunda parte del título, en cursiva naranja. */
  titleItalic: string;
  description: string;
};

/**
 * Las tres tarjetas bajo el buscador del hero (Figma Home 2.0, "Frame 641":
 * I695:45162;692:44676/44681/44686). La tercera trae lorem en el diseño
 * ("Lorem Ipsum is simply dummy text of the printing"): se reproduce tal cual.
 * TODO: confirmar con diseño el texto de la tercera tarjeta.
 */
export const INTRO_FEATURES: IntroFeature[] = [
  {
    id: "detalle",
    title: "No omitimos ",
    titleItalic: "ningún detalle",
    description: "Te contamos todo lo relacionado con tu auto tal y como es.",
  },
  {
    id: "garantia",
    title: "Garantía por ",
    titleItalic: "seis meses",
    description:
      "6 meses incluidos sobre +3.000 componentes. Con taller propio y red de aliados en todo el país.",
  },
  {
    id: "peritaje",
    title: "Peritaje gratis ",
    titleItalicDesktopOnly: "disponible ",
    titleItalic: "online",
    description: "Lorem Ipsum is simply dummy text of the printing",
  },
];

/** A dónde lleva "Ver vehículos →" de cada tarjeta: el catálogo, sin filtro. */
export const INTRO_FEATURES_HREF = ROUTES.buyCar;
