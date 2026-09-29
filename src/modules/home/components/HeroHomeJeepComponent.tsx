import Image from "next/image";

/**
 * El jeep del primer slide del banner (`HeroSlideHomeComponent`). Va en una
 * capa aparte (`foreground` de `HeroCarouselComponent`), `z-20`: por encima de
 * la tarjeta de búsqueda (`z-10` en `HeroSearchSectionComponent`), para que el
 * jeep se vea montado sobre ella y no cortado por su borde, como en Figma. Los
 * `pointer-events-none` dejan pasar los clics a la tarjeta.
 *
 * Posición y tamaño: 585 x 313, a 64 px del borde de la derecha del lienzo y a 79 del
 * de arriba (antes 185). Sube 106 px porque la barra de rótulos de los slides
 * (`HeroCarouselComponent`) ocupa la franja de y=400 a 457 y el jeep ya no puede
 * pasar por ahí: ahora acaba en y=392, sobre la barra, y no llega a la tarjeta de
 * búsqueda (que empieza en y=490).
 */
export default function HeroHomeJeepComponent() {
  return (
    <div className="pointer-events-none absolute top-[79px] right-[64px] h-[313px] w-[585px]">
      <Image
        src="/assets/home/hero/jeep.webp"
        alt="Jeep Wrangler naranja, el vehículo destacado de wcar"
        fill
        sizes="585px"
        priority
        className="object-contain object-bottom"
      />
    </div>
  );
}
