import Image, { type StaticImageData } from "next/image";

/**
 * Una forma (SVG) de los banners de Figma, con su giro y su volteo. Figma
 * entrega estas piezas como una caja del tamaño del giro (`outerClassName`, ya
 * con su posición) y, dentro, la caja real de la forma (`boxClassName`) con la
 * transformación (`transformClassName`: `rotate-[…]`, `-scale-y-100`, `skew-x-[…]`).
 * Cuando la forma lleva un desenfoque, su SVG trae el margen del blur y se
 * pinta con ese sobrante (`bleedClassName`: `inset-[-22.6%_-16.55%]`).
 *
 * Es decoración: `aria-hidden` y sin `alt`.
 */
export default function HeroSlideShapeComponent({
  src,
  outerClassName,
  boxClassName,
  transformClassName = "",
  bleedClassName,
}: {
  src: StaticImageData;
  outerClassName: string;
  boxClassName: string;
  transformClassName?: string;
  bleedClassName?: string;
}) {
  const image = (
    <Image
      src={src}
      alt=""
      aria-hidden
      className={
        bleedClassName
          ? "block size-full max-w-none"
          : "absolute inset-0 block size-full max-w-none"
      }
    />
  );

  return (
    <div
      aria-hidden
      className={`absolute flex items-center justify-center ${outerClassName}`}
    >
      <div className={`flex-none ${transformClassName}`}>
        <div className={`relative ${boxClassName}`}>
          {bleedClassName ? (
            <div className={`absolute ${bleedClassName}`}>{image}</div>
          ) : (
            image
          )}
        </div>
      </div>
    </div>
  );
}
