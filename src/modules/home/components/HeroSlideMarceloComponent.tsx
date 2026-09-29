import Image from "next/image";

import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

import { HERO_BAND_END, HERO_CANVAS_MARGIN } from "../constants/hero-carousel";
import cunaGris from "../assets/hero-slides/marcelo/cuna-gris.svg";
import cunaNaranja from "../assets/hero-slides/marcelo/cuna-naranja.svg";
import destello from "../assets/hero-slides/marcelo/destello.svg";
import marcaAgua from "../assets/hero-slides/marcelo/marca-agua.svg";
import HeroSlideShapeComponent from "./HeroSlideShapeComponent";

/**
 * La foto de la oficina con su degradado negro (el relleno del nodo 117:3617,
 * 1440 x 544). Se pinta dos veces: en su sitio y, en pantallas anchas, en espejo
 * a la derecha del lienzo.
 */
function OfficePhoto() {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/assets/home/hero/slides/marcelo/oficina.webp"
          alt=""
          width={1800}
          height={1200}
          sizes="900px"
          className="absolute top-[-17.26%] left-[42.27%] h-[108.44%] w-[61.32%] max-w-none"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{ backgroundImage: "linear-gradient(4.146deg, rgb(0, 0, 0) 39.721%, rgba(0, 0, 0, 0) 51.503%)" }}
      />
    </>
  );
}

/**
 * Slide "Marcelo Cezán se une a nuestro equipo de wcar" del banner del inicio.
 * Diseño: Figma "Wcar Website - 2026", nodo 117:3615 ("Banner", 1440 x 546,
 * dentro del frame de home anterior 117:3575). Solo se tomó el banner: el resto
 * de ese frame no.
 *
 * Mismo esquema que `HeroSlideSantanderComponent`: arte en un lienzo de 1440
 * (`overflow-hidden`) y debajo la banda gris claro del slide (que es también el
 * fondo de la sección). Capas, en el orden de Figma:
 * 1. Foto de la oficina wcar (`h-[108,44%] left-[42,27%] top-[-17,26%]
 *    w-[61,32%]` de la caja de 1440 x 544: es un recorte de la foto de 4096 x
 *    2731) con un degradado negro hacia abajo (4,1°, negro al 39,7 % y
 *    transparente al 51,5 %).
 * 2. Marcelo Cezán (recorte de otra foto de 4096 x 2731, 272 x 386 en x=675,
 *    y=20), la cuña naranja (1:… "Rectangle", girada -176,9° y volteada) y el
 *    rayado blanco al 50 % (327 x 60 en x=1113, y=321).
 * 3. Banda gris (`#f6f7f9`, y=381) y cuña gris de la izquierda (928 x 382).
 * 4. Otra vez Marcelo (272 x 219, la parte de arriba) POR ENCIMA de la cuña gris
 *    para que su cabeza y hombros salgan de ella; marca de agua "wcar"
 *    (808 x 180 en x=-94) y el destello naranja de la punta (22,5 x 20 en
 *    x=860,5, y=335, con blur).
 *
 * El texto (nodos 117:3628 y 117:3627): 44/48 bold, "Marcelo Cezán se une a" en
 * negro y "nuestro equipo de wcar" en naranja (cursiva media y bold); párrafo de
 * 18 semibold `gray-dark` en 434 de ancho.
 *
 * En pantallas anchas el slide ocupa TODO el ancho: a la izquierda sigue el gris
 * y a la derecha la foto de la oficina se repite en espejo (ver el comentario de
 * los bordes). TODO: confirmar con diseño cómo debe seguir a la derecha de 1440:
 * Figma no lo define.
 *
 * Solo desktop (`xl`): el mobile es `HeroSlideMarceloMobileComponent`.
 */
export default function HeroSlideMarceloComponent() {
  return (
    <div className="relative mx-auto hidden md:block md:h-[740px] md:max-w-[1440px]" style={{ marginLeft: HERO_CANVAS_MARGIN }}>
      {/* Arte: solo desktop. */}
      <div aria-hidden className="hidden md:block">
        {/* Borde derecho a pantalla completa (guía §4.2). La foto termina en un poste
            de vidrio en x=1440; una columna de píxeles estirada dejaba un corte
            duro con bandas horizontales. En su lugar, la foto se repite EN ESPEJO a
            la derecha del lienzo: el empalme es continuo (los píxeles del borde
            coinciden) y el ambiente sigue. Se espeja como mucho 360 px (x=1080 a
            1440): más allá entraría el logo "wcar" de la pared (desde x=1065) y se
            vería al revés, así que en pantallas de más de ~2160 px el resto lleva
            la columna de pared naranja estirada (`borde-derecho.png`). Solo hasta y=381: debajo va la
            banda gris. El rayado blanco se continúa aparte, con su fase (1440 -
            1113 = 327 = 2 mod 13). A la izquierda ya sigue el gris del fondo. */}
        <span
          className="absolute top-0 left-full w-[calc(50vw-50%+1px)] bg-gray-light"
          style={{
            height: HERO_BAND_END,
            backgroundImage: "url('/assets/home/hero/slides/marcelo/borde-derecho.png')",
            backgroundSize: "100% 546px",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute top-0 left-full h-[381px] w-[min(360px,calc(50vw-50%))] overflow-hidden">
          <div className="absolute top-0 left-0 h-[546px] w-[1440px] -scale-x-100">
            <OfficePhoto />
          </div>
        </div>
        <span
          className="absolute top-[321px] left-full h-[60px] w-[calc(50vw-50%+1px)] opacity-50"
          style={{ backgroundImage: "url('/assets/shared/lines-13px-white.png')", backgroundSize: "13px 13px", backgroundPosition: "-2px 0" }}
        />

        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: HERO_BAND_END }}>
          {/* 1. Foto de la oficina + degradado. */}
          {/* Figma la deja a 2 px del borde de arriba (y=2, 544 de alto): se sube al
              borde y se estira esos 2 px para que no quede una línea clara. */}
          <div className="absolute top-0 left-0 h-[546px] w-[1440px]">
            <OfficePhoto />
          </div>

          {/* 2. Marcelo, cuña naranja y rayado. */}
          <div className="absolute top-[20px] left-[675px] h-[386px] w-[272px]">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/assets/home/hero/slides/marcelo/marcelo.webp"
                alt=""
                width={1800}
                height={1200}
                sizes="900px"
                className="absolute top-[-30%] left-[-25.18%] h-[154.48%] w-[328.72%] max-w-none"
              />
            </div>
          </div>
          <HeroSlideShapeComponent
            src={cunaNaranja}
            outerClassName="top-[-118px] right-[562.03px] h-[618.394px] w-[647.966px]"
            boxClassName="h-[586.21px] w-[617.5px]"
            transformClassName="-scale-y-100 rotate-[-176.93deg]"
          />
          <DiagonalLinesComponent variant="white" className="absolute top-[321px] left-[1113px] h-[60px] w-[327px] opacity-50" />

          {/* 3. Banda y cuña grises. */}
          <span className="absolute top-[381px] left-0 w-[1440px] bg-gray-light" style={{ height: HERO_BAND_END - 381 }} />
          <Image
            src={cunaGris}
            alt=""
            aria-hidden
            className="absolute top-[-1px] left-0 h-[382px] w-[928px] max-w-none"
          />

          {/* 4. Marcelo por encima de la cuña gris, marca de agua y destello. */}
          <div className="absolute top-[20px] left-[675px] h-[219px] w-[272px]">
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src="/assets/home/hero/slides/marcelo/marcelo.webp"
                alt=""
                width={1800}
                height={1200}
                sizes="900px"
                className="absolute top-[-52.86%] left-[-25.18%] h-[272.19%] w-[328.72%] max-w-none"
              />
            </div>
          </div>
          <div className="absolute top-[335px] left-[860.5px] h-[20px] w-[22.5px]">
            <div className="absolute inset-[-20%_-17.78%]">
              <Image src={destello} alt="" aria-hidden className="block size-full max-w-none" />
            </div>
          </div>
        </div>

        {/* La marca de agua va FUERA del arte recortado: si no, el lienzo de 1440 la
            cortaría por la izquierda (empieza en x=-94) aunque a la ventana le
            sobre espacio. Así se ve completa en pantallas anchas y solo se corta
            cuando toca el borde de la ventana. */}
        <Image
          src={marcaAgua}
          alt=""
          aria-hidden
          className="absolute top-[101px] left-[-94px] h-[180px] w-[808px] max-w-none"
        />
      </div>

      {/* Contenido: en mobile apilado; en desktop, cada pieza en su sitio del lienzo. */}
      <div className="relative px-6 py-12 pb-16 md:static md:p-0">
        <h2 className="text-[32px] leading-9 font-bold md:absolute md:top-[123px] md:left-[120px] md:w-[538px] md:text-[44px] md:leading-[48px]">
          <span className="text-black">Marcelo Cezán </span>
          <span className="font-semibold text-black">se une a </span>
          <span className="font-medium text-orange italic">nuestro equipo de </span>
          <span className="text-orange">wcar</span>
        </h2>

        <p className="mt-4 text-[18px] leading-[22px] font-semibold text-gray-dark md:absolute md:top-[256px] md:left-[120px] md:mt-0 md:w-[434px]">
          Marcelo Cezán se une a la familia wcar para garantizarte el mejor trato , compra o vende de tu vehículo con total seguridad.
        </p>
      </div>
    </div>
  );
}
