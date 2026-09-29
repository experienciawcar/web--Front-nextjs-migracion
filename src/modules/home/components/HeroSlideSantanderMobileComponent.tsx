import Image from "next/image";

import logoSantander from "@/modules/shared/assets/hero/logo-santander.png";

import destello from "../assets/hero-mobile/santander-destello.svg";
import wIcon from "../assets/hero-mobile/santander-w.svg";
import { HERO_MOBILE_HEIGHT } from "../constants/hero-carousel";

/**
 * Slide "Financia hasta el 100% de tu vehículo con Santander" del banner en
 * MOBILE (`< md`). Diseño real: Figma "Wcar Website - 2026", página
 * "mobile 399" (nodo 1:3230, 393 x 7844) — la misma clase de página que
 * "mobile 400" resolvió el mobile de Marcelo: trae el hero completo con texto
 * y decoración propios, no el nodo "Hero" a solas (1:3243, sin texto) que se
 * había usado en el primer intento de este componente.
 *
 * Mismo esquema que `HeroSlideMarceloMobileComponent` (guía §8, "un elemento a
 * ancho fijo dentro de un layout mobile"): el FONDO (foto, tarjeta, marca de
 * agua, triángulo, destello) va suelto con `inset-x-0`, a todo el ancho real
 * de la ventana; el TEXTO (logo, título, párrafo) se queda en una columna
 * centrada de hasta 600. Coordenadas de Figma medidas menos 98 (donde termina
 * el `Nav mobile` de esa página; aquí el navbar es aparte).
 *
 * Piezas:
 * - Tarjeta NARANJA (`#ff8000`, nodo 1:3786): el mismo rectángulo con la
 *   esquina inferior derecha cortada en diagonal que usa Marcelo (mismo
 *   `clip-path`, mismo tamaño 393 x 473), pero naranja en vez de gris claro —
 *   la primera versión de este componente no la tenía y el fondo se veía gris
 *   azulado desde arriba.
 * - Marca de agua "W" en blanco al 12 % (121:5239, un ícono, no la palabra
 *   "wcar" como en Marcelo): top=-34 (queda medio tapado por el navbar, que es
 *   aparte) y left=-10.
 * - Logo de Santander (nodo 1:3789, 239 x 42 en top=43,left=75): el activo
 *   compartido (`logo-santander.png`) es rojo; se pone blanco con
 *   `brightness-0 invert`, como en el slide de escritorio — la primera
 *   versión de este componente lo dejaba en su color de archivo (gris al
 *   verse sobre el fondo oscuro que tenía entonces).
 * - Título (nodo 1:3790, top=116,left=27,w=339): "Financia hasta el 100% de"
 *   en NEGRO (no blanco) + "tu vehículo con Santarder" en blanco cursiva
 *   (semibold, con "Santarder" en bold) — la primera versión llevaba ese
 *   tramo en naranja cursiva, que no es lo que trae el diseño.
 * - Párrafo (nodo 1:3788, top=200,left=68,w=282): 16 medium blanco/90&nbsp;%,
 *   sin cambios respecto a la primera versión (ese texto sí estaba bien).
 * - Foto de fondo (`santander.webp`, el mismo nodo 1:3244 que arma el fondo
 *   del slide de escritorio): 393 x 637 completos (antes se guardaba
 *   recortada a 470 de alto, dejando el auto más chico de lo que debía verse).
 * - Triángulo NEGRO detrás del auto (nodo 1:3791, 139,5 x 244,5, mismo
 *   `clip-path` que el naranja de Marcelo pero en negro): x=-0.5,y=572,5 de
 *   página → top=474,5 aquí.
 * - Destello cian junto al auto (nodo 1:3793, `#00fefe`, 82 x 80, girado 180°
 *   — el mismo tono `blue-neon` del sistema de diseño): x=275,y=653 de página
 *   → top=555,left=275.
 *
 * No se reprodujo una segunda foto del auto más recortada y girada 2,2° que
 * trae ese Figma (nodo 1:3792, "Waoussss"): es un recorte MÁS CERCANO del
 * mismo auto de la foto de fondo (no un auto distinto), pensado para que se
 * vea más nítido/grande. Añadirla exigía además reconciliar su giro con que
 * `x`/`y` de un nodo girado son su origen local, no su caja (guía §14): se
 * dejó fuera por ahora, con la foto de fondo sola el auto ya se ve completo.
 * TODO: sumarla si hace falta más presencia del auto.
 *
 * La foto de fondo sigue más abajo de los `HERO_MOBILE_HEIGHT` (620) del
 * banner: se corta por abajo, como en los otros slides.
 */
export default function HeroSlideSantanderMobileComponent() {
  return (
    <div
      className="relative overflow-hidden bg-black md:hidden"
      style={{ height: HERO_MOBILE_HEIGHT }}
    >
      {/* Fondo: a todo el ancho real de la ventana (`inset-x-0`), no encerrado
          en el `max-w-[600px]` del texto — ver el JSDoc de
          `HeroSlideMarceloMobileComponent` para por qué. */}
      <div aria-hidden className="absolute inset-x-0 top-[-22px] h-[637px]">
        <Image
          src="/assets/home/hero/mobile/santander.webp"
          alt=""
          fill
          sizes="(max-width: 1279px) 100vw, 1279px"
          className="object-cover object-bottom"
        />
      </div>

      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[380px] bg-orange"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 73.81%, 28.88% 73.81%, 0 100%)",
        }}
      />
      <Image
        src={wIcon}
        alt=""
        aria-hidden
        className="absolute top-[-34px] left-[-10px] h-[220px] w-[199px] max-w-none"
      />
      <span
        aria-hidden
        className="absolute top-[474.5px] left-0 h-[244.5px] w-[139.5px] bg-black"
        style={{ clipPath: "polygon(0 0, 0 100%, 100% 50%)" }}
      />
      <Image
        src={destello}
        alt=""
        aria-hidden
        className="absolute top-[555px] left-[275px] h-[80px] w-[82px] rotate-180"
      />

      <div className="relative mx-auto h-full w-full max-w-[600px]">
        <Image
          src={logoSantander}
          alt="Santander"
          className="absolute top-[43px] left-[75px] h-[42px] w-[239px] max-w-none brightness-0 invert"
        />

        <h2 className="absolute top-[116px] left-[27px] max-w-[339px] text-[28px] leading-[34px] font-bold">
          <span className="text-black">Financia hasta el 100% de </span>
          {/* TODO: confirmar con diseño: "Santarder" (así viene en Figma). */}
          <span className="font-semibold text-white italic">
            tu vehículo con <span className="font-bold">Santarder</span>
          </span>
        </h2>

        <p className="absolute top-[200px] left-[68px] max-w-[282px] text-[16px] leading-[22px] font-medium text-white/90">
          Póngase en contacto con nosotros y le informaremos sin compromiso de
          nuestras tarifas y servicios.
        </p>
      </div>
    </div>
  );
}
