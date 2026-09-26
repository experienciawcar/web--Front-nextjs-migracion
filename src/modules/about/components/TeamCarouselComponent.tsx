"use client";

import { useState } from "react";

import CarouselArrowsComponent from "@/modules/shared/components/CarouselArrowsComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import { useCarousel } from "@/modules/shared/hooks/useCarousel";

import type { Sede, TeamMember } from "../types/team";
import TeamCardComponent from "./TeamCardComponent";

/** Naranja y gris azulado de los sliders del diseño, los mismos de CarouselDots. */
const ACTIVO = "bg-[#ff8000]";
const INACTIVO = "bg-[#c7d1df]";

/** Ancho de la columna de flechas en desktop: las pestañas y las rayas arrancan después. */
const COLUMNA_FLECHAS = "xl:w-[102px]";

/** Sin barra de scroll: el desplazamiento se hace con las flechas, las rayas o el dedo. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * La parte interactiva de "Nuestro Equipo": pestañas por sede, carrusel de
 * tarjetas y, debajo, las flechas y las rayas que lo paginan.
 *
 * Desktop (captura del diseño): arriba, las flechas de las pestañas y las
 * pestañas, cada una de 178px con 40px en medio; luego las tarjetas de 280px
 * (cuatro llenan los 1192px del contenedor); abajo, las flechas otra vez y una
 * raya de 120px por posición. Las flechas de arriba mueven las pestañas y las
 * de abajo las tarjetas.
 *
 * Mobile: sin flechas, se desliza con el dedo, y las rayas van centradas y de
 * 24px. El diseño mobile de esta sección no se pudo revisar.
 *
 * Los controles de las tarjetas se muestran siempre, como en el diseño, y una
 * raya es un asesor: la posición 1 deja la primera tarjeta al borde izquierdo
 * y la última, la última. Para que con tres asesores (que caben de sobra en
 * cuatro huecos) también se pueda avanzar, al final de la fila se deja un
 * hueco que permite llevar la última tarjeta hasta el borde izquierdo (ver el
 * `after:` de la lista). Sin `sedes` no hay pestañas y se muestran todos los
 * asesores.
 *
 * Al cambiar de pestaña las tarjetas se remontan (`key`), así que el carrusel
 * vuelve al principio y se vuelve a medir.
 *
 * El cuadrado amarillo y las rayas grises del costado derecho son adorno del
 * diseño y solo van en desktop. Sus medidas salen de la captura (aprox.).
 */
export default function TeamCarouselComponent({
  sedes,
  members,
}: {
  sedes: Sede[];
  members: TeamMember[];
}) {
  const [selectedId, setSelectedId] = useState<number | null>(sedes[0]?.id ?? null);
  const [tabsRef, tabs] = useCarousel<HTMLDivElement>();
  const [cardsRef, cards] = useCarousel<HTMLUListElement>();

  const hasTabs = sedes.length > 0;
  const shown = hasTabs ? members.filter((member) => member.sedeId === selectedId) : members;

  return (
    <div className={hasTabs ? "mt-8" : "mt-10 xl:mt-12"}>
      {hasTabs && (
        <div className="flex items-end">
          {/* Mide lo que la raya de las pestañas (2px) y centra las flechas
              sobre ella, que es como se ven en el diseño. */}
          <div className={`relative hidden h-[2px] shrink-0 xl:block ${COLUMNA_FLECHAS}`}>
            {tabs.positions > 1 && (
              <CarouselArrowsComponent
                canPrev={tabs.canPrev}
                canNext={tabs.canNext}
                onPrev={tabs.prev}
                onNext={tabs.next}
                className="absolute top-1/2 left-1 -translate-y-1/2"
              />
            )}
          </div>

          <div
            ref={tabsRef}
            role="group"
            aria-label="Sedes"
            className={`-mr-8 flex min-w-0 flex-1 snap-x gap-10 overflow-x-auto pr-8 xl:mr-0 xl:pr-0 ${SIN_SCROLLBAR}`}
          >
            {sedes.map((sede) => {
              const active = sede.id === selectedId;
              return (
                <button
                  key={sede.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedId(sede.id)}
                  className="w-[178px] shrink-0 snap-start text-left text-small leading-[18px]"
                >
                  <span className="block font-bold text-dark-gray">Sede</span>
                  <span
                    className={`block font-medium italic ${active ? "text-dark-gray" : "text-gray-1"}`}
                  >
                    wcar {sede.name}
                  </span>
                  <span aria-hidden className={`mt-4 block h-[2px] ${active ? ACTIVO : INACTIVO}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={`relative ${hasTabs ? "mt-8 xl:mt-11" : ""}`}>
        {/* Adornos. Las rayas van por debajo de las tarjetas y llegan hasta el
            borde de la ventana (el `overflow-x-clip` de la sección evita el
            scroll horizontal); el cuadrado amarillo va por encima y pisa la
            esquina de la última tarjeta. */}
        <DiagonalLinesComponent
          variant="gray"
          className="pointer-events-none absolute top-[380px] right-[calc(50%-50vw)] left-[1054px] hidden h-[154px] opacity-50 xl:block"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute top-[429px] left-[1166px] z-20 hidden h-[59px] w-[92px] bg-label-yellow xl:block"
        />

        {/* -mx-2/px-2: hueco para que el overflow del carrusel no recorte la
            sombra de las tarjetas por los lados; pb-4, por abajo. El
            scroll-padding hace que el snap respete ese hueco en vez de
            pegar la tarjeta al borde. En mobile el margen derecho sangra
            hasta el borde de la pantalla.
            El `after:` es el hueco final: mide el ancho útil menos una tarjeta
            y su separación (280 + 24 = 304px) y es lo que permite que la
            última tarjeta llegue al borde izquierdo aunque toda la fila quepa
            a la vista. */}
        <ul
          key={selectedId ?? "todos"}
          ref={cardsRef}
          className={`relative z-10 -ml-2 -mr-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-2 pr-8 pb-4 pl-2 after:w-[calc(100%-304px)] after:shrink-0 xl:-mr-2 xl:scroll-pr-2 xl:pr-2 ${SIN_SCROLLBAR}`}
        >
          {shown.map((member) => (
            <TeamCardComponent key={member.id} member={member} />
          ))}
        </ul>
      </div>

      {/* En desktop, 66px + los 16px del pb del carrusel + los 12px del botón
          de cada raya son los 94px que separan las tarjetas de las rayas. */}
      <div className="mt-8 flex items-center xl:mt-[66px]">
        <div className={`relative hidden h-[2px] shrink-0 xl:block ${COLUMNA_FLECHAS}`}>
          <CarouselArrowsComponent
            canPrev={cards.canPrev}
            canNext={cards.canNext}
            onPrev={cards.prev}
            onNext={cards.next}
            className="absolute top-1/2 left-1 -translate-y-1/2"
          />
        </div>

        {/* Las rayas no se parten en filas: si son muchas se encogen (el
            botón admite `shrink`) hasta caber en una. En desktop miden 120px
            con 40px en medio, y en mobile 24px con 12px. */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-x-3 xl:justify-start xl:gap-x-10">
          {Array.from({ length: cards.positions }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir a la posición ${index + 1} de ${cards.positions}`}
              aria-current={index === cards.position}
              onClick={() => cards.scrollToPosition(index)}
              // El botón es más alto que la raya para tener dónde pulsar.
              className="w-6 min-w-0 py-3 xl:w-[120px]"
            >
              <span
                className={`block h-[2px] w-full ${index === cards.position ? ACTIVO : INACTIVO}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
