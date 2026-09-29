"use client";

import { useState } from "react";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { SearchIcon } from "@/modules/shared/components/icons";
import { ROUTES } from "@/modules/shared/constants/routes";

import { TabBriefcaseIcon, TabCarIcon } from "./icons";

type TabId = "buy" | "sell" | "installments";

const TABS: { id: TabId; label: string; placeholder: string; action: string }[] = [
  { id: "buy", label: "Compra tu carro", placeholder: "Busca por marca, modelo, color...", action: ROUTES.buyCar },
  // TODO: confirmar el destino de "Vende tu carro" (¿el mismo formulario de
  // placa del buscador anterior, ahora sin diseño en esta tarjeta?).
  { id: "sell", label: "Vende tu carro", placeholder: "Ingresa la placa de tu vehículo", action: ROUTES.sellCar },
  { id: "installments", label: "Compra a cuotas", placeholder: "Busca por marca, modelo, color...", action: ROUTES.financing },
];

/**
 * Las 5 rayas decorativas bajo la barra de búsqueda (Figma "Frame 535",
 * 671:44670): no están etiquetadas ni enlazadas a nada en el diseño y no hay
 * un quinto criterio evidente que las explique.
 * TODO: confirmar con diseño qué representan (¿tipos de vehículo? ¿nada, son
 * decorativas?).
 */
const DECORATIVE_SEGMENTS = 5;

/**
 * La tarjeta blanca que cuelga del hero: tres pestañas ("Compra tu carro",
 * "Vende tu carro", "Compra a cuotas") y, debajo, una barra de búsqueda con su
 * botón. Es la parte interactiva de `HeroSearchSectionComponent`.
 *
 * Figma (Home 2.0, nodo "Banner" I695:45162;692:44611, 1195 x 264): pestañas de
 * 22 semibold con su ícono de 32 (naranja + subrayado de 2px cuando está
 * activa, `gray-dark` con ícono `gray` cuando no), separadas por una raya de
 * 1 x 46 (`gray` al 30 %). Aquí quedaron más chicas (16 y 20) que en el
 * diseño: el usuario las pidió más pequeñas, se ven grandes con el hero y el
 * jeep más grandes de lo que Figma medía. Barra de búsqueda de 54 de alto con
 * el ícono de
 * lupa a la izquierda y el botón `primary` "BUSCAR" (con el ícono de flecha) a
 * la derecha, ya con su brillo (`ButtonComponent`); debajo, 5 rayas
 * decorativas (`CarouselSegmentsComponent`, sin `useCarousel`: aquí son fijas,
 * la primera en naranja).
 *
 * Desde `md` (tablet incluida) toma el aspecto de desktop: relleno de 40, pestañas con su
 * raya en medio, y la barra de búsqueda y el botón en una fila; por debajo, el de mobile.
 *
 * El diseño solo muestra el panel de "Compra tu carro" (una barra de búsqueda
 * simple); las otras dos pestañas comparten esa misma barra, con su propio
 * placeholder y su propio destino, hasta que haya diseño de sus paneles.
 */
export default function HeroSearchTabsComponent() {
  const [activeId, setActiveId] = useState<TabId>("buy");
  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0];

  return (
    <div className="rounded-lg bg-white p-6 shadow-[0_7px_14px_rgba(211,218,226,0.4)] md:p-10">
      <div role="tablist" aria-label="Buscar vehículos" className="flex flex-wrap items-center gap-4 md:gap-0">
        {TABS.map((tab, index) => {
          const isActive = tab.id === activeId;
          const Icon = tab.id === "buy" ? TabCarIcon : TabBriefcaseIcon;
          return (
            <div key={tab.id} className="flex items-center">
              {index > 0 && <span aria-hidden className="mx-3 hidden h-8 w-px bg-gray/30 md:block" />}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(tab.id)}
                className={`flex items-center gap-1.5 border-b-2 pb-1.5 text-body font-semibold whitespace-nowrap opacity-90 md:pb-2 ${
                  isActive ? "border-orange text-dark-gray" : "border-transparent text-gray-dark hover:text-dark-gray"
                }`}
              >
                <Icon className={`size-5 shrink-0 ${isActive ? "text-orange" : "text-gray"}`} />
                {tab.label}
              </button>
            </div>
          );
        })}
      </div>

      <form
        action={active.action}
        method="get"
        className="mt-7 flex flex-col gap-4 md:flex-row md:items-center md:gap-4"
      >
        <div className="flex h-[54px] min-w-0 flex-1 items-center gap-3 rounded-lg border-[1.5px] border-gray/30 bg-white px-4">
          <SearchIcon className="size-6 shrink-0 text-orange" />
          <input
            key={active.id}
            name="q"
            type="text"
            placeholder={active.placeholder}
            autoComplete="off"
            aria-label={active.label}
            className="min-w-0 flex-1 bg-transparent text-small font-medium text-dark-gray outline-none placeholder:text-gray"
          />
        </div>

        <ButtonComponent type="submit" icon={arrowCircle} className="h-[54px]! w-full justify-center! md:w-[152px]!">
          BUSCAR
        </ButtonComponent>
      </form>

      {/* Estáticas y no interactivas a propósito: no representan posiciones de
          nada (ver el TODO de arriba), así que no llevan `role="tablist"` ni
          reaccionan al clic. */}
      <div aria-hidden className="mt-8 flex max-w-[600px] gap-8">
        {Array.from({ length: DECORATIVE_SEGMENTS }, (_, index) => (
          <span key={index} className={`h-[3px] flex-1 ${index === 0 ? "bg-orange" : "bg-gray/50"}`} />
        ))}
      </div>
    </div>
  );
}
