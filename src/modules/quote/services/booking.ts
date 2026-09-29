import { apiUrl } from "@/modules/shared/services/api";

import type { BookDate, BookDateDto, BookHour, BookHourDto } from "../types/booking";

/** "hh:mm" a partir de "hh:mm:ss". */
function trimSeconds(time: string): string {
  return time.slice(0, 5);
}

/** Fechas disponibles para agendar la cita de venta (GET /date-avaliable-review-sell/). */
export async function getAvailableDates(): Promise<BookDate[]> {
  const url = apiUrl("/date-avaliable-review-sell/");

  try {
    const response = await fetch(url, { next: { revalidate: 60 * 15 } });
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const dates: BookDateDto[] = await response.json();

    return dates.filter((dto) => dto.typeSell).map((dto) => ({ id: String(dto.id), date: dto.date }));
  } catch (error) {
    console.error("No se pudieron cargar las fechas disponibles:", error);
    return [];
  }
}

/** Horas disponibles de una fecha (GET /date-avaliable-review-sell/:dateId/), pedidas al elegir la fecha. */
export async function getAvailableHours(dateId: string): Promise<BookHour[]> {
  const url = apiUrl(`/date-avaliable-review-sell/${dateId}/`);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GET ${url} respondió ${response.status}`);
    const hours: BookHourDto[] = await response.json();

    return hours.map((dto) => ({ id: String(dto.id), from: trimSeconds(dto.hour_from), to: trimSeconds(dto.hour_to) }));
  } catch (error) {
    console.error("No se pudieron cargar las horas disponibles:", error);
    return [];
  }
}
