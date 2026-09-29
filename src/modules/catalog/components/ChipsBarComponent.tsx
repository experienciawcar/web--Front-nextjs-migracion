import type { ActiveChip } from "../services/chips";

/**
 * Fila bajo el buscador: el contador de resultados, los chips de filtros
 * activos (uno por valor elegido, no uno por campo — dos colores elegidos
 * son dos chips) y "Limpiar filtros". Presentacional: el estado vive en
 * `CatalogComponent`.
 *
 * "Limpiar filtros" no es un `ButtonComponent`: en el diseño es un control
 * chico sin fondo (ícono + texto gris), tratado como `CarouselArrowsComponent`
 * — un control utilitario, no un CTA. Ver la fila "Botones" de
 * `docs/planes/compra-tu-carro.md`.
 */
export default function ChipsBarComponent({
  countLabel,
  chips,
  onRemoveChip,
  onClearFilters,
}: {
  countLabel: string;
  chips: ActiveChip[];
  onRemoveChip: (chipId: string) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 xl:min-h-[51px] xl:pt-2 xl:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-body font-semibold text-dark-gray xl:hidden">
          {countLabel}
        </span>
        {chips.map((chip) => (
          <span
            key={chip.id}
            className="flex items-center gap-2 rounded-md border border-gray bg-white py-1.5 pr-2 pl-3 text-small text-orange"
          >
            {chip.label}
            <button
              type="button"
              onClick={() => onRemoveChip(chip.id)}
              aria-label={`Quitar filtro: ${chip.label}`}
              className="grid size-5 place-items-center text-gray-dark hover:text-dark-gray"
            >
              <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden>
                <path
                  d="M5 5 19 19M19 5 5 19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </button>
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        className="ml-auto flex items-center gap-2 text-body text-dark-gray"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-[18px] text-gray-dark"
          aria-hidden
        >
          <path
            d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        Limpiar filtros
      </button>
    </div>
  );
}
