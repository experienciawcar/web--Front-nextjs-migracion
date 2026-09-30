import { apiUrl } from "@/modules/shared/services/api";
import { toVehicle } from "@/modules/shared/services/vehicles";
import type { Vehicle, VehicleDto } from "@/modules/shared/types/vehicle";

const REVALIDATE_SECONDS = 60 * 60;

/** Cuántos vehículos lleva el carrusel "Vehículos en venta" de un artículo. */
const VEHICLES_LIMIT = 12;

/**
 * Los vehículos de un artículo: el filtro que el backoffice guardó en el post (`vehicleFilter`, ver
 * `getBlogArticle`) enviado a `POST /v2/filter-cars/`, el mismo buscador del catálogo (el sitio
 * anterior usaba el v1, sin token). Solo la primera página.
 *
 * Sin filtro, o si el backend falla, devuelve una lista vacía y el artículo se pinta sin la sección.
 */
export async function getBlogVehicles(filter: Record<string, unknown> | null): Promise<Vehicle[]> {
  if (!filter) return [];
  const url = apiUrl("/v2/filter-cars/?page=1");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filter),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) {
      throw new Error(`POST ${url} respondió ${response.status}`);
    }
    const page: { results?: VehicleDto[] } = await response.json();

    const vehicles: Vehicle[] = [];
    for (const dto of page.results ?? []) {
      const vehicle = toVehicle(dto);
      if (vehicle) vehicles.push(vehicle);
      if (vehicles.length === VEHICLES_LIMIT) break;
    }
    return vehicles;
  } catch (error) {
    console.error("No se pudieron cargar los vehículos del artículo:", error);
    return [];
  }
}
