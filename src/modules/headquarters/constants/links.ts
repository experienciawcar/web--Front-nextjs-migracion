/**
 * Búsqueda de Google Maps que ofrece el banner de Nuestras Sedes cuando no se
 * pudo saber dónde está el usuario (negó el permiso de ubicación, el navegador
 * no la da o tardó demasiado): "concesionario wcar cerca de mí".
 *
 * Google la centra en la ubicación que tenga del usuario (la aproximada por IP,
 * si no dio permiso) y ordena las fichas de la más cercana a la más lejana. Solo
 * salen las sedes con ficha en Google Maps que coincida con el texto.
 * TODO: comprobar con marketing que las fichas de las sedes salgan con esta
 * búsqueda; si no, ajustar `NEAREST_QUERY` (por ejemplo, al nombre de la ficha).
 */
const NEAREST_QUERY = "wcar concesionario cerca de mí";

export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(NEAREST_QUERY)}`;
