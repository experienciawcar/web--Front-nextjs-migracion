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
 * raya en medio, y la barra de búsqueda y el botón en una fila.
 *
 * Mobile (`< md`, sin nodo de Figma propio — ver el TODO de las pestañas más
 * abajo; esta parte del diseño no está en el marco de mobile de Home): captura
 * que pasó el usuario. La pestaña activa queda suelta a la izquierda con su
 * subrayado naranja (igual que en desktop) y las otras dos se agrupan en una
 * píldora gris a la derecha, separadas por una raya, en letra e ícono más
 * chicos; qué pestaña cae en cada lado cambia con `activeId`, no con su orden
 * en `TABS`. La barra de búsqueda y el botón van en una sola fila (no
 * apilados, como antes) y el botón se achica a un cuadrado "Go" sin el ícono
 * de flecha (`iconClassName="hidden md:flex"`), del ancho fijo de desktop
 * solo desde `md`. Las rayas decorativas también cambian: en la captura la
 * primera es mucho más ancha que las otras cuatro (que quedan fijas, ~24 px);
 * se logra con `flex-1` solo en la primera y un ancho fijo en las demás,
 * revertido a `flex-1` desde `md` para no tocar el desktop. El `gap-8` de
 * desktop (32 px, pensado para 5 rayas casi iguales en ~600 px) también baja a
 * `gap-2` en mobile: con el original, los 4 huecos solos (128 px) ya se comían
 * casi todo el ancho disponible (~280 px) y la "ancha" salía más angosta que
 * las fijas — un bug real que solo se vio verificando con un viewport de 393
 * de verdad (ver la nota de la píldora, más abajo), no con el ~500 mínimo de
 * Chrome headless.
 *
 * El diseño solo muestra el panel de "Compra tu carro" (una barra de búsqueda
 * simple); las otras dos pestañas comparten esa misma barra, con su propio
 * placeholder y su propio destino, hasta que haya diseño de sus paneles.
 */
export default function HeroSearchTabsComponent() {
  const [activeId, setActiveId] = useState<TabId>("buy");
  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0];
  const ActiveIcon = active.id === "buy" ? TabCarIcon : TabBriefcaseIcon;
  const inactiveTabs = TABS.filter((tab) => tab.id !== activeId);

  return (
    <div className="rounded-lg bg-white p-6 shadow-[0_7px_14px_rgba(211,218,226,0.4)] md:p-10">
      <div role="tablist" aria-label="Buscar vehículos" className="flex items-center gap-3 md:flex-wrap md:gap-0">
        {/* Mobile (`< md`): la activa suelta a la izquierda (se achica con
            `truncate` solo si hiciera falta: en un teléfono real no debería
            llegar a notarse). */}
        <button
          type="button"
          role="tab"
          aria-selected="true"
          onClick={() => setActiveId(active.id)}
          className="flex min-w-0 items-center gap-1.5 border-b-2 border-orange pb-1.5 text-body font-bold whitespace-nowrap text-dark-gray md:hidden"
        >
          <ActiveIcon className="size-5 shrink-0 text-orange" />
          <span className="min-w-0 truncate">{active.label}</span>
        </button>

        {/* ...y las otras dos, agrupadas en su píldora gris. Sus 15-16
            letras no caben junto a la pestaña activa en un ancho de teléfono
            real (293-430, medido con un viewport de verdad por CDP, no con
            Chrome headless a secas: no baja de ~500 y la comparación miente):
            por eso el texto solo aparece desde `sm` (640) y antes se ven nada
            más los íconos, con el nombre igual disponible para lector de
            pantalla (`aria-label`). */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 rounded-xl bg-gray/10 px-3 py-2.5 md:hidden">
          {inactiveTabs.map((tab, index) => {
            const Icon = tab.id === "buy" ? TabCarIcon : TabBriefcaseIcon;
            return (
              <div key={tab.id} className="flex min-w-0 items-center gap-3">
                {index > 0 && <span aria-hidden className="h-6 w-px shrink-0 bg-gray/30" />}
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-label={tab.label}
                  onClick={() => setActiveId(tab.id)}
                  className="flex min-w-0 items-center gap-1.5 text-small font-medium text-gray-dark"
                >
                  <Icon className="size-4 shrink-0 text-gray" />
                  <span className="hidden min-w-0 truncate sm:inline">{tab.label}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Tablet (`md`) y desktop: las tres iguales, con raya entre cada una. */}
        {TABS.map((tab, index) => {
          const isActive = tab.id === activeId;
          const Icon = tab.id === "buy" ? TabCarIcon : TabBriefcaseIcon;
          return (
            <div key={tab.id} className="hidden items-center md:flex">
              {index > 0 && <span aria-hidden className="mx-3 h-8 w-px bg-gray/30" />}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(tab.id)}
                className={`flex items-center gap-1.5 border-b-2 pb-2 text-body font-semibold whitespace-nowrap opacity-90 ${
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

      <form action={active.action} method="get" className="mt-7 flex items-center gap-3 md:gap-4">
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

        <ButtonComponent
          type="submit"
          icon={arrowCircle}
          iconClassName="hidden md:flex"
          className="h-[54px]! justify-center! md:w-[152px]!"
        >
          <span className="md:hidden">Go</span>
          <span className="hidden md:inline">BUSCAR</span>
        </ButtonComponent>
      </form>

      {/* Estáticas y no interactivas a propósito: no representan posiciones de
          nada (ver el TODO de arriba), así que no llevan `role="tablist"` ni
          reaccionan al clic. */}
      <div aria-hidden className="mt-8 flex max-w-[600px] gap-2 md:gap-8">
        {Array.from({ length: DECORATIVE_SEGMENTS }, (_, index) => (
          <span
            key={index}
            className={`h-[3px] ${index === 0 ? "flex-1 bg-orange" : "w-6 bg-gray/50 md:w-auto md:flex-1"}`}
          />
        ))}
      </div>
    </div>
  );
}
