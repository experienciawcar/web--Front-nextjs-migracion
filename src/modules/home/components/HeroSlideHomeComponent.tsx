import Image from "next/image";

import estrellas from "../assets/hero-decor/estrellas-resena.svg";
import { HERO_CANVAS_MARGIN } from "../constants/hero-carousel";

/**
 * Primer slide del banner (`HeroComponent`) en DESKTOP: el hero del inicio.
 * Diseño: Figma "Wcar Website - 2026", página "Home - 3.0": banner en 1542:21411
 * (1440 x 546, con texto) y fondo ancho sin texto en 1542:21397 (2189 x 546).
 *
 * Solo desktop (`md`+): el mobile es `HeroSlideHomeMobileComponent`. Por eso el
 * `<h1>` de la página (que vive aquí) está oculto en mobile, donde el título es un
 * `role="heading" aria-level="1"` del componente mobile.
 *
 * Fondo: UN WebP (`banner.webp`, 2175 x 546, 1x) tomado del export de 1542:21397 (trae
 * la foto del jeep con su muro, los degradados y la marca "wcar"). El lienzo de 1440
 * es la ventana que empieza en x=280 de esa imagen (en Figma el "Hero 1" va en x=-280
 * dentro del banner de 1440), así que la imagen sobra 280 a la izquierda y 455 a la
 * derecha, donde se ve más escena en pantallas anchas. Pasado eso se prolonga estirando
 * su columna de borde (`banner-borde-izq/der.webp`, 1 px): a la izquierda es gris liso y
 * a la derecha, muro naranja. Está a 1x porque el export de Figma no da más.
 *
 * Medidas (px de diseño, desde el borde de arriba del banner):
 * - `<h1>` 40/48 bold con tracking 0,4 en (125, 49), 579 de ancho: "La Plataforma #1 en
 *   Ventas de" en naranja, "Autos Usados 100% Online" en negro y "en Colombia" en blanco
 *   sobre un rectángulo negro (121, 146) de 243 x 47.
 * - Cifras (121, 223), separadas 22 por rayas de 2 x 89: "4.5" (+ reseñas y estrellas),
 *   "+10k" y "+9k", en 36 extrabold naranja con la etiqueta de 14 semibold negra.
 */
export default function HeroSlideHomeComponent() {
  return (
    <div
      className="relative mx-auto hidden md:block md:h-[740px] md:max-w-[1440px]"
      style={{ marginLeft: HERO_CANVAS_MARGIN }}
    >
      <div aria-hidden className="absolute inset-0 hidden md:block">
        <Image
          src="/assets/home/hero/banner.webp"
          alt=""
          width={2175}
          height={546}
          sizes="2175px"
          className="absolute top-0 left-[-280px] h-[546px] w-[2175px] max-w-none"
        />
        {/* Prolongación a los lados de la imagen (ver arriba). `--hero-bleed: 0`
            en tablet: ahí el lienzo escalado ya llena la ventana. */}
        <div className="absolute top-0 right-[1720px] h-[546px] w-[calc(50vw*var(--hero-bleed,1))] bg-[url('/assets/home/hero/banner-borde-izq.webp')] bg-[length:100%_100%]" />
        <div className="absolute top-0 left-[1895px] h-[546px] w-[calc(50vw*var(--hero-bleed,1))] bg-[url('/assets/home/hero/banner-borde-der.webp')] bg-[length:100%_100%]" />
      </div>

      <div className="relative">
        <span
          aria-hidden
          className="absolute top-[146px] left-[121px] h-[47px] w-[243px] bg-black"
        />
        <h1
          id="hero-title"
          className="absolute top-[49px] left-[125px] w-[579px] text-[40px] leading-[48px] font-bold tracking-[0.4px] text-orange"
        >
          <span className="block">La Plataforma #1 en Ventas de</span>
          <span className="block text-black">Autos Usados 100% Online</span>
          <span className="block text-white">en Colombia</span>
        </h1>

        <div className="absolute top-[223px] left-[121px] flex items-center gap-[22px] tracking-[0.14px] text-black">
          <div className="flex h-[110px] w-[134px] flex-col justify-end">
            <p className="text-[36px] leading-[43px] font-extrabold tracking-[0.36px] text-orange">
              4.5
            </p>
            <p className="text-[14px] leading-[17px] font-semibold">
              +2k Reseña positivas
            </p>
            <Image
              src={estrellas}
              alt="Calificación de 4,5 sobre 5 en Google"
              className="mt-2 h-4 w-[133px] max-w-none"
            />
          </div>
          <span
            aria-hidden
            className="h-[89px] w-0.5 shrink-0 rounded-[9px] bg-[#90a3bf]/30"
          />
          <p className="flex h-[110px] w-[136px] flex-col justify-center">
            <span className="text-[36px] leading-[43px] font-extrabold tracking-[0.36px] text-orange">
              +10k
            </span>
            <span className="text-center text-[14px] leading-[17px] font-semibold whitespace-nowrap">
              Vehículos vendidos
            </span>
          </p>
          <span
            aria-hidden
            className="h-[89px] w-0.5 shrink-0 rounded-[9px] bg-[#90a3bf]/30"
          />
          <p className="flex h-[110px] flex-col justify-center">
            <span className="text-[36px] leading-[43px] font-extrabold tracking-[0.36px] text-orange">
              +9k
            </span>
            <span className="text-[14px] leading-[17px] font-semibold whitespace-nowrap">
              Clientes Felices
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
