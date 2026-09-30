"use client";

import { useState } from "react";

import Image from "next/image";

import type { Brand } from "../types/brand";

/**
 * "Marca y modelo": marcas con checkbox; al marcar una, sus modelos aparecen
 * debajo como una sub-lista con checkbox. A diferencia de la SPA anterior,
 * los modelos ya vienen anidados en `GET /v2/brands/` (`Brand.models`, ver
 * `catalog/services/brands.ts`): no hace falta pedir nada al marcar una marca.
 */
export default function BrandModelFilterComponent({
  brands,
  selectedBrandIds,
  selectedModelIds,
  onChange,
  layout = "list",
}: {
  layout?: "list" | "cards";
  brands: Brand[];
  selectedBrandIds: string[];
  selectedModelIds: string[];
  onChange: (next: { brandIds: string[]; modelIds: string[] }) => void;
}) {
  const [query, setQuery] = useState("");
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  const visibleBrands = brands.filter((b) =>
    normalize(b.name).includes(normalize(query.trim())),
  );

  function toggleBrand(brandId: string) {
    const brand = brands.find((b) => b.id === brandId);
    const modelIdsOfBrand = new Set((brand?.models ?? []).map((m) => m.id));

    if (selectedBrandIds.includes(brandId)) {
      // Al desmarcar la marca se sueltan también sus modelos elegidos.
      onChange({
        brandIds: selectedBrandIds.filter((id) => id !== brandId),
        modelIds: selectedModelIds.filter((id) => !modelIdsOfBrand.has(id)),
      });
    } else {
      onChange({
        brandIds: [...selectedBrandIds, brandId],
        modelIds: selectedModelIds,
      });
    }
  }

  function toggleModel(modelId: string) {
    onChange({
      brandIds: selectedBrandIds,
      modelIds: selectedModelIds.includes(modelId)
        ? selectedModelIds.filter((id) => id !== modelId)
        : [...selectedModelIds, modelId],
    });
  }

  if (brands.length === 0) {
    return <p className="text-caption text-gray">No hay marcas disponibles.</p>;
  }

  if (layout === "cards") {
    return (
      <ul className="grid grid-cols-2 gap-3">
        {brands.map((brand) => {
          const checked = selectedBrandIds.includes(brand.id);
          return (
            <li key={brand.id} className="contents">
              <button
                type="button"
                aria-pressed={checked}
                onClick={() => toggleBrand(brand.id)}
                className={`flex h-[52px] min-w-0 items-center gap-3 rounded-lg border px-3 text-left text-small transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.97] ${
                  checked
                    ? "border-orange bg-orange text-white"
                    : "border-gray/40 bg-white text-dark-gray"
                }`}
              >
                {brand.imageUrl && (
                  <Image
                    src={brand.imageUrl}
                    alt=""
                    aria-hidden
                    width={32}
                    height={32}
                    className="size-8 shrink-0 object-contain"
                  />
                )}
                <span className="truncate">{brand.name}</span>
              </button>

              {checked && brand.models.length > 0 && (
                <div className="filter-fade-in col-span-2 flex flex-wrap gap-2 rounded-lg bg-gray-light p-3">
                  {brand.models.map((model) => {
                    const modelChecked = selectedModelIds.includes(model.id);
                    return (
                      <button
                        key={model.id}
                        type="button"
                        aria-pressed={modelChecked}
                        onClick={() => toggleModel(model.id)}
                        className={`rounded-md border px-3 py-1.5 text-caption transition-colors duration-200 active:scale-95 ${
                          modelChecked
                            ? "border-orange bg-orange text-white"
                            : "border-gray/40 bg-white text-dark-gray"
                        }`}
                      >
                        {model.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar..."
        aria-label="Buscar marca"
        className="mb-2 h-10 w-full border-b border-gray bg-transparent text-small text-dark-gray placeholder:text-gray focus:outline-none"
      />
      {visibleBrands.length === 0 && (
        <p className="py-2 text-caption text-gray">Sin resultados.</p>
      )}
      <ul className="flex max-h-80 flex-col gap-1 overflow-y-auto pr-1">
        {visibleBrands.map((brand) => {
          const brandChecked = selectedBrandIds.includes(brand.id);
          const brandInputId = `brand-${brand.id}`;
          return (
            <li key={brand.id}>
              <div className="flex items-center gap-2.5 py-1">
                <input
                  id={brandInputId}
                  type="checkbox"
                  checked={brandChecked}
                  onChange={() => toggleBrand(brand.id)}
                  className="filter-checkbox"
                />
                {brand.imageUrl && (
                  <Image
                    src={brand.imageUrl}
                    alt=""
                    aria-hidden
                    width={32}
                    height={32}
                    className="size-8 object-contain"
                  />
                )}
                <label
                  htmlFor={brandInputId}
                  className="text-small text-gray select-none"
                >
                  {brand.name}
                </label>
              </div>

              {brandChecked && brand.models.length > 0 && (
                <ul className="filter-fade-in ml-6 flex flex-col gap-1 border-l border-gray/15 pl-3">
                  {brand.models.map((model) => {
                    const modelInputId = `model-${model.id}`;
                    return (
                      <li
                        key={model.id}
                        className="flex items-center gap-2.5 py-0.5"
                      >
                        <input
                          id={modelInputId}
                          type="checkbox"
                          checked={selectedModelIds.includes(model.id)}
                          onChange={() => toggleModel(model.id)}
                          className="filter-checkbox"
                        />
                        <label
                          htmlFor={modelInputId}
                          className="text-caption text-gray-dark select-none"
                        >
                          {model.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
