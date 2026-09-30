"use client";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import CarouselSegmentsComponent from "@/modules/shared/components/CarouselSegmentsComponent";
import CarouselProgressComponent from "@/modules/shared/components/CarouselProgressComponent";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";

import type { AdditionalService } from "../types/additional-service";

/** Sin barra de scroll: el desplazamiento se hace con las flechas, la barra o el dedo. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * La parte interactiva de "Servicios adicionales": las tarjetas en un carrusel
 * con `scroll-snap` y, debajo, las flechas y la barra de progreso.
 *
 * En desktop cuelga del lienzo (`xl:absolute`), con su esquina superior izquierda
 * en (584,240) (Figma: el marco de las tarjetas está en x=560 con las tarjetas a 24 de él; la captura había dado 586,243) y el borde derecho en el de la ventana: el diseño deja asomar la
 * tarjeta siguiente por ese lado. Sus medidas, de la captura 4 (con la
 * calibración de siempre):
 * - Tarjeta de 277 de ancho (icono de 48 + 24 + texto de 205) y 29 entre tarjetas
 *   (306 de paso, medido). El texto de 205 sale de dos límites: la descripción
 *   parte donde lo hace en la captura solo con menos de 208,5, y el título en
 *   cursiva "Repuestos Originales" (202) cabe en un renglón solo con más de 202.
 * - Flechas (`CarouselArrowsComponent`, 24 + 8 + 24) en x=563, y=472, o sea 23 a
 *   la izquierda de la primera tarjeta y 41 debajo de la más alta.
 * - Barra de progreso: una raya de 2 px que arranca 28 px después de las flechas
 *   y llega a la ventana, con un tramo activo en `gray` al 50 % (en la captura
 *   se ve 76,87,99 sobre 28: es `gray` #90A3BF al 50 %) sobre una pista casi
 *   invisible (`white` al 5 %). El tramo activo mide (posición + 1) / posiciones.
 *   En la captura mide el 50 %; aquí, con tres tarjetas, empieza en un tercio.
 *   En Figma (nodo 192:6200) el tramo activo mide 401 de los 1431 de la pista (28 %)
 *   y el carrusel tiene 5 tarjetas, dos de ellas fuera del marco y a medias (ver
 *   `constants/additional-services.ts`).
 *   TODO: confirmar con diseño cuántas tarjetas van y cómo se calcula la barra.
 *
 * La barra de progreso es `shared/components/CarouselProgressComponent` (la misma
 * de los pasos de Financiación, con otros colores).
 *
 * Los controles se ven siempre y funcionan, aunque las tres tarjetas casi
 * quepan: el `after:` del final deja el hueco que permite llevar la última
 * tarjeta al borde izquierdo (guía §3.3). La pista es clicable: encima van un
 * botón por posición, para que la barra continua del diseño cumpla también la
 * regla de "una raya por posición, y clicable".
 *
 * Mobile (Figma 1:9787): sin flechas ni barra; se desliza con el dedo, la
 * siguiente tarjeta asoma por la derecha y debajo van las rayas de paginación (48
 * de ancho, una por posición y clicables).
 */
export default function WorkshopServicesCarouselComponent({ services }: { services: AdditionalService[] }) {
  const [ref, carousel] = useCarousel<HTMLUListElement>();

  return (
    <div className="reveal mt-16 xl:absolute xl:top-[240px] xl:right-[calc(50%-50vw)] xl:left-[584px] xl:mt-0">
      <ul
        ref={ref}
        className={`-mr-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-8 after:w-[calc(100%-310px)] after:shrink-0 xl:mr-0 xl:gap-[29px] xl:after:w-[calc(100%-306px)] xl:pr-0 ${SIN_SCROLLBAR}`}
      >
        {services.map((service) => (
          <li key={service.id} className="w-[294.5px] shrink-0 snap-start first:w-[253px] xl:w-[277px] xl:first:w-[277px]">
            <FeatureCardComponent
              icon={service.icon}
              title={service.title}
              titleItalic={service.titleItalic}
              description={service.description}
              iconClassName="size-12"
              tone="dark"
              // Un título de una sola línea ("Lavado y Detailing") no arranca en
              // el borde de la tarjeta: en la captura su línea base está 6 px
              // más abajo y la descripción 13 (el título se centra en un
              // bloque de 43 de alto en vez de los 30 de una línea).
              titleClassName={service.titleItalic ? "" : "mt-1.5"}
              descriptionClassName={service.titleItalic ? "" : "mt-[7px]"}
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

      <div className="mt-[41px] hidden items-center xl:flex">
        <CarouselArrowsComponent
          canPrev={carousel.canPrev}
          canNext={carousel.canNext}
          onPrev={carousel.prev}
          onNext={carousel.next}
          className="-ml-[23px]"
        />

        <CarouselProgressComponent
          position={carousel.position}
          positions={carousel.positions}
          onSelect={carousel.scrollToPosition}
          className="ml-7"
          trackClassName="h-[2px] bg-white/5"
          activeClassName="h-[2px] bg-gray/50"
        />
      </div>
    </div>
  );
}
