import type { StaticImageData } from "next/image";

/** Un dato de contacto directo: correo, teléfono o dirección. */
export type ContactChannel = {
  id: string;
  /** Lo que se lee bajo el círculo (y el nombre accesible del enlace). */
  label: string;
  href: string;
  /** Abre en otra pestaña: para el mapa. Correo y teléfono no la necesitan. */
  newTab?: boolean;
  /** El círculo cian con su glifo ya dibujado. */
  icon: StaticImageData;
};

/** Una de las maneras de contactar a WCAR: un bloque con su botón. */
export type ContactOption = {
  id: string;
  title: string;
  description: string;
  /** Texto del botón. */
  cta: string;
  href: string;
  icon: StaticImageData;
  /** Medidas del ícono cuando no llena su caja de 32px (por defecto `size-8`). */
  iconClassName?: string;
};
