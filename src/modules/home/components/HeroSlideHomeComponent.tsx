import Image from "next/image";

import starIcon from "../assets/hero-decor/star-blanca.svg";
import watermarkWcar from "../assets/hero-decor/watermark-wcar.svg";
import { HERO_CANVAS_MARGIN } from "../constants/hero-carousel";

/**
 * Primer slide del banner (`HeroComponent`) en DESKTOP: el hero del inicio.
 * Diseño: Figma "Wcar Website - 2026", página "Banners", nodo 1322:9916
 * ("Banner", 1440 x 546, dentro del marco "desktop 1482" 1322:9876). Reemplaza al
 * hero anterior (cuña naranja + jeep aparte): ahora la foto trae el muro naranja, el
 * jeep y su reflejo, todo en una sola imagen.
 *
 * Solo desktop (`md`+): el mobile es `HeroSlideHomeMobileComponent`. Por eso el
 * `<h1>` de la página (que vive aquí) está oculto en mobile, donde el título es un
 * `role="heading" aria-level="1"` del componente mobile.
 *
 * La foto (`banner.webp`, 2880 x 1092 = 1440 x 546 a 2x) está HORNEADA: en Figma son
 * tres capas de la misma foto, espejadas y giradas 0,79° (`relativeTransform` con
 * ±0,0138 fuera de la diagonal), con contraste +13 % y saturación +65 % y degradados al
 * gris de la página (#f6f7f9) por abajo. CSS no sabe hacer eso, así que se compuso con
 * PIL (inversa de `relativeTransform` por capa + ajuste de color polinómico contra el
 * export, error 3/255; correlación 0,994 con el export). Los degradados del banner
 * (rectángulos 4249-4251) ya van dentro. No lleva texto ni la "wcar" de fondo: eso va
 * encima, como en Figma.
 *
 * El muro es casi horizontal, así que a anchos mayores de 1440 la foto se prolonga
 * estirando su columna de borde (`banner-borde-izq/der.webp`, una columna de 1 px):
 * se ve como más muro. Mismo criterio que las franjas que sangran de los otros slides.
 *
 * Medidas (px de diseño, desde el borde de arriba del banner):
 * - Raya blanca (120,57) 77 x 4.
 * - `<h1>` (120,111) 542 x 112: 48/56 bold, "El vehículo mas seguro" en negro y
 *   "de colombia" en cursiva blanca sobre un rectángulo negro (0,62) de 277 x 49. El
 *   texto va 4 px a la derecha de la caja (left 4), con tracking 0,48.
 * - Cifras (120,273), separadas 16: "+10.000 Vehículos vendidos", "+9.000 Clientes
 *   felices" y la estrella + "4.8 en Google" (estrella de 24, 7 de aire). Cada cifra en
 *   28 extrabold blanca y la etiqueta en 14 bold negra.
 * - "wcar" de fondo (-97,77) 808 x 180 (la marca de agua ya trae su opacidad y su
 *   degradado: es el SVG tal cual).
 * - El "Hero 1" del nodo (rayado blanco al 50 % en (1113,321), 327 x 60) NO se ve en el export de
 *   Figma, así que no se reprodujo.
 *
 * TODO: confirmar con diseño: "mas" sin tilde en el título.
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
          width={1440}
          height={546}
          sizes="1440px"
          className="absolute top-0 left-0 h-[546px] w-[1440px] max-w-none"
        />
        {/* Prolongación del muro a los lados del lienzo (ver arriba). `--hero-bleed: 0`
            en tablet: ahí el lienzo escalado ya llena la ventana. */}
        <div className="absolute top-0 right-full h-[546px] w-[calc(50vw*var(--hero-bleed,1))] bg-[url('/assets/home/hero/banner-borde-izq.webp')] bg-[length:100%_100%]" />
        <div className="absolute top-0 left-full h-[546px] w-[calc(50vw*var(--hero-bleed,1))] bg-[url('/assets/home/hero/banner-borde-der.webp')] bg-[length:100%_100%]" />

        <Image
          src={watermarkWcar}
          alt=""
          className="absolute top-[77px] left-[-97px] h-[180px] w-[808px] max-w-none"
        />
        <span
          aria-hidden
          className="absolute top-[57px] left-[120px] h-1 w-[77px] bg-white"
        />
      </div>

      <div className="relative">
        <div className="absolute top-[111px] left-[120px] h-[112px] w-[542px]">
          <span
            aria-hidden
            className="absolute top-[62px] left-0 h-[49px] w-[277px] bg-black"
          />
          {/* TODO: confirmar con diseño: "mas" sin tilde. */}
          <h1
            id="hero-title"
            className="absolute top-0 left-1 w-[538px] text-[48px] leading-[56px] font-bold tracking-[0.48px] text-black"
          >
            El vehículo mas seguro
            <span className="block font-normal text-white italic">
              de colombia
            </span>
          </h1>
        </div>

        <p className="absolute top-[273px] left-[120px] flex items-center gap-4 font-bold tracking-[0.16px] whitespace-nowrap text-black">
          <span>
            <span className="text-[28px] font-extrabold text-white">
              +10.000
            </span>{" "}
            <span className="text-[14px]">Vehículos vendidos</span>
          </span>
          <span>
            <span className="text-[28px] font-extrabold text-white">
              +9.000
            </span>{" "}
            <span className="text-[14px]">Clientes felices</span>
          </span>
          <span className="flex items-center gap-[7px]">
            <Image src={starIcon} alt="" aria-hidden className="size-6" />
            <span>
              <span className="text-[28px] font-extrabold text-white">4.8</span>{" "}
              <span className="text-[14px]">en Google</span>
            </span>
          </span>
        </p>
      </div>
    </div>
  );
}
