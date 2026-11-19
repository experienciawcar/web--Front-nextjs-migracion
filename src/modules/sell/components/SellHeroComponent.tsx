import Image from "next/image";

import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

/**
 * Hero de "Vende tu Carro" según Figma (desktop 496:2147 → marco 497:15323,
 * mobile 1586:12599). El fondo (foto de las llaves, triángulo naranja, marca
 * de agua "W", rayas) va horneado en un WebP por breakpoint, sin texto:
 * `hero/banner.webp` (1440x509 a 2x; el pixel de la derecha se estira en
 * `banner-borde-der.webp` para que el fondo sangre en pantallas anchas) y
 * `hero/mobile/banner.webp` (393x741 a 1x, único tamaño que da el export).
 * El texto y el botón se maquetan encima con las posiciones del Figma.
 *
 * Mobile: columna de 393 centrada sobre negro hasta `xl`.
 */
export default function SellHeroComponent() {
  return (
    <section className="relative overflow-x-clip bg-black" aria-label="Vende tu carro con wcar">
      {/* Desktop: lienzo de 1440 pegado a la derecha (<1440) o centrado (>=1440). */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 left-1/2 hidden bg-[length:100%_100%] xl:block"
        style={{ backgroundImage: "url(/assets/vende-tu-carro/hero/banner-borde-der.webp)" }}
      />
      <div className="absolute inset-y-0 right-0 hidden w-[1440px] min-[1440px]:right-auto min-[1440px]:left-1/2 min-[1440px]:-translate-x-1/2 xl:block">
        <Image
          src="/assets/vende-tu-carro/hero/banner.webp"
          alt=""
          aria-hidden
          fill
          sizes="1440px"
          priority
          className="object-cover"
        />
      </div>
      {/* Mobile */}
      <div className="absolute inset-y-0 left-1/2 w-[393px] -translate-x-1/2 xl:hidden">
        <Image
          src="/assets/vende-tu-carro/hero/mobile/banner.webp"
          alt=""
          aria-hidden
          fill
          sizes="393px"
          priority
          className="object-cover"
        />
      </div>

      <div className="relative mx-auto h-[741px] w-[393px] xl:h-[509px] xl:w-auto xl:max-w-[1440px]">
        <div className="absolute top-[51px] left-8 xl:top-[82px] xl:left-[125px]">
          <p className="reveal flex flex-col gap-2 text-small font-bold text-white xl:flex-row xl:items-center xl:gap-4">
            <span aria-hidden className="h-[3px] w-12 shrink-0 bg-orange" />
            Lo revisamos a fondo. Lo reparamos con excelencia
          </p>
        </div>

        <h1 className="reveal absolute top-[124px] left-[33px] w-[328px] text-[28px] leading-[normal] font-semibold text-white xl:top-[141px] xl:left-[125px] xl:w-[520px] xl:text-[44px] xl:leading-[55px]">
          ¡Vende tu carro a un precio razonable y{" "}
          <span className="font-normal italic">
            llévate <br className="hidden xl:inline" />
            una oferta BRUTAL
          </span>
        </h1>

        <div className="reveal absolute top-[652px] left-1/2 -translate-x-1/2 xl:top-[371px] xl:left-[125px] xl:translate-x-0">
          <ButtonComponent href={ROUTES.quote} variant="primary">
            VENDE TU CARRO
          </ButtonComponent>
        </div>
      </div>
    </section>
  );
}
