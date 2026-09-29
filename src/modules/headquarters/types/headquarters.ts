/** Un punto en el mapa, en grados. */
export type Coordinates = { lat: number; lng: number };

/**
 * Una sede tal como la pinta una tarjeta de "Nuestras Sedes".
 *
 * Es un tipo de vista y no un DTO: hoy estos datos no vienen del backend (ver
 * `constants/headquarters.ts`). Cuando `GET /sedes/` los traiga, se agrega el
 * `HeadquartersDto` y un servicio que devuelva este mismo tipo.
 */
export type Headquarters = {
  /** Identificador estable y legible: también es el ancla (`#id`) de la sede. */
  id: string;
  /** Marca en naranja delante del nombre: "wcar", "wcoffe Morato". */
  brand: string;
  /** Nombre en negro. */
  name: string;
  /**
   * `true`: la marca va en el mismo párrafo que el nombre ("wcar Caribe compra
   * o vende tu auto"). `false`: la marca va sola en su línea y el nombre debajo.
   */
  inlineBrand: boolean;
  /**
   * `true`: el título se balancea (`text-balance`) para que parta las líneas
   * donde las parte el diseño. Solo hace falta donde el corte codicioso del
   * navegador no coincide (Caribe: sin balancear deja "auto" solo).
   */
  balanceTitle?: boolean;
  address: string;
  /**
   * Dónde está la sede, para calcular la más cercana a quien pulsa el botón del
   * banner. No se pinta en ninguna parte.
   */
  coordinates: Coordinates;
  /**
   * `false` si la sede no es un concesionario (el taller y el café): no cuenta
   * para "el concesionario de wcar más cerca de ti". Si falta, cuenta.
   */
  isDealership?: boolean;
  /** `null` si el diseño no trae horario para esta sede: no se pinta la fila. */
  schedule: string | null;
  /** Párrafos del texto de presentación de la sede (el modal los pinta uno por uno). */
  description: string[];
  /**
   * Búsqueda que se manda a Google Maps y a Waze. Si falta se usa `address`;
   * solo hace falta cuando la dirección no dice la ciudad ("Puente Aranda").
   */
  mapQuery?: string;
  /** Ruta pública de la foto (WebP, `public/assets/nuestras-sedes/sedes/`). */
  photo: string;
  /**
   * Fotos de la galería del modal. Si falta es solo `[photo]`; con una sola
   * foto las flechas quedan deshabilitadas y no se pintan las miniaturas.
   */
  gallery?: string[];
  /** `object-position` de la foto dentro de su caja de 381x313 (el recorte del diseño). */
  photoPosition: string;
};
