"use client";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import CarouselDotsComponent from "@/modules/shared/components/CarouselDotsComponent";
import TestimonialCardComponent from "@/modules/shared/components/TestimonialCardComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";
import type { Review } from "@/modules/shared/types/reviews";

/** Sin barra de scroll: el desplazamiento se hace con las flechas, las rayas o el dedo. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * Carrusel de reseñas de "Testimonios y Opiniones": las tarjetas
 * (`TestimonialCardComponent`, compartida con "¿Qué dicen de wcar?" de Sobre
 * Nosotros) y, debajo, flechas + rayas de paginación (`CarouselDotsComponent`),
 * a diferencia de la línea continua que usa Sobre Nosotros. Mobile: sin
 * flechas (se desliza con el dedo), solo las rayas.
 */
export default function SellTestimonialsCarouselComponent({ reviews }: { reviews: Review[] }) {
  const [listRef, carousel] = useCarousel<HTMLUListElement>();

  return (
    <div className="reveal min-w-0 flex-1">
      <ul
        ref={listRef}
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto ${SIN_SCROLLBAR}`}
      >
        {reviews.map((review) => (
          <TestimonialCardComponent key={review.id} review={review} />
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-6">
        <CarouselArrowsComponent
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          onPrev={carousel.prev}
          onNext={carousel.next}
          className="hidden xl:flex"
        />
        <CarouselDotsComponent
          total={carousel.positions}
          active={carousel.position}
          width={40}
          onSelect={carousel.scrollToPosition}
        />
      </div>
    </div>
  );
}
