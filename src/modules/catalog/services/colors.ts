import { apiUrl } from "@/modules/shared/services/api";

import type { ColorDto, ColorOption } from "../types/filter-options";

const REVALIDATE_SECONDS = 60 * 60;

/**
 * Colores para el filtro "Color" (GET /v2/colors/). Se manda por **nombre**,
 * no por id: por id el backend no filtra nada (verificado, ver la referencia
 * del plan). El círculo de cada opción se pinta con `hex` tal cual lo entrega
 * el backend (no todos son válidos: alguno viene corto, "#48e" es azul).
 */
export async function getColors(): Promise<ColorOption[]> {
  const url = apiUrl("/v2/colors/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const colors: ColorDto[] = await response.json();
    return colors
      .map((c) => ({ name: c.name?.trim() ?? "", hex: c.hex?.trim() || "#cccccc" }))
      .filter((c) => c.name)
      // El backend repite nombres (dos "Dorado", dos "gfh"): como el filtro va por nombre son la
      // misma opción, y repetirlos duplicaba la `key` en la lista.
      .filter((c, index, all) => all.findIndex((other) => other.name === c.name) === index)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
  } catch (error) {
    console.error("No se pudieron cargar los colores:", error);
    return [];
  }
}
