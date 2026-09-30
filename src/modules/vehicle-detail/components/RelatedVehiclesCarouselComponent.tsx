"use client";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import CarouselSegmentsComponent from "@/modules/shared/components/CarouselSegmentsComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";

/** Sin barra de scroll: se desliza con el dedo, las flechas o las rayas. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * La parte interactiva de "Vehículos relacionados": la fila de tarjetas con `scroll-snap`
 * (`useCarousel`) y, debajo, las flechas y las rayas que la paginan. Las tarjetas llegan ya
 * pintadas por el servidor (`children`, una `<li>` por vehículo).
 *
 * Figma 89:4207: tarjetas de 291 con 9,33 entre ellas (cuatro llenan los 1192 del contenido:
 * 4 x 291 + 3 x 9,33); los controles quedan 43 debajo de las tarjetas: dos flechas de 24 con 8 de
 * separación y, desde 88 del borde, las rayas de paginación (naranja la activa). Los controles se
 * ven siempre y funcionan aunque quepan todas (regla de la guía §3.3): con cuatro o menos hay una
 * sola posición y las flechas quedan apagadas.
 *
 * Los 16 px de relleno a la izquierda y los 24 de abajo son para la sombra de las tarjetas, que el
 * `overflow` recortaría; se compensan con márgenes negativos y `scroll-pl-4` respeta el relleno.
 * Mobile (Figma 89:4840): sin flechas, solo las rayas; la tarjeta siguiente asoma por la derecha.
 */
export default function RelatedVehiclesCarouselComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ref, carousel] = useCarousel<HTMLUListElement>();

  return (
    <div className="min-w-0">
      <ul
        ref={ref}
        role="list"
        className={`-mt-2 -mr-8 -mb-6 -ml-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 pt-2 pr-8 pb-6 pl-4 xl:mr-0 xl:gap-[9.33px] xl:pr-0 ${SIN_SCROLLBAR}`}
      >
        {children}
      </ul>

      <div className="mt-[43px] flex h-8 items-center">
        <CarouselArrowsComponent
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          onPrev={carousel.prev}
          onNext={carousel.next}
          className="ml-1 max-xl:hidden"
        />
        <CarouselSegmentsComponent
          position={carousel.position}
          positions={carousel.positions}
          onSelect={carousel.scrollToPosition}
          className="xl:ml-[26px]"
        />
      </div>
    </div>
  );
}
