import Image from "next/image";

import logoSantander from "@/modules/shared/assets/hero/logo-santander.png";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

import { HERO_BAND_END, HERO_CANVAS_MARGIN } from "../constants/hero-carousel";
import cunaNaranja from "../assets/hero-slides/santander/cuna-naranja.svg";
import cunaNegra from "../assets/hero-slides/santander/cuna-negra.svg";
import cunaNegraDerecha from "../assets/hero-slides/santander/cuna-negra-derecha.svg";
import marcaAgua from "../assets/hero-slides/santander/marca-agua.svg";
import paralelogramosCian from "../assets/hero-slides/santander/paralelogramos-cian.svg";
import zigzag from "../assets/hero-slides/santander/zigzag.svg";
import HeroSlideShapeComponent from "./HeroSlideShapeComponent";

/**
 * Slide "Financia hasta el 100% de tu vehículo con Santander" del banner del
 * inicio. Diseño: Figma "Wcar Website - 2026", nodo 1:1339 ("Banner", 1440 x
 * 546, dentro del frame de home anterior 1:1299). Solo se tomó el banner: el
 * resto de ese frame (pestañas, tarjetas, secciones) no.
 *
 * El arte va en un lienzo de 1440 (`overflow-hidden`, como el marco de Figma).
 * La banda negra de abajo llega hasta `HERO_BAND_END` (en Figma mide 166: 381 a
 * 547), no hasta los 740 del hero: es donde acaba la franja naranja del primer
 * slide (`HeroSlideHomeComponent`), y a partir de ahí todos los slides dejan ver el
 * gris de la página. La barra de rótulos (`HeroCarouselComponent`) va sobre esa
 * banda, en y=400. La tarjeta de búsqueda se monta sobre esa banda (empieza en
 * y=490; el arte termina en 381). Las
 * capas van en el orden de Figma:
 * 1. Foto de estudio: el relleno del nodo 1:1341 (1440 x 544, y=2) es un recorte
 *    de la foto de 2914 x 1440 con giro (-2,3°), ampliación (1,52 x 1,26) y ajustes
 *    de color (contraste, saturación, sombras). Se horneó con `figma_imagen.py`
 *    (correlación 0,974 y error de color 3,8/255 contra el export) y solo se
 *    guarda la parte de x=650 a 1440: a la izquierda la tapan las cuñas.
 * 2. Cuña negra grande (1:1342), rayado blanco al 50 % (681 x 60 en x=769),
 *    banda negra (y=381, 166 de alto), cuña negra de la derecha (1:1345) y los
 *    paralelogramos cian (1:1346).
 * 3. El frente del auto (1:1347, girado -2,2°): un recorte de la foto que pisa
 *    la cuña, para que la rueda delantera "salga" de ella.
 * 4. Cuña naranja de la izquierda (1:1348, 928 x 382), marca de agua "wcar"
 *    (808 x 180 en x=-94), logo Santander (239 x 42 en x=123, y=42) y el zigzag
 *    blanco y cian (1:1353).
 *
 * En pantallas anchas el slide ocupa TODO el ancho: a la izquierda sangran el
 * naranja y la banda negra, y a la derecha el negro de la cuña, que sigue su
 * diagonal (ver el comentario de los bordes) en vez de cortarse en horizontal.
 *
 * Texto (nodos 1:1352 y 1:1351): 44/55 bold, "Financia hasta el 100% de" en
 * negro y "tu vehículo con Santarder" en blanco cursiva (semibold y extrabold);
 * párrafo de 18 semibold blanco en 434 de ancho.
 * TODO: confirmar con diseño: "Santarder" (así viene en el diseño) por
 * "Santander".
 *
 * Solo desktop (`xl`): el mobile es `HeroSlideSantanderMobileComponent`.
 */
export default function HeroSlideSantanderComponent() {
  return (
    <div
      className="relative mx-auto hidden md:block md:h-[740px] md:max-w-[1440px]"
      style={{ marginLeft: HERO_CANVAS_MARGIN }}
    >
      {/* Arte: solo desktop. */}
      <div aria-hidden className="hidden md:block">
        {/* Bordes a pantalla completa (guía §4.2): el arte termina en x=0 y x=1440,
            así que a los lados se prolonga lo que hay en su borde.
            - Izquierda: naranja y, bajo y=381, la banda negra.
            - Derecha: negro. La cuña negra de la derecha sigue en diagonal (45°, medida
              en el export: y = 1499 - x) y sale por arriba en x=1499, o sea 59 px pasado
              el borde; solo ese triángulo de arriba conserva el gris oscuro de la foto
              y el rayado blanco (con su fase: 1440 - 769 = 671 = 8 mod 13, y 2 de
              alto). Si el negro empezara en horizontal se vería un codo en el borde. */}
        <span className="absolute top-0 right-full h-[381px] w-[calc(50vw-50%)] bg-orange" />
        <span
          className="absolute top-[381px] right-full w-[calc(50vw-50%)] bg-black"
          style={{ height: HERO_BAND_END - 381 }}
        />
        <span
          className="absolute top-0 left-full w-[calc(50vw-50%+1px)] bg-black"
          style={{ height: HERO_BAND_END }}
        />
        <span
          className="absolute top-0 left-full size-[59px] bg-[#302d32]"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
        <span
          className="absolute top-0 left-full size-[59px] opacity-50"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            backgroundImage: "url('/assets/shared/lines-13px-white.png')",
            backgroundSize: "13px 13px",
            backgroundPosition: "-8px 2px",
          }}
        />

        <div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{ height: HERO_BAND_END }}
        >
          {/* Figma la deja a 2 px del borde de arriba (y=2, 544 de alto), lo que dibuja una
              línea clara de 2 px sobre la foto: se sube al borde y se estira esos 2 px. */}
          <div className="absolute top-0 left-[650px] h-[546px] w-[790px]">
            <Image
              src="/assets/home/hero/slides/santander/fondo.webp"
              alt=""
              fill
              sizes="790px"
              className="object-fill"
            />
          </div>

          <HeroSlideShapeComponent
            src={cunaNegra}
            outerClassName="top-[-121px] right-[497.03px] h-[618.394px] w-[647.966px]"
            boxClassName="h-[586.21px] w-[617.5px]"
            transformClassName="-scale-y-100 rotate-[-176.93deg]"
          />
          <DiagonalLinesComponent
            variant="white"
            className="absolute top-[2px] left-[769px] h-[60px] w-[681px] opacity-50"
          />
          <span
            className="absolute top-[381px] left-0 w-[1440px] bg-black"
            style={{ height: HERO_BAND_END - 381 }}
          />
          <HeroSlideShapeComponent
            src={cunaNegraDerecha}
            outerClassName="top-[14px] right-[-67.16px] h-[433.16px] w-[455.159px]"
            boxClassName="h-[408.68px] w-[435.507px]"
            transformClassName="rotate-[-3.29deg] skew-x-[-0.43deg]"
          />
          <HeroSlideShapeComponent
            src={paralelogramosCian}
            outerClassName="top-[261px] left-[1116px] h-[240px] w-[246px]"
            boxClassName="h-[240px] w-[246px]"
            transformClassName="-scale-y-100 rotate-180"
          />
          <div
            aria-hidden
            className="absolute top-[-114px] left-[1142px] flex h-[548.466px] w-[433.183px] items-center justify-center"
          >
            <div className="flex-none rotate-[-2.2deg]">
              <div className="relative h-[533px] w-[413.021px]">
                <Image
                  src="/assets/home/hero/slides/santander/frente-auto.webp"
                  alt=""
                  fill
                  sizes="414px"
                  className="max-w-none"
                />
              </div>
            </div>
          </div>

          <Image
            src={cunaNaranja}
            alt=""
            aria-hidden
            className="absolute top-[-1px] left-0 h-[382px] w-[928px] max-w-none"
          />
          <HeroSlideShapeComponent
            src={zigzag}
            outerClassName="top-[60px] left-[781px] h-[36px] w-[112px]"
            boxClassName="h-[36px] w-[112px]"
            transformClassName="-scale-y-100 rotate-180"
          />
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

        <Image
          src={logoSantander}
          alt="Santander"
          className="absolute top-[42px] left-[123px] h-[42px] w-[239px] max-w-none"
        />
      </div>

      {/* Contenido: en mobile apilado; en desktop, cada pieza en su sitio del lienzo. */}
      <div className="relative px-6 py-12 pb-16 md:static md:p-0">
        <h2 className="text-[32px] leading-9 font-bold md:absolute md:top-[116px] md:left-[120px] md:mt-0 md:w-[538px] md:text-[44px] md:leading-[55px]">
          <span className="text-black">Financia hasta el 100% de </span>
          <span className="font-semibold text-white italic">
            tu vehículo con{" "}
          </span>
          {/* TODO: confirmar con diseño: "Santarder" (así viene en Figma). */}
          <span className="font-extrabold text-white italic">Santarder</span>
        </h2>

        <p className="mt-4 text-[18px] leading-[22px] font-semibold text-white md:absolute md:top-[258px] md:left-[123px] md:mt-0 md:w-[434px]">
          Póngase en contacto con nosotros y le informaremos sin compromiso de
          nuestras tarifas y servicios.
        </p>
      </div>
    </div>
  );
}
