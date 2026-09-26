import type { TermsDto, TermsLink } from "../types/terms";
import { apiUrl } from "./api";

/**
 * Los documentos legales casi no cambian; una hora de caché es de sobra y
 * evita pedirlos en cada visita, porque el footer va en todas las páginas.
 */
const REVALIDATE_SECONDS = 60 * 60;

function toTermsLink(terms: TermsDto): TermsLink {
  return {
    id: terms.id,
    title: terms.title.trim(),
    // Los slugs traen tildes, espacios y signos (ver `TermsDto.url`); sin
    // codificar, un "?" o un "#" en el slug cortaría la ruta.
    href: `/${encodeURIComponent(terms.url)}/${terms.id}`,
    isApp: terms.is_app,
  };
}

/**
 * Documentos legales para los desplegables del footer
 * (GET /api/terms/no-contents/).
 *
 * Si el backend falla devuelve una lista vacía y los desplegables quedan sin
 * enlaces dinámicos: el footer no puede tumbar la página entera. El error queda
 * en el log del servidor.
 *
 * Solo se devuelven los activos: el endpoint trae `active` y el sitio anterior
 * no lo filtraba, pero pintar un documento dado de baja no tiene sentido.
 */
export async function getTermsLinks(): Promise<TermsLink[]> {
  const url = apiUrl("/terms/no-contents/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) {
      throw new Error(`GET ${url} respondió ${response.status}`);
    }
    const terms: TermsDto[] = await response.json();
    return terms.filter((item) => item.active).map(toTermsLink);
  } catch (error) {
    console.error("No se pudieron cargar los términos y condiciones:", error);
    return [];
  }
}
