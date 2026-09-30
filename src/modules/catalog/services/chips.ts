import {
  FUEL_TYPES,
  TRACTIONS,
  TRANSMISSIONS,
} from "../constants/filter-options";
import type { CatalogFilterOptions } from "./options";
import type { CatalogFilters } from "../types/filters";

/** Un filtro activo, como chip: `id` codifica qué filtro y qué valor es, para poder quitarlo con `removeChip`. */
export type ActiveChip = { id: string; label: string };

const priceFormat = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

/** "Precio: $ 20.000.000 - $ 50.000.000" / "Desde $ 20.000.000" / "Hasta $ 50.000.000". */
function formatRange(
  prefix: string,
  min: number | undefined,
  max: number | undefined,
  unit: string,
  currency = "",
): string {
  const fmt = (n: number) => `${currency}${priceFormat.format(n)}${unit}`;
  if (min != null && max != null) return `${prefix}: ${fmt(min)} - ${fmt(max)}`;
  if (min != null) return `${prefix}: desde ${fmt(min)}`;
  return `${prefix}: hasta ${fmt(max ?? 0)}`;
}

/**
 * Los filtros activos como lista de chips, con el texto ya resuelto contra
 * `options` (las marcas/colores/etc. vienen por id o valor crudo en
 * `CatalogFilters`; el chip necesita el nombre legible). Se apoya en los
 * mismos ids/nombres que ya usa `services/vehicles.ts` para armar el body de
 * la búsqueda — ver `docs/planes/compra-tu-carro/referencia-sitio-anterior.md` §B.1.
 */
export function getActiveChips(
  filters: CatalogFilters,
  options: CatalogFilterOptions,
): ActiveChip[] {
  const chips: ActiveChip[] = [];

  if (filters.search)
    chips.push({ id: "search", label: `Búsqueda: ${filters.search}` });

  for (const id of filters.brandIds ?? []) {
    const brand = options.brands.find((b) => b.id === id);
    if (brand) chips.push({ id: `brand:${id}`, label: brand.name });
  }
  for (const id of filters.modelIds ?? []) {
    const model = options.brands
      .flatMap((b) => b.models)
      .find((m) => m.id === id);
    if (model) chips.push({ id: `model:${id}`, label: model.name });
  }
  for (const name of filters.colorNames ?? [])
    chips.push({ id: `color:${name}`, label: name });
  for (const id of filters.bodyTypeIds ?? []) {
    const type = options.vehicleTypes.find((t) => String(t.id) === id);
    if (type) chips.push({ id: `bodyType:${id}`, label: type.name });
  }
  for (const value of filters.fuelTypes ?? []) {
    const fuel = FUEL_TYPES.find((f) => f.value === value);
    if (fuel) chips.push({ id: `fuel:${value}`, label: fuel.label });
  }
  for (const id of filters.tagIds ?? []) {
    const tag = options.tags.find((t) => t.id === id);
    if (tag) chips.push({ id: `tag:${id}`, label: tag.name });
  }
  for (const id of filters.sedeIds ?? []) {
    const sede = options.sedes.find((s) => s.id === id);
    if (sede) chips.push({ id: `sede:${id}`, label: sede.name });
  }
  if (filters.priceMin != null || filters.priceMax != null) {
    chips.push({
      id: "price",
      label: formatRange(
        "Precio",
        filters.priceMin,
        filters.priceMax,
        "",
        "$ ",
      ),
    });
  }
  if (filters.mileageMin != null || filters.mileageMax != null) {
    chips.push({
      id: "mileage",
      label: formatRange(
        "Kilometraje",
        filters.mileageMin,
        filters.mileageMax,
        " Km",
      ),
    });
  }
  if (filters.year) chips.push({ id: "year", label: `Año: ${filters.year}` });
  if (filters.transmission != null) {
    const transmission = TRANSMISSIONS.find(
      (t) => t.value === filters.transmission,
    );
    if (transmission)
      chips.push({ id: "transmission", label: transmission.label });
  }
  for (const id of filters.traction ?? []) {
    const traction = TRACTIONS.find((t) => t.value === id);
    if (traction) chips.push({ id: `traction:${id}`, label: traction.label });
  }
  for (const digit of filters.plateDigits ?? [])
    chips.push({ id: `plate:${digit}`, label: `Placa: ${digit}` });

  return chips;
}

/** Quita un solo valor del filtro que corresponda (`chipId` de `getActiveChips`), sin tocar el resto. */
export function removeChip(
  filters: CatalogFilters,
  chipId: string,
): CatalogFilters {
  const sep = chipId.indexOf(":");
  const kind = sep === -1 ? chipId : chipId.slice(0, sep);
  const value = sep === -1 ? "" : chipId.slice(sep + 1);

  switch (kind) {
    case "brand":
      return {
        ...filters,
        brandIds: filters.brandIds?.filter((id) => id !== value),
      };
    case "model":
      return {
        ...filters,
        modelIds: filters.modelIds?.filter((id) => id !== value),
      };
    case "color":
      return {
        ...filters,
        colorNames: filters.colorNames?.filter((name) => name !== value),
      };
    case "bodyType":
      return {
        ...filters,
        bodyTypeIds: filters.bodyTypeIds?.filter((id) => id !== value),
      };
    case "fuel":
      return {
        ...filters,
        fuelTypes: filters.fuelTypes?.filter((fuel) => fuel !== value),
      };
    case "tag":
      return {
        ...filters,
        tagIds: filters.tagIds?.filter((id) => id !== value),
      };
    case "sede":
      return {
        ...filters,
        sedeIds: filters.sedeIds?.filter((id) => id !== value),
      };
    case "traction":
      return {
        ...filters,
        traction: filters.traction?.filter((id) => id !== value),
      };
    case "plate":
      return {
        ...filters,
        plateDigits: filters.plateDigits?.filter(
          (digit) => String(digit) !== value,
        ),
      };
    case "price":
      return { ...filters, priceMin: undefined, priceMax: undefined };
    case "mileage":
      return { ...filters, mileageMin: undefined, mileageMax: undefined };
    case "search":
      return { ...filters, search: undefined };
    case "year":
      return { ...filters, year: undefined };
    case "transmission":
      return { ...filters, transmission: undefined };
    default:
      return filters;
  }
}
