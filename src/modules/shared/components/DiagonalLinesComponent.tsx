/**
 * Patrón de rayas diagonales del sistema de diseño. En Figma es el componente
 * "Lines 13px", un tile de 13x13 que se repite; aparece 8 veces solo en la
 * vista Sobre Nosotros y también en el home.
 *
 * Va como `background-image` y no como <Image> porque next/image no repite:
 * necesita renderizar un tile en mosaico, no una imagen única.
 */
export default function DiagonalLinesComponent({
  className,
  variant = "white",
  tile = 13,
}: {
  className?: string;
  /** El tile existe en dos colores: blanco sobre fondos oscuros (hero) y gris
   *  sobre fondos claros o fotos (fundador). */
  variant?: "white" | "gray";
  /** Lado del tile en px (13 en casi todo el diseño; 6,5 en el rayado fino del hero mobile del Taller). */
  tile?: number;
}) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: `url('/assets/shared/lines-13px-${variant}.png')`,
        backgroundSize: `${tile}px ${tile}px`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
