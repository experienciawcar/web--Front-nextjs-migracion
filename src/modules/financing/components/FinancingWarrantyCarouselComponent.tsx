"use client";

import CarouselPagesComponent from "@/modules/shared/components/CarouselPagesComponent";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";

import type { FinancingFeature } from "../types/financing-feature";

/** Sin barra de scroll: el desplazamiento se hace con el dedo o las rayas. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * Las tres tarjetas de la garantía. En desktop son una fila fija de 876 (tres
 * columnas iguales); en teléfono (< 1280, marco "items" 204:7850 de "financiación
 * - 394") son un carrusel con `scroll-snap`: tarjetas de 268 (icono de 32 + 24 +
 * texto de 212), 24 entre ellas y la primera 24 dentro del borde, que sangra hasta
 * el borde de la ventana para que la siguiente asome (se le ve el icono). Debajo,
 * a 20, las tres rayas de `CarouselPagesComponent`, clicables.
 *
 * El `after:` del final deja el hueco que permite llevar la última tarjeta al borde
 * izquierdo: 100 % de la caja menos el paso (268 + 24), sin relleno a la derecha,
 * así hay exactamente una posición por tarjeta (ver `useCarousel`).
 */
export default function FinancingWarrantyCarouselComponent({ features }: { features: FinancingFeature[] }) {
  const [ref, carousel] = useCarousel<HTMLDivElement>();

  return (
    <>
      <div
        ref={ref}
        className={`-mr-8 mt-16 flex snap-x snap-mandatory scroll-pl-6 gap-6 overflow-x-auto pl-6 after:w-[calc(100%-292px)] after:shrink-0 xl:mr-0 xl:mt-16 xl:w-[876px] xl:overflow-visible xl:after:hidden ${SIN_SCROLLBAR}`}
      >
        {features.map((feature) => (
          <FeatureCardComponent
            key={feature.id}
            icon={feature.icon}
            title={feature.title}
            titleItalic={feature.titleItalic}
            titleAs="h3"
            description={feature.description}
            className="w-[268px] shrink-0 snap-start xl:w-auto xl:flex-1"
          />
        ))}
      </div>

      <CarouselPagesComponent
        position={carousel.position}
        positions={carousel.positions}
        onSelect={carousel.scrollToPosition}
        className="mt-5 xl:hidden"
      />
    </>
  );
}
