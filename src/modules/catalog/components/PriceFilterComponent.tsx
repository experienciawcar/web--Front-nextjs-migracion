import RangeFilterComponent, { type Range } from "./RangeFilterComponent";

const PRICE_MIN = 1_000_000;
const PRICE_MAX = 300_000_000;

/** Rangos populares (`docs/replicar-diseno-filtros.md` §6): un solo lado abierto en los extremos. */
const POPULAR_RANGES: { label: string; range: Range }[] = [
  { label: "Hasta $20M", range: { max: 20_000_000 } },
  { label: "$20M – $50M", range: { min: 20_000_000, max: 50_000_000 } },
  { label: "$50M – $90M", range: { min: 50_000_000, max: 90_000_000 } },
  { label: "$90M – $150M", range: { min: 90_000_000, max: 150_000_000 } },
  { label: "Más de $150M", range: { min: 150_000_000 } },
];

const money = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

/**
 * Filtro "Precio": chips de rangos populares (grilla de 2, activo naranja; tocar el activo lo
 * quita), el valor actual en texto y el slider de dos manijas con los límites `$1M` / `+300M`
 * debajo. Sin inputs numéricos, a diferencia de Kilometraje.
 */
export default function PriceFilterComponent({
  value,
  onChange,
}: {
  value: Range;
  onChange: (next: Range) => void;
}) {
  const min = value.min ?? PRICE_MIN;
  const max = value.max ?? PRICE_MAX;

  return (
    <div>
      <p className="mb-2 text-small font-bold text-gray">Rangos populares</p>
      <div className="grid grid-cols-2 gap-[0.6em]">
        {POPULAR_RANGES.map(({ label, range }) => {
          const active = value.min === range.min && value.max === range.max;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? {} : range)}
              className={`rounded-lg border px-[0.6em] py-[0.7em] text-[13px] font-medium ${
                active
                  ? "border-orange bg-orange text-white"
                  : "border-[#e7ebf1] bg-gray-light text-gray"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-small font-bold text-gray">Rango de precio</p>
      <p className="mt-1 whitespace-nowrap text-small text-gray">
        $ {money.format(min)} — $ {money.format(max)}
        {value.max == null && "+"}
      </p>

      <RangeFilterComponent
        compact
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={1_000_000}
        value={value}
        onChange={onChange}
      />
      <div className="mt-1 flex justify-between text-caption text-gray">
        <span>$1M</span>
        <span>+300M</span>
      </div>
    </div>
  );
}
