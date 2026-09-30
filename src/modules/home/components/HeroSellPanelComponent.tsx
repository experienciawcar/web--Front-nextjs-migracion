// Mobile (captura del usuario): Año, Modelo, Versión y Kilometraje; desktop: Año,
// Marca, Modelo y Kilometraje. Cada selector dice en qué ancho se ve.
const SELECTS: { label: string; only?: "mobile" | "desktop" }[] = [
  { label: "Año" },
  { label: "Marca", only: "desktop" },
  { label: "Modelo" },
  { label: "Versión", only: "mobile" },
  { label: "Kilometraje" },
];

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-gray-dark"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/**
 * Panel de la pestaña "Vende tu carro" del buscador del home: placa, cuatro
 * selectores (año, marca, modelo, kilometraje) y el botón "Conocer el valor de
 * vehículo". Por ahora es solo la maqueta, sin funcionalidad (pedido del usuario):
 * los selectores no tienen opciones y el botón no envía nada.
 * TODO: conectar con la cotización (placa -> datos del vehículo -> valor).
 */
export default function HeroSellPanelComponent() {
  return (
    <div className="mt-7">
      <h3 className="text-[18px] leading-6 font-bold text-dark-gray md:text-body">
        Conoce el valor aproximado{" "}
        <span className="text-orange italic">de tu vehículo</span>
      </h3>
      <p className="mt-2 text-small text-gray-dark">
        Ingresa la placa de tu vehículo o los datos para calcular el valor de tu
        vehículo
      </p>

      <div className="mt-5 flex h-[50px] items-stretch md:h-[54px] overflow-hidden rounded-lg border-[1.5px] border-orange/60 bg-white transition-colors focus-within:border-orange">
        <label
          htmlFor="sell-plate"
          className="flex items-center bg-orange/70 px-5 text-body font-bold text-dark-gray md:px-6"
        >
          Placa
        </label>
        <input
          id="sell-plate"
          type="text"
          placeholder="ABC123"
          autoComplete="off"
          maxLength={7}
          className="min-w-0 flex-1 bg-transparent px-5 text-small font-medium tracking-[0.2em] text-dark-gray uppercase outline-none placeholder:text-gray"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {SELECTS.map(({ label, only }) => (
          <div
            key={label}
            className={`relative ${only === "mobile" ? "md:hidden" : only === "desktop" ? "hidden md:block" : ""}`}
          >
            <select
              aria-label={label}
              defaultValue=""
              className="h-12 w-full appearance-none rounded-lg border border-gray/30 bg-gray-light pr-10 pl-3 text-body md:h-[42px] md:text-small text-dark-gray outline-none focus:border-orange"
            >
              <option value="" disabled>
                {label}
              </option>
            </select>
            <ChevronIcon />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-disabled
        className="mt-5 flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg rounded-br-[28px] bg-orange text-small font-semibold tracking-wide text-white uppercase md:h-[42px] md:bg-gray md:text-[11px] md:text-dark-gray"
      >
        Conocer el valor de vehículo
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-[18px]"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12h8m-3-3 3 3-3 3" />
        </svg>
      </button>
    </div>
  );
}
