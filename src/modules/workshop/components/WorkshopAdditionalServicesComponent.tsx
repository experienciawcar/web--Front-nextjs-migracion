import Image from "next/image";

import logoWcarPanel from "@/modules/shared/assets/logos/logo-wcar-panel.svg";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";

import logoWcarMobile from "../assets/adicionales/logo-wcar-movil.svg";
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
 * marco "Frame 592" 193:6421). El mobile viene de Figma (ver más abajo). Medidas (px de diseño, ±1,5
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
 * Mobile (Figma, marco 1:9787): panel oscuro a todo el ancho con eyebrow y título
 * centrados (36/44), el carrusel a 64 px del título (tarjetas de 253 la primera y
 * 294,5 las demás, 16 entre ellas) y rayas de paginación a 64 px; luego, a 52 px, la
 * foto cuadrada de 329 (`lavado-de-rin-movil.webp`, el export a 2× del nodo
 * 193:7935 con su degradado naranja ya incluido) con el logo de 124 x 40 a 37 px
 * del borde superior. La foto sobresale 166 px del panel oscuro sobre la sección
 * siguiente (el panel acaba 230 px antes del final de la sección). No lleva el
 * lema "Mas que solo una marca". El diseño trae CINCO tarjetas (las dos últimas,
 * a medio hacer, como en desktop: ver `constants/additional-services.ts`) y aquí
 * hay tres. Sin Figma de desktop no se sabía; TODO: confirmar cuántas van.
 *
 * Textos tal cual del diseño (con `TODO: confirmar con diseño`): "Mas" sin tilde.
 * Iconos de las tarjetas (en `constants/additional-services.ts`): los de Figma
 * ("Icons/money", "Icons/star", "mdi:water", 48 x 48, naranja).
 */
export default function WorkshopAdditionalServicesComponent() {
  return (
    <section aria-labelledby="adicionales-title" className="relative overflow-x-clip pb-16 xl:h-[603px] xl:pb-0">
      {/* Lienzo de 1440. `isolate` para poder mandar el panel oscuro detrás del
          contenido con un z-index negativo sin que se vaya detrás de la página
          (un absoluto pinta por encima del contenido estático). */}
      <div className="relative isolate mx-auto flex flex-col xl:block xl:h-[603px] xl:max-w-[1440px]">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 bottom-[230px] -z-10 bg-dark-gray xl:right-[calc(50%-50vw)] xl:bottom-auto xl:left-[404px] xl:h-[603px]"
        />

        {/* ---------- Columna naranja (en mobile, la foto cuadrada con el logo) ---------- */}
        <div className="reveal reveal-fade relative order-2 mx-auto mt-[52px] aspect-square w-[calc(100%-4rem)] max-w-[329px] bg-orange xl:absolute xl:top-0 xl:left-0 xl:z-10 xl:m-0 xl:aspect-auto xl:h-[1100px] xl:w-[404px] xl:max-w-none">
          <Image
            src="/assets/taller/adicionales/lavado-de-rin-movil.webp"
            alt="Una mano lava con una esponja el rin de un carro sobre una cubeta, con luz naranja de atardecer"
            fill
            sizes="329px"
            className="object-cover xl:hidden"
          />
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
          {/* El logo de mobile es el de Figma (193:7937) con las letras en blanco: así
              se ve en el diseño, aunque el SVG exportado las trae en negro. */}
          <Image
            src={logoWcarMobile}
            alt="WCAR"
            className="absolute top-[37px] left-1/2 w-[124.27px] -translate-x-1/2 xl:hidden"
          />
          <Image
            src={logoWcarPanel}
            alt="WCAR"
            className="absolute top-[81px] left-[103px] hidden w-[198.84px] xl:block"
          />
          {/* TODO: confirmar con diseño: "Mas" sin tilde. Solo en desktop: el diseño mobile no lo trae. */}
          <p className="absolute inset-x-0 top-[201px] hidden text-center text-[32px] leading-[38px] font-bold text-white xl:block">
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
        <div className="order-1">
          <div className="container-wcar pt-16 xl:pt-[89px]">
            <div className="xl:ml-[435px]">
              <SectionEyebrowComponent className="reveal gap-2.5! max-xl:mx-auto max-xl:items-center">Servicios Ofrecidos por wcar</SectionEyebrowComponent>

              <h2 id="adicionales-title" className="reveal mt-2.5 text-center text-subheadline-1 font-bold text-white min-[375px]:max-xl:whitespace-nowrap xl:mt-[11px] xl:text-left">
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
