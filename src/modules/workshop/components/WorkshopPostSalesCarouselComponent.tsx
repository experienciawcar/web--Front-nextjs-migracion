"use client";

import type { StaticImageData } from "next/image";

import CarouselSegmentsComponent from "@/modules/shared/components/CarouselSegmentsComponent";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";

const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export type PostSalesCard = {
  id: string;
  icon: StaticImageData;
  title: string;
  titleItalic?: string;
  description: string;
  /** Interlineado de la descripción (la primera va a 22 y la segunda a 24). */
  descriptionClassName?: string;
  /** Ancho de la tarjeta: el de mobile y el de desktop (`w-[243px] xl:w-[334px]`). */
  widthClassName: string;
};

/**
 * Las tarjetas de "Servicios Postventa". En desktop son dos columnas fijas (una
 * fila con 129 px entre ellas); bajo `xl` son un carrusel con `scroll-snap`,
 * porque en mobile (Figma, marco 1:9787) la segunda tarjeta asoma por el borde
 * derecho: 243 y 244 de ancho con 16 entre ellas, la primera en x=32, y debajo
 * las rayas de paginación a 64 px de las tarjetas (una por posición y clicable,
 * como manda el proyecto). El diseño dibuja cuatro rayas de 48 con 16 de
 * separación; con dos tarjetas hay dos posiciones, y las rayas se dejan en 48
 * (con los 12 de separación del componente).
 *
 * El `after:` deja espacio al final para que la última tarjeta pueda llegar al
 * borde izquierdo (así hay una posición por tarjeta).
 */
export default function WorkshopPostSalesCarouselComponent({ cards }: { cards: PostSalesCard[] }) {
  const [ref, carousel] = useCarousel<HTMLUListElement>();

  return (
    <div className="reveal mt-16 xl:mt-[60px] xl:ml-3">
      <ul
        ref={ref}
        className={`-mx-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-8 scroll-pl-8 after:w-[calc(100%-259px)] after:shrink-0 xl:mx-0 xl:gap-[129px] xl:overflow-visible xl:px-0 xl:after:hidden ${SIN_SCROLLBAR}`}
      >
        {cards.map((card) => (
          <li key={card.id} className={`shrink-0 snap-start ${card.widthClassName}`}>
            <FeatureCardComponent
              icon={card.icon}
              title={card.title}
              titleItalic={card.titleItalic}
              description={card.description}
              descriptionClassName={card.descriptionClassName}
            />
          </li>
        ))}
      </ul>

      <div className="mt-[52px] flex justify-center xl:hidden">
        <CarouselSegmentsComponent
          position={carousel.position}
          positions={carousel.positions}
          onSelect={carousel.scrollToPosition}
          className="max-w-full flex-none"
          style={{ width: carousel.positions * 60 - 12 }}
        />
      </div>
    </div>
  );
}
