import { apiUrl } from "@/modules/shared/services/api";

import type { Brand, BrandDto } from "../types/brand";

/** Las marcas casi no cambian: una hora de caché es de sobra. */
const REVALIDATE_SECONDS = 60 * 60;

/**
 * Marcas para el select "Marca" del paso "Datos del carro" (GET /v2/brands/).
 *
 * No reutiliza `catalog/services/brands.ts` (que ya pide este mismo endpoint
 * para el filtro del catálogo): ese módulo lo está tocando otra sesión en
 * paralelo ahora mismo, y aquí solo hace falta `{id, name}`, no los modelos
 * anidados que trae esa versión. Si `catalog/` se estabiliza, promover una
 * sola versión a `shared/` (ver docs/planes/cotizar.md, Registro).
 */
export async function getBrands(): Promise<Brand[]> {
  const url = apiUrl("/v2/brands/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const brands: BrandDto[] = await response.json();

    return brands
      .map((dto) => ({ id: String(dto.id), name: dto.brand?.trim() ?? "" }))
      .filter((brand) => brand.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("No se pudieron cargar las marcas:", error);
    return [];
  }
}
