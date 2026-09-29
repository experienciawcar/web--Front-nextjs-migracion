import { getReviews } from "@/modules/shared/services/reviews";

import SellTestimonialsCarouselComponent from "./SellTestimonialsCarouselComponent";

/**
 * "Testimonios y Opiniones": panel negro con el título + el carrusel de
 * reseñas reales de Google (`GET /api/map/`, la misma fuente que ya usa "¿Qué
 * dicen de wcar?" de Sobre Nosotros). El sitio anterior descartaba las de 3
 * estrellas o menos (`filter(calification > 3)`); se replica con
 * `minRating: 4` (hoy hay una reseña de 1 estrella que queda fuera).
 *
 * Medido con `cdp.py` contra `https://wcar.co/vende-tu-carro` a 1440: panel
 * negro a la izquierda con el `<h2>` en dos renglones (36px, el segundo en
 * cursiva) y, a la derecha, las tarjetas de reseña con flechas + rayas de
 * paginación debajo (no una línea continua, a diferencia de Sobre Nosotros).
 *
 * Si no hay reseñas (o ninguna llega a 4 estrellas), la sección no se pinta.
 */
export default async function SellTestimonialsComponent() {
  const reviews = await getReviews({ minRating: 4 });

  if (reviews.length === 0) return null;

  return (
    <section aria-label="Testimonios y opiniones" className="bg-gray-light">
      <div className="container-wcar py-16 xl:py-20">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-stretch xl:gap-10">
          <div className="reveal flex w-full shrink-0 items-center justify-center rounded-lg bg-black px-8 py-12 xl:w-[300px]">
            <h2 className="text-center text-[32px] leading-[1.15] font-bold text-white xl:text-left xl:text-[36px]">
              Testimonios
              <br />
              <span className="font-normal italic">y Opiniones</span>
            </h2>
          </div>

          <SellTestimonialsCarouselComponent reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
