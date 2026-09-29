/** Color tal como lo entrega GET /v2/colors/. */
export type ColorDto = {
  id: number;
  name: string;
  hex: string;
};

/**
 * Color listo para el `<select>` de "Ubicación y detalles". A diferencia del
 * filtro de colores del catálogo (que manda el nombre al backend), este
 * formulario manda el `id` (`POST /sale-cars/create/` guarda `color` como
 * entero: confirmado contra registros reales), así que aquí sí se conserva.
 */
export type Color = { id: string; name: string; hex: string };
