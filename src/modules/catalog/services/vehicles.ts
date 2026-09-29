import { apiUrl } from "@/modules/shared/services/api";
import { toVehicle } from "@/modules/shared/services/vehicles";
import type { Vehicle, VehicleDto } from "@/modules/shared/types/vehicle";

import type { CatalogFilters } from "../types/filters";

/**
 * Resultado de una búsqueda: los vehículos ya normalizados más la paginación
 * tal como la entrega el backend (`count`/`num_pages`/`has_next`/`has_previous`
 * de `POST /v2/filter-cars/`).
 */
export type CatalogSearchResult = {
  vehicles: Vehicle[];
  count: number;
  numPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

const EMPTY_RESULT: CatalogSearchResult = { vehicles: [], count: 0, numPages: 0, hasNext: false, hasPrevious: false };

/**
 * El body de `POST /v2/filter-cars/`, verificado campo por campo contra el
 * backend real (no asumido del código de la SPA anterior): `brand` va por
 * **id** (por nombre da HTTP 500), `colors` va por **nombre** (por id no
 * filtra nada), `transmission` es `1`/`0`, `year_from`/`year_to` van con el
 * mismo valor (no hay rango real de años). Ver
 * `docs/planes/compra-tu-carro/referencia-sitio-anterior.md` §B.1.
 *
 * `fixedBodyTypeId` es el `bodyTypeId` de `CatalogConfig` (motos/vans/camión):
 * cuando está definido manda sobre `filters.bodyTypeIds` (el filtro "Tipo" del
 * sidebar no existe en esas variantes).
 */
function toSearchBody(filters: CatalogFilters, fixedBodyTypeId?: string): Record<string, unknown> {
  const body: Record<string, unknown> = {};

  if (filters.search) body.search_word = filters.search;
  if (filters.brandIds?.length) body.brand = filters.brandIds;
  if (filters.modelIds?.length) body.model = filters.modelIds;
  if (filters.colorNames?.length) body.colors = filters.colorNames;
  if (fixedBodyTypeId) body.body_type = [fixedBodyTypeId];
  else if (filters.bodyTypeIds?.length) body.body_type = filters.bodyTypeIds;
  if (filters.fuelTypes?.length) body.fuel_type = filters.fuelTypes;
  if (filters.tagIds?.length) body.tag = filters.tagIds;
  if (filters.sedeIds?.length) body.sedes = filters.sedeIds;
  if (filters.priceMin != null) body.price_from = filters.priceMin;
  if (filters.priceMax != null) body.price_to = filters.priceMax;
  if (filters.mileageMin != null) body.mileage_from = filters.mileageMin;
  if (filters.mileageMax != null) body.mileage_to = filters.mileageMax;
  if (filters.year) {
    body.year_from = filters.year;
    body.year_to = filters.year;
  }
  if (filters.transmission != null) body.transmission = filters.transmission;
  if (filters.traction?.length) body.traction = filters.traction;
  if (filters.plateDigits?.length) body.plate = filters.plateDigits;

  // "relevance" no manda nada; los otros tres sí, y "warranty" no compite con
  // el orden de precio (TODO: confirmar con diseño si deben poder combinarse).
  if (filters.orderBy === "price-desc") body.orderBy = "desc";
  else if (filters.orderBy === "price-asc") body.orderBy = "asc";
  else if (filters.orderBy === "warranty") body.warranty = true;

  return body;
}

/**
 * Busca vehículos en el catálogo (`POST /v2/filter-cars/?page=N`). Se llama
 * desde el cliente (el catálogo entero es un árbol `"use client"`: ver la
 * fila "Arquitectura cliente/servidor" del plan), así que **sin**
 * `next.revalidate` — no tiene sentido cachear una búsqueda con filtros.
 *
 * Si el `fetch` falla, no se cae la vista: devuelve el resultado vacío y
 * registra el error (mismo criterio que el resto de servicios del sitio).
 */
export async function searchVehicles(
  filters: CatalogFilters,
  page: number,
  fixedBodyTypeId?: string,
): Promise<CatalogSearchResult> {
  const url = apiUrl(`/v2/filter-cars/?page=${page}`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSearchBody(filters, fixedBodyTypeId)),
    });
    if (!response.ok) {
      throw new Error(`POST ${url} respondió ${response.status}`);
    }
    const page_: {
      results?: VehicleDto[];
      count?: number;
      num_pages?: number;
      has_next?: boolean;
      has_previous?: boolean;
    } = await response.json();

    const vehicles: Vehicle[] = [];
    for (const dto of page_.results ?? []) {
      const vehicle = toVehicle(dto);
      if (vehicle) vehicles.push(vehicle);
    }

    return {
      vehicles,
      count: page_.count ?? 0,
      numPages: page_.num_pages ?? 0,
      hasNext: page_.has_next ?? false,
      hasPrevious: page_.has_previous ?? false,
    };
  } catch (error) {
    console.error("No se pudo buscar en el catálogo:", error);
    return EMPTY_RESULT;
  }
}
