/**
 * Indicadores de carrusel: rayas horizontales, la activa en naranja y el resto
 * en gris azulado. En Figma son los nodos "slider" (37:9208 en Misión &
 * visión, 37:9300 en Equipo, 37:9680 en Testimonios).
 *
 * Sin `onSelect` son decorativos (Misión & visión: la maquetación va estática
 * y el desplazamiento se hace con scroll táctil). Con `onSelect` (Vende tu
 * Carro) cada raya es un botón real con `aria-label` y estado seleccionado.
 */
export default function CarouselDotsComponent({
  total,
  active = 0,
  width = 64,
  onSelect,
  className = "",
}: {
  total: number;
  active?: number;
  /** Ancho de cada raya: 64px en Misión & visión, 24px en Equipo. */
  width?: number;
  /** Si se da, cada raya se vuelve clicable y llama con su posición. */
  onSelect?: (position: number) => void;
  className?: string;
}) {
  if (!onSelect) {
    return (
      <div aria-hidden className={`flex items-center gap-6 ${className}`}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} style={{ width }} className={`h-px ${i === active ? "bg-orange" : "bg-[#c7d1df]"}`} />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-6 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Ir a la posición ${i + 1} de ${total}`}
          aria-current={i === active}
          onClick={() => onSelect(i)}
          // El botón es más alto que la raya para tener dónde pulsar.
          className="flex h-6 items-center"
        >
          <span style={{ width }} className={`h-px ${i === active ? "bg-orange" : "bg-[#c7d1df]"}`} />
        </button>
      ))}
    </div>
  );
}
