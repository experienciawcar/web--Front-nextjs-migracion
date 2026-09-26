/**
 * Rutas de la web en un solo lugar: el navbar, el footer y cualquier enlace
 * interno las leen de aquí, así que cambiar una URL es tocar una línea.
 *
 * Solo `home` y `aboutUs` tienen página hoy. El resto son las URLs del sitio
 * anterior (wcar.co), que se conservan a propósito para no perder
 * posicionamiento cuando existan las páginas, salvo las que el navbar ya traía
 * definidas: `/comprar`, `/servicios/financiacion`, `/blog`, `/contacto` y
 * `/sign-in`.
 * TODO: unificar el idioma de las URLs (hoy conviven `/about-us` y `/sign-in`
 * con `/compra-tu-carro`) y, si se renombran, crear las redirecciones desde las
 * del sitio anterior.
 */
export const ROUTES = {
  home: "/",
  aboutUs: "/about-us",
  headquarters: "/nuestras-sedes",
  buyOrSell: "/comprar",
  buyCar: "/compra-tu-carro",
  buyMotorcycle: "/compra-tu-moto",
  buyTruck: "/compra-tu-camion",
  buyVan: "/compra-tu-van",
  sellCar: "/vende-tu-carro",
  financing: "/servicios/financiacion",
  /** Otro dominio: en el sitio anterior también apuntaba fuera. */
  insurance: "https://wcarseguros.com/",
  procedures: "/tramites-de-vehiculos",
  workshop: "/taller",
  blog: "/blog",
  contact: "/contacto",
  signIn: "/sign-in",
} as const;

/** Un href absoluto va como <a>: next/link no tiene nada que precargar fuera. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
