"use client";

import { Children } from "react";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import CarouselSegmentsComponent from "@/modules/shared/components/CarouselSegmentsComponent";
import { useInfiniteCarousel } from "@/modules/shared/hooks/useInfiniteCarousel";

/** Sin barra de scroll: se desliza con el dedo, las flechas o las rayas. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * Degradado a blanco de la derecha. Perfil medido contra el render de Figma
 * (la 4.ª tarjeta, la misma foto que la 1.ª): el blanco empieza en 0 pegado a
 * la 3.ª tarjeta, ya tapa un 31 % donde arranca la 4.ª y un 72 % 58 px después,
 * y llega al 100 % ~240 px dentro. No es lineal.
 */
const FADE_TO_WHITE =
  "linear-gradient(to right, rgba(255,255,255,0) 0, rgba(255,255,255,.31) 38px, rgba(255,255,255,.72) 96px, rgba(255,255,255,.83) 125px, rgba(255,255,255,.9) 169px, #fff 242px)";

/**
 * La parte interactiva del catálogo destacado: la fila de tarjetas en un
 * carrusel INFINITO de `scroll-snap` (`useInfiniteCarousel`: tras la última
 * tarjeta sigue la primera y al revés) y, debajo, las flechas y las rayas que
 * lo paginan. Las tarjetas llegan ya pintadas por el servidor (`children`, una
 * `<li>` por vehículo), así que aquí no se sabe nada de vehículos.
 *
 * Medidas de Figma (nodo "Frame 627", 671:11871): tarjetas de 291 con 38 entre
 * ellas (paso de 329, medido en el render: entre las tarjetas 1 y 4 hay 987 px);
 * la primera arranca 124 px después del borde izquierdo del lienzo y la fila
 * sangra hasta la ventana (a 1440 caben tres y la cuarta queda a medias, ya
 * desvanecida). Debajo, a 21 px de las tarjetas, las flechas (24 px, a 4 px del
 * borde) y, desde 102 px del borde, las rayas.
 *
 * Los controles se ven siempre y funcionan (guía §3.3). Una raya es un vehículo
 * (`positions` = las tarjetas, sin contar las copias del bucle) y las flechas
 * nunca se deshabilitan.
 *
 * Degradado a blanco (Figma 671:11872, "Rectangle 4280", 338 x 460 en x=1072):
 * tapa el final de la fila para que las tarjetas se desvanezcan hacia la
 * derecha. Va pegado al borde de la VENTANA (la fila sangra hasta ahí), no al
 * del lienzo, así que en pantallas anchas no se queda a mitad de camino.
 *
 * Los 16 px de relleno a la izquierda y los 24 de abajo son para la sombra de
 * las tarjetas (`0 7 14`), que el `overflow` del carrusel recortaría; se
 * compensan con márgenes negativos y el `scroll-pl` hace que el snap respete ese
 * relleno.
 *
 * Mobile: sin flechas ni rayas ni degradado; se desliza con el dedo y la tarjeta
 * siguiente asoma por la derecha (guía §4.3). No hay diseño mobile.
 */
export default function FeaturedVehiclesCarouselComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ref, carousel] = useInfiniteCarousel<HTMLDivElement>(
    Children.count(children),
  );

  const clones = (name: string) =>
    Array.from({ length: carousel.side }, (_, index) => (
      <ul key={`${name}-${index}`} aria-hidden data-clon className="contents">
        {children}
      </ul>
    ));

  return (
    <div className="min-w-0 xl:mr-[calc(50%-50vw)]">
      <div className="relative">
        {/* La pista es un `<div>` con tres `<ul>` (`display: contents`: para el
            layout, los `<li>` son sus hijos directos y el `gap` y el snap
            funcionan entre copias). `relative`: `offsetLeft` cuenta desde aquí. */}
        <div
          ref={ref}
          className={`relative -mt-2 -mr-8 -mb-6 -ml-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-4 pt-2 pr-8 pb-6 pl-4 xl:mr-0 xl:gap-[38px] xl:pr-0 ${SIN_SCROLLBAR}`}
        >
          {carousel.looping && clones("antes")}
          <ul role="list" className="contents">
            {children}
          </ul>
          {carousel.looping && clones("despues")}
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -top-2 right-0 -bottom-6 hidden w-[368px] xl:block"
          style={{ backgroundImage: FADE_TO_WHITE }}
        />
      </div>

      <div className="mt-[45px] hidden h-8 items-center xl:flex">
        <CarouselArrowsComponent
          canPrev
          canNext
          onPrev={carousel.prev}
          onNext={carousel.next}
          className="ml-1"
        />
        <CarouselSegmentsComponent
          position={carousel.position}
          positions={carousel.positions}
          onSelect={carousel.scrollToPosition}
          className="ml-[42px]"
        />
      </div>
    </div>
  );
}
