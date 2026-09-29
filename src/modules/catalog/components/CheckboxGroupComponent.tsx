import Image from "next/image";

/**
 * Lista de checkboxes id→nombre, reutilizada por los filtros que son "elegí
 * uno o varios de una lista fija o del backend": Ubicación, Tipo, Transmisión,
 * Tracción, Disponibilidad y Combustible (ver `docs/planes/compra-tu-carro.md`,
 * tarea 5). Cada uno de esos seis filtros es esta misma pieza con datos
 * distintos, así que se construye una sola vez.
 */
export default function CheckboxGroupComponent({
  name,
  options,
  selected,
  onChange,
}: {
  /** Para el `name`/`id` de cada `<input>`: debe ser único por filtro ("sede", "tipo"...). */
  name: string;
  options: {
    value: string;
    label: string;
    imageUrl?: string | null;
    count?: number;
  }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(value: string) {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value],
    );
  }

  if (options.length === 0) {
    return (
      <p className="text-caption text-gray">No hay opciones disponibles.</p>
    );
  }

  return (
    <ul className="flex flex-col">
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        return (
          <li key={option.value} className="my-2 flex items-center gap-2">
            <input
              id={id}
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="filter-checkbox"
            />
            {option.imageUrl && (
              <Image
                src={option.imageUrl}
                alt=""
                aria-hidden
                width={25}
                height={25}
                className="size-[25px] object-contain"
              />
            )}
            <label htmlFor={id} className="text-small text-gray select-none">
              {option.label}
              {option.count != null && (
                <span className="ml-1">({option.count})</span>
              )}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
