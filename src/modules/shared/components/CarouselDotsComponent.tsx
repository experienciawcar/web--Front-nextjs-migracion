/**
 * Indicadores de carrusel: rayas horizontales, la activa en naranja y el resto
 * en gris azulado. En Figma son los nodos "slider" (37:9208 en Misión &
 * visión, 37:9300 en Equipo, 37:9680 en Testimonios).
 *
 * Por ahora son decorativos: la maquetación va estática y el desplazamiento se
 * hace con scroll táctil, así que no representan estado navegable.
 * TODO: al conectar la lógica del carrusel, convertirlos en botones con
 * aria-label y estado seleccionado.
 */
export default function CarouselDotsComponent({
  total,
  active = 0,
  width = 64,
  className = "",
}: {
  total: number;
  active?: number;
  /** Ancho de cada raya: 64px en Misión & visión, 24px en Equipo. */
  width?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={`flex items-center gap-6 ${className}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          style={{ width }}
          className={`h-px ${i === active ? "bg-[#ff8000]" : "bg-[#c7d1df]"}`}
        />
      ))}
    </div>
  );
}
