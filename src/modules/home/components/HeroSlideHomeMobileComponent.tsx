import Image from "next/image";

import { HERO_MOBILE_HEIGHT } from "../constants/hero-carousel";

/**
 * Primer slide del banner en MOBILE (`< md`). Diseño: Figma "Wcar Website - 2026",
 * página "mobile 398" (701:54961), nodo 1306:4912 ("Banner mobile/Default", 393 x 481;
 * reemplaza al diseño anterior del jeep visto desde arriba, nodo 913:14270).
 *
 * Todo en px de diseño sobre 393 de ancho, anclado a la izquierda (como el marco):
 * - Foto de fondo (nodo 1306:4922, el jeep naranja de frente con el muro de rayas): el
 *   relleno es `FILL`, ESPEJADO y girado 0,79° (por eso se hornea y no es `object-cover`),
 *   con contraste +13 % y saturación +65 %. `jeep-frente.webp` ya trae todo eso (ajuste
 *   polinómico de color contra el export, error 4-5/255; correlación 0,996 sin desvío) y
 *   mide 768 x 450 (a 2x): la ventana del marco (393) más lo que asoma a la derecha en
 *   pantallas de hasta 767. Con 393 de ancho se ve el marco tal cual, con el jeep pegado
 *   al borde derecho.
 * - Degradado del color de la página (`gray-light`): transparente en y=325 y opaco en
 *   y=450 (stops 75,96 % y 97,6 % del nodo). Va en CSS, no en la foto.
 * - Raya naranja de 50 x 2 en (20, 22).
 * - Título 28/36 bold en (19, 39), 341 de ancho: "El carro usado más seguro" y "de
 *   Colombia" en cursiva blanca sobre un rectángulo negro de 172 x 32 en (14, 77). El
 *   texto NO es el de escritorio ("El vehículo mas seguro de colombia"): así viene en
 *   cada diseño. TODO: confirmar con diseño cuál es el bueno y unificarlos.
 * - Tres cifras (24 black blanca + etiqueta de 12 bold negra), centradas en y=148,5,
 *   190,5 y 230,5: "+10.000 Vehículos vendidos" (x=19), "+9.000 Clientes felices"
 *   (x=20) y "4.8 en Google" (x=24; así está en Figma, ligeramente sangrada).
 *   TODO: el nodo 1306:4929 (un vector de 10 x 10 en (20, 173)) no se ve en el render
 *   de Figma; no se reprodujo. Las "W" y "wcar" de fondo del marco quedan tapadas por la
 *   foto y tampoco van.
 *
 * El título es un `<p role="heading" aria-level="1">` y no un `<h1>`: el `<h1>` de la
 * página ya está en el slide de escritorio (`HeroSlideHomeComponent`, oculto en
 * mobile); así hay un solo `<h1>` en el HTML y aun así un encabezado accesible aquí.
 *
 * Alto: `HERO_MOBILE_HEIGHT` (620), no los 481 de Figma (ver la constante); bajo la
 * foto queda gris, donde se montan las rayas del carousel y la tarjeta de búsqueda.
 */
export default function HeroSlideHomeMobileComponent() {
  return (
    <div
      className="relative overflow-hidden bg-gray-light md:hidden"
      style={{ height: HERO_MOBILE_HEIGHT }}
    >
      <div className="absolute top-0 left-0 h-[450px] w-[768px]">
        <Image
          src="/assets/home/hero/mobile/jeep-frente.webp"
          alt="Jeep Wrangler naranja de frente"
          fill
          sizes="768px"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_72.2%,var(--color-gray-light)_100%)]"
        />
      </div>

      <span
        aria-hidden
        className="absolute top-[22px] left-[20px] h-[2px] w-[50px] bg-orange"
      />

      <span
        aria-hidden
        className="absolute top-[77px] left-[14px] h-[32px] w-[172px] bg-black"
      />
      <p
        role="heading"
        aria-level={1}
        className="absolute top-[39px] left-[19px] w-[341px] text-[28px] leading-9 font-bold tracking-[0.28px] text-dark-gray"
      >
        El carro usado más seguro{" "}
        <span className="block font-normal text-white italic">de Colombia</span>
      </p>

      <p className="absolute top-[148.5px] left-[19px] -translate-y-1/2 font-bold tracking-[0.16px] whitespace-nowrap text-black">
        <span className="text-[24px] font-black text-white">+10.000</span>
        <span className="text-[16px]"> </span>
        <span className="text-[12px]">Vehículos vendidos</span>
      </p>
      <p className="absolute top-[190.5px] left-[20px] -translate-y-1/2 font-bold tracking-[0.16px] whitespace-nowrap text-black">
        <span className="text-[24px] font-black text-white">+9.000</span>
        <span className="text-[16px]"> </span>
        <span className="text-[12px]">Clientes felices</span>
      </p>
      <p className="absolute top-[230.5px] left-[24px] -translate-y-1/2 font-bold tracking-[0.16px] whitespace-nowrap text-black">
        <span className="text-[24px] font-black text-white">4.8</span>
        <span className="text-[16px]"> </span>
        <span className="text-[12px]">en Google</span>
      </p>
    </div>
  );
}
