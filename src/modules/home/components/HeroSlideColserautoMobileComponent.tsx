import Image from "next/image";

import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

import brillo from "../assets/hero-mobile/colserauto-brillo.svg";
import lineas from "../assets/hero-mobile/colserauto-lineas.svg";
import logoColserauto from "../assets/hero-slides/colserauto/logo-colserauto.png";
import logoWcar from "../assets/hero-slides/colserauto/logo-wcar.svg";
import { HERO_MOBILE_HEIGHT } from "../constants/hero-carousel";
import HeroSlideShapeComponent from "./HeroSlideShapeComponent";

/**
 * Slide "Los mejores en registro, documentación y peritaje" (con Colserauto) del
 * banner en MOBILE (`< xl`). Diseño: Figma "Wcar Website - 2026", nodo 1:3807
 * ("Hero" de 393 x 811). Es el único de los tres banners móviles que trae el texto.
 *
 * Todo en px de diseño sobre 393 de ancho:
 * - Fondo negro. La foto del taller es el relleno de "Frame 554" (1744 x 810): un
 *   recorte de la foto de 3360 x 1280 de 1006 x 380 px puesto en y=257 (más ancho que
 *   la pantalla: se ve su parte central) con ajustes de color; se horneó con
 *   `figma_imagen.py` (correlación 0,97 y error de color 7/255 contra el export). En
 *   pantallas más anchas la foto se estira (`object-cover`) manteniendo el centro.
 * - Encima, los dos degradados del marco (negro y azul-morado) sobre un alto de 810.
 * - Rayado blanco al 50 % (140 x 100 en y=16, pegado a la derecha), el brillo de
 *   la esquina (SVG con desenfoque, girado 86,66°), el triángulo negro de abajo a la
 *   derecha (a 45°, de (393, 507) a (265, 635)) y las rayas cian (120 x 120, a 27 del
 *   borde derecho y a y=533).
 * - Arriba: lockup wcar (108 x 35 en x=44, y=49), raya blanca al 60 % y logo de
 *   Colserauto (160 x 41 en x=191, y=43); título 28 semibold blanco con -0,5 de
 *   interletrado ("para tu Vehículo" en naranja cursiva) desde y=131; y el párrafo de
 *   16 medium desde y=257.
 *
 * Como el alto es `HERO_MOBILE_HEIGHT` (620) y no los 811 de Figma, se corta lo que
 * pasa de ahí: la banda negra de abajo (y=635) no se ve y las rayas cian y el triángulo
 * quedan cortados. TODO: confirmar el diseño mobile con el nuevo alto.
 */
export default function HeroSlideColserautoMobileComponent() {
  return (
    <div className="relative overflow-hidden bg-black md:hidden" style={{ height: HERO_MOBILE_HEIGHT }}>
      <div aria-hidden>
        <div className="absolute inset-x-0 top-[257px] h-[380px]">
          <Image
            src="/assets/home/hero/mobile/colserauto.webp"
            alt=""
            fill
            sizes="(max-width: 1279px) 100vw, 1279px"
            className="object-cover object-[61%_50%]"
          />
        </div>
        <div
          className="absolute inset-x-0 top-0 h-[810px]"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.8) 18.132%, rgba(0, 0, 0, 0.2) 25.454%, rgba(0, 0, 0, 0.2) 56.414%, rgba(0, 0, 0, 0.85) 75.305%, rgb(0, 0, 0) 82.979%), linear-gradient(2.19deg, rgba(3, 76, 145, 0) 55.595%, rgb(3, 76, 145) 66.326%, rgb(16, 35, 129) 81.42%)",
          }}
        />
        <DiagonalLinesComponent variant="white" className="absolute top-[16px] right-0 h-[100px] w-[140px] opacity-50" />
        <HeroSlideShapeComponent
          src={brillo}
          outerClassName="top-[170px] right-[-62.56px] h-[455.499px] w-[255.334px]"
          boxClassName="h-[229.952px] w-[442.868px]"
          transformClassName="-scale-y-100 rotate-[86.66deg]"
          bleedClassName="inset-[-43.49%_-22.58%]"
        />
        <span
          className="absolute top-[507px] right-0 size-[128px] bg-black"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
        />
        <Image src={lineas} alt="" aria-hidden className="absolute top-[533px] right-[27px] size-[120px] max-w-none" />
      </div>

      <div className="relative mx-auto h-full w-full max-w-[600px] px-[29px] pt-[43px]">
        <div className="relative ml-[15px] flex h-[41.356px] items-center">
          <Image src={logoWcar} alt="" aria-hidden className="mt-[5.8px] h-[34.8px] w-[108px] max-w-none self-start" />
          <span aria-hidden className="mx-[22.5px] mt-[2.9px] h-[34.8px] w-[1.45px] self-start bg-white/60" />
          <Image
            src={logoColserauto}
            alt="Colserauto"
            className="h-[41.356px] w-[159.727px] max-w-none object-cover"
          />
        </div>

        <h2 className="mt-[44px] max-w-[329px] text-[28px] leading-[normal] font-semibold tracking-[-0.5px] text-white">
          Los mejores en registro , documentación y peritaje{" "}
          <span className="font-normal text-orange italic">para tu Vehículo</span>
        </h2>

        <p className="mt-[25px] max-w-[345px] text-[16px] leading-[normal] font-medium text-white">
          Somos la única plataforma que vende autos usados con peritaje online
        </p>
      </div>
    </div>
  );
}
