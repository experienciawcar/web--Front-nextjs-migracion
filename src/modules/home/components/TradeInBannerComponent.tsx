import Image from "next/image";

import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import logoWcar from "../assets/banner/logo-wcar-banner.svg";

/**
 * Banner naranja "Tu auto viejo es la llave de tu auto nuevo. ¡Cámbialo
 * ahora!" bajo las tres tarjetas del hero (Figma Home 2.0, "Banner_785×80",
 * 684:29317). Todo el banner es un enlace, como el resto de banners
 * promocionales del sitio.
 *
 * Medidas de Figma (785 x 80, esquinas rectas):
 * - Logo wcar (98,75 x 32: la W en blanco y "wcar" en negro, un solo SVG) a 29 px
 *   del borde y centrado en vertical.
 * - Texto de 24 con interlineado de 28 (medido contra el export: a 22 quedaba un
 *   9 % más angosto), en dos líneas ("Tu auto viejo es la llave de tu" / "auto
 *   nuevo. ¡Cámbialo ahora!") en un bloque de 321 de ancho que arranca en x=214;
 *   por eso el ancho está fijo y no se deja que el texto se acomode solo.
 * - Patrón de arcos (tesela de 71 x 73, la misma que lleva la foto de
 *   Transparencia) sobre el naranja, al 7 %: lleno hasta ~250 px y desvanecido
 *   del todo hacia los ~420. Opacidad y desvanecido medidos contra el export de
 *   Figma.
 * - Foto de los dos autos (568 x 574, mostrada a 244 x 247 en x=568, y=-107): el
 *   banner la recorta por arriba y por la derecha, así que solo se ve la franja
 *   con los autos (un Kia Sportage y un Kia Forte con dos flechas de cambio).
 *
 * Mobile (Figma "mobile 398", "Banner_393×296", 701:55000; 329 x 296, esquinas
 * rectas): una caja cuadrada con el logo centrado a 22 px del borde (74 x 24), el
 * texto centrado en un bloque de 250 (tres renglones: "Tu auto viejo es la" /
 * "llave de tu auto nuevo." en 22 semibold con interlineado de 24, y
 * "¡Cámbialo ahora!" en 28 bold) y, debajo, la MISMA foto de los dos autos a
 * todo el ancho (329,5 x 333: 568 x 574 a la escala del ancho, puesta en y=32)
 * pero RECORTADA por una caja que empieza en y=156 y llega al borde de abajo:
 * solo se ven los autos. Sobre todo el fondo va el patrón de arcos (tesela de
 * 71 x 73 escalada a 58,84 x 60,49) al 5 % y, sobre él, entre y=60 y y=156, un
 * degradado de transparente a naranja (0,1 % -> 79,3 %) que lo desvanece hacia
 * abajo. El texto: Figma lo centra en y=112,5 (`top: calc(50% - 35.5px)`); medido
 * contra el export, los renglones caen en y=68, 92 y 129 (`top` de 65 y el tercer
 * renglón con interlineado de 54 en vez de 42: Figma deja 6 px más de aire ahí).
 *
 * Escala (mobile y tablet, hasta `xl`): el banner es una caja de proporción fija
 * 329:296 con un ancho máximo de 480 y TODO lo de adentro crece con su ancho: es un
 * contenedor (`@container`) con `--u` = un px del diseño (`100cqw / 329`); las
 * medidas y las letras van en `calc(N * var(--u))` y las de la foto y el degradado,
 * que son relativas a la caja, en %. Antes tenía el alto fijo en 296 y la foto
 * crecía con el ancho: entre 500 y 1200 px los autos salían cortados por abajo.
 * A 393 (ancho del diseño) `--u` vale 1 y sale lo mismo que en Figma.
 *
 * En mobile el banner se sale 101 px de la sección gris hacia la blanca de abajo
 * (el gris acaba en y=957 y el banner en 1058; ver `HeroSearchSectionComponent`).
 * Ese saliente se queda en 101 px aunque el banner crezca.
 *
 * Destino: no hay una página de "cambia tu vehículo" en este proyecto.
 * TODO: confirmar con diseño/negocio a dónde debe llevar.
 */
export default function TradeInBannerComponent() {
  return (
    <AppLinkComponent
      href={ROUTES.sellCar}
      className="reveal @container relative mx-auto block aspect-[329/296] max-w-[480px] overflow-hidden bg-orange [--u:calc(100cqw/329)] xl:flex xl:aspect-auto xl:h-20 xl:max-w-[785px] xl:items-center xl:gap-[86px] xl:py-0 xl:pr-0 xl:pl-[29px]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-5 xl:hidden"
        style={{
          backgroundImage: "url('/assets/home/decor/arcos.png')",
          backgroundSize: "calc(58.84 * var(--u)) calc(60.49 * var(--u))",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden opacity-[0.07] xl:block"
        style={{
          backgroundImage: "url('/assets/home/decor/arcos.png')",
          backgroundSize: "71px 73px",
          maskImage: "linear-gradient(to right, #000 30%, transparent 54%)",
          WebkitMaskImage:
            "linear-gradient(to right, #000 30%, transparent 54%)",
        }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[52.7%] bottom-0 overflow-hidden xl:hidden"
      >
        <Image
          src="/assets/home/hero/autos-cambio.webp"
          alt=""
          aria-hidden
          width={568}
          height={574}
          sizes="480px"
          className="absolute top-0 left-0 h-auto w-full max-w-none -translate-y-[37.2%]"
        />
      </span>
      <Image
        src="/assets/home/hero/autos-cambio.webp"
        alt=""
        aria-hidden
        width={244}
        height={247}
        sizes="244px"
        className="pointer-events-none absolute top-[-107px] right-[-27px] hidden max-w-none xl:block"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[20.27%] h-[32.43%] xl:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(255,128,0,0) 0.12%, #ff8000 79.3%)",
        }}
      />

      <Image
        src={logoWcar}
        alt=""
        aria-hidden
        className="absolute top-[calc(22*var(--u))] left-1/2 h-[calc(24*var(--u))] w-auto -translate-x-1/2 xl:relative xl:top-auto xl:left-auto xl:h-8 xl:shrink-0 xl:translate-x-0"
      />

      <p className="absolute top-[calc(65*var(--u))] left-1/2 w-[calc(250*var(--u))] -translate-x-1/2 text-center text-[length:calc(22*var(--u))] leading-[calc(24*var(--u))] text-white xl:relative xl:top-auto xl:left-auto xl:w-[321px] xl:translate-x-0 xl:text-left xl:text-[24px] xl:leading-7">
        <span className="font-semibold xl:font-extrabold">Tu auto viejo </span>
        <span className="font-semibold xl:font-medium">
          es la
          <br className="xl:hidden" /> llave de tu{" "}
        </span>
        <span className="font-semibold xl:font-extrabold">
          auto nuevo.
          <br className="xl:hidden" />{" "}
        </span>
        <span className="text-[length:calc(28*var(--u))] leading-[calc(54*var(--u))] font-bold xl:text-[24px] xl:leading-7 xl:font-extrabold">
          ¡Cámbialo ahora!
        </span>
      </p>
    </AppLinkComponent>
  );
}
