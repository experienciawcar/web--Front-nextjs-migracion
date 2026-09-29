import type { StaticImageData } from "next/image";

/** Un beneficio con ícono, título (con una parte en cursiva) y descripción. */
export type FinancingFeature = {
  id: string;
  icon: StaticImageData;
  title: string;
  /** Segunda parte del título: cursiva y en su propio renglón. */
  titleItalic: string;
  description: string;
};
