const DIGITS = Array.from({ length: 10 }, (_, i) => i);

/**
 * Filtro "Placa": picker de dígitos 0-9 (así lo describe el documento
 * original, sin más detalle de cuántos elegir a la vez — ver la tarea 5 del
 * plan, queda como `TODO` de diseño exacto). Cada dígito elegido se manda
 * como número en `plate` del body.
 */
export default function PlateFilterComponent({
  selected,
  onChange,
}: {
  selected: number[];
  onChange: (next: number[]) => void;
}) {
  function toggle(digit: number) {
    onChange(selected.includes(digit) ? selected.filter((d) => d !== digit) : [...selected, digit]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {DIGITS.map((digit) => {
        const checked = selected.includes(digit);
        return (
          <button
            key={digit}
            type="button"
            onClick={() => toggle(digit)}
            aria-pressed={checked}
            className={`rounded-[5px] px-4 py-2 text-small ${checked ? "bg-orange text-white" : "bg-gray-light text-black"}`}
          >
            {digit}
          </button>
        );
      })}
    </div>
  );
}
