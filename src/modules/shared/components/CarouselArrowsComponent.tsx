function ArrowButton({
  label,
  disabled,
  onClick,
  flip = false,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      // Deshabilitada no baja la opacidad del botón: se desvanecería también la
      // flecha, que es blanca. Baja solo el fondo, como en el diseño.
      className="grid size-6 place-items-center rounded-sm bg-[#ff8000] text-white disabled:bg-[#ff8000]/30"
    >
      <svg
        aria-hidden
        viewBox="0 0 12 12"
        className={`size-3 ${flip ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />
      </svg>
    </button>
  );
}

/**
 * Par de flechas anterior / siguiente de los carruseles: dos cuadrados de 24px
 * con 8px en medio, en naranja, y el de un extremo sin recorrido en naranja al
 * 30%. Son los que se ven junto a las pestañas y a las rayas de "Nuestro
 * Equipo".
 */
export default function CarouselArrowsComponent({
  canPrev,
  canNext,
  onPrev,
  onNext,
  className = "",
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      <ArrowButton label="Anterior" disabled={!canPrev} onClick={onPrev} flip />
      <ArrowButton label="Siguiente" disabled={!canNext} onClick={onNext} />
    </div>
  );
}
