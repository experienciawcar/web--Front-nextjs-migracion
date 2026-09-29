import Image from "next/image";

import logoWcarPanel from "@/modules/shared/assets/logos/logo-wcar-panel.svg";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";

import { ADDITIONAL_SERVICES } from "../constants/additional-services";
import WorkshopServicesCarouselComponent from "./WorkshopServicesCarouselComponent";

/**
 * Degradado que cubre la foto de la columna por arriba (Figma, nodo 192:6184):
 * naranja `#FF8000` sólido hasta el 24,227 % del alto de la columna y transparente
 * al 55,727 %. Figma interpola SIN premultiplicar: el color viaja de `#FF8000` a
 * `rgb(189 47 34)` mientras el alfa baja de 1 a 0, y CSS sí premultiplica (daría un
 * naranja que solo se desvanece, 10/255 de diferencia contra el export de Figma
 * en vez de 2-3). Por eso van nueve paradas intermedias con ese color y ese alfa.
 */
const ORANGE_FADE = `linear-gradient(to bottom,
  rgb(255 128 0 / 1) 24.227%,
  rgb(247 118 4 / 0.875) 28.164%,
  rgb(239 108 9 / 0.75) 32.102%,
  rgb(230 98 13 / 0.625) 36.039%,
  rgb(222 88 17 / 0.5) 39.977%,
  rgb(214 77 21 / 0.375) 43.914%,
  rgb(206 67 26 / 0.25) 47.852%,
  rgb(197 57 30 / 0.125) 51.789%,
  rgb(189 47 34 / 0) 55.727%)`;

/**
 * Sección "Servicios adicionales": la columna naranja de la izquierda ("Mas que
 * solo una marca", con la foto del lavado) y, a su derecha, el panel oscuro con
 * el carrusel de servicios.
 *
 * La columna NO acaba aquí: mide 1100 y sigue por debajo del panel oscuro, a lo
 * largo de "¿Dónde nos ubicamos?" (`WorkshopLocationComponent`), donde acaba. Igual
 * que la barra negra de Postventa, cuelga de esta sección y la siguiente pasa
 * por debajo.
 *
 * Fuente: captura del desktop 1440 (`docs/planes/taller/4-adicionales-y-ubicacion.png`,
 * calibrada con el marco: x de captura = 0,640 × X, y desde el borde superior de
 * la captura, que es el de la sección) y, para la columna, el Figma (nodo 188:8089,
 * marco "Frame 592" 193:6421). Sin diseño mobile. Medidas (px de diseño, ±1,5
 * salvo lo que diga "Figma"), con y=0 en el borde superior de la sección (y=1987 de
 * la página, justo donde acaba "Garantías y seguros"):
 * - Panel oscuro (`dark-gray`): x=404, sangra a la derecha, 603 de alto.
 * - Columna (Figma): x=0..404, 1100 de alto (la captura daba 405 y 1102). El
 *   diseño la pega al borde del marco; aquí va anclada al lienzo y no sangra a la
 *   izquierda (una foto no se estira). TODO: confirmar con diseño qué hace en
 *   pantallas más anchas que 1440.
 *   - Logo (el de `shared/assets/logos/logo-wcar-panel.svg`, aro blanco y texto
 *     negro; es el mismo dibujo del de Figma a otra escala) de 198,84 x 64 en
 *     (103,81), centrado (Figma).
 *   - "Mas que solo / una marca": 32/38 bold blanco, centrado; caja de 210 x 76 en
 *     y=201 (Figma; la primera línea base en y=232).
 *   - Foto de la rueda con la esponja (Figma, nodo 192:6184): el nodo está
 *     ESPEJADO (rotación 180° y volteo) y su relleno es un recorte con la foto
 *     estirada a 0,584 en x y 0,746 en y (un 28 % más alta que ancha respecto a
 *     la original de 960 x 1234) y con ajustes de imagen (exposición -15 %,
 *     contraste -60 %, temperatura +15 %, tinte +38 %...). Por eso
 *     `lavado-de-rin-con-esponja.webp` (808 x 1680 = 2× de la caja de 404 x 840
 *     que empieza en y=260, donde empieza la foto) ya viene espejada, estirada y
 *     con el color horneado; el naranja sólido de arriba y el degradado
 *     (`ORANGE_FADE`) van en CSS. Verificado contra el export: geometría
 *     (correlación 0,99), color (2-4/255).
 * - Bloque de rayas cian de 200 x 200 en (303,505): 23 rayas de 2 px cada 9,
 *   `blue-neon`. Cruza el borde de la columna, el panel oscuro (que acaba en
 *   y=603) y el fondo blanco de la sección siguiente, por encima de todo.
 * - Contenido del panel, desde x=559: el mismo esquema que Postventa: eyebrow
 *   (`SectionEyebrowComponent` con 10 px hasta el texto) con la raya en y=89 (Figma; la captura daba 91),
 *   título de 36/44 en blanco y, 61 px debajo, las tarjetas (y=243).
 *
 * Mobile: no hay diseño. Se adaptó (guía §4.3): la columna baja a una franja
 * naranja con el logo y el lema; sin foto ni rayas, y el panel oscuro a todo el
 * ancho con el carrusel deslizable.
 *
 * Textos tal cual del diseño (con `TODO: confirmar con diseño`): "Mas" sin tilde.
 * Iconos de las tarjetas (en `constants/additional-services.ts`): los de Figma
 * ("Icons/money", "Icons/star", "mdi:water", 48 x 48, naranja).
 */
export default function WorkshopAdditionalServicesComponent() {
  return (
    <section aria-labelledby="adicionales-title" className="relative overflow-x-clip xl:h-[603px]">
      {/* Lienzo de 1440. `isolate` para poder mandar el panel oscuro detrás del
          contenido con un z-index negativo sin que se vaya detrás de la página
          (un absoluto pinta por encima del contenido estático). */}
      <div className="relative isolate mx-auto xl:h-[603px] xl:max-w-[1440px]">
        <div
          aria-hidden
          className="absolute top-0 -z-10 hidden h-[603px] bg-dark-gray xl:right-[calc(50%-50vw)] xl:left-[404px] xl:block"
        />

        {/* ---------- Columna naranja ---------- */}
        <div className="reveal reveal-fade relative flex flex-col items-center bg-orange px-8 py-12 xl:absolute xl:top-0 xl:left-0 xl:z-10 xl:block xl:h-[1100px] xl:w-[404px] xl:p-0">
          {/* Foto de la rueda, de y=260 (donde empieza en el diseño) hasta abajo, y
              encima el degradado naranja de toda la columna. */}
          <div aria-hidden className="absolute inset-x-0 top-[260px] hidden h-[840px] xl:block">
            <Image
              src="/assets/taller/adicionales/lavado-de-rin-con-esponja.webp"
              alt=""
              fill
              sizes="404px"
              className="object-cover"
            />
          </div>
          <div aria-hidden className="absolute inset-0 hidden xl:block" style={{ backgroundImage: ORANGE_FADE }} />
          <Image
            src={logoWcarPanel}
            alt="WCAR"
            className="relative w-[160px] xl:absolute xl:top-[81px] xl:left-[103px] xl:w-[198.84px]"
          />
          {/* TODO: confirmar con diseño: "Mas" sin tilde. */}
          <p className="relative mt-6 text-center text-[24px] leading-[30px] font-bold text-white xl:absolute xl:inset-x-0 xl:top-[201px] xl:mt-0 xl:text-[32px] xl:leading-[38px]">
            Mas que solo
            <br />
            una marca
          </p>
        </div>

        <div
          aria-hidden
          className="reveal reveal-fade absolute top-[505px] left-[303px] z-20 hidden size-[200px] bg-[repeating-linear-gradient(to_bottom,var(--color-blue-neon)_0_2px,transparent_2px_9px)] xl:block"
        />

        {/* ---------- Panel oscuro ---------- */}
        <div className="bg-dark-gray xl:bg-transparent">
          <div className="container-wcar pb-16 pt-16 xl:pt-[89px] xl:pb-0">
            <div className="xl:ml-[435px]">
              <SectionEyebrowComponent className="reveal xl:gap-2.5!">Servicios Ofrecidos por wcar</SectionEyebrowComponent>

              <h2 id="adicionales-title" className="reveal mt-[11px] text-subheadline-1 font-bold text-white">
                Servicios adicionales
              </h2>

              <WorkshopServicesCarouselComponent services={ADDITIONAL_SERVICES} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
