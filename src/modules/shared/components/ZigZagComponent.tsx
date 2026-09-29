import Image from "next/image";

import zigzagDark from "../assets/icons/zigzag-dark.svg";
import zigzagWhite from "../assets/icons/zigzag-white.svg";
import zigzagYellow from "../assets/icons/zigzag-yellow.svg";

/**
 * Adorno "Zig zag" del diseño (nodos 27:7760 y 37:8614): dos líneas en zigzag
 * verticales, una oscura y otra amarilla, dentro de una caja de 36x112.
 *
 * Figma las exporta horizontales (107x15) y las rota 90 grados. Aquí se hace
 * igual: se posiciona cada una por su centro y se rota, en vez de pedir un
 * SVG ya vertical, para no alterar el archivo original.
 *
 * `max-w-none` es imprescindible: el preflight de Tailwind aplica
 * `max-width:100%` a las imágenes, y sin quitarlo el SVG de 107px se recorta al
 * ancho de 36px del contenedor y el zigzag sale a un tercio de su tamaño.
 *
 * Ojo: en los metadatos de Figma la `y` de estas instancias corresponde al
 * borde INFERIOR, no al superior. Las posiciones de aquí salen de medir el
 * render, no de esos metadatos.
 *
 * `tone="light"`: la línea de la izquierda en blanco en vez de oscura, para
 * fondos oscuros (el panel "Razones para comprar" del home en mobile, Figma
 * 701:55054, trae la misma caja de 36x112 con el blanco a la izquierda).
 */
export default function ZigZagComponent({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <div aria-hidden className={`relative h-[112px] w-9 ${className}`}>
      <Image
        src={tone === "light" ? zigzagWhite : zigzagDark}
        alt=""
        className="absolute top-[57px] left-[8px] h-[15.31px] w-[107.47px] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90"
      />
      <Image
        src={zigzagYellow}
        alt=""
        className="absolute top-[53px] left-[27px] h-[15.31px] w-[107.47px] max-w-none -translate-x-1/2 -translate-y-1/2 rotate-90"
      />
    </div>
  );
}
