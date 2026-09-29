import { apiUrl } from "@/modules/shared/services/api";

import type { Version, VersionDto } from "../types/version";

/** Versiones de una marca (GET /version-brand/:brandId/), pedidas de nuevo cada vez que cambia la marca elegida. */
export async function getVersionsByBrand(brandId: string): Promise<Version[]> {
  const url = apiUrl(`/version-brand/${brandId}/`);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const versions: VersionDto[] = await response.json();

    return versions
      .map((dto) => ({ id: String(dto.id), label: dto.version?.trim() ?? "" }))
      .filter((version) => version.label);
  } catch (error) {
    console.error("No se pudieron cargar las versiones:", error);
    return [];
  }
}
