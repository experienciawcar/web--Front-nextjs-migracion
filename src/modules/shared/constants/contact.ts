/**
 * Datos de contacto de WCAR. Son fijos (no vienen de ningún endpoint) y son los
 * mismos del sitio anterior y del footer.
 *
 * TODO: `FooterComponent` los repite literales; que los lea de aquí para que
 * cambiarlos sea tocar una línea.
 */
export const CONTACT_INFO = {
  email: "contacto@wcar.co",
  /** Como se muestra. */
  phone: "+57 324 4001212",
  /** Para el enlace: formato internacional, sin espacios. */
  phoneHref: "tel:+573244001212",
  address: "Calle 98a # 69B-35",
} as const;

/** La dirección en Google Maps: una búsqueda, no unas coordenadas. */
export const CONTACT_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.address)}`;
