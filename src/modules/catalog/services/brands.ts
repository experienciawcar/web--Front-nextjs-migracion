import { apiUrl } from "@/modules/shared/services/api";

import type { Brand, BrandDto } from "../types/brand";

/** Igual que el resto de servicios de opciones de filtro: se piden una vez al montar. */
const REVALIDATE_SECONDS = 60 * 60;

function toBrand(dto: BrandDto): Brand {
  return {
    id: String(dto.id),
    name: dto.brand?.trim() ?? "",
    imageUrl: dto.image || null,
    models: (dto.modelcar_set ?? [])
      .map((m) => ({ id: String(m.id), name: m.model?.trim() ?? "" }))
      .filter((m) => m.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es")),
  };
}

/**
 * Marcas para el filtro "Marca y modelo" (GET /v2/brands/), con sus modelos
 * ya anidados (ver `types/brand.ts`). El filtro manda `brand` por **id**: por
 * nombre el backend responde HTTP 500 (verificado, ver la referencia del plan).
 */
export async function getBrands(): Promise<Brand[]> {
  const url = apiUrl("/v2/brands/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const brands: BrandDto[] = await response.json();
    return brands
      .map(toBrand)
      .filter((b) => b.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("No se pudieron cargar las marcas:", error);
    return [];
  }
}
