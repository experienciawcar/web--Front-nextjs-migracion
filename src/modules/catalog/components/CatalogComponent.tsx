"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { FiltersIcon } from "@/modules/shared/components/icons";

import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { getActiveChips, removeChip } from "../services/chips";
import { getSeoCategory } from "../services/seo-category";
import type { CatalogFilterOptions } from "../services/options";
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from "../services/url-filters";
import { searchVehicles, type CatalogSearchResult } from "../services/vehicles";
import type { CatalogConfig } from "../types/catalog";
import {
  EMPTY_FILTERS,
  type CatalogFilters,
  type CatalogOrderBy,
} from "../types/filters";
import ChipsBarComponent from "./ChipsBarComponent";
import FilterBottomSheetComponent from "./FilterBottomSheetComponent";
import FilterSidebarComponent from "./FilterSidebarComponent";
import FilterTabsComponent from "./FilterTabsComponent";
import PaginationComponent from "./PaginationComponent";
import SeoAccordionComponent from "./SeoAccordionComponent";
import SeoBannerComponent from "./SeoBannerComponent";
import type { Range } from "./RangeFilterComponent";
import ResultsGridComponent from "./ResultsGridComponent";
import SearchSortBarComponent, { OrderDropdown } from "./SearchSortBarComponent";

/** Debounce del buscador de texto: mismo valor que usaba la SPA anterior (ver la referencia del plan). */
const SEARCH_DEBOUNCE_MS = 1000;
/** Debounce de precio y kilometraje: 600ms, más corto que el buscador porque arrastrar un slider genera más eventos. */
const RANGE_DEBOUNCE_MS = 600;

const EMPTY_RANGE: Range = {};

/**
 * El catálogo entero: buscador, sidebar de filtros, chips, grilla y
 * paginación. Único árbol "use client" grande del sitio a propósito (ver la
 * fila "Arquitectura cliente/servidor" de `docs/planes/compra-tu-carro.md`):
 * necesita re-buscar sin recargar la página con cada filtro. `options`
 * (marcas, colores, etiquetas, sedes, tipos de vehículo) se piden una sola
 * vez, en servidor, antes de montar este componente.
 *
 * `filters` guarda todo lo que se aplica al instante (orden y, desde la
 * tarea 5, marca/modelo/tipo/transmisión/tracción/disponibilidad/combustible/
 * color/placa/año); el buscador de texto y los rangos de precio/kilometraje
 * van aparte (`searchDraft`/`priceDraft`/`mileageDraft` + `useDebouncedValue`)
 * y se combinan con `filters` recién en `effectiveFilters` — nunca se
 * "sincroniza" un valor debounced hacia `filters` con un efecto (ese patrón
 * dispara `react-hooks/set-state-in-effect` y además es innecesario: alcanza
 * con derivarlo en el render, memoizado).
 *
 * TODO(seo): el diseño no muestra un `<h1>` visible en esta vista (es un
 * buscador + resultados, no un titular); se deja como encabezado oculto
 * (`sr-only`) con la intención de búsqueda de la variante. Confirmar con
 * diseño si debe verse.
 */
export default function CatalogComponent({
  config,
  options,
  initialFilters,
}: {
  config: CatalogConfig;
  options: CatalogFilterOptions;
  /**
   * Filtro sembrado desde la URL (hoy solo `/compra-tu-carro`, el tipo de
   * vehículo de `?type_vehicle=`, resuelto en servidor — ver el `page.tsx`
   * del catch-all). Las otras 3 rutas no pasan nada.
   */
  initialFilters?: Partial<CatalogFilters>;
}) {
  const [filters, setFilters] = useState<CatalogFilters>(() => ({
    ...EMPTY_FILTERS,
    ...initialFilters,
  }));
  const [searchDraft, setSearchDraft] = useState("");
  const [priceDraft, setPriceDraft] = useState<Range>(EMPTY_RANGE);
  const [mileageDraft, setMileageDraft] = useState<Range>(EMPTY_RANGE);

  const debouncedSearch = useDebouncedValue(searchDraft, SEARCH_DEBOUNCE_MS);
  const debouncedPrice = useDebouncedValue(priceDraft, RANGE_DEBOUNCE_MS);
  const debouncedMileage = useDebouncedValue(mileageDraft, RANGE_DEBOUNCE_MS);

  const [page, setPage] = useState(1);
  const [result, setResult] = useState<CatalogSearchResult | null>(null);
  // Arranca en `true` (la carga inicial). Cada acción que cambia la búsqueda
  // lo vuelve a poner en `true` en el mismo evento (handler o el bloque de
  // "ajustar estado durante el render" de abajo) — nunca dentro del efecto de
  // búsqueda: `setState` síncrono al abrir un efecto dispara en cascada
  // (`react-hooks/set-state-in-effect`), y ese efecto solo lo apaga cuando la
  // búsqueda resuelve.
  const [loading, setLoading] = useState(true);
  // `false` hasta que el efecto de deep-linking (abajo) termine de leer la URL una
  // única vez al montar. Mientras tanto no se busca ni se escribe la URL: si se
  // buscara antes, la primera búsqueda saldría con los filtros vacíos (los del
  // primer render) y una fracción de segundo después se repetiría ya con los de la
  // URL — dos búsquedas en vez de una, y de paso el segundo write pisaría el propio
  // `?search=`/`?min_price=`/etc. recién leído. `loading` ya arranca en `true`, así
  // que no hay flash visual mientras se espera.
  const [hydrated, setHydrated] = useState(false);

  // Los tres valores debounced cambian la página a 1 sin pasar por un
  // efecto: comparar contra el anterior durante el render y ajustar el
  // estado ahí es el patrón que React recomienda para "reaccionar a un
  // cambio" (react.dev/learn/you-might-not-need-an-effect), y no dispara el
  // lint de `setState` en efectos porque no corre dentro de uno. Se combinan
  // los tres en una sola firma para no repetir el bloque tres veces.
  const debouncedSignature = JSON.stringify([
    debouncedSearch,
    debouncedPrice,
    debouncedMileage,
  ]);
  const [committedSignature, setCommittedSignature] =
    useState(debouncedSignature);
  if (debouncedSignature !== committedSignature) {
    setCommittedSignature(debouncedSignature);
    setPage(1);
    setLoading(true);
  }

  const effectiveFilters = useMemo<CatalogFilters>(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      priceMin: debouncedPrice.min,
      priceMax: debouncedPrice.max,
      mileageMin: debouncedMileage.min,
      mileageMax: debouncedMileage.max,
    }),
    [filters, debouncedSearch, debouncedPrice, debouncedMileage],
  );

  // Deep-linking: lee la URL una sola vez al montar (recarga de página o URL
  // compartida) y siembra todo el estado de filtros desde ahí — la contraparte del
  // efecto de más abajo, que la escribe. Los tres drafts con debounce
  // (`searchDraft`/`priceDraft`/`mileageDraft`) también actualizan `committedSignature`
  // en el mismo golpe: si no, cuando el debounce de 600-1000ms alcance recién ahora a
  // estos valores (ya sembrados, no cambiados por el usuario), el bloque de "ajustar
  // estado durante el render" de abajo detectaría una "firma nueva" y resetearía
  // `page` a 1, pisando la página que se acaba de leer de `?page=`.
  useEffect(() => {
    // `window.location.search` es un sistema externo (el navegador, no React):
    // exactamente el caso que react.dev/learn/you-might-not-need-an-effect señala
    // como legítimo para un efecto ("Subscribe for updates from some external
    // system, calling setState... when external state changes"). No hay forma de
    // leerlo durante el render sin romper la hidratación (el servidor no tiene
    // `window`; leerlo ahí produciría markup distinto al que ya mandó el servidor).
    /* eslint-disable react-hooks/set-state-in-effect */
    const params = new URLSearchParams(window.location.search);
    const { filters: urlFilters, page: urlPage } = searchParamsToFilters(
      params,
      options,
    );
    const {
      search,
      priceMin,
      priceMax,
      mileageMin,
      mileageMax,
      ...instantFilters
    } = urlFilters;
    const urlPriceDraft: Range = { min: priceMin, max: priceMax };
    const urlMileageDraft: Range = { min: mileageMin, max: mileageMax };

    setFilters((prev) => ({ ...prev, ...instantFilters }));
    setSearchDraft(search ?? "");
    setPriceDraft(urlPriceDraft);
    setMileageDraft(urlMileageDraft);
    setCommittedSignature(
      JSON.stringify([search ?? "", urlPriceDraft, urlMileageDraft]),
    );
    setPage(urlPage);
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- una sola vez, al montar
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    searchVehicles(effectiveFilters, page, config.bodyTypeId).then(
      (searchResult) => {
        if (cancelled) return;
        setResult(searchResult);
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [hydrated, effectiveFilters, page, config.bodyTypeId]);

  // La contraparte del efecto de deep-linking de arriba: cada vez que los filtros
  // (ya debounced) o la página cambian, reescribe la URL con `replaceState` — nunca
  // `pushState`, para no llenar el botón "Atrás" con un paso por cada filtro tocado
  // (mismo criterio que la web anterior, ver la referencia §7).
  useEffect(() => {
    if (!hydrated) return;
    const query = filtersToSearchParams(effectiveFilters, page).toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    if (nextUrl !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", nextUrl);
    }
  }, [hydrated, effectiveFilters, page]);

  function handleFiltersPatch(patch: Partial<CatalogFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
    setLoading(true);
  }

  function handleOrderByChange(orderBy: CatalogOrderBy) {
    handleFiltersPatch({ orderBy });
  }

  function handleRemoveChip(chipId: string) {
    setFilters((prev) => removeChip(prev, chipId));
    // Búsqueda, precio y kilometraje viven en sus borradores, no en `filters`.
    if (chipId === "search") setSearchDraft("");
    if (chipId === "price") setPriceDraft(EMPTY_RANGE);
    if (chipId === "mileage") setMileageDraft(EMPTY_RANGE);
    setPage(1);
    setLoading(true);
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
    setSearchDraft("");
    setPriceDraft(EMPTY_RANGE);
    setMileageDraft(EMPTY_RANGE);
    setPage(1);
    setLoading(true);
    // No borra parámetro por parámetro: vuelve a la ruta base, sin query string, igual
    // que "Limpiar filtros" en la web anterior (referencia §7). El efecto de arriba que
    // reescribe la URL también la dejaría así una vez que el debounce de
    // búsqueda/precio/kilometraje alcance a estos valores ya vacíos, pero eso tarda
    // 600-1000ms — esto la deja limpia al toque, sin esperar.
    window.history.replaceState(null, "", config.route);
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    setLoading(true);
    // A los resultados, no al principio de la página (que ya se ve: el
    // buscador y los filtros no se movieron).
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const resultsRef = useRef<HTMLDivElement>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Los chips salen de `effectiveFilters` (con búsqueda, precio y kilometraje), no de `filters`.
  const chips = getActiveChips(effectiveFilters, options);

  // Banner + acordeón SEO de la categoría activa (`services/seo-category.ts`). Con banner, el banner
  // es el `<h1>` de la página y el `<h1>` oculto de la variante se omite.
  const seoCategory = getSeoCategory(config, effectiveFilters, options);

  const countLabel = loading
    ? "Cargando…"
    : config.countLabelTemplate.replace("{count}", String(result?.count ?? 0));

  // Un solo formulario de filtros (`filters`/`priceDraft`/`mileageDraft` en
  // este componente, nunca un estado aparte por layout), presentado con dos
  // layouts distintos según el ancho — acordeón fijo en desktop, pestañas de
  // dos columnas en un bottom sheet en mobile (`diseno-filtros-laterales.md`
  // §2-3) — así que las props se arman una sola vez y se le pasan a los dos.
  const filterProps = {
    filters,
    onFiltersChange: handleFiltersPatch,
    priceDraft,
    onPriceDraftChange: setPriceDraft,
    mileageDraft,
    onMileageDraftChange: setMileageDraft,
    options,
    showTypeFilter: config.showTypeFilter,
  };

  return (
    <>
      {!seoCategory?.bannerTitle && <h1 className="sr-only">{config.seo.h1}</h1>}

      <SearchSortBarComponent
        searchDraft={searchDraft}
        onSearchDraftChange={setSearchDraft}
        orderBy={filters.orderBy ?? "relevance"}
        onOrderByChange={handleOrderByChange}
      />

      <FilterBottomSheetComponent
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        onClearFilters={handleClearFilters}
      >
        <FilterTabsComponent {...filterProps} />
      </FilterBottomSheetComponent>

      <div className="bg-gray-light">
        {/* Solo mobile: "Ordenar por" a la izquierda y "Filtrar" (abre el bottom
            sheet) a la derecha; el sidebar de al lado cumple esto en desktop.
            Va dentro del mismo fondo gris que los resultados para que no haya
            una costura entre los dos bloques. */}
        <div className="container-catalog relative z-10 flex items-center justify-between py-4 xl:hidden">
          <div className="flex items-center gap-3 text-dark-gray">
            <span className="text-small">Ordenar por:</span>
            <OrderDropdown
              tone="light"
              value={filters.orderBy ?? "relevance"}
              onChange={handleOrderByChange}
            />
          </div>
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 text-body text-dark-gray"
          >
            <FiltersIcon className="size-6" />
            Filtrar
          </button>
        </div>

        <div className="container-catalog grid gap-8 pb-16 xl:grid-cols-[minmax(0,1fr)_3fr] xl:gap-0">
          <aside className="hidden bg-white px-6 xl:block">
            <div className="sticky top-20 flex max-h-[calc(100vh-5rem)] flex-col">
              <p className="mt-4 border-b border-gray pt-6 pb-2 text-small text-dark-gray">
                {countLabel}
              </p>
              {/* "Filtrar" ya no hace falta para que cada filtro aplique (todos
              buscan solos, ver el resto de este componente): se deja como en
              el diseño original y, sin un paso de "aplicar" que desacoplar,
              se limita a llevar la vista a los resultados. Decisión anotada
              en la tarea 5 del plan. */}
              <ButtonComponent
                variant="primary"
                size="big"
                className="mx-auto my-3 h-10! w-[265px]! max-w-full! shrink-0 justify-center! text-body! font-normal! normal-case!"
                onClick={() =>
                  resultsRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
                }
              >
                Filtrar
              </ButtonComponent>

              <div className="filter-scroll min-h-0 flex-1 overflow-y-auto pb-16 pr-4">
                <FilterSidebarComponent {...filterProps} />
              </div>
            </div>
          </aside>

          <div ref={resultsRef} className="min-w-0 xl:px-3">
            {seoCategory?.bannerTitle && <SeoBannerComponent title={seoCategory.bannerTitle} />}

            <ChipsBarComponent
              chips={chips}
              onRemoveChip={handleRemoveChip}
              onClearFilters={handleClearFilters}
            />

            <ResultsGridComponent
              vehicles={result?.vehicles ?? []}
              loading={loading}
              hasFilters={chips.length > 0}
              onClearFilters={handleClearFilters}
            />
            {/* `result` sigue siendo el de la última búsqueda resuelta mientras
              `loading` está en `true` (nunca se limpia a `null` al empezar
              una nueva): así la paginación no desaparece y vuelve a
              aparecer con cada página, solo se actualiza cuando llega la
              siguiente. */}
            {result && (
              <PaginationComponent
                page={page}
                numPages={result.numPages}
                hasNext={result.hasNext}
                hasPrevious={result.hasPrevious}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {seoCategory && (
        <section className="container-wcar grid gap-x-6 pt-20 pb-10 lg:grid-cols-2">
          <SeoAccordionComponent items={seoCategory.left} group="seo-left" imagesDir={seoCategory.key} />
          <SeoAccordionComponent items={seoCategory.right} group="seo-right" imagesDir={seoCategory.key} />
        </section>
      )}
    </>
  );
}
