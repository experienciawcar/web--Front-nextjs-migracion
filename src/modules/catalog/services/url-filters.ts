import type { CatalogFilterOptions } from "./options";
import type { CatalogFilters, CatalogOrderBy } from "../types/filters";

/** Los tres valores de orden que sí viajan en la URL ("relevance" es el default, se omite. */
const ORDER_BY_PARAM_VALUES: CatalogOrderBy[] = ["price-desc", "price-asc", "warranty"];

function joinValues(values: string[] | undefined): string | undefined {
  return values?.length ? values.join("-") : undefined;
}

function splitValues(value: string | null): string[] {
  return value ? value.split("-").filter(Boolean) : [];
}

/**
 * `CatalogFilters` -> query params, con los mismos nombres que usaba la SPA anterior
 * (confirmado contra su código fuente real, no solo contra la documentación) donde el
 * campo coincide con lo que ya guarda este proyecto. Deep-linking: cada filtro se puede
 * compartir/recargar y vuelve al mismo catálogo filtrado.
 *
 * Deltas a propósito frente a la SPA anterior (decisión: mantener consistente, no replicar
 * deuda técnica — ver `docs/planes/compra-tu-carro/diseno-filtros-laterales.md` §8):
 * - `brand`/`model` van por **id**, no por nombre: así es como ya funciona `CatalogFilters`
 *   contra el backend real (por nombre, `brand` da HTTP 500 — ver la referencia §B.1).
 * - `year` es un solo valor, no un arreglo "2020-2021": esta implementación ya es de
 *   selección única (`YearFilterComponent`), probado contra el backend real como rango
 *   verdadero solo cuando `year_from` = `year_to`.
 * - `transmission` es un solo valor `0`/`1`, no un arreglo: ya es de selección excluyente
 *   en este proyecto (un vehículo es automático o manual, no las dos).
 */
export function filtersToSearchParams(filters: CatalogFilters, page: number): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);

  const brand = joinValues(filters.brandIds);
  if (brand) params.set("brand", brand);

  const model = joinValues(filters.modelIds);
  if (model) params.set("model", model);

  if (filters.colorNames?.length) params.set("color", filters.colorNames.join("-"));

  const type = joinValues(filters.bodyTypeIds);
  if (type) params.set("type_vehicle", type);

  if (filters.fuelTypes?.length) params.set("typeOfFuels", filters.fuelTypes.join("-"));

  const tag = joinValues(filters.tagIds);
  if (tag) params.set("tag", tag);

  const sede = joinValues(filters.sedeIds);
  if (sede) params.set("location", sede);

  if (filters.priceMin != null) params.set("min_price", String(filters.priceMin));
  if (filters.priceMax != null) params.set("max_price", String(filters.priceMax));
  if (filters.mileageMin != null) params.set("km_min", String(filters.mileageMin));
  if (filters.mileageMax != null) params.set("km_max", String(filters.mileageMax));
  if (filters.year) params.set("year", filters.year);
  if (filters.transmission != null) params.set("transmission", String(filters.transmission));

  if (filters.traction?.length) params.set("traccion", filters.traction.join("-"));
  if (filters.plateDigits?.length) params.set("plate", filters.plateDigits.join("-"));

  if (filters.orderBy && ORDER_BY_PARAM_VALUES.includes(filters.orderBy)) params.set("orderBy", filters.orderBy);
  if (page > 1) params.set("page", String(page));

  return params;
}

/**
 * Query params -> `CatalogFilters`, para el deep-linking al montar (recarga de página o URL
 * compartida) — la contraparte de `filtersToSearchParams`.
 *
 * `type_vehicle` acepta tanto ids (lo que escribe este mismo módulo) como nombres (los 8
 * enlaces de categoría del navbar, ej. `?type_vehicle=SUV`, resueltos también en servidor
 * para el primer render — ver `page.tsx` de `/compra-tu-carro`): mismo doble formato que
 * aceptaba la SPA anterior.
 */
export function searchParamsToFilters(
  params: URLSearchParams,
  options: CatalogFilterOptions,
): { filters: Partial<CatalogFilters>; page: number } {
  const filters: Partial<CatalogFilters> = {};

  const search = params.get("search");
  if (search) filters.search = search;

  const brand = splitValues(params.get("brand"));
  if (brand.length) filters.brandIds = brand;

  const model = splitValues(params.get("model"));
  if (model.length) filters.modelIds = model;

  const color = splitValues(params.get("color"));
  if (color.length) filters.colorNames = color;

  const typeVehicleTokens = splitValues(params.get("type_vehicle"));
  if (typeVehicleTokens.length) {
    const ids = new Set<string>();
    for (const token of typeVehicleTokens) {
      const type =
        options.vehicleTypes.find((t) => String(t.id) === token) ?? options.vehicleTypes.find((t) => t.name === token);
      if (type) ids.add(String(type.id));
    }
    if (ids.size) filters.bodyTypeIds = [...ids];
  }

  const fuel = splitValues(params.get("typeOfFuels"));
  if (fuel.length) filters.fuelTypes = fuel;

  const tag = splitValues(params.get("tag"));
  if (tag.length) filters.tagIds = tag;

  const sede = splitValues(params.get("location"));
  if (sede.length) filters.sedeIds = sede;

  const minPrice = params.get("min_price");
  if (minPrice) filters.priceMin = Number(minPrice);
  const maxPrice = params.get("max_price");
  if (maxPrice) filters.priceMax = Number(maxPrice);
  const kmMin = params.get("km_min");
  if (kmMin) filters.mileageMin = Number(kmMin);
  const kmMax = params.get("km_max");
  if (kmMax) filters.mileageMax = Number(kmMax);

  const year = params.get("year");
  if (year) filters.year = year;

  const transmission = params.get("transmission");
  if (transmission === "0" || transmission === "1") filters.transmission = Number(transmission) as 0 | 1;

  const traction = splitValues(params.get("traccion"));
  if (traction.length) filters.traction = traction;

  const plate = splitValues(params.get("plate"));
  if (plate.length) {
    const digits = plate.map(Number).filter((n) => !Number.isNaN(n));
    if (digits.length) filters.plateDigits = digits;
  }

  const orderBy = params.get("orderBy") as CatalogOrderBy | null;
  if (orderBy && ORDER_BY_PARAM_VALUES.includes(orderBy)) filters.orderBy = orderBy;

  const pageParam = Number(params.get("page"));
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  return { filters, page };
}
