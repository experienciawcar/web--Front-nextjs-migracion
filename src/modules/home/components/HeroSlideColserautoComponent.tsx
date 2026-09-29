import Image from "next/image";

import { HERO_BAND_END, HERO_CANVAS_MARGIN } from "../constants/hero-carousel";
import brillo1 from "../assets/hero-slides/colserauto/brillo-1.svg";
import brillo2 from "../assets/hero-slides/colserauto/brillo-2.svg";
import brillo3 from "../assets/hero-slides/colserauto/brillo-3.svg";
import cunaNegra from "../assets/hero-slides/colserauto/cuna-negra.svg";
import formas from "../assets/hero-slides/colserauto/formas.svg";
import logoColserauto from "../assets/hero-slides/colserauto/logo-colserauto.png";
import logoWcar from "../assets/hero-slides/colserauto/logo-wcar.svg";
import HeroSlideShapeComponent from "./HeroSlideShapeComponent";

/** Rayas cian de la esquina: 23 de 3 px cada 9 (Figma 1:2002, "Lines", 201 x 201 girado 90°). */
const CYAN_LINES = 23;

/**
 * Slide "Los mejores en registro, documentación y peritaje para tu Vehículo"
 * (con Colserauto) del banner del inicio. Diseño: Figma "Wcar Website - 2026",
 * nodo 1:1977 ("Banner", 1440 x 546). Solo se tomó el banner.
 *
 * Mismo esquema que los otros slides: arte en un lienzo de 1440
 * (`overflow-hidden`) y debajo la banda negra, que llega hasta `HERO_BAND_END` (donde acaba
 * la franja naranja del primer slide), no hasta los 740 del hero. Capas, en el
 * orden de Figma:
 * 1. La foto del taller: el relleno del nodo 1:1977 es un recorte (la foto de 3360
 *    x 1280 a todo el ancho, corrida 113 px hacia arriba) con ajustes de color
 *    (más fría, con menos luces). Se horneó con `figma_imagen.py` (correlación
 *    0,97 y error de color 7/255 contra el export) y solo se guarda la parte que
 *    se ve: de x=300 a 1440 y de y=0 a 381 (debajo va la banda negra y a la
 *    izquierda el degradado casi negro). Encima, dos degradados: uno
 *    de azul a morado por la derecha y otro de negro por la izquierda (que da el
 *    fondo oscuro donde va el texto).
 * 2. Las formas oscuras del marco ("Frame 555", un SVG de 1440 x 546 con
 *    desenfoque) y tres brillos de esquina (1:1984 a 1:1986, con blur), girados.
 * 3. Banda negra (y=381, 166 de alto), cuña negra de la derecha (1:1988, girada
 *    -3,07°) y, en la esquina inferior derecha, las 23 rayas cian.
 *
 * Texto: la raya naranja de 77 x 4 con "wcar" (eyebrow, 1:1989), el título de
 * 36/48 bold con -0,5 de interletrado ("Los mejores en registro , documentación
 * y peritaje" en blanco semibold y "para tu Vehículo" en naranja cursiva) y el
 * párrafo de 18 medium blanco en 345 de ancho. Arriba a la derecha: el lockup
 * wcar (149 x 48 en x=893, y=44), una raya blanca al 60 % de 2 x 48 y el logo de
 * Colserauto (220 x 57 en x=1102, y=33).
 * TODO: confirmar con diseño el espacio antes de la coma ("registro , doc…") y
 * el color naranja del eyebrow (`#ec671b`, distinto del naranja de marca).
 *
 * En pantallas anchas el slide ocupa TODO el ancho: a la izquierda sigue el negro
 * y a la derecha el negro de la cuña, que sigue su diagonal y deja un triángulo
 * morado arriba (`borde-derecho.png`, una columna de 1 px del export estirada).
 * TODO: confirmar con diseño cómo debe seguir a la derecha de 1440.
 *
 * Solo desktop (`xl`): el mobile es `HeroSlideColserautoMobileComponent`.
 */
export default function HeroSlideColserautoComponent() {
  return (
    <div className="relative mx-auto hidden md:block md:h-[740px] md:max-w-[1440px]" style={{ marginLeft: HERO_CANVAS_MARGIN }}>
      {/* Arte: solo desktop. */}
      <div aria-hidden className="hidden md:block">
        {/* Bordes a pantalla completa (guía §4.2): a la izquierda, negro. A la
            derecha, negro también, pero la cuña negra sigue en diagonal (45°,
            medida en el export: y = 1599 - x) y sale por arriba en x=1599, 159 px
            pasado el borde: solo ese triángulo de arriba conserva el morado de la
            esquina (la columna de píxeles del borde del export, estirada,
            `borde-derecho.png`). Si el negro empezara en horizontal se vería un
            codo en el borde. */}
        <span className="absolute top-0 right-full w-[calc(50vw-50%)] bg-black" style={{ height: HERO_BAND_END }} />
        <span className="absolute top-0 left-full w-[calc(50vw-50%+1px)] bg-black" style={{ height: HERO_BAND_END }} />
        <span
          className="absolute top-0 left-full size-[159px]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 0 100%)",
            backgroundImage: "url('/assets/home/hero/slides/colserauto/borde-derecho.png')",
            backgroundSize: "100% 546px",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: HERO_BAND_END }}>
          {/* 1. Foto del taller y sus dos degradados. */}
          <div className="absolute top-0 left-[300px] h-[381px] w-[1140px]">
            <Image
              src="/assets/home/hero/slides/colserauto/fondo.webp"
              alt=""
              fill
              sizes="1140px"
              className="object-fill"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(89.88155133914488deg, rgba(3, 76, 145, 0) 68.309%, rgba(3, 76, 145, 0.8) 86.807%, rgb(16, 35, 129) 112.83%), linear-gradient(-89.99999924346079deg, rgba(0, 0, 0, 0.8) 22.354%, rgba(0, 0, 0, 0.4) 38.971%, rgba(0, 7, 14, 0.325) 42.042%, rgba(1, 29, 56, 0.2) 52.864%, rgba(1, 37, 73, 0.5) 58.8%, rgba(0, 16, 36, 0.9) 64.594%, rgb(0, 0, 0) 83.955%)",
            }}
          />

          {/* 2. Formas del marco y brillos de esquina. */}
          <div className="absolute top-0 left-0 h-[544px] w-[1440px] overflow-clip">
            <Image src={formas} alt="" aria-hidden className="absolute top-0 left-0 block h-[546px] w-[1440px] max-w-none" />
          </div>
          <HeroSlideShapeComponent
            src={brillo1}
            outerClassName="top-[-175.39px] left-[886px] h-[727.581px] w-[639.916px]"
            boxClassName="h-[442.503px] w-[604.32px]"
            transformClassName="-scale-y-100 rotate-[112.48deg]"
            bleedClassName="inset-[-22.6%_-16.55%]"
          />
          <HeroSlideShapeComponent
            src={brillo2}
            outerClassName="top-[-118px] left-[818px] h-[247.727px] w-[289.707px]"
            boxClassName="h-[190.15px] w-[249.273px]"
            transformClassName="-scale-y-100 rotate-[165.14deg]"
            bleedClassName="inset-[-52.59%_-40.12%]"
          />
          <HeroSlideShapeComponent
            src={brillo3}
            outerClassName="top-[-122px] left-[842.46px] h-[222.579px] w-[260.298px]"
            boxClassName="h-[170.847px] w-[223.969px]"
            transformClassName="-scale-y-100 rotate-[165.14deg]"
            bleedClassName="inset-[-58.53%_-44.65%]"
          />

          {/* 3. Banda negra, cuña negra de la derecha y rayas cian. */}
          <span className="absolute top-[381px] left-0 w-[1440px] bg-black" style={{ height: HERO_BAND_END - 381 }} />
          <HeroSlideShapeComponent
            src={cunaNegra}
            outerClassName="top-0 right-[-189.97px] h-[618.394px] w-[647.966px]"
            boxClassName="h-[586.21px] w-[617.5px]"
            transformClassName="rotate-[-3.07deg]"
          />
          <div className="absolute top-[257px] right-[97px] flex size-[201px] items-center justify-center">
            <div className="flex-none rotate-90">
              <div className="flex size-[201px] items-start gap-[6px]">
                {Array.from({ length: CYAN_LINES }, (_, index) => (
                  <span key={index} className="h-full min-w-px flex-[1_0_0] bg-blue-neon" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lockup arriba a la derecha. */}
        <Image
          src={logoWcar}
          alt=""
          className="absolute top-[44px] left-[62.01%] h-12 w-[149.126px] max-w-none"
        />
        <span className="absolute top-[40px] left-[1071.13px] h-12 w-[2px] bg-white/60" />
        <Image
          src={logoColserauto}
          alt="Colserauto"
          className="absolute top-[33px] left-[1102.13px] h-[57px] w-[220px] max-w-none object-cover"
        />
      </div>

      {/* Contenido: en mobile apilado; en desktop, cada pieza en su sitio del lienzo. */}
      <div className="relative px-6 py-12 pb-16 md:static md:p-0">
        <div className="w-[77px] md:absolute md:top-[43px] md:left-[124px]">
          <span aria-hidden className="block h-1 w-full bg-[#ec671b]" />
          <p className="mt-2 text-[14px] leading-[22px] font-bold text-white">wcar</p>
        </div>

        <h2 className="mt-6 text-[28px] leading-9 font-semibold tracking-[-0.5px] text-white md:absolute md:top-[107px] md:left-[123px] md:mt-0 md:w-[436px] md:text-[36px] md:leading-[48px]">
          Los mejores en registro , documentación y peritaje{" "}
          <span className="font-normal text-orange italic">para tu Vehículo</span>
        </h2>

        <p className="mt-4 text-[18px] leading-[22px] font-medium text-white md:absolute md:top-[284px] md:left-[123px] md:mt-0 md:w-[345px]">
          Somos la única plataforma
          {/* Salto de línea del diseño (el bloque de 345 dejaría "que vende" en la primera). */}
          <br className="hidden md:block" /> que vende autos usados con peritaje online
        </p>
      </div>
    </div>
  );
}
