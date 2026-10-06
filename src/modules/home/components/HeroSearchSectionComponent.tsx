import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

import HeroSearchTabsComponent from "./HeroSearchTabsComponent";
import IntroFeaturesComponent from "./IntroFeaturesComponent";
import TradeInBannerComponent from "./TradeInBannerComponent";

/**
 * Todo lo que cuelga del hero: la tarjeta de búsqueda (que se monta sobre la
 * parte baja del hero, encima del jeep), las tres tarjetas de introducción y
 * el banner de cambia-tu-vehículo. Van en un componente aparte, y no dentro de
 * `HeroComponent`, porque cruzan el borde entre el hero y la sección gris
 * siguiente.
 *
 * `xl:-mt-[250px]` es el solape: la tarjeta arranca en y=490 del banner (que mide
 * 740), o sea que se monta 250 px sobre él. Salió a ojo, no de una medida de Figma:
 * es lo que deja la barra de rótulos de los slides (`HeroCarouselComponent`, de
 * y=400 a ~457) entre el arte y la tarjeta, con ~33 px de aire. Antes la tarjeta
 * arrancaba en 400 y se montaba sobre el jeep; la barra la bajó 90 px. Ahora el jeep
 * va dentro de la foto del primer slide (acaba en y=546, ya fundida al gris). Si cambia el alto de la barra, del banner o
 * de la tarjeta, revisar este número y `HERO_BAND_END` (constants/hero-carousel.ts).
 *
 * La banda negra de los slides oscuros se ve A LOS LADOS de la tarjeta (como en Figma: el color sigue a su
 * derecha), no cortada por ella. Para eso el fondo gris de este bloque tiene que
 * empezar donde termina el hero, no donde empieza la tarjeta: ver `flow-root`
 * abajo. Lo que deba verse POR ENCIMA de la tarjeta va en la capa `foreground` de
 * `HeroCarouselComponent` (`z-20` contra el `z-10` de ella).
 *
 * Detrás de las tarjetas y del banner va un rayado gris de 992 x 152 (Figma
 * 684:30616, "Lines 13px"): centrado, asoma 67 px por debajo de las tarjetas y
 * acaba 19 px antes del banner, por eso se ancla al banner (`bottom-[99px]` =
 * 80 de alto del banner + 19) y no a las tarjetas, cuyo alto puede variar.
 *
 * El banner de cambia-tu-vehículo se sale 28 px de la sección gris hacia la
 * blanca de abajo (`xl:-mb-7`, y sin `pb` en desktop): en Figma el gris
 * (572 -> 949) acaba a media altura del banner (897 -> 977).
 *
 * Mobile (Figma "mobile 398", 701:54961): el banner mide 296 y se sale 101 px
 * (`-mb-[101px]`: el gris acaba en y=957 y el banner en 1058), a 57 px de las
 * tarjetas (que en mobile son un carrusel de 146 de alto: ver
 * `IntroFeaturesComponent`). El rayado (701:54995, 328 x 62, centrado) acaba 32 px
 * por encima del banner y asoma 25 px por debajo de las tarjetas; se ancla al
 * borde de arriba del banner (`bottom-full mb-8`, dentro de su envoltorio) y no a
 * un número, porque el banner escala con el ancho de la pantalla y su alto
 * varía. Lo que se sale de la sección lo absorbe la siguiente:
 * `FeaturedVehiclesComponent` sube su relleno de arriba.
 */
export default function HeroSearchSectionComponent() {
  return (
    // `flow-root` crea un contexto de formato de bloque: sin él, el margen
    // negativo del hijo (`-mt-[250px]`) colapsa a través de este contenedor y lo
    // sube 250 px con todo y su fondo gris, que entonces tapaba el hero desde el
    // borde de la tarjeta hacia abajo (la cuña naranja se veía cortada en seco
    // y no se veía a la derecha de la tarjeta). Con `flow-root` solo la tarjeta
    // se sale hacia arriba y el gris arranca al final del hero. El gris es el
    // mismo que ya trae el hero por debajo: no hace falta que sangre (es un
    // color plano, no una pieza posicionada en px), así que no necesita la
    // receta del lienzo centrado.
    <div className="relative flow-root bg-gray-light">
      <div className="container-wcar relative z-10 -mt-16 md:-mt-[calc(340px*var(--hero-s)-73px)] xl:-mt-[250px]">
        <HeroSearchTabsComponent />

        <div className="relative">
          <DiagonalLinesComponent
            variant="gray"
            className="absolute bottom-[99px] left-1/2 -z-10 hidden h-[152px] w-[992px] -translate-x-1/2 xl:block"
          />

          <div className="mt-6 xl:mt-[25px]">
            <IntroFeaturesComponent />
          </div>

          <div className="relative mt-[57px] -mb-[101px] xl:mt-[86px] xl:-mb-7">
            {/* Rayado de mobile: pegado ARRIBA del banner (32 px de aire) y del ancho
                del banner, porque el banner crece con la pantalla y su alto ya no es fijo. */}
            <DiagonalLinesComponent
              variant="gray"
              className="absolute bottom-full left-1/2 mb-8 -z-10 h-[62px] w-full max-w-[480px] -translate-x-1/2 xl:hidden"
            />
            <TradeInBannerComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
