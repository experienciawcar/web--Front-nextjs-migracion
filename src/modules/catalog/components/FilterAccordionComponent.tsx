/**
 * Un filtro del sidebar, como acordeón `<details>` nativo — pero **sin**
 * `name` compartido: a diferencia del acordeón de preguntas frecuentes (que
 * cierra uno al abrir otro), acá cada filtro se abre/cierra de forma
 * independiente (guía de la tarea 5 del plan). `defaultOpen` deja alguno
 * abierto de entrada (Kilometraje, en la captura de referencia, se ve
 * siempre desplegado).
 */
export default function FilterAccordionComponent({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="filter-accordion group mt-4">
      <summary className="flex border-b border-gray pb-2 cursor-pointer list-none items-center justify-between gap-2 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="text-small text-gray">{title}</span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-3.5 shrink-0 text-gray transition-transform duration-200 group-open:rotate-180"
        >
          <path
            d="m6 9 6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </summary>
      <div className="pt-3 pb-2">{children}</div>
    </details>
  );
}
