/**
 * Filtro "Año": un solo valor, no un rango real — el backend manda
 * `year_from` = `year_to` con el mismo valor (ver la referencia del plan
 * §7), así que aquí es selección simple, no múltiple. Se muestra como chips
 * (`docs/replicar-diseno-filtros.md` §5): grilla de 3 por fila, activo naranja;
 * volver a tocar el chip activo quita el filtro.
 */
export default function YearFilterComponent({
  years,
  value,
  onChange,
}: {
  years: number[];
  value?: string;
  onChange: (next?: string) => void;
}) {
  return (
    <div role="group" aria-label="Año" className="grid grid-cols-3 gap-x-2 gap-y-1">
      {years.map((year) => {
        const active = value === String(year);
        return (
          <button
            key={year}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active ? undefined : String(year))}
            className={`rounded-[5px] px-2 py-2 text-small ${
              active ? "bg-orange text-white" : "bg-gray-light text-black"
            }`}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}
