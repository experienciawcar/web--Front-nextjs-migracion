import type { Coordinates, Headquarters } from "../types/headquarters";

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Distancia en línea recta entre dos puntos (fórmula de Haversine), en km. No
 * es la distancia por carretera: para elegir "la más cercana" alcanza, y el
 * modal manda a Google Maps y a Waze, que sí calculan la ruta.
 */
export function distanceKm(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * El concesionario más cercano a `position`, con su distancia. Las sedes que no
 * son concesionario (`isDealership: false`: el taller y el café) no cuentan.
 * Devuelve `null` si no queda ninguna.
 */
export function findNearestHeadquarters(
  position: Coordinates,
  headquarters: Headquarters[],
): { headquarters: Headquarters; distanceKm: number } | null {
  let nearest: { headquarters: Headquarters; distanceKm: number } | null = null;

  for (const candidate of headquarters) {
    if (candidate.isDealership === false) continue;
    const distance = distanceKm(position, candidate.coordinates);
    if (!nearest || distance < nearest.distanceKm) {
      nearest = { headquarters: candidate, distanceKm: distance };
    }
  }

  return nearest;
}

const KM_FORMAT = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 1 });

/** "850 m", "3,2 km", "250 km": el texto que acompaña a la sede más cercana. */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`;
  if (km < 10) return `${KM_FORMAT.format(km)} km`;
  return `${Math.round(km)} km`;
}
