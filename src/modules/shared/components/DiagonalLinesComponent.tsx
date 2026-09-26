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
}: {
  className?: string;
  /** El tile existe en dos colores: blanco sobre fondos oscuros (hero) y gris
   *  sobre fondos claros o fotos (fundador). */
  variant?: "white" | "gray";
}) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: `url('/assets/shared/lines-13px-${variant}.png')`,
        backgroundSize: "13px 13px",
        backgroundRepeat: "repeat",
      }}
    />
  );
}
