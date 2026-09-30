/**
 * Indicador de un carrusel en teléfono: una raya por posición (59,3 de ancho y 16
 * entre ellas, centradas), la activa naranja de 3 px y las demás `gray` al 50 % de
 * 2 px. Cada raya es un botón (regla del proyecto: una raya por posición, y
 * clicable) de 24 px de alto para que la zona táctil sea cómoda.
 *
 * Distinto de `CarouselSegmentsComponent` (rayas de 3 px sobre una pista continua, para
 * el catálogo del home): aquí son rayas sueltas de 59,3 px, centradas.
 *
 * Medidas de "Frame 594" de Financiación mobile (Figma 204:7872 y 204:7379). Va con
 * `useCarousel`: recibe `position`, `positions` y `scrollToPosition` de ahí.
 */
export default function CarouselPagesComponent({
  position,
  positions,
  onSelect,
  className = "",
}: {
  position: number;
  positions: number;
  onSelect: (position: number) => void;
  className?: string;
}) {
  return (
    <div className={`flex justify-center gap-4 ${className}`}>
      {Array.from({ length: positions }, (_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Ir a la posición ${index + 1} de ${positions}`}
          aria-current={index === position}
          onClick={() => onSelect(index)}
          className="flex h-6 w-[59.33px] cursor-pointer items-center"
        >
          <span
            aria-hidden
            className={`block w-full transition-colors motion-reduce:transition-none ${
              index === position ? "h-[3px] bg-orange" : "h-0.5 bg-gray/50"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
