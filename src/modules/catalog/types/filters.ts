/**
 * Filtros del catálogo, en la forma que usa el formulario (ids/nombres como
 * `string`, listos para la URL). El mapeo a lo que espera el backend vive en
 * `services/vehicles.ts` (`toSearchBody`): ahí es donde importa que `brand`
 * vaya por id y `colors` por nombre, no aquí.
 *
 * Verificado campo por campo contra el backend real (no asumido del código de
 * la SPA anterior): ver `docs/planes/compra-tu-carro/referencia-sitio-anterior.md` §B.1.
 */
export type CatalogFilters = {
  search?: string;
  brandIds?: string[];
  modelIds?: string[];
  /** Por NOMBRE, no por id: así lo exige el backend (`colors`). */
  colorNames?: string[];
  /** Ids de `/type-cars/`. Se oculta en el sidebar cuando la variante trae `bodyTypeId` fijo. */
  bodyTypeIds?: string[];
  /** Valores fijos del backend ("gasolina", "diesel", "hibrido", "electrico", "gas"), no ids. */
  fuelTypes?: string[];
  /** Ids de `/v2/tags/`. */
  tagIds?: string[];
  /** Ids de `/sedes/`. */
  sedeIds?: string[];
  priceMin?: number;
  priceMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  /** Un solo año: el backend no soporta un rango real (manda `year_from` = `year_to`). */
  year?: string;
  /** `1` = automática, `0` = manual (como lo espera el backend). */
  transmission?: 0 | 1;
  traction?: string[];
  /** Dígitos de placa elegidos (0-9), tal como los pide el picker del diseño. */
  plateDigits?: number[];
  orderBy?: CatalogOrderBy;
};

export type CatalogOrderBy = "relevance" | "price-desc" | "price-asc" | "warranty";

/** El valor por defecto: sin ningún filtro activo, orden por relevancia. */
export const EMPTY_FILTERS: CatalogFilters = { orderBy: "relevance" };
