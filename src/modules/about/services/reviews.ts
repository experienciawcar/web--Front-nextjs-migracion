import { apiUrl } from "@/modules/shared/services/api";

import type { Review, ReviewDto } from "../types/reviews";

/**
 * Las reseñas de Google cambian poco (llegan de a una por día o menos) y el
 * backend las consulta a Google, así que una hora de caché es de sobra.
 */
const REVALIDATE_SECONDS = 60 * 60;

/** Zona horaria de las fechas: la de Colombia, para que un día no se corra por la hora del servidor. */
const TIME_ZONE = "America/Bogota";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/** "Septiembre 26 / 2026", como en el diseño ("Junio 02 / 2023"). */
function formatDate(date: Date): string {
  const parts = Object.fromEntries(
    dateFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  const month = parts.month.charAt(0).toUpperCase() + parts.month.slice(1);
  return `${month} ${parts.day} / ${parts.year}`;
}

function toReview(dto: ReviewDto, id: number): Review {
  // `time` viene en segundos; Date espera milisegundos.
  const date = new Date(dto.time * 1000);

  return {
    id,
    authorName: dto.author_name.trim(),
    photoUrl: dto.profile_photo_url || null,
    rating: dto.rating,
    text: (dto.text ?? "").trim(),
    dateLabel: formatDate(date),
    dateIso: date.toISOString(),
  };
}

/**
 * Reseñas para la sección "¿Qué dicen de wcar?" (GET /api/map/), en el orden
 * en que las entrega el backend. Una reseña sin texto no es un testimonio, así
 * que se descarta.
 *
 * Si el backend falla no se cae la página: devuelve una lista vacía, la
 * sección no se pinta y el error queda en el log del servidor.
 */
export async function getReviews(): Promise<Review[]> {
  const url = apiUrl("/map/");

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) {
      throw new Error(`GET ${url} respondió ${response.status}`);
    }
    const reviews: ReviewDto[] = await response.json();

    return reviews.map(toReview).filter((review) => review.text !== "");
  } catch (error) {
    console.error("No se pudieron cargar las reseñas:", error);
    return [];
  }
}
