import Image from "next/image";

import starHalf from "../assets/icons/star-half.svg";
import star from "../assets/icons/star.svg";

/**
 * Estrellas de calificación. En el diseño son de 18px con 5px de aire entre
 * ellas (van posicionadas cada 23px) y usan el amarillo del sistema.
 *
 * Solo existen dos piezas en Figma: estrella llena y media estrella. No hay
 * estrella vacía, así que una calificación por debajo de 4 dejaría huecos.
 * Hoy no pasa (los valores del diseño son 4.5 y 5.0), pero si el backend
 * llega a mandar valores más bajos hay que pedirle a diseño la variante vacía.
 */
export default function StarRatingComponent({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-[5px] ${className}`}
      role="img"
      aria-label={`${value} de 5 estrellas`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const llena = value >= i + 1;
        const media = !llena && value > i;
        if (!llena && !media) return null;
        return (
          <Image
            key={i}
            src={llena ? star : starHalf}
            alt=""
            aria-hidden
            className="size-[18px]"
          />
        );
      })}
    </span>
  );
}
