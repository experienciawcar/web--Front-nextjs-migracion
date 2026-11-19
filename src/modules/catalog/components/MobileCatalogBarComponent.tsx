"use client";

import { useEffect, useState } from "react";

import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";
import { FiltersIcon } from "@/modules/shared/components/icons";
import { ROUTES } from "@/modules/shared/constants/routes";
import { maxPriceForPayment } from "@/modules/shared/services/loan-calculator";

import type { ActiveChip } from "../services/chips";
import type { CatalogFilterOptions } from "../services/options";
import { searchVehicles } from "../services/vehicles";
import type { CatalogConfig } from "../types/catalog";
import type { CatalogFilters, CatalogOrderBy } from "../types/filters";
import type { Range } from "./RangeFilterComponent";
import { OrderDropdown } from "./SearchSortBarComponent";

/** Cuotas mensuales de los chips rápidos (pesos). */
const QUOTA_PRESETS = [1_000_000, 1_500_000, 2_000_000, 3_000_000];
const MOTO_BODY_TYPE_ID = "18";

const millions = (n: number) => `${n / 1_000_000}`.replace(".", ",");

/** Chip de filtro rápido: un `<select>` nativo con forma de píldora (accesible y sin lista propia). */
function ChipSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const active = value !== "";
  return (
    <label
      className={`relative shrink-0 rounded-lg border ${
        active ? "border-black bg-black text-white" : "border-gray bg-white text-dark-gray"
      }`}
    >
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-28 appearance-none rounded-lg bg-transparent pr-8 pl-4 text-small focus:outline-none"
      >
        <option value="" className="text-dark-gray">
          {label}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-dark-gray">
            {option.label}
          </option>
        ))}
      </select>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 border-x-[4px] border-t-[4px] border-x-transparent border-t-current"
      />
    </label>
  );
}

function Tab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <AppLinkComponent
      href={href}
      className={`flex h-12 flex-1 items-center justify-center rounded-t-2xl border border-b-0 text-body ${
        active ? "border-orange bg-orange font-bold text-white" : "border-gray/40 bg-white text-gray-dark"
      }`}
    >
      <span aria-current={active ? "page" : undefined}>{children}</span>
    </AppLinkComponent>
  );
}

/**
 * Cabecera del catálogo en móvil (`xl:hidden`, ver propuesta 11): pestañas Carros / Motos (enlaces
 * a sus rutas), chips rápidos (cuota, ciudad, tipo, caja; "Filtrar" abre el resto), el conteo
 * visible y "Ordenar por". La cuota se convierte a precio máximo (`maxPriceForPayment`) y se
 * aplica como filtro de precio: no hay filtro de cuota en el backend.
 */
export default function MobileCatalogBarComponent({
  config,
  filters,
  onFiltersChange,
  priceDraft,
  onPriceDraftChange,
  count,
  loading,
  onOpenFilters,
  chips,
  onRemoveChip,
}: {
  config: CatalogConfig;
  options?: CatalogFilterOptions;
  filters: CatalogFilters;
  onFiltersChange: (patch: Partial<CatalogFilters>) => void;
  priceDraft: Range;
  onPriceDraftChange: (range: Range) => void;
  count: number;
  loading: boolean;
  onOpenFilters: () => void;
  chips: ActiveChip[];
  onRemoveChip: (chipId: string) => void;
}) {
  const hasTabs = config.kind === "carros" || config.kind === "motos";

  // Totales para las pestañas: solo en móvil y solo con pestañas (dos peticiones de conteo).
  const [totals, setTotals] = useState<{ cars: number; motos: number } | null>(null);
  useEffect(() => {
    if (!hasTabs || window.matchMedia("(min-width: 1280px)").matches) return;
    let cancelled = false;
    Promise.all([searchVehicles({}, 1), searchVehicles({}, 1, MOTO_BODY_TYPE_ID)]).then(([all, motos]) => {
      // Sin ningún tipo, el backend devuelve todo (motos incluidas).
      if (!cancelled) setTotals({ cars: Math.max(all.count - motos.count, 0), motos: motos.count });
    });
    return () => {
      cancelled = true;
    };
  }, [hasTabs]);

  const quotaValue =
    String(QUOTA_PRESETS.find((quota) => priceDraft.max === maxPriceForPayment(quota)) ?? "");
  const noun = config.kind === "motos" ? "motos" : config.kind === "carros" ? "carros" : "vehículos";

  return (
    <div className="container-catalog flex flex-col gap-3 pt-3 xl:hidden">
      {hasTabs && (
        <nav aria-label="Tipo de vehículo" className="flex">
          <Tab href={ROUTES.buyCar} active={config.kind === "carros"}>
            Carros {totals?.cars}
          </Tab>
          <Tab href={ROUTES.buyMotorcycle} active={config.kind === "motos"}>
            Motos {totals?.motos}
          </Tab>
        </nav>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg border border-gray bg-white px-4 text-small text-dark-gray"
        >
          <FiltersIcon className="size-4" />
          Filtrar
        </button>
        <ChipSelect
          label="Valor"
          value={quotaValue}
          onChange={(value) => onPriceDraftChange({ ...priceDraft, max: value ? maxPriceForPayment(Number(value)) : undefined })}
          options={QUOTA_PRESETS.map((quota) => ({ value: String(quota), label: `Hasta $${millions(quota)}M/mes` }))}
        />
        <div className="relative z-10 ml-auto">
          <OrderDropdown tone="light" fixedLabel="Ordenar por" value={filters.orderBy ?? "relevance"} onChange={(orderBy: CatalogOrderBy) => onFiltersChange({ orderBy })} />
        </div>
      </div>

      <div className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-3 text-small text-dark-gray">
        <p aria-live="polite" className="shrink-0 border-r border-gray pr-4">
          {loading ? "Cargando…" : `${count} ${noun}`}
        </p>
        {chips.map((chip) => (
          <span key={chip.id} className="flex shrink-0 items-center gap-2 rounded-md border border-orange bg-white py-1.5 pr-2 pl-3 text-orange">
            {chip.label}
            <button type="button" onClick={() => onRemoveChip(chip.id)} aria-label={`Quitar filtro: ${chip.label}`} className="grid size-5 place-items-center text-gray-dark">
              <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden>
                <path d="M5 5 19 19M19 5 5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
