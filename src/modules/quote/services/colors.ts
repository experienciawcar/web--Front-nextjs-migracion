import { apiUrl } from "@/modules/shared/services/api";

import type { Color, ColorDto } from "../types/color";

const REVALIDATE_SECONDS = 60 * 60;

/** Colores para el select "Color" (GET /v2/colors/), conservando el `id` que pide el backend al crear la cotización. */
export async function getColors(): Promise<Color[]> {
  const url = apiUrl("/v2/colors/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const colors: ColorDto[] = await response.json();

    return colors
      .map((dto) => ({ id: String(dto.id), name: dto.name?.trim() ?? "", hex: dto.hex?.trim() || "#cccccc" }))
      .filter((color) => color.name)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("No se pudieron cargar los colores:", error);
    return [];
  }
}
