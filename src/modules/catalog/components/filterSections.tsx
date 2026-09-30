import type { ReactNode } from "react";

import {
  FUEL_TYPES,
  TRACTIONS,
  TRANSMISSIONS,
  YEARS,
} from "../constants/filter-options";
import type { CatalogFilterOptions } from "../services/options";
import type { CatalogFilters } from "../types/filters";
import BrandModelFilterComponent from "./BrandModelFilterComponent";
import CheckboxGroupComponent from "./CheckboxGroupComponent";
import ColorFilterComponent from "./ColorFilterComponent";
import PlateFilterComponent from "./PlateFilterComponent";
import PriceFilterComponent from "./PriceFilterComponent";
import RangeFilterComponent, { type Range } from "./RangeFilterComponent";
import YearFilterComponent from "./YearFilterComponent";

const MILEAGE_MIN = 0;
const MILEAGE_MAX = 1_000_000;

export type FilterSection = {
  id: string;
  title: string;
  defaultOpen?: boolean;
  content: ReactNode;
};

export type FilterSectionsParams = {
  filters: CatalogFilters;
  onFiltersChange: (patch: Partial<CatalogFilters>) => void;
  priceDraft: Range;
  onPriceDraftChange: (next: Range) => void;
  mileageDraft: Range;
  onMileageDraftChange: (next: Range) => void;
  options: CatalogFilterOptions;
  showTypeFilter: boolean;
  /** "cards" = marcas como tarjetas en dos columnas (bottom sheet mobile). */
  brandLayout?: "list" | "cards";
};

/**
 * Los doce filtros del sidebar como datos (título + contenido), en el orden real de la web en
 * vivo (`docs/planes/compra-tu-carro/referencia-sitio-anterior.md` §B.2): Precio, Ubicación,
 * Marca y modelo, Año, Kilometraje, Tipo (oculto si `showTypeFilter` es `false`), Transmisión,
 * Tracción, Disponibilidad, Combustible, Color, Placa.
 *
 * Única fuente de verdad para las dos formas en que se presentan estos filtros: acordeón fijo
 * en desktop (`FilterSidebarComponent`) y pestañas de dos columnas en mobile
 * (`FilterTabsComponent`, bottom sheet) — mismo estado, mismo comportamiento en los dos
 * breakpoints (decisión: no replicar las inconsistencias mobile/desktop de la SPA anterior,
 * ver §8 de la referencia), solo cambia el layout que envuelve cada filtro.
 */
export function buildFilterSections({
  filters,
  onFiltersChange,
  priceDraft,
  onPriceDraftChange,
  mileageDraft,
  onMileageDraftChange,
  options,
  showTypeFilter,
  brandLayout,
}: FilterSectionsParams): FilterSection[] {
  const sections: FilterSection[] = [
    {
      id: "price",
      title: "Precio",
      content: (
        <PriceFilterComponent
          value={priceDraft}
          onChange={onPriceDraftChange}
        />
      ),
    },
    {
      id: "location",
      title: "Ubicación",
      content: (
        <CheckboxGroupComponent
          name="sede"
          options={options.sedes.map((s) => ({ value: s.id, label: s.name }))}
          selected={filters.sedeIds ?? []}
          onChange={(sedeIds) => onFiltersChange({ sedeIds })}
        />
      ),
    },
    {
      id: "brand",
      title: "Marca y modelo",
      content: (
        <BrandModelFilterComponent
          layout={brandLayout}
          brands={options.brands}
          selectedBrandIds={filters.brandIds ?? []}
          selectedModelIds={filters.modelIds ?? []}
          onChange={({ brandIds, modelIds }) =>
            onFiltersChange({ brandIds, modelIds })
          }
        />
      ),
    },
    {
      id: "year",
      title: "Año",
      content: (
        <YearFilterComponent
          years={YEARS}
          value={filters.year}
          onChange={(year) => onFiltersChange({ year })}
        />
      ),
    },
    {
      id: "mileage",
      title: "Kilometraje",
      defaultOpen: true,
      content: (
        <RangeFilterComponent
          min={MILEAGE_MIN}
          max={MILEAGE_MAX}
          step={5_000}
          value={mileageDraft}
          onChange={onMileageDraftChange}
          formatValue={(n) => `${new Intl.NumberFormat("es-CO").format(n)} Km`}
        />
      ),
    },
  ];

  if (showTypeFilter) {
    sections.push({
      id: "type",
      title: "Tipo",
      content: (
        <CheckboxGroupComponent
          name="tipo"
          options={options.vehicleTypes.map((t) => ({
            value: String(t.id),
            label: t.name,
            imageUrl: t.imageUrl,
            count: t.count,
          }))}
          selected={filters.bodyTypeIds ?? []}
          onChange={(bodyTypeIds) => onFiltersChange({ bodyTypeIds })}
        />
      ),
    });
  }

  sections.push(
    {
      id: "transmission",
      title: "Transmisión",
      content: (
        <CheckboxGroupComponent
          name="transmision"
          options={TRANSMISSIONS.map((t) => ({
            value: String(t.value),
            label: t.label,
          }))}
          selected={
            filters.transmission != null ? [String(filters.transmission)] : []
          }
          onChange={(next) =>
            onFiltersChange({
              transmission: next.length
                ? (Number(next.at(-1)) as 0 | 1)
                : undefined,
            })
          }
        />
      ),
    },
    {
      id: "traction",
      title: "Tracción",
      content: (
        <CheckboxGroupComponent
          name="traccion"
          options={TRACTIONS.map((t) => ({ value: t.value, label: t.label }))}
          selected={filters.traction ?? []}
          onChange={(traction) => onFiltersChange({ traction })}
        />
      ),
    },
    {
      id: "availability",
      title: "Disponibilidad",
      content: (
        <CheckboxGroupComponent
          name="disponibilidad"
          options={options.tags.map((t) => ({ value: t.id, label: t.name }))}
          selected={filters.tagIds ?? []}
          onChange={(tagIds) => onFiltersChange({ tagIds })}
        />
      ),
    },
    {
      id: "fuel",
      title: "Combustible",
      content: (
        <CheckboxGroupComponent
          name="combustible"
          options={FUEL_TYPES.map((f) => ({ value: f.value, label: f.label }))}
          selected={filters.fuelTypes ?? []}
          onChange={(fuelTypes) => onFiltersChange({ fuelTypes })}
        />
      ),
    },
    {
      id: "color",
      title: "Color",
      content: (
        <ColorFilterComponent
          colors={options.colors}
          selected={filters.colorNames ?? []}
          onChange={(colorNames) => onFiltersChange({ colorNames })}
        />
      ),
    },
    {
      id: "plate",
      title: "Placa",
      content: (
        <PlateFilterComponent
          selected={filters.plateDigits ?? []}
          onChange={(plateDigits) => onFiltersChange({ plateDigits })}
        />
      ),
    },
  );

  return sections;
}
