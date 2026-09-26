import { apiUrl } from "@/modules/shared/services/api";

import type { Ally, PartnerDto } from "../types/allies";

/**
 * Cada cuánto se vuelve a pedir la lista. Los logos son URLs firmadas que
 * caducan a las 24 h (X-Goog-Expires=86400) y la página con esas URLs queda
 * cacheada, así que esto tiene que ser bastante menor: con una hora hay margen.
 * Ojo: si la página se queda sin visitas más de 24 h, la primera visita todavía
 * recibe la versión vieja (con los logos caducados) mientras se regenera.
 */
const REVALIDATE_SECONDS = 60 * 60;

/**
 * Aliados para la sección "Nuestros Aliados" (GET /api/partners/), en el orden
 * en que los entrega el backend. Un aliado sin logo no se puede pintar, así que
 * se descarta.
 *
 * Si el backend falla no se cae la página: devuelve una lista vacía, la
 * sección no se pinta y el error queda en el log del servidor.
 */
export async function getAllies(): Promise<Ally[]> {
  const url = apiUrl("/partners/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) {
      throw new Error(`GET ${url} respondió ${response.status}`);
    }
    const partners: PartnerDto[] = await response.json();

    return partners.flatMap((partner) =>
      partner.image ? [{ id: partner.id, name: partner.partner.trim(), logoUrl: partner.image }] : [],
    );
  } catch (error) {
    console.error("No se pudieron cargar los aliados:", error);
    return [];
  }
}
