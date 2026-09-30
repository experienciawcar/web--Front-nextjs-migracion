import Image from "next/image";

import starIcon from "@/modules/shared/assets/icons/star.svg";

import w from "../assets/hero-mobile/w.svg";
import { HERO_MOBILE_HEIGHT } from "../constants/hero-carousel";

/**
 * Primer slide del banner en MOBILE (`< xl`). Diseño: Figma "Wcar Website - 2026",
 * frame de la web en responsive "mobile 398" (701:54961), nodo 913:14270 ("Banner
 * mobile/Default", 393 x 481).
 *
 * Todo en px de diseño sobre 393 de ancho. La cuña (un triángulo de 200 x 333) y el
 * jeep, ahora VISTO DESDE ARRIBA (otra foto que la de escritorio), van pegados al
 * borde derecho de la ventana; el texto, en una columna de 600 como mucho, centrada
 * si la pantalla es más ancha:
 * - Raya naranja de 50 x 2 en (20, 22) y la "W" de fondo (204 x 226 en x=-31, y=24;
 *   el SVG ya trae su opacidad).
 * - Título 28/32 bold en (19, 41) de 220 de ancho: "El carro usado más seguro" y
 *   "de Colombia" en cursiva naranja. Ojo: el texto NO es el de escritorio ("El
 *   vehículo mas seguro de colombia"): así viene en cada diseño. TODO: confirmar con
 *   diseño cuál es el bueno y unificarlos.
 * - Las tres cifras, una bajo otra (18 bold naranja + etiqueta de 10 bold `gray-dark`):
 *   "4.8 en Google" con su estrella (y=178), "+ 9.000 Clientes felices" (y=216) y
 *   "+ 10.000 Vehículos vendidos" (y=254).
 * - Jeep aéreo (nodo 913:14292: 240 x 235 girado 15,67°) y su sombra (la silueta negra
 *   913:14291 con desenfoque de 5 y 70 % de opacidad, girada igual). La foto del jeep
 *   sale del PNG con transparencia del diseño (ya recortado a la caja) con los ajustes
 *   de color de Figma horneados (contraste, saturación, temperatura, luces: ajuste
 *   polinómico contra el export, error 14/255); Figma no exporta ese nodo con alfa
 *   (sale con fondo blanco), así que no se pudo usar el export directamente. Ambos van
 *   pegados al borde derecho de la ventana y se pasan del borde (el marco de 393 los
 *   corta, como aquí la ventana).
 *
 * El título es un `<p role="heading" aria-level="1">` y no un `<h1>`: el `<h1>` de la
 * página ya está en el slide de escritorio (`HeroSlideHomeComponent`, oculto en
 * mobile); así hay un solo `<h1>` en el HTML y aun así un encabezado accesible aquí.
 *
 * Alto: `HERO_MOBILE_HEIGHT` (620), no los 481 de Figma (ver la constante); bajo las
 * cifras queda gris. Las rayas del carousel y la tarjeta de búsqueda se montan abajo.
 */
export default function HeroSlideHomeMobileComponent() {
  return (
    <div
      className="relative overflow-hidden bg-gray-light md:hidden"
      style={{ height: HERO_MOBILE_HEIGHT }}
    >
      <div
        aria-hidden
        className="absolute top-0 right-0 h-[333px] w-[200px] bg-orange"
        style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute top-[36.57px] right-[-59px] flex h-[293.547px] w-[297.011px] items-center justify-center"
      >
        <div className="flex-none rotate-[15.67deg]">
          <div className="relative h-[237px] w-[242px] opacity-70 blur-[5px]">
            <Image
              src="/assets/home/hero/mobile/jeep-sombra.webp"
              alt=""
              fill
              sizes="242px"
            />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute top-[14px] right-[-65.5px] flex h-[291.081px] w-[294.545px] items-center justify-center">
        <div className="flex-none rotate-[15.67deg]">
          <div className="relative h-[235px] w-[240px]">
            <Image
              src="/assets/home/hero/mobile/jeep-aereo.webp"
              alt="Jeep Wrangler naranja visto desde arriba"
              fill
              sizes="240px"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto h-full w-full max-w-[600px]">
        <Image
          src={w}
          alt=""
          aria-hidden
          className="absolute top-[24px] left-[-31px] h-[226px] w-[204px] max-w-none"
        />
        <span
          aria-hidden
          className="absolute top-[22px] left-[20px] h-[2px] w-[50px] bg-orange"
        />

        <p
          role="heading"
          aria-level={1}
          className="absolute top-[41px] left-[19px] w-[220px] text-[28px] leading-8 font-bold tracking-[0.28px] text-dark-gray"
        >
          El carro usado más seguro{" "}
          <span className="block font-normal text-orange italic">
            de Colombia
          </span>
        </p>

        <Image
          src={starIcon}
          alt=""
          aria-hidden
          className="absolute top-[173px] left-[20px] size-[10px]"
        />
        <p className="absolute top-[178px] left-[36px] -translate-y-1/2 text-[10px] font-bold tracking-[0.16px] whitespace-nowrap text-gray-dark">
          <span className="text-[18px] text-orange">4.8</span> en Google
        </p>
        <p className="absolute top-[216px] left-[20px] -translate-y-1/2 text-[10px] font-bold tracking-[0.16px] whitespace-nowrap text-gray-dark">
          <span className="text-[18px] text-orange">+ 9.000</span> Clientes
          felices
        </p>
        <p className="absolute top-[254px] left-[20px] -translate-y-1/2 text-[10px] font-bold tracking-[0.16px] whitespace-nowrap text-gray-dark">
          <span className="text-[18px] text-orange">+ 10.000</span> Vehículos
          vendidos
        </p>
      </div>
    </div>
  );
}
