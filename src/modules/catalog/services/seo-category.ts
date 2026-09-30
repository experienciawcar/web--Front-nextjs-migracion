import { SEO_CATEGORIES } from "../constants/seo-categories";
import type { CatalogConfig } from "../types/catalog";
import type { CatalogFilters } from "../types/filters";
import type { SeoCategory } from "../types/seo";
import type { CatalogFilterOptions } from "./options";

/** Nombres de `/type-cars/` que cuentan como "Camioneta" (comparten el slug `camionetas-usadas`). */
const SUV_TYPE_NAMES = ["Camioneta - SUV", "SUV"];

/**
 * Qué contenido SEO (banner + acordeón) corresponde a los filtros activos, o `null` si ninguno.
 * Mismas reglas del sitio anterior (`docs/SEO_CATALOGO_COMPRA_TU_CARRO.md` §2), en un solo lugar
 * y sin repetir cinco bloques:
 * - Motos: por la variante del catálogo (solo acordeón, sin banner).
 * - Híbridos: combustible "hibrido" y ninguna camioneta marcada.
 * - Camionetas / Coupe / Sedan / Hatchback: ese tipo marcado y no híbrido.
 * Híbrido + camioneta a la vez no muestra ninguno de los dos.
 */
export function getSeoCategory(
  config: CatalogConfig,
  filters: CatalogFilters,
  options: CatalogFilterOptions,
): SeoCategory | null {
  if (config.kind === "motos") return SEO_CATEGORIES.motos;
  if (config.kind !== "carros") return null;

  const typeNames = (filters.bodyTypeIds ?? []).map(
    (id) => options.vehicleTypes.find((t) => String(t.id) === id)?.name,
  );
  const isSuv = typeNames.some((name) => name !== undefined && SUV_TYPE_NAMES.includes(name));
  const isHybrid = !!filters.fuelTypes?.includes("hibrido");

  if (isHybrid) return isSuv ? null : SEO_CATEGORIES.hibridos;
  if (isSuv) return SEO_CATEGORIES.camionetas;
  if (typeNames.includes("Coupe")) return SEO_CATEGORIES.coupe;
  if (typeNames.includes("Sedan")) return SEO_CATEGORIES.sedan;
  if (typeNames.includes("Hatchback")) return SEO_CATEGORIES.hatchback;
  return null;
}
