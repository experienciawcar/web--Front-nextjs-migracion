"use client";

import { useEffect, useState } from "react";

import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";
import { FiltersIcon } from "@/modules/shared/components/icons";
import { ROUTES } from "@/modules/shared/constants/routes";
import { maxPriceForPayment } from "@/modules/shared/services/loan-calculator";

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
      className={`relative shrink-0 rounded-full border ${
        active ? "border-black bg-black text-white" : "border-gray bg-white text-dark-gray"
      }`}
    >
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 appearance-none rounded-full bg-transparent pr-8 pl-4 text-small focus:outline-none"
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
      className={`border-b-2 pb-2 text-body ${
        active ? "border-orange font-bold text-dark-gray" : "border-transparent text-gray-dark"
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
  options,
  filters,
  onFiltersChange,
  priceDraft,
  onPriceDraftChange,
  count,
  loading,
  onOpenFilters,
}: {
  config: CatalogConfig;
  options: CatalogFilterOptions;
  filters: CatalogFilters;
  onFiltersChange: (patch: Partial<CatalogFilters>) => void;
  priceDraft: Range;
  onPriceDraftChange: (range: Range) => void;
  count: number;
  loading: boolean;
  onOpenFilters: () => void;
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
        <nav aria-label="Tipo de vehículo" className="flex gap-6 border-b border-gray/40">
          <Tab href={ROUTES.buyCar} active={config.kind === "carros"}>
            Carros {totals?.cars}
          </Tab>
          <Tab href={ROUTES.buyMotorcycle} active={config.kind === "motos"}>
            Motos {totals?.motos}
          </Tab>
        </nav>
      )}

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex h-9 shrink-0 items-center gap-2 rounded-full border border-gray bg-white px-4 text-small text-dark-gray"
        >
          <FiltersIcon className="size-4" />
          Filtrar
        </button>
        <ChipSelect
          label="Cuota"
          value={quotaValue}
          onChange={(value) => onPriceDraftChange({ ...priceDraft, max: value ? maxPriceForPayment(Number(value)) : undefined })}
          options={QUOTA_PRESETS.map((quota) => ({ value: String(quota), label: `Hasta $${millions(quota)}M/mes` }))}
        />
        <ChipSelect
          label="Ciudad"
          value={filters.sedeIds?.[0] ?? ""}
          onChange={(value) => onFiltersChange({ sedeIds: value ? [value] : undefined })}
          options={options.sedes.map((sede) => ({ value: sede.id, label: sede.name }))}
        />
        {config.showTypeFilter && (
          <ChipSelect
            label="Tipo"
            value={filters.bodyTypeIds?.[0] ?? ""}
            onChange={(value) => onFiltersChange({ bodyTypeIds: value ? [value] : undefined })}
            options={options.vehicleTypes.map((type) => ({ value: String(type.id), label: type.name }))}
          />
        )}
        <ChipSelect
          label="Caja"
          value={filters.transmission != null ? String(filters.transmission) : ""}
          onChange={(value) => onFiltersChange({ transmission: value === "" ? undefined : (Number(value) as 0 | 1) })}
          options={[
            { value: "1", label: "Automática" },
            { value: "0", label: "Manual" },
          ]}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between pb-3 text-small text-dark-gray">
        <p aria-live="polite">{loading ? "Cargando…" : `${count} ${noun}`}</p>
        <div className="flex items-center gap-2">
          <span>Ordenar por:</span>
          <OrderDropdown tone="light" value={filters.orderBy ?? "relevance"} onChange={(orderBy: CatalogOrderBy) => onFiltersChange({ orderBy })} />
        </div>
      </div>
    </div>
  );
}
