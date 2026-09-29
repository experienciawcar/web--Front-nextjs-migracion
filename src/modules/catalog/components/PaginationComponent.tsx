/** Lista de páginas a mostrar, con "…" cuando `numPages` es grande (no asume que siempre serán pocas, hoy son 10). */
function buildPageList(
  page: number,
  numPages: number,
): (number | "ellipsis")[] {
  if (numPages <= 7) return Array.from({ length: numPages }, (_, i) => i + 1);

  const pages = new Set<number>([1, numPages, page, page - 1, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= numPages)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}

/**
 * Paginación de verdad (números de página + anterior/siguiente), no una
 * barra continua como los carruseles del resto del sitio: acá cada posición
 * es una página real del backend, no un punto de scroll (guía de la tarea 8
 * del plan). `numPages`/`hasNext`/`hasPrevious` vienen tal cual de
 * `searchVehicles` (`POST /v2/filter-cars/`).
 */
export default function PaginationComponent({
  page,
  numPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: {
  page: number;
  numPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}) {
  if (numPages <= 1) return null;

  const arrowClass =
    "grid h-8 w-8 place-items-center rounded-[3px] bg-orange text-white disabled:cursor-default disabled:bg-gray";
  const cellClass =
    "grid h-8 min-w-8 place-items-center border border-[#d9d9d9] px-2 text-body -ml-px";

  return (
    <nav
      aria-label="Paginación de resultados"
      className="mt-10 flex flex-wrap items-center justify-center gap-1"
    >
      <button
        type="button"
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
        className={`${arrowClass} mr-1`}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path
            d="M20 12H4m0 0 6-6m-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      <div className="flex flex-wrap items-center justify-center pl-px">
        {buildPageList(page, numPages).map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className={`${cellClass} bg-white text-orange`}
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`${cellClass} ${
                item === page
                  ? "relative border-orange bg-orange text-white"
                  : "bg-white text-orange hover:bg-gray-light"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        aria-label="Página siguiente"
        className={`${arrowClass} ml-1`}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path
            d="M4 12h16m0 0-6-6m6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
    </nav>
  );
}
