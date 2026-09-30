"use client";

import { useEffect } from "react";

import Image, { type StaticImageData } from "next/image";

import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";
import { ROUTES, vehicleHref } from "@/modules/shared/constants/routes";

import type { CarSuggestion } from "../types/car-suggestion";

import deportivo from "../assets/busqueda/deportivo.webp";
import hatchback from "../assets/busqueda/hatchback.webp";
import camioneta from "../assets/busqueda/camioneta.webp";
import pickup from "../assets/busqueda/pickup.webp";
import sedan from "../assets/busqueda/sedan.webp";

type Badge = "electric" | "hybrid";

const CATEGORIES: {
  label: string;
  href: string;
  image: StaticImageData;
  badge?: Badge;
}[] = [
  { label: "Sedan", href: `${ROUTES.buyCar}?type_vehicle=Sedan`, image: sedan },
  {
    label: "Hatchback",
    href: `${ROUTES.buyCar}?type_vehicle=Hatchback`,
    image: hatchback,
  },
  {
    label: "Camionetas / SUVs",
    href: `${ROUTES.buyCar}?type_vehicle=${encodeURIComponent("Camioneta - SUV")}`,
    image: camioneta,
  },
  {
    label: "Pickup",
    href: `${ROUTES.buyCar}?type_vehicle=Pickup`,
    image: pickup,
  },
  {
    label: "Deportivo",
    href: `${ROUTES.buyCar}?type_vehicle=Coupe`,
    image: deportivo,
  },
  {
    label: "Eléctrico",
    href: `${ROUTES.buyCar}?typeOfFuels=electrico`,
    image: hatchback,
    badge: "electric",
  },
  {
    label: "Híbrido",
    href: `${ROUTES.buyCar}?typeOfFuels=hibrido`,
    image: sedan,
    badge: "hybrid",
  },
];

// Tag 3 = "Promoción" en GET /v2/tags/. "Destacados del mes" no tiene filtro propio
// en el backend: lleva al catálogo con el orden por relevancia (el que ya destaca).
const SHORTCUTS: {
  label: string;
  shortLabel?: string;
  href: string;
  icon: "tag" | "money" | "shield" | "heart";
}[] = [
  { label: "Vehículos en oferta", href: `${ROUTES.buyCar}?tag=3`, icon: "tag" },
  {
    label: "Menos de $70.000.000",
    href: `${ROUTES.buyCar}?max_price=70000000`,
    icon: "money",
  },
  {
    label: "Garantía de fábrica",
    href: `${ROUTES.buyCar}?orderBy=warranty`,
    icon: "shield",
  },
  {
    label: "Destacados del mes",
    shortLabel: "Destacados",
    href: ROUTES.buyCar,
    icon: "heart",
  },
];

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 10 14"
      fill="currentColor"
      className="h-3 w-2.5"
      aria-hidden
    >
      <path d="M6 0 0 8h4l-1 6 7-9H6z" />
    </svg>
  );
}

function FuelIcon() {
  return (
    <svg
      viewBox="0 0 12 14"
      fill="currentColor"
      className="h-3 w-2.5"
      aria-hidden
    >
      <path d="M1 1.5A1.5 1.5 0 0 1 2.5 0h4A1.5 1.5 0 0 1 8 1.5V7h.5A1.5 1.5 0 0 1 10 8.5V11a.5.5 0 0 0 1 0V6L9.5 4.5 10.2 3.8 12 5.6V11a1.5 1.5 0 0 1-3 0V8.5a.5.5 0 0 0-.5-.5H8v6H1V1.5zM2.5 1a.5.5 0 0 0-.5.5V5h5V1.5a.5.5 0 0 0-.5-.5h-4z" />
    </svg>
  );
}

function ShortcutIcon({
  kind,
}: {
  kind: "tag" | "money" | "shield" | "heart";
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5 shrink-0 text-gray"
      aria-hidden
      {...common}
    >
      {kind === "tag" && (
        <>
          <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" />
          <circle cx="8" cy="8" r="1.5" />
        </>
      )}
      {kind === "money" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M14.5 9c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6v1.5M12 16.5V18" />
        </>
      )}
      {kind === "shield" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m12 7.5 1.4 3 3.1.4-2.3 2.2.6 3.2-2.8-1.6-2.8 1.6.6-3.2-2.3-2.2 3.1-.4z" />
        </>
      )}
      {kind === "heart" && (
        <path d="M12 20s-8-5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15 12 20 12 20z" />
      )}
    </svg>
  );
}

/**
 * El panel que se despliega bajo la barra de búsqueda del hero cuando tiene el foco:
 * siete tarjetas de categoría (tipo de carrocería o combustible) y cuatro accesos
 * rápidos. Todo son enlaces al catálogo con el filtro en la URL (`CatalogComponent`
 * los lee de `window.location.search`).
 *
 * La animación es de altura real sin medir nada: una grilla que pasa de `0fr` a
 * `1fr` (más el fundido y el ascenso escalonado de cada tarjeta por `--i`). Cerrado
 * lleva `inert`: sus enlaces no entran en el orden de tabulación ni los lee el lector
 * de pantalla. Solo desde `md`: en mobile la barra queda como estaba.
 */
export default function HeroSearchSuggestionsComponent({
  open,
  suggestions,
  highlighted,
  listId,
}: {
  open: boolean;
  /** Lo que sugiere el backend para lo escrito; si hay, reemplaza las categorías. */
  suggestions: CarSuggestion[];
  /** Índice resaltado con el teclado (-1: ninguno). */
  highlighted: number;
  listId: string;
}) {
  // Con las flechas el resaltado puede salirse del área visible: se sigue con el scroll.
  useEffect(() => {
    if (highlighted < 0) return;
    const option = document.getElementById(`${listId}-${highlighted}`);
    const list = option?.parentElement;
    if (!option || !list) return;
    // A mano y solo dentro de la lista (`scrollIntoView` también movería la página);
    // la lista es `relative` para que `offsetTop` se mida contra ella.
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (
      option.offsetTop + option.offsetHeight >
      list.scrollTop + list.clientHeight
    ) {
      list.scrollTop =
        option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [highlighted, listId]);

  return (
    <div
      inert={!open}
      data-open={open}
      className="group/panel grid grid-rows-[0fr] transition-[grid-template-rows,margin] duration-500 ease-out data-[open=true]:mt-6 data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none"
    >
      <div className="min-h-0 overflow-hidden">
        {suggestions.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            aria-label="Sugerencias de vehículos"
            className="relative flex max-h-[216px] md:max-h-[188px] flex-col overflow-y-auto overscroll-contain py-1 pr-1"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === highlighted}
              >
                <AppLinkComponent
                  href={vehicleHref(suggestion)}
                  className={`flex items-baseline gap-1.5 rounded-lg px-1 py-2 text-body transition-colors md:items-center md:justify-between md:gap-4 md:px-4 md:py-3 md:text-small hover:bg-gray-light focus-visible:outline-2 focus-visible:outline-orange ${
                    index === highlighted ? "bg-gray-light" : ""
                  }`}
                >
                  <span className="min-w-0 truncate text-dark-gray">
                    <strong className="font-bold md:font-semibold">
                      {suggestion.name.split(" ")[0]}
                    </strong>
                    <span className="md:font-semibold">
                      {suggestion.name.slice(suggestion.name.indexOf(" "))}
                    </span>
                  </span>
                  <span aria-hidden className="text-gray-dark md:hidden">
                    ·
                  </span>
                  <span className="shrink-0 text-gray-dark">
                    {suggestion.type}
                  </span>
                </AppLinkComponent>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <ul className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pt-1 pb-3 [scrollbar-width:none] md:grid md:grid-cols-7 md:gap-4 md:overflow-visible md:pb-2 [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((category, index) => (
                <li
                  key={category.label}
                  style={{ "--i": index } as React.CSSProperties}
                  className="translate-y-3 opacity-0 transition-[opacity,translate] duration-500 ease-out [transition-delay:calc(var(--i)*40ms+100ms)] group-data-[open=true]/panel:translate-y-0 group-data-[open=true]/panel:opacity-100 motion-reduce:transition-none"
                >
                  <AppLinkComponent
                    href={category.href}
                    className="relative flex h-[104px] w-[136px] shrink-0 snap-start flex-col md:w-auto items-center justify-center gap-2.5 rounded-lg bg-white shadow-[0_2px_10px_rgba(144,163,191,0.3)] transition-shadow hover:shadow-[0_4px_14px_rgba(255,128,0,0.35)] focus-visible:outline-2 focus-visible:outline-orange"
                  >
                    {category.badge && (
                      <span className="absolute top-2.5 left-3 flex items-center gap-1 text-gray">
                        {category.badge === "hybrid" && <FuelIcon />}
                        {category.badge === "hybrid" && (
                          <span className="h-3 w-px bg-gray/50" />
                        )}
                        <BoltIcon />
                      </span>
                    )}
                    <Image
                      src={category.image}
                      alt=""
                      width={96}
                      className="h-auto w-[84px] md:w-[64px]"
                    />
                    <span className="px-2 text-center text-[13px] leading-tight font-semibold whitespace-nowrap text-dark-gray">
                      {category.label}
                    </span>
                  </AppLinkComponent>
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-gray/30 pt-5 pb-1">
              <ul className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
                {SHORTCUTS.map((shortcut, index) => (
                  <li
                    key={shortcut.label}
                    style={
                      {
                        "--i": index + CATEGORIES.length,
                      } as React.CSSProperties
                    }
                    className="translate-y-3 opacity-0 transition-[opacity,translate] duration-500 ease-out [transition-delay:calc(var(--i)*40ms+100ms)] group-data-[open=true]/panel:translate-y-0 group-data-[open=true]/panel:opacity-100 motion-reduce:transition-none"
                  >
                    <AppLinkComponent
                      href={shortcut.href}
                      className="flex h-10 items-center gap-2 rounded-lg border border-gray/40 bg-white px-3 text-[13px] font-medium text-gray-dark md:text-small transition-colors hover:border-orange hover:text-orange focus-visible:outline-2 focus-visible:outline-orange"
                    >
                      <ShortcutIcon kind={shortcut.icon} />
                      {shortcut.shortLabel ? (
                        <>
                          <span className="md:hidden">
                            {shortcut.shortLabel}
                          </span>
                          <span className="hidden md:inline">
                            {shortcut.label}
                          </span>
                        </>
                      ) : (
                        shortcut.label
                      )}
                    </AppLinkComponent>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
