/** Versión tal como la entrega GET /version-brand/:brandId/. */
export type VersionDto = {
  id: number;
  version: string;
};

/**
 * Versión lista para el select "Versión". El valor que viaja al backend es el
 * **texto**, no el id: los registros reales de `GET /sale-cars/` guardan
 * `version` como cadena ("ALLURE 1.6 MT 4P"), no como entero.
 */
export type Version = { id: string; label: string };
