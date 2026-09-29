import type { ColorOption } from "../types/filter-options";

/**
 * Filtro "Color": un círculo con el `hex` real del backend + el nombre. Se
 * manda por **nombre**, no por id (verificado contra el backend real, ver
 * `docs/planes/compra-tu-carro/referencia-sitio-anterior.md` §B.1) — por eso
 * `selected`/`onChange` trabajan con nombres, no con ids.
 */
export default function ColorFilterComponent({
  colors,
  selected,
  onChange,
}: {
  colors: ColorOption[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(name: string) {
    onChange(selected.includes(name) ? selected.filter((n) => n !== name) : [...selected, name]);
  }

  if (colors.length === 0) {
    return <p className="text-caption text-gray">No hay colores disponibles.</p>;
  }

  return (
    <ul className="flex flex-wrap gap-x-2.5 gap-y-1">
      {colors.map((color) => {
        const checked = selected.includes(color.name);
        return (
          <li key={color.name}>
            <button
              type="button"
              title={color.name}
              aria-label={color.name}
              aria-pressed={checked}
              onClick={() => toggle(color.name)}
              className={`flex size-[2.7em] items-center justify-center rounded-full border ${
                checked ? "border-black" : "border-gray"
              }`}
            >
              <span className="size-8 rounded-full" style={{ backgroundColor: color.hex }} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
