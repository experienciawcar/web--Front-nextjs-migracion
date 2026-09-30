/**
 * Etiquetas de estado (`tag_car`) que cambian la ficha. Ojo: en el sitio anterior los avisos de
 * arriba se decidían por el `id` de la etiqueta (5, 7, 11) y los botones y el precio por su
 * `name` ("Reservado", "Vendido"): son dos criterios sobre el mismo objeto
 * (`docs/DETALLE_VEHICULO.md` §7.12). Se conservan tal cual mientras negocio no diga otra cosa.
 */
export const TAG_IDS = {
  outOfStandard: 5,
  reserved: 7,
  presale: 11,
} as const;

/** Con estas etiquetas no se puede separar el vehículo. */
export function isUnavailable(tagName: string | undefined): boolean {
  return tagName === "Reservado" || tagName === "Vendido";
}
