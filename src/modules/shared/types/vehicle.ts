/** Una foto con las variantes a distinto ancho que genera el backend. */
export type VehicleImageSrcsetDto = {
  /** Ancho en px de la variante (160, 320, 480, 640, 800, 1024 y la original). */
  w: number;
  url: string;
};

/** Foto de la galería de un vehículo (`files[]` en GET /api/cars/). */
export type VehicleFileDto = {
  image?: string | null;
  image_srcset?: VehicleImageSrcsetDto[] | null;
};

/**
 * Vehículo tal como lo entrega GET /api/cars/ (`results[]`, paginado de a 22)
 * o POST /v2/filter-cars/ (catálogo con filtros, `results[]`, 22 por página).
 * Solo se declaran los campos que usa la tarjeta.
 *
 * Ojo con los tipos, que el backend no cuida:
 * - `price` y `discount_price` llegan como texto con decimales ("41990000.00");
 *   sin descuento, `discount_price` es `null` (o "0.00").
 * - `transmission` es 1 (automática) o 0 (manual): así lo lee el sitio anterior.
 * - `warranty_type` y `type_warranty` traen la cobertura ("Garantía de 6 meses
 *   o 4000 km") pero también basura ("on", "null"); ver `getWarrantyLabel`.
 * - `image_first` es una URL firmada de Google Cloud Storage que caduca a las
 *   24 h; por eso la tarjeta usa las variantes de `image_first_srcset` (URLs del
 *   propio backend, sin firma) y no esa.
 * - **La galería viene en dos formas distintas según el endpoint**: `GET
 *   /api/cars/` trae `files[]` (un objeto por foto, con su propio
 *   `image_srcset`); `POST /v2/filter-cars/` trae `preview_images` (URLs
 *   firmadas) y `preview_images_srcset` (array de arrays, uno por foto, en el
 *   mismo orden que `preview_images`) — no hay `files`. `toImages()` lee
 *   cualquiera de los dos que venga.
 */
export type VehicleDto = {
  id: number;
  /** Nombre completo ("Kia Soluto Emotion 1.4 Mecánico 4P"). */
  car: string;
  year: number | null;
  mileage: number | null;
  transmission: number | null;
  price: string | null;
  discount_price?: string | null;
  active?: boolean;
  /** Carrocería ("Sedan", "Camioneta - SUV"). */
  type?: { type?: string | null } | null;
  sede_car?: { name?: string | null } | null;
  tag_car?: { id: number; tag: string; color?: string | null } | null;
  warranty?: boolean | null;
  warranty_type?: string | null;
  type_warranty?: string | null;
  garantie7Day?: boolean | null;
  /** Personas que han visto el vehículo. */
  quantityPersons?: number | null;
  image_first?: string | null;
  image_first_srcset?: VehicleImageSrcsetDto[] | null;
  files?: VehicleFileDto[] | null;
  /** Solo en POST /v2/filter-cars/: galería sin agrupar por objeto (ver arriba). */
  preview_images?: (string | null)[] | null;
  preview_images_srcset?: VehicleImageSrcsetDto[][] | null;
};

/** Una foto lista para pintar: la URL más ancha y su `srcset`. */
export type VehicleImage = {
  src: string;
  srcSet?: string;
};

export type VehicleWarrantyTone = "standard" | "factory" | "oneYear";

/** Etiqueta de estado sobre la foto ("Promoción", "Vehículo por ingresar"...). */
export type VehicleTag = {
  name: string;
  /** Color de fondo (hex) que trae el backend. */
  color: string;
};

/** Vehículo ya normalizado, con lo que necesita la tarjeta. */
export type Vehicle = {
  id: number;
  name: string;
  /** Carrocería: "Sedan", "Camioneta - SUV"... */
  bodyType: string;
  year: number | null;
  /** Kilometraje ya formateado ("21.630 Km."), o `null` si no hay dato. */
  mileage: string | null;
  transmission: "Automática" | "Manual";
  city: string;
  /** Lo que se cobra: el precio con descuento si lo hay. */
  price: string;
  /** El precio de lista, tachado, solo si hay descuento. */
  previousPrice: string | null;
  /**
   * Cuota mensual estimada (60 meses, 30 % de inicial, la tasa de
   * `loan-rates.ts`), solo cuando no hay descuento: con descuento la tarjeta
   * muestra el precio de lista tachado en su lugar (guía de la tarjeta, ver
   * `VehicleCardComponent`). No es una cuota real ni viene del backend.
   * TODO: confirmar con negocio el plazo, la cuota inicial y la tasa.
   */
  monthlyPayment: string | null;
  tag: VehicleTag | null;
  warranty: { label: string; tone: VehicleWarrantyTone } | null;
  viewers: number;
  images: VehicleImage[];
  /** Enlace al detalle (ver `vehicleHref`). */
  href: string;
};
