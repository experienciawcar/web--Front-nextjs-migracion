import type { StaticImageData } from "next/image";

/** Un fragmento de texto con su propio estilo (negrita, otro tamaño) dentro de un renglón. */
export type ProductTextPart = {
  text: string;
  className?: string;
};

/** Una fila de la lista de una tarjeta de producto ("Aprobación inmediata en 5 minutos"). */
export type ProductItem = {
  id: string;
  /** Alto de la fila en desktop (Figma). */
  rowHeight: number;
  /** Separación del texto por arriba, en desktop (Figma). */
  textTop: number;
  /** El ícono baja 1 px en las filas de un solo renglón con interlineado de 38. */
  iconTop?: number;
  /** Lo mismo en teléfono (tarjeta de 367): alto de la fila y separaciones de arriba del texto y del ícono. */
  mobile: { rowHeight: number; textTop: number; iconTop: number };
  /** Tamaño e interlineado del renglón principal. */
  mainClassName: string;
  main: ProductTextPart[];
  /** Renglón pequeño de abajo (nota). */
  note?: ProductTextPart[];
  noteClassName?: string;
};

/** Colores del acento de la cabecera: el del nombre del producto y el de las rayas. */
export type ProductAccent = "orange" | "cyan";

/** Un punto de la cabecera en px (esquina superior izquierda). */
export type HeaderPoint = { left: number; top: number };

/** Geometría de la cabecera en teléfono: la tarjeta mide 367 x 80 y todo va en px reales. */
export type ProductMobileHeader = {
  iconBox: { left: number; top: number; width: number; height: number };
  namePosition: HeaderPoint;
  /** El subtítulo de teléfono puede ser más corto que el de desktop. */
  subtitle: string;
  subtitlePosition: HeaderPoint;
  linesPosition: { right: number; top: number };
};

export type FinancingProduct = {
  id: string;
  accent: ProductAccent;
  /** Ícono de la cabecera y su caja, en px de la tarjeta de 482 (Figma). */
  icon: StaticImageData;
  iconBox: { left: number; top: number; width: number; height: number };
  /** "Credi" (color del acento) + "rápido" (blanco, cursiva). */
  nameLead: string;
  nameTail: string;
  /** Peso e interlineado del nombre y estilo de su segunda parte; posición del nombre y del subtítulo. */
  nameClassName: string;
  nameTailClassName: string;
  namePosition: { left: number; top: number };
  subtitle: string;
  subtitlePosition: { left: number; top: number };
  /** Rayado de la esquina de la cabecera: `right` (negativo) y `top` de su caja de 148,7 x 136,3. */
  linesPosition: { right: number; top: number };
  mobile: ProductMobileHeader;
  items: ProductItem[];
  buttonLabel: string;
};
