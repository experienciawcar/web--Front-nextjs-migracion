import type { Stats } from "../types/stats";

/**
 * Datos de la sección "Nuestros Datos".
 *
 * TODO: reemplazar por la llamada real al backend. Los componentes ya reciben
 * todo por props y esta función es asíncrona, así que al conectar el endpoint
 * solo cambia el cuerpo de aquí: no hay que tocar la interfaz.
 *
 * Ojo con el contenido: en Figma las dos tarjetas de calificación son
 * idénticas (Google 4.5 con 1.500+ reseñas las dos). Se reproduce tal cual
 * porque es lo que dice el diseño, pero lo más probable es que la segunda
 * debiera ser otra fuente y quedó duplicada. Confirmar con diseño.
 */
export async function getStats(): Promise<Stats> {
  return {
    ratings: [
      { id: "google", score: "4.5", stars: 4.5, source: "Google", detail: "(1.500 + reseñas)" },
      { id: "google-2", score: "4.5", stars: 4.5, source: "Google", detail: "(1.500 + reseñas)" },
    ],
    figures: [
      { id: "ventas", value: "#1", title: "Ventas de vehículos", detail: "En toda colombia" },
      {
        id: "vendidos",
        value: "+ 2.900",
        title: "Vehículos vendidos",
        detail: "y reservados en 3 años",
      },
    ],
  };
}
