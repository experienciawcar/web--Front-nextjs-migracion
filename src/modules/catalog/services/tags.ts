import { apiUrl } from "@/modules/shared/services/api";

import type { TagDto, TagOption } from "../types/filter-options";

const REVALIDATE_SECONDS = 60 * 60;

/**
 * Ids que el sitio anterior excluye a propósito del filtro "Disponibilidad":
 * `9` es un duplicado exacto de `1` ("Vehículo por ingresar"); `13` no existe
 * hoy en `/v2/tags/` (se deja el id igual, por si vuelve a aparecer).
 */
const EXCLUDED_TAG_IDS = new Set([9, 13]);

/** Etiquetas para el filtro "Disponibilidad" (GET /v2/tags/). Se manda por id. */
export async function getTags(): Promise<TagOption[]> {
  const url = apiUrl("/v2/tags/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const tags: TagDto[] = await response.json();
    return tags
      .filter((t) => !EXCLUDED_TAG_IDS.has(t.id))
      .map((t) => ({ id: String(t.id), name: t.tag?.trim() ?? "", color: t.color?.trim() || "#000000" }))
      .filter((t) => t.name);
  } catch (error) {
    console.error("No se pudieron cargar las etiquetas de disponibilidad:", error);
    return [];
  }
}
