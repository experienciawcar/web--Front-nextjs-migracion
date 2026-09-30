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
  /** Formulario "Contactar a la empresa" de Contacto (URL del sitio anterior). */
  contactCompany: "/contacta-a-la-empresa",
  /** "Contacta un asesor" / cotizar la venta de un vehículo (URL del sitio anterior). */
  quote: "/cotizar",
  signIn: "/sign-in",
} as const;

/** Texto en minúsculas, sin tildes y con guiones ("Camioneta - SUV" → "camioneta-suv"). */
function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Enlace al detalle de un vehículo: `/compra-tu-carro/<tipo>/<nombre>/<id>`, la
 * misma estructura del sitio anterior (que armaba `tipo/nombre/id` con guiones y
 * minúsculas, sin quitar tildes ni símbolos: aquí sí, para no romper la URL).
 * Solo el `id` cuenta para encontrar el vehículo.
 * La página de detalle vive en `app/compra-tu-carro/[[...typeVehicleName]]/page.tsx`
 * (módulo `vehicle-detail`).
 */
export function vehicleHref({ id, type, name }: { id: number; type: string; name: string }): string {
  return `${ROUTES.buyCar}/${slugify(type) || "vehiculo"}/${slugify(name) || "vehiculo"}/${id}`;
}

/** Un href absoluto va como <a>: next/link no tiene nada que precargar fuera. */
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
