/**
 * Reseña tal como la entrega GET /api/map/: son las reseñas de Google Maps de
 * WCAR (el nombre del endpoint viene de ahí). Solo se declaran los campos que
 * usa la sección; la respuesta trae además `author_url`, `language`,
 * `original_language`, `relative_time_description` (en inglés: "in the last
 * week") y `translated`.
 */
export type ReviewDto = {
  author_name: string;
  /** Foto de perfil de Google (128x128), o vacía si el autor no tiene. */
  profile_photo_url?: string | null;
  /** De 1 a 5; hoy llegan enteras. */
  rating: number;
  /** Puede venir vacío: en Google se puede calificar sin escribir. */
  text?: string | null;
  /** Momento de la reseña, en segundos desde 1970 (no en milisegundos). */
  time: number;
};

/** Reseña lista para pintar en una tarjeta. */
export type Review = {
  /** No viene del backend: el endpoint no trae `id`. Es el índice en la lista. */
  id: number;
  authorName: string;
  /** URL de la foto de perfil, o null si no hay. */
  photoUrl: string | null;
  rating: number;
  text: string;
  /** Fecha en el formato del diseño ("Septiembre 26 / 2026"). */
  dateLabel: string;
  /** La misma fecha para el atributo `dateTime` de <time>. */
  dateIso: string;
};
