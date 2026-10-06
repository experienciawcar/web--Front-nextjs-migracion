import Image from "next/image";

import starIcon from "../assets/hero-decor/star-blanca.svg";
import wMark from "../assets/hero-mobile/w.svg";
import { HERO_MOBILE_HEIGHT } from "../constants/hero-carousel";

/**
 * Primer slide del banner en MOBILE (`< md`). Diseño: Figma "Wcar Website - 2026",
 * página "Banners", nodo 1322:8888 ("Banner mobile/Default", 393 x 811; el contenido
 * va en el marco 1322:8889 y, dentro, el 1322:8891 desplazado (19, -90): abajo todo
 * está ya en coordenadas del marco 1322:8889). Reemplaza al diseño anterior (nodo
 * 1306:4912).
 *
 * Todo en px de diseño sobre 393 de ancho, anclado a la izquierda:
 * - Foto (`mobile/banner.webp`, 1536 x 1080 = 768 x 540 a 2x): el jeep naranja de frente
 *   con el muro de rayas y su reflejo. En Figma es UNA capa (1322:8897), espejada y
 *   girada 0,79°, con contraste +13 % y saturación +65 % y degradados al gris de la
 *   página por abajo: por eso se hornea (PIL, inversa de `relativeTransform` + ajuste de
 *   color polinómico contra el export, error 2-3/255) y no es `object-cover`. Los
 *   degradados ya van dentro. Mide 768 (no 393) para que, entre 394 y 767 px de ancho,
 *   se vea más escena y no un hueco; con 393 se ve el marco tal cual.
 * - "W" de fondo (161, -12) 232 x 256, arriba a la derecha (el SVG trae su opacidad
 *   y su degradado).
 * - Raya naranja de 50 x 2 en (20, 22).
 * - Título 28/36 bold en (19, 39), 341 de ancho: "El carro usado más seguro" y "de
 *   Colombia" en cursiva blanca sobre un rectángulo negro de 172 x 32 en (14, 77). El
 *   texto NO es el de escritorio ("El vehículo mas seguro de colombia"): así viene en
 *   cada diseño. TODO: confirmar con diseño cuál es el bueno y unificarlos.
 * - Tres cifras (24 extrabold blanca + etiqueta de 12 bold negra), centradas en y=209,5,
 *   258,5 y 309,5: "+10.000 Vehículos vendidos" y "+9.000 Clientes felices" en x=22, y la
 *   estrella (22, 298; 24 x 24) con "4.8 en Google" en x=53.
 *   TODO: el nodo 1322:8905 (un vector de 10 x 10 en (20, 173)) no se ve en el render
 *   de Figma; no se reprodujo.
 *
 * El título es un `<p role="heading" aria-level="1">` y no un `<h1>`: el `<h1>` de la
 * página ya está en el slide de escritorio (`HeroSlideHomeComponent`, oculto en
 * mobile); así hay un solo `<h1>` en el HTML y aun así un encabezado accesible aquí.
 *
 * Alto: `HERO_MOBILE_HEIGHT` (620), no los 811 de Figma (ver la constante); bajo la
 * foto (que acaba en 540, ya en gris) queda el gris de la página, donde se montan las
 * rayas del carousel y la tarjeta de búsqueda.
 */
export default function HeroSlideHomeMobileComponent() {
  return (
    <div
      className="relative overflow-hidden bg-gray-light md:hidden"
      style={{ height: HERO_MOBILE_HEIGHT }}
    >
      <Image
        src="/assets/home/hero/mobile/banner.webp"
        alt="Jeep Wrangler naranja de frente"
        width={768}
        height={540}
        sizes="768px"
        className="absolute top-0 left-0 h-[540px] w-[768px] max-w-none"
      />

      <Image
        src={wMark}
        alt=""
        aria-hidden
        className="absolute top-[-12px] left-[161px] h-[256px] w-[232px] max-w-none"
      />

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

      <p className="absolute top-[209.5px] left-[22px] -translate-y-1/2 font-bold tracking-[0.16px] whitespace-nowrap text-black">
        <span className="text-[24px] font-extrabold text-white">+10.000</span>
        <span className="text-[16px]"> </span>
        <span className="text-[12px]">Vehículos vendidos</span>
      </p>
      <p className="absolute top-[258.5px] left-[22px] -translate-y-1/2 font-bold tracking-[0.16px] whitespace-nowrap text-black">
        <span className="text-[24px] font-extrabold text-white">+9.000</span>
        <span className="text-[16px]"> </span>
        <span className="text-[12px]">Clientes felices</span>
      </p>
      <Image
        src={starIcon}
        alt=""
        aria-hidden
        className="absolute top-[298px] left-[22px] size-6"
      />
      <p className="absolute top-[309.5px] left-[53px] -translate-y-1/2 font-bold tracking-[0.16px] whitespace-nowrap text-black">
        <span className="text-[24px] font-extrabold text-white">4.8</span>
        <span className="text-[16px]"> </span>
        <span className="text-[12px]">en Google</span>
      </p>
    </div>
  );
}
