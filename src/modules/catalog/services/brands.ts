import { apiUrl } from "@/modules/shared/services/api";

import type { Brand, BrandDto } from "../types/brand";

/** Igual que el resto de servicios de opciones de filtro: se piden una vez al montar. */
const REVALIDATE_SECONDS = 60 * 60;

function toBrand(dto: BrandDto): Brand {
  return {
    id: String(dto.id),
    name: dto.brand?.trim() ?? "",
    // URL propia y estable (ver `getBrandLogoSource`): la del backend es una URL firmada de GCS
    // que cambia en cada llamada, y con ella el caché de imágenes de Next nunca se reutiliza.
    imageUrl: dto.image ? `/api/marca-logo/${dto.id}` : null,
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
async function fetchBrandDtos(): Promise<BrandDto[]> {
  const url = apiUrl("/v2/brands/");
  const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
  return response.json();
}

/** URL firmada vigente del logo de una marca, para que la ruta `/api/marca-logo/[id]` lo descargue. */
export async function getBrandLogoSource(id: string): Promise<string | null> {
  const brands = await fetchBrandDtos();
  return brands.find((b) => String(b.id) === id)?.image || null;
}

export async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await fetchBrandDtos();
    return brands
      .map(toBrand)
      .filter((b) => b.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("No se pudieron cargar las marcas:", error);
    return [];
  }
}
