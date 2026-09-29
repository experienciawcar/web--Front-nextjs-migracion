import type { StaticImageData } from "next/image";

/**
 * Un servicio de "Servicios adicionales". Es contenido fijo del diseño: la vista
 * Taller no tiene endpoint (se sondearon `/taller/`, `/workshop/` y
 * `/services/`, todos 404).
 * TODO: si el backend llega a exponerlos, esto pasa a ser `AdditionalServiceDto`
 * + servicio, y esta forma queda como el tipo de vista.
 */
export type AdditionalService = {
  id: string;
  icon: StaticImageData;
  /** Primera parte del título, en negrita. */
  title: string;
  /** Segunda parte, en cursiva y en su propio renglón. */
  titleItalic?: string;
  description: string;
};
