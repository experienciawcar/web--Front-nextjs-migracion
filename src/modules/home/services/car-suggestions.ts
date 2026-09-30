import { apiUrl } from "@/modules/shared/services/api";

import type { CarSuggestion, CarSuggestionDto } from "../types/car-suggestion";

/** Menos de esto el backend responde `[]`: ni se pregunta. */
export const MIN_SUGGESTION_CHARS = 2;

const LIMIT = 8;

/**
 * Sugerencias del buscador del home (`GET /v2/car-suggestions/?q=`). Se llama
 * desde el cliente mientras se escribe, así que va sin caché de Next y acepta una
 * `AbortSignal` para cancelar la petición anterior cuando el usuario sigue
 * escribiendo.
 *
 * Nunca lanza: si falla o se cancela devuelve `[]` y el buscador sigue
 * funcionando como siempre (Enter o "Go" llevan al catálogo). Solo una falla de
 * verdad (no una cancelación) queda en el log.
 *
 * El backend agrupa sin distinguir mayúsculas, pero las versiones se cargan
 * mezcladas ("GRAND TOURING" / "Grand Touring") y llegan como dos sugerencias:
 * aquí se quitan los repetidos por nombre normalizado.
 */
export async function getCarSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<CarSuggestion[]> {
  const q = query.trim();
  if (q.length < MIN_SUGGESTION_CHARS) return [];

  const url = `${apiUrl("/v2/car-suggestions/")}?${new URLSearchParams({ q, limit: String(LIMIT) })}`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`GET ${url} respondió ${response.status}`);
    }
    const dtos: CarSuggestionDto[] = await response.json();
    if (!Array.isArray(dtos)) return [];

    const seen = new Set<string>();
    const suggestions: CarSuggestion[] = [];
    for (const dto of dtos) {
      const name = dto.name?.replace(/\s+/g, " ").trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      suggestions.push({ id: dto.id, name, type: dto.type?.trim() ?? "" });
    }
    return suggestions;
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) {
      console.error(
        "No se pudieron cargar las sugerencias del buscador:",
        error,
      );
    }
    return [];
  }
}
