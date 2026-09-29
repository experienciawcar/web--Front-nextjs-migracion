"use client";

export const QUOTE_STEPS = ["Datos personales", "Datos del carro", "Ubicación y detalles", "Agenda tu cita"] as const;

/**
 * Stepper horizontal de 4 pasos: círculo numerado + texto, con una línea
 * entre cada par. Medido en `wcar.co/cotizar` (círculos de 25px, línea entre
 * ellos), pero con un 4.º paso que no tenía captura ("Agenda tu cita": ver
 * `docs/planes/cotizar.md`, "Decisión de alcance"). El paso activo va en
 * naranja; los ya completados, en negro con fondo claro; los pendientes, en
 * gris.
 */
export default function QuoteStepperComponent({
  current,
  onSelect,
}: {
  current: number;
  /** Ir a un paso ya completado (no a uno futuro): quien lo llama decide si el paso pedido es válido. */
  onSelect?: (step: number) => void;
}) {
  return (
    <ol className="flex items-start" aria-label={`Paso ${current + 1} de ${QUOTE_STEPS.length}`}>
      {QUOTE_STEPS.map((label, index) => {
        const canGoBack = onSelect && index < current;
        const circle = (
          <span
            aria-current={index === current ? "step" : undefined}
            className={`grid size-[25px] shrink-0 place-items-center rounded-full text-caption font-bold ${
              index === current
                ? "bg-orange text-white"
                : index < current
                  ? "bg-dark-gray text-white"
                  : "bg-gray-light text-gray"
            }`}
          >
            {index < current ? "✓" : index + 1}
          </span>
        );

        return (
          <li key={label} className="flex min-w-0 flex-1 items-center last:flex-none">
            {canGoBack ? (
              <button
                type="button"
                onClick={() => onSelect(index)}
                className="flex cursor-pointer items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
              >
                {circle}
                <span className="hidden truncate text-small font-medium text-dark-gray md:inline">{label}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {circle}
                <span className={`hidden truncate text-small font-medium md:inline ${index <= current ? "text-dark-gray" : "text-gray"}`}>
                  {label}
                </span>
              </div>
            )}
            {index < QUOTE_STEPS.length - 1 && (
              <span aria-hidden className={`mx-3 h-px min-w-6 flex-1 ${index < current ? "bg-dark-gray" : "bg-gray-light"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
