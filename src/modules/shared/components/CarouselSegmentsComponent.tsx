/**
 * Paginación de un carrusel en rayas: una de 3px por posición, la activa en
 * naranja y las demás en `gray` al 50 %, sobre una pista de 1px `gray` al 20 %
 * que corre por debajo de todas. Cada raya es un botón (de 24px de alto para
 * que sea cómodo de pulsar aunque la raya mida 3): regla del proyecto, una raya
 * por posición y clicable.
 *
 * Es el "slider" del catálogo destacado del inicio (Figma 671:13992: rayas de
 * 179px con 48 en medio, la primera en naranja) y de la tira de novedades del
 * hero. A diferencia de `CarouselProgressComponent` (una barra continua que
 * crece), aquí cada posición tiene su raya.
 *
 * Las rayas miden como máximo 179px y, si hay muchas, se encogen para caber en
 * una sola fila en vez de partirse (`min-w-0 flex-1`); la separación también se
 * encoge (`gap-3`) porque los 48px del diseño solo caben con cuatro o cinco.
 *
 * Se usa dentro de un componente cliente con `useCarousel` (recibe `position`,
 * `positions` y `scrollToPosition` de ahí). Va con `flex-1`: ocupa lo que quede
 * en la fila de controles, junto a `CarouselArrowsComponent`.
 */
export default function CarouselSegmentsComponent({
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
    <div className={`relative flex h-6 flex-1 items-center ${className}`}>
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray/20" />
      <div className="relative flex min-w-0 flex-1 gap-3 xl:gap-6">
        {Array.from({ length: positions }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir a la posición ${index + 1} de ${positions}`}
            aria-current={index === position}
            onClick={() => onSelect(index)}
            className="flex h-6 min-w-0 max-w-[179px] flex-1 cursor-pointer items-center"
          >
            <span
              aria-hidden
              className={`h-[3px] w-full transition-colors duration-300 motion-reduce:transition-none ${index === position ? "bg-orange" : "bg-gray/50"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
