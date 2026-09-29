"use client";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import TestimonialCardComponent from "@/modules/shared/components/TestimonialCardComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";
import type { Review } from "@/modules/shared/types/reviews";

/** Sin barra de scroll: el desplazamiento se hace con las flechas, la línea o el dedo. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * Carrusel de reseñas: las tarjetas, y debajo las flechas y la línea que lo
 * pagina.
 *
 * Desktop (captura del diseño): las tarjetas arrancan en x=429 y llegan hasta
 * el borde de la ventana, donde la tercera queda cortada; son de 381px con 25
 * en medio. Las flechas van en x=409 y la línea arranca en x=493 (28px
 * después) y también llega hasta el borde. El margen derecho negativo
 * (`calc(50%-50vw)`) es lo que las lleva hasta ahí: se calcula contra el
 * lienzo de 1440 centrado que pone la sección.
 *
 * La línea del diseño tiene un tramo grueso (el actual) sobre una raya fina.
 * Aquí es la misma raya partida en una parte por posición del carrusel, con la
 * actual gruesa, y cada parte se puede pulsar. Como en "Nuestro Equipo", los
 * controles se muestran siempre; con pocas reseñas quedan sin recorrido.
 *
 * Mobile: sin flechas (se desliza con el dedo), tarjetas de 300px y la línea a
 * todo el ancho. El diseño mobile no se pudo revisar.
 */
export default function TestimonialsCarouselComponent({ reviews }: { reviews: Review[] }) {
  const [listRef, carousel] = useCarousel<HTMLUListElement>();

  return (
    <div className="reveal mt-8 xl:mt-0">
      <ul
        ref={listRef}
        className={`-mr-8 flex snap-x snap-mandatory gap-[25px] overflow-x-auto pr-8 xl:mr-[calc(50%-50vw)] xl:ml-[429px] ${SIN_SCROLLBAR}`}
      >
        {reviews.map((review) => (
          <TestimonialCardComponent key={review.id} review={review} />
        ))}
      </ul>

      <div className="mt-6 flex items-center xl:mt-[35px] xl:mr-[calc(50%-50vw)] xl:ml-[409px]">
        <CarouselArrowsComponent
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          onPrev={carousel.prev}
          onNext={carousel.next}
          className="hidden xl:mr-7 xl:flex"
        />

        <div className="flex min-w-0 flex-1 items-center">
          {Array.from({ length: carousel.positions }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir a la posición ${index + 1} de ${carousel.positions}`}
              aria-current={index === carousel.position}
              onClick={() => carousel.scrollToPosition(index)}
              // El botón es más alto que la raya para tener dónde pulsar.
              className="flex h-6 min-w-0 flex-1 items-center"
            >
              <span
                className={`block w-full ${index === carousel.position ? "h-[3px] bg-gray" : "h-px bg-gray/30"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
