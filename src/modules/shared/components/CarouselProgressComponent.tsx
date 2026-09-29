/**
 * Barra de progreso continua de un carrusel: una pista, un tramo activo que
 * crece hasta `(posición + 1) / posiciones` y, encima, un botón invisible por
 * posición para que la barra sea clicable (regla del proyecto: una raya por
 * posición, y clicable).
 *
 * Nació en "Servicios adicionales" de Taller (pista casi invisible sobre fondo
 * oscuro) y se repite en los pasos de Financiación (pista y tramo grises sobre
 * blanco); lo único que cambia es el color y el grosor, que llegan por
 * `trackClassName` y `activeClassName`. Va con `flex-1`: ocupa lo que quede en la
 * fila de controles, junto a `CarouselArrowsComponent`. Alto de 24px para que la
 * zona clicable sea cómoda aunque la raya mida 1 a 3px.
 *
 * Se usa dentro de un componente cliente con `useCarousel` (recibe `position`,
 * `positions` y `scrollToPosition` de ahí).
 */
export default function CarouselProgressComponent({
  position,
  positions,
  onSelect,
  trackClassName,
  activeClassName,
  className = "",
}: {
  position: number;
  positions: number;
  onSelect: (position: number) => void;
  /** Alto y color de la pista completa (p. ej. `h-[2px] bg-white/5`). */
  trackClassName: string;
  /** Alto y color del tramo activo (p. ej. `h-[2px] bg-gray/50`). */
  activeClassName: string;
  className?: string;
}) {
  const progress = ((position + 1) / positions) * 100;

  return (
    <div className={`relative h-6 flex-1 ${className}`}>
      <span aria-hidden className={`absolute inset-x-0 top-1/2 -translate-y-1/2 ${trackClassName}`} />
      <span
        aria-hidden
        className={`absolute top-1/2 left-0 -translate-y-1/2 transition-[width] duration-300 motion-reduce:transition-none ${activeClassName}`}
        style={{ width: `${progress}%` }}
      />
      <div className="absolute inset-0 flex">
        {Array.from({ length: positions }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir a la posición ${index + 1} de ${positions}`}
            aria-current={index === position}
            onClick={() => onSelect(index)}
            className="h-full min-w-0 flex-1 cursor-pointer"
          />
        ))}
      </div>
    </div>
  );
}
