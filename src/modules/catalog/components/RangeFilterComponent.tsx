export type Range = { min?: number; max?: number };

/**
 * Rango con dos manijas (Precio, Kilometraje): dos `<input type="range">`
 * nativos superpuestos sobre la misma pista — no hay RSuite en este proyecto
 * (a diferencia de la SPA anterior) y no vale la pena traer una librería
 * nueva solo para esto (ver "Piezas que se repiten" del plan). Más los dos
 * `<input type="number">` ("Mínimo"/"Máximo") sincronizados.
 *
 * El valor se pasa "en crudo" (sin debounce): quien lo use decide cuándo
 * confirmarlo (`CatalogComponent` lo debounce a 600ms antes de buscar, igual
 * que el buscador de texto a 1000ms — ver la tarea 3 del plan).
 */
export default function RangeFilterComponent({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (n) => String(n),
  compact = false,
}: {
  min: number;
  max: number;
  step?: number;
  value: Range;
  onChange: (next: Range) => void;
  formatValue?: (n: number) => string;
  /** Solo la pista con las dos manijas (sin inputs Mínimo/Máximo ni resumen): Precio la arma aparte. */
  compact?: boolean;
}) {
  const currentMin = value.min ?? min;
  const currentMax = value.max ?? max;

  function setMin(next: number) {
    onChange({ min: Math.min(next, currentMax), max: value.max });
  }
  function setMax(next: number) {
    onChange({ min: value.min, max: Math.max(next, currentMin) });
  }

  return (
    <div>
      <div className="relative mx-2.5 mt-6 h-2 rounded-full bg-[#eef0f4]">
        <div
          aria-hidden
          className="absolute h-2 rounded-full bg-gradient-to-r from-[#ffc38a] to-orange"
          style={{
            left: `${((currentMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((currentMax - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          aria-label="Valor mínimo"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          onChange={(event) => setMin(Number(event.target.value))}
          className="price-slider pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2 appearance-none"
        />
        <input
          type="range"
          aria-label="Valor máximo"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          onChange={(event) => setMax(Number(event.target.value))}
          className="price-slider pointer-events-none absolute inset-x-0 top-1/2 w-full -translate-y-1/2 appearance-none"
        />
      </div>

      {!compact && (
        <>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Mínimo"
              value={value.min ?? ""}
              onChange={(event) =>
                onChange({
                  min: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                  max: value.max,
                })
              }
              className="h-10 w-full min-w-0 rounded-lg border border-transparent bg-gray-light px-3 text-small font-bold text-gray-dark placeholder:text-gray focus:border-orange focus:outline-none"
            />
            <span aria-hidden className="text-gray">
              —
            </span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Máximo"
              value={value.max ?? ""}
              onChange={(event) =>
                onChange({
                  min: value.min,
                  max: event.target.value
                    ? Number(event.target.value)
                    : undefined,
                })
              }
              className="h-10 w-full min-w-0 rounded-lg border border-transparent bg-gray-light px-3 text-small font-bold text-gray-dark placeholder:text-gray focus:border-orange focus:outline-none"
            />
          </div>

          <p className="mt-2 whitespace-nowrap text-small text-gray">
            {formatValue(currentMin)} – {formatValue(currentMax)}
          </p>
        </>
      )}
    </div>
  );
}
