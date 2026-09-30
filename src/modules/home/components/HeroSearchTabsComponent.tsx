"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useSyncExternalStore } from "react";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { SearchIcon } from "@/modules/shared/components/icons";
import { ROUTES, vehicleHref } from "@/modules/shared/constants/routes";

import {
  getCarSuggestions,
  MIN_SUGGESTION_CHARS,
} from "../services/car-suggestions";
import type { CarSuggestion } from "../types/car-suggestion";

import HeroSearchSuggestionsComponent from "./HeroSearchSuggestionsComponent";
import HeroInstallmentsPanelComponent from "./HeroInstallmentsPanelComponent";
import HeroSellPanelComponent from "./HeroSellPanelComponent";
import { TabBriefcaseIcon, TabCarIcon, TabSellIcon } from "./icons";

const TAB_ICONS = {
  buy: TabCarIcon,
  sell: TabSellIcon,
  installments: TabBriefcaseIcon,
} as const;

type TabId = "buy" | "sell" | "installments";

const TABS: {
  id: TabId;
  label: string;
  placeholder: string;
  mobilePlaceholder: string;
  action: string;
}[] = [
  {
    id: "buy",
    label: "Compra tu carro",
    placeholder: "Busca por marca, modelo, color...",
    mobilePlaceholder: "Busca por marca",
    action: ROUTES.buyCar,
  },
  // TODO: confirmar el destino de "Vende tu carro" (¿el mismo formulario de
  // placa del buscador anterior, ahora sin diseño en esta tarjeta?).
  {
    id: "sell",
    label: "Vende tu carro",
    placeholder: "Ingresa la placa de tu vehículo",
    mobilePlaceholder: "Ingresa la placa de tu vehículo",
    action: ROUTES.sellCar,
  },
  {
    id: "installments",
    label: "Compra a cuotas",
    placeholder: "Busca por marca, modelo, color...",
    mobilePlaceholder: "Busca por marca",
    action: ROUTES.financing,
  },
];

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
 * lupa a la izquierda y el botón `primary` "Go" (con el ícono de flecha desde `md`) a
 * la derecha, ya con su brillo (`ButtonComponent`). Las 5 rayas
 * decorativas de Figma bajo la barra se quitaron a pedido del usuario.
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
 * solo desde `md`.
 *
 * El diseño solo muestra el panel de "Compra tu carro" (una barra de búsqueda
 * simple); las otras dos pestañas comparten esa misma barra, con su propio
 * placeholder y su propio destino, hasta que haya diseño de sus paneles.
 */
const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(callback: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export default function HeroSearchTabsComponent() {
  // El placeholder es un atributo: no se puede acortar con CSS. En el servidor
  // (y al hidratar) se asume desktop.
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
  const [activeId, setActiveId] = useState<TabId>("buy");
  const active = TABS.find((tab) => tab.id === activeId) ?? TABS[0];
  const [focused, setFocused] = useState(false);
  // Las sugerencias son de vehículos: solo acompañan a la pestaña "Compra tu carro".
  const showSuggestions = focused && active.id === "buy";

  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [fetched, setFetched] = useState<CarSuggestion[]>([]);
  const [highlighted, setHighlighted] = useState(-1);
  // Con menos de 2 letras (o en otra pestaña) no se muestra lo último que llegó.
  const suggestions =
    active.id === "buy" && query.trim().length >= MIN_SUGGESTION_CHARS
      ? fetched
      : [];

  // Espera a que deje de escribir (250 ms) y cancela la petición anterior: si no,
  // una respuesta lenta de "ma" podría llegar después de la de "maz".
  useEffect(() => {
    if (query.trim().length < MIN_SUGGESTION_CHARS) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const items = await getCarSuggestions(query, controller.signal);
      if (controller.signal.aborted) return;
      setFetched(items);
      setHighlighted(-1);
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestions.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      // Del -1 (ninguno) al último y de vuelta: n + 1 posiciones en círculo.
      setHighlighted(
        (current) =>
          ((current + 1 + step + suggestions.length + 1) %
            (suggestions.length + 1)) -
          1,
      );
    } else if (event.key === "Enter" && highlighted >= 0) {
      event.preventDefault();
      router.push(vehicleHref(suggestions[highlighted]));
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-[0_7px_14px_rgba(211,218,226,0.4)] md:p-10">
      <div
        role="tablist"
        aria-label="Buscar vehículos"
        className="-mx-6 -mt-6 flex overflow-hidden rounded-t-lg bg-[#dde3ec] md:m-0 md:flex-wrap md:items-center md:overflow-visible md:rounded-none md:bg-transparent"
      >
        {/* Mobile (`< md`): pestañas de carpeta a todo el ancho de la tarjeta. La
            activa es blanca (se funde con el cuerpo de la tarjeta) y las otras
            quedan sobre la franja gris, con una raya solo entre dos inactivas
            contiguas. */}
        {TABS.map((tab, index) => {
          const isActive = tab.id === activeId;
          const Icon = TAB_ICONS[tab.id];
          const prevInactive = index > 0 && TABS[index - 1].id !== activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(tab.id)}
              className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2 py-3.5 text-[12px] whitespace-nowrap md:hidden ${
                isActive
                  ? "rounded-t-lg bg-white font-semibold text-dark-gray"
                  : "font-medium text-gray-dark"
              } ${!isActive && prevInactive ? "border-l border-gray/40" : ""}`}
            >
              <Icon
                className={`size-4 shrink-0 ${isActive ? "text-orange" : "text-gray"}`}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}

        {/* Tablet (`md`) y desktop: las tres iguales, con raya entre cada una. */}
        {TABS.map((tab, index) => {
          const isActive = tab.id === activeId;
          const Icon = TAB_ICONS[tab.id];
          return (
            <div key={tab.id} className="hidden items-center md:flex">
              {index > 0 && (
                <span aria-hidden className="mx-3 h-8 w-px bg-gray/30" />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveId(tab.id)}
                className={`flex items-center gap-1.5 border-b-2 pb-2 text-body font-semibold whitespace-nowrap opacity-90 ${
                  isActive
                    ? "border-orange text-dark-gray"
                    : "border-transparent text-gray-dark hover:text-dark-gray"
                }`}
              >
                <Icon
                  className={`size-5 shrink-0 ${isActive ? "text-orange" : "text-gray"}`}
                />
                {tab.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* El foco "vive" mientras esté dentro de este bloque (barra, botón o el panel):
          `tabIndex={-1}` hace que un clic en un hueco del panel lo enfoque a él y no
          cierre todo; Escape o pulsar fuera lo cierran. */}
      <div
        tabIndex={-1}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setFocused(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setFocused(false);
            (document.activeElement as HTMLElement | null)?.blur();
          }
        }}
        className="outline-none"
      >
        {active.id === "sell" ? (
          <HeroSellPanelComponent />
        ) : active.id === "installments" ? (
          <HeroInstallmentsPanelComponent />
        ) : (
          <>
            <form
              action={active.action}
              method="get"
              className="mt-7 flex items-center gap-3 md:gap-4"
            >
              <div className="flex h-[54px] min-w-0 flex-1 items-center gap-3 rounded-lg border-[1.5px] border-gray/30 bg-white px-4 transition-colors focus-within:border-orange">
                <SearchIcon className="size-6 shrink-0 text-orange" />
                <input
                  key={active.id}
                  name="search"
                  type="text"
                  placeholder={
                    isDesktop ? active.placeholder : active.mobilePlaceholder
                  }
                  autoComplete="off"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={handleKeyDown}
                  role="combobox"
                  aria-expanded={showSuggestions && suggestions.length > 0}
                  aria-controls={listId}
                  aria-autocomplete="list"
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
                Go
              </ButtonComponent>
            </form>

            <HeroSearchSuggestionsComponent
              open={showSuggestions}
              suggestions={suggestions}
              highlighted={highlighted}
              listId={listId}
            />
          </>
        )}
      </div>
    </div>
  );
}
