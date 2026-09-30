import ButtonComponent from "@/modules/shared/components/ButtonComponent";

/**
 * Estado sin resultados: se muestra cuando la búsqueda resuelve con 0 vehículos.
 * Explica qué pasó y ofrece la salida (quitar los filtros) en vez de dejar un vacío.
 */
export default function EmptyResultsComponent({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center shadow-sm"
    >
      <div className="grid size-20 place-items-center rounded-full bg-gray-light text-orange">
        <svg viewBox="0 0 24 24" className="size-10" aria-hidden>
          <path
            d="M3 14l2-5.5A2 2 0 0 1 6.9 7h10.2a2 2 0 0 1 1.9 1.5L21 14M3 14v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4M3 14h18M7 14h.01M17 14h.01"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>
      <h2 className="mt-6 text-heading-1 font-semibold text-dark-gray">
        No encontramos vehículos
      </h2>
      <p className="mt-2 max-w-md text-body text-gray-dark">
        {hasFilters
          ? "Ningún vehículo coincide con los filtros elegidos. Prueba quitando alguno o ampliando el rango de precio."
          : "Por ahora no tenemos vehículos disponibles. Vuelve pronto."}
      </p>
      {hasFilters && (
        <ButtonComponent
          variant="primary"
          size="big"
          className="mt-8"
          onClick={onClearFilters}
        >
          Limpiar filtros
        </ButtonComponent>
      )}
    </div>
  );
}
