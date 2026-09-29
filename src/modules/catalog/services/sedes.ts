import { apiUrl } from "@/modules/shared/services/api";

import type { SedeDto, SedeOption } from "../types/filter-options";

const REVALIDATE_SECONDS = 60 * 60;

/**
 * Sedes para el filtro "Ubicación" (GET /sedes/). Servicio propio de este
 * catálogo, no el de `headquarters/`: ese usa una lista fija de 8 sedes del
 * sitio anterior porque las 3 que trae hoy el backend son datos de prueba sin
 * coincidir con el diseño de Sedes (ver la memoria del proyecto). Aquí da
 * igual: el filtro solo necesita las sedes reales que puede traer un vehículo
 * (`sede_car`), no una lista curada de marketing.
 */
export async function getSedes(): Promise<SedeOption[]> {
  const url = apiUrl("/sedes/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const sedes: SedeDto[] = await response.json();
    return sedes
      .filter((s) => s.active !== false)
      .map((s) => ({ id: String(s.id), name: s.name?.trim() ?? "" }))
      .filter((s) => s.name);
  } catch (error) {
    console.error("No se pudieron cargar las sedes:", error);
    return [];
  }
}
