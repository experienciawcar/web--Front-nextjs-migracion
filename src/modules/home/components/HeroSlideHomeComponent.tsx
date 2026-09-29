import Image from "next/image";

import starIcon from "@/modules/shared/assets/icons/star.svg";
import isotipoWcar from "@/modules/shared/assets/icons/isotipo-wcar.svg";
import logoSantander from "@/modules/shared/assets/hero/logo-santander.png";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

import watermarkWcar from "../assets/hero-decor/watermark-wcar.svg";
import { HERO_BAND_END, HERO_CANVAS_MARGIN } from "../constants/hero-carousel";

/**
 * Primer slide del carousel del banner (`HeroComponent`): el hero del inicio
 * (rediseño "Home - 2.0" de Figma, nodo 671:11456 "Banner", 1440 x 500, dentro
 * del frame 671:11438).
 *
 * El jeep NO está aquí: va en `HeroHomeJeepComponent`, en una capa aparte por
 * encima de la tarjeta de búsqueda (dentro del slide no puede pasar por encima
 * de ella: el slide tiene su propio fondo y su propio contexto de apilado).
 *
 * Este slide, en Figma, es el hero anterior: Reemplaza al hero anterior (con dos
 * botones y varios jeeps): sin botones (se movieron a la tarjeta de búsqueda
 * que cuelga encima, ver `HeroSearchSectionComponent`), y el fondo es un
 * reparto diagonal: gris claro a la izquierda con la marca de agua "wcar", y
 * una cuña naranja a la derecha con un solo jeep.
 *
 * El alto (740) y el tamaño del jeep (585x313, misma proporción que el de
 * Figma) NO son los del diseño (500 y 396x212): el usuario pidió, en dos
 * pasos, un hero cada vez más alto y la tarjeta de búsqueda cada vez más
 * montada sobre él (`HeroSearchSectionComponent`, que fija cuánto se monta
 * con un margen negativo). Salió a ojo contra la referencia que pasó, no de
 * una medida de Figma.
 *
 * Medidas (px de diseño):
 * - Cuña naranja: un rectángulo girado 3,3°; medida contra el export
 *   (`comparar_figma`-style, a ojo de píxel) da aproximadamente
 *   `polygon(80% 0, 100% 0, 100% 100%, 48.75% 100%)`. Su lado derecho ya cae
 *   recto en x=1440 (los dos puntos de la derecha del `clipPath` están al
 *   100 %), así que en pantallas anchas una segunda franja lisa del mismo
 *   naranja sangra desde ahí hasta el borde de la ventana (guía §4.2): sin
 *   eso, el usuario vio la foto y el lockup parados lejos del borde real, con
 *   una franja gris de más en medio.
 * - Lockup arriba a la derecha (916,31,394,50): el isotipo "W" en naranja +
 *   "wcar" en negro (no blanco, porque acá va sobre fondo claro) | Santander en
 *   blanco (va sobre la cuña naranja). Con una raya vertical en medio.
 * - Rayado pequeño en la esquina superior derecha (671:11471, 56 x 147, al
 *   50 %), recortado por el borde del hero.
 * - `<h1>` a (126,46,545,96), 42/48 (antes era 48/48): "El vehículo mas
 *   seguro" bold + "de colombia" italic naranja.
 * - Raya fina (126,169,282,0) `gray` al 30 %, 1,5px.
 * - Calificación (126,197): estrella + "4,8 en Google · +9.000 Clientes
 *   felices · +10.000 Vehículos vendidos" (antes solo traía dos datos), con
 *   cada cifra en 24 bold naranja y la etiqueta en 14 semibold `gray-dark`.
 *
 * La foto es el mismo jeep de antes (mismo recorte de Figma: incluso las seis
 * cifras del `imageTransform` son idénticas), solo que ahora se ve más chico.
 *
 * Solo desktop (`xl`): el mobile es `HeroSlideHomeMobileComponent`. Por eso el
 * `<h1>` de la página (que vive aquí) está oculto en mobile, donde el título es un
 * `role="heading" aria-level="1"` del componente mobile.
 */
export default function HeroSlideHomeComponent() {
  return (
    <div className="relative mx-auto hidden md:block md:max-w-[1440px]" style={{ marginLeft: HERO_CANVAS_MARGIN }}>
        {/* Cuña naranja + jeep + lockup: solo desktop. */}
        <div aria-hidden className="absolute inset-0 hidden md:block">
          <Image
            src={watermarkWcar}
            alt=""
            className="absolute top-[9px] left-[-23px] h-[186px] w-[835px] max-w-none opacity-80"
          />
          <div
            className="absolute top-0 right-0 h-[500px] w-full bg-orange"
            style={{
              clipPath: "polygon(80% 0, 100% 0, 100% 100%, 48.75% 100%)",
            }}
          />
          {/* La diagonal de arriba mide 500 de alto (lo que medía TODO el hero
              en el diseño): al estirar el hero a 740 para que la tarjeta de
              búsqueda se montara más sobre él, si la diagonal se estiraba con
              todo el hero, la tarjeta le tapaba el tramo de abajo y la cuña se
              veía cortada en una línea recta en vez de terminar en punta. Esta
              franja lisa completa la cuña donde la diagonal ya terminó (ancha
              del todo, de 48,75% a 100%): la tarjeta se monta encima, sobre
              naranja liso, no sobre la diagonal cortada a la mitad.

              Arranca 1 px antes (499) para que, con el lienzo escalado en tablet, no quede una línea
              fina entre esta franja y la cuña. Termina en `HERO_BAND_END` (673), no en el borde del hero (740):
              la tarjeta empieza en y=490 y mide ~231, o sea acaba en ~721, y
              como en Figma el naranja que asoma a su derecha se corta ~48 px
              antes de que la tarjeta acabe (en el diseño acaba en 538 y la
              tarjeta en 586). Es la misma altura donde acaba la banda negra de
              los slides oscuros: ver `constants/hero-carousel.ts`. */}
          <div
            aria-hidden
            className="absolute top-[499px] right-0 left-[48.75%] bg-orange"
            style={{ height: HERO_BAND_END - 499 }}
          />
          {/* La cuña de arriba mide justo el lienzo de 1440 (su lado derecho ya
              cae en x=1440, recto y sin diagonal: los dos puntos de la derecha
              del `clipPath` están al 100%). En pantallas anchas eso dejaba un
              corte seco y toda esa foto y el lockup quedaban lejos del borde
              real de la ventana. Esta franja sangra desde ahí hasta el borde,
              del mismo naranja: como el borde ya es recto, no hace falta
              repetir el corte diagonal. Acaba a la misma altura (`HERO_BAND_END`) que la
              franja lisa de arriba, para que el corte inferior sea uno solo. */}
          <div
            aria-hidden
            className="absolute top-0 left-full hidden w-[calc(50vw-50%+1px)] bg-orange md:block"
            style={{ height: HERO_BAND_END }}
          />
          <DiagonalLinesComponent
            variant="white"
            className="absolute top-0 right-[calc((50%-50vw)*var(--hero-bleed,1))] h-[147px] w-[56px] opacity-50"
          />

          <div className="absolute top-[31px] right-8 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={isotipoWcar}
                alt=""
                aria-hidden
                className="h-8 w-auto"
              />
              <span className="text-heading-1 font-bold text-dark-gray">
                wcar
              </span>
            </div>
            <span aria-hidden className="h-8 w-px bg-gray/40" />
            <Image
              src={logoSantander}
              alt="Santander"
              className="h-[26px] w-[147px] brightness-0 invert"
            />
          </div>
        </div>

        <div className="container-wcar relative py-12 md:h-[740px] md:py-0">
          <div className="md:max-w-[545px] md:pt-[100px]">
            {/* TODO: confirmar con diseño: "mas" sin tilde. */}
            <h1
              id="hero-title"
              className="text-[32px] leading-9 font-bold text-dark-gray md:text-[42px] md:leading-[48px]"
            >
              El vehículo mas seguro
              {" "}
              <span className="block text-orange italic">de colombia</span>
            </h1>

            <span
              aria-hidden
              className="mt-6 hidden h-px w-[282px] bg-gray/30 md:block"
            />
          </div>

          {/* Fuera del md:max-w-[545px] del título: a 24 bold + 14 semibold, las
              tres cifras no caben en 545 y el diseño (537 de ancho) sí les da
              algo más de aire. */}
          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-small font-semibold text-gray-dark md:mt-7 md:max-w-[620px]">
            <Image src={starIcon} alt="" aria-hidden className="size-5" />
            <span className="text-[24px] font-bold text-orange">4.8</span>
            en Google
            <span aria-hidden className="text-gray-dark/60">
              ·
            </span>
            <span className="text-[24px] font-bold text-orange">+9.000</span>
            Clientes felices
            <span aria-hidden className="text-gray-dark/60">
              ·
            </span>
            <span className="text-[24px] font-bold text-orange">+10.000</span>
            Vehículos vendidos
          </p>
        </div>
    </div>
  );
}
