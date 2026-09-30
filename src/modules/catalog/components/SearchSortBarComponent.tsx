"use client";

import { useEffect, useRef, useState } from "react";

import { SearchIcon } from "@/modules/shared/components/icons";

import type { CatalogOrderBy } from "../types/filters";

const ORDER_OPTIONS: { value: CatalogOrderBy; label: string }[] = [
  { value: "relevance", label: "Relevancia" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "price-asc", label: "Menor precio" },
  { value: "warranty", label: "Garantía" },
];

/**
 * Franja negra bajo el navbar: buscador de texto a la izquierda, "Ordenar
 * por" a la derecha. Presentacional — el estado (`searchDraft`/`orderBy`)
 * vive en `CatalogComponent`, este componente solo recibe valor + `onChange`.
 *
 * TODO(diseño): las rayas diagonales cian/naranja de las esquinas del diseño
 * (ver `docs/planes/compra-tu-carro/0-captura-usuario-desktop.png`) no son el
 * patrón punteado de `DiagonalLinesComponent` (ese es blanco/gris, de 13px, y
 * esto se ve como un acento de esquina propio): se aproxima aquí con un
 * degradado en CSS; comparar contra la captura en el cierre y ajustar si no
 * calza.
 */
export default function SearchSortBarComponent({
  searchDraft,
  onSearchDraftChange,
  orderBy,
  onOrderByChange,
}: {
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  orderBy: CatalogOrderBy;
  onOrderByChange: (value: CatalogOrderBy) => void;
}) {
  return (
    <div className="relative z-20 bg-black">
      {/* El recorte (`overflow-hidden`) va solo en la capa de acentos: en el contenedor cortaría la lista del desplegable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Acento de esquina: aproximación en CSS de las rayas cian (izquierda) y
          naranja (derecha) de la captura — ver el TODO del JSDoc. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-24 w-24 opacity-70"
          style={{
            background:
              "repeating-linear-gradient(-45deg, var(--color-blue-neon) 0 3px, transparent 3px 10px)",
            maskImage:
              "linear-gradient(135deg, black 0%, black 30%, transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 h-24 w-24 opacity-70"
          style={{
            background:
              "repeating-linear-gradient(45deg, var(--color-orange) 0 3px, transparent 3px 10px)",
            maskImage:
              "linear-gradient(-135deg, black 0%, black 30%, transparent 65%)",
          }}
        />
      </div>

      <div className="container-catalog relative flex flex-col gap-4 py-4 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative flex h-12 w-full items-center rounded-full bg-white pl-5 pr-4 xl:max-w-[420px]">
          <SearchIcon className="size-5 shrink-0 text-gray" />
          <span className="sr-only">Buscar por marca, modelo, color</span>
          <input
            type="search"
            value={searchDraft}
            onChange={(event) => onSearchDraftChange(event.target.value)}
            placeholder="Buscar por marca, modelo, color..."
            className="ml-3 h-full w-full bg-transparent text-small text-dark-gray placeholder:text-gray focus:outline-none"
          />
        </label>

        {/* En mobile "Ordenar por" baja a la fila de `MobileToolbar`, junto a Filtrar. */}
        <div className="hidden items-center gap-3 text-white xl:flex">
          <span className="text-body">Ordenar por:</span>
          <OrderDropdown value={orderBy} onChange={onOrderByChange} />
        </div>
      </div>
    </div>
  );
}

/**
 * "Ordenar por" como en la web anterior: botón oscuro con la opción activa en negrita y una
 * flecha, y una lista blanca flotante debajo (no el `<select>` nativo, cuya lista no se puede
 * estilar). Patrón de botón + `listbox`; cierra con clic afuera o Esc.
 */
export function OrderDropdown({
  value,
  onChange,
  tone = "dark",
}: {
  value: CatalogOrderBy;
  onChange: (value: CatalogOrderBy) => void;
  tone?: "dark" | "light";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const current =
    ORDER_OPTIONS.find((option) => option.value === value) ?? ORDER_OPTIONS[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Ordenar resultados por: ${current.label}`}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 items-center gap-4 rounded-md px-4 text-body ${
          tone === "light"
            ? "bg-gray/30 text-dark-gray"
            : "bg-dark-gray font-bold text-white"
        }`}
      >
        {current.label}
        <span
          aria-hidden
          className={`border-x-[4px] border-t-[4px] border-x-transparent ${
            tone === "light" ? "border-t-dark-gray" : "border-t-white"
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Ordenar resultados por"
          className="absolute top-full left-0 z-30 xl:right-0 xl:left-auto mt-2 min-w-40 rounded-lg border border-gray/30 bg-white py-2 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        >
          {ORDER_OPTIONS.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="block w-full px-4 py-1.5 text-left text-body text-dark-gray hover:bg-gray-light"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
