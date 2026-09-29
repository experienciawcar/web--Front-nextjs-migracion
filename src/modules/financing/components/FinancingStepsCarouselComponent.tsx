"use client";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import CarouselProgressComponent from "@/modules/shared/components/CarouselProgressComponent";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";

import type { FinancingStep } from "../types/financing-step";

/** Sin barra de scroll: el desplazamiento se hace con las flechas, la barra o el dedo. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * La parte interactiva de los pasos del proceso: las tarjetas en un carrusel
 * con `scroll-snap` y, debajo, las flechas y la barra de progreso.
 *
 * Medidas de Figma (nodo "items carrousel" 193:8216, 1490 x 174 en (124,717)):
 * - Tarjeta de 274 (icono de 32 + 24 + texto de 218) y 24 entre tarjetas: paso de
 *   298. La primera arranca 24 dentro del carrusel (`pl-6`). Es un
 *   `FeatureCardComponent` (título 22/30 bold, descripción 16/24), con el
 *   número delante del título ("1. Simulación"): en Figma es la numeración de una
 *   lista, con el texto siempre a 33 px del borde de la columna y el número a su
 *   izquierda (`titleMarker`).
 * - Fila de tarjetas de 110 de alto (título 30 + 8 + tres renglones de 24) y 32
 *   debajo, la fila de controles de 32: flechas de 24 x 24 en x=128 (4 dentro
 *   de sus cajas de 32) y la barra desde 28 px después de ellas, en x=212, hasta
 *   la ventana.
 * - Barra (líneas del diseño): pista de 1 px `gray` al 20 % y tramo activo de 3 px
 *   `gray` al 50 %. En Figma el tramo activo mide 401 de 1402 (29 %); aquí crece
 *   con (posición + 1) / posiciones, como en Taller, y con cinco posiciones
 *   arranca en 20 %. TODO: confirmar con diseño cómo se calcula.
 *
 * El carrusel sangra hasta el borde derecho de la ventana: el diseño deja asomar
 * la quinta tarjeta cortada por ese lado. Los controles se ven siempre y
 * funcionan (guía §3.3): el `after:` del final deja el hueco que permite llevar
 * la última tarjeta al borde izquierdo (298 = el paso; medido con `cdp.py`: con 322
 * el recorrido máximo quedaba 24 px corto y la última posición no alineaba), así
 * que hay exactamente una posición por tarjeta. La barra es clicable.
 *
 * Mobile: sin flechas ni barra; se desliza con el dedo y la siguiente tarjeta
 * asoma por la derecha (guía §4.3). No hay diseño mobile.
 */
export default function FinancingStepsCarouselComponent({ steps }: { steps: FinancingStep[] }) {
  const [ref, carousel] = useCarousel<HTMLOListElement>();

  return (
    <div className="xl:mr-[calc(50%-50vw)]">
      <ol
        ref={ref}
        className={`-mr-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pr-8 after:w-[calc(100%-298px)] after:shrink-0 xl:mr-0 xl:scroll-pl-6 xl:pr-0 xl:pl-6 ${SIN_SCROLLBAR}`}
      >
        {steps.map((step, index) => (
          <li key={step.id} className="w-[274px] shrink-0 snap-start">
            <FeatureCardComponent
              icon={step.icon}
              titleMarker={`${index + 1}.`}
              title={step.title}
              description={step.description}
            />
          </li>
        ))}
      </ol>

      <div className="mt-8 hidden h-8 items-center xl:flex">
        <CarouselArrowsComponent
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          onPrev={carousel.prev}
          onNext={carousel.next}
          className="ml-1"
        />
        <CarouselProgressComponent
          position={carousel.position}
          positions={carousel.positions}
          onSelect={carousel.scrollToPosition}
          className="ml-7"
          trackClassName="h-px bg-gray/20"
          activeClassName="h-[3px] bg-gray/50"
        />
      </div>
    </div>
  );
}
