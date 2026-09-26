type NavLinkBase = {
  label: string;
  /** Ícono a la izquierda del texto. Solo lo traen los tipos de vehículo. */
  iconUrl?: string;
  /** Contador entre paréntesis a la derecha. Solo lo traen los tipos de vehículo. */
  count?: number;
};

/** Enlace simple. */
export type NavLeaf = NavLinkBase & {
  href: string;
  children?: undefined;
};

/**
 * Enlace con submenú. `href` es opcional: "Servicios" no tiene página propia,
 * así que su texto solo abre el submenú.
 */
export type NavGroup = NavLinkBase & {
  href?: string;
  children: NavLink[];
};

/**
 * Nodo del árbol de navegación. Es recursivo porque el diseño anterior tenía
 * tres niveles: "Compra o Vende" > "Compra tu carro" > tipos de vehículo.
 * `children` sirve de discriminante: si existe, es un grupo.
 */
export type NavLink = NavLeaf | NavGroup;
