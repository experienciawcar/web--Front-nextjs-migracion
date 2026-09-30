import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import logoWcarFoto from "../assets/transparencia/logo-wcar-foto.svg";
import zigzagNaranja from "../assets/decor/zigzag-naranja.svg";
import { TRANSPARENCY_FEATURES } from "../constants/transparency";
import TransparencyFeaturesComponent from "./TransparencyFeaturesComponent";

/**
 * La foto de DESKTOP (la de mobile es `TransparencyPhotoMobile`: otro encuadre y
 * otras capas, no se resuelve con clases responsivas).
 *
 * `className` trae el posicionamiento (`absolute`/`aspect`/`w-`) del
 * llamador: no puede ir junto a un `relative` propio en el mismo elemento —
 * las dos son la propiedad `position` y, en Tailwind, cuál gana depende del
 * orden en que el motor genera las clases, no del orden en el `className`
 * (aquí ganaba `relative` y la foto absoluta se quedaba con 0 de alto, sin
 * salir del flujo). Por eso el `relative` para el `<Image fill>` va en un
 * `<div>` interno aparte, siempre fijo.
 *
 * La foto es el carro retro naranja ("62-R4-ORA") del diseño, no un jeep: la
 * primera versión de este componente usó por error la foto del hero. Sale del
 * export de Figma (nodo 671:11590/671:14164) tal cual, a 1x: pedir el 2x a
 * diseño para que no se vea blanda en pantallas retina.
 * TODO(imagen): pedir el export a 2x.
 *
 * El logo (199 x 64 en x=57, y=70: la W en blanco y "wcar" en negro) es el SVG
 * del nodo 671:11594, no el isotipo con texto suelto de antes. `object-bottom`:
 * el auto queda contra el borde de abajo aunque la caja sea más baja que la
 * foto de Figma (1309), y lo que se recorta es el naranja liso de arriba.
 */
function TransparencyPhoto({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden bg-orange ${className}`}>
      <div className="relative size-full">
        <Image
          src="/assets/home/transparencia/renault-retro.webp"
          alt=""
          aria-hidden
          fill
          sizes="483px"
          className="object-cover object-bottom"
        />
        {/* Patrón de arcos de Figma (671:11591/11592): la tesela de 71 x 73 al
            10,5 % arriba, desvaneciéndose hacia abajo hasta desaparecer en
            ~431 px. Opacidad y desvanecido medidos contra el export del nodo. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[431px] opacity-[0.105]"
          style={{
            backgroundImage: "url('/assets/home/decor/arcos.png')",
            backgroundSize: "71px 73px",
            maskImage:
              "linear-gradient(to bottom, #000 25%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.2) 62%, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 25%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.2) 62%, transparent 85%)",
          }}
        />
        <Image
          src={logoWcarFoto}
          alt=""
          aria-hidden
          className="absolute top-10 left-8 h-10 w-auto lg:top-14 lg:h-12 xl:top-[70px] xl:left-[57px] xl:h-16"
        />
        <p className="absolute top-[112px] left-8 text-[32px] leading-[1.1] font-bold text-white lg:top-[144px] lg:text-[40px] xl:top-[186px] xl:left-[50px] xl:text-[56px]">
          Transparencia
          <br />
          <span className="font-medium italic">brutal</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Degradado naranja que cubre la parte izquierda de la foto mobile y la funde
 * con el fondo: perfil medido contra el export de Figma (columnas de 20 px sin
 * texto ni carro): ~72 % hasta x=100, 93 % en x=130, y baja a 74 % en 160, 40 %
 * en 180, 19 % en 200, 5 % en 240 y 0 pasados los 260 (de 394). En %: 0/33/41/46/51/61/66.
 */
const PHOTO_MOBILE_FADE =
  "linear-gradient(to right, rgba(255,128,0,.72) 0, rgba(255,128,0,.93) 33%, rgba(255,128,0,.74) 41%, rgba(255,128,0,.4) 46%, rgba(255,128,0,.19) 51%, rgba(255,128,0,.05) 61%, rgba(255,128,0,0) 66%)";

/**
 * La foto de MOBILE, bajo el panel "Razones para comprar" (Figma 701:55029,
 * "Frame 564", 394 x 394; `xl:hidden`): el mismo carro retro del diseño, pero
 * ESPEJADO (la placa se lee al revés, así está en Figma) y desplazado a la
 * derecha para que asome su mitad. `renault-retro-mobile.webp` es la foto original
 * (1408 x 768) espejada y recortada al marco (registrada contra el export: escala
 * 435/768 = 0,5665, x=-4, y=0, correlación 0,99); el degradado naranja de la
 * izquierda (`PHOTO_MOBILE_FADE`) y el patrón de arcos van en CSS.
 *
 * Arcos: la tesela de 71 x 73 escalada a 58,84 x 60,49 al 10 %, en el tercio
 * izquierdo (Figma "Background": 215 de ancho que en el marco espejado cubren de
 * x=-89 a x=126) y desvanecidos hacia la derecha: la primera columna entera y
 * la segunda a medias (medido contra el export; la tesela cae en la misma
 * fase). Logo de 149 x 48 centrado a 36 px del borde y título de 36/42
 * a 32 px del borde y 101 de alto, en dos renglones ("Transparencia" /
 * "brutal" en cursiva regular).
 *
 * No se replicó el rectángulo desenfocado (Figma "Rectangle black", 149 x 502
 * con blur de 20 px) que suaviza la costura del carro: no se distingue del
 * degradado de arriba a esta escala.
 */
function TransparencyPhotoMobile() {
  return (
    <div className="bg-dark-gray md:hidden">
      <div className="reveal reveal-fade relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden bg-orange">
        <Image
          src="/assets/home/transparencia/renault-retro-mobile.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: PHOTO_MOBILE_FADE }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[32%] opacity-10"
          style={{
            backgroundImage: "url('/assets/home/decor/arcos.png')",
            backgroundSize: "58.84px 60.49px",
            maskImage: "linear-gradient(to right, #000 25%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, #000 25%, transparent 100%)",
          }}
        />
        <Image
          src={logoWcarFoto}
          alt=""
          aria-hidden
          className="absolute top-9 left-1/2 h-12 w-auto -translate-x-1/2"
        />
        <p className="absolute top-[101px] left-8 text-[36px] leading-[42px] font-bold text-white">
          Transparencia
          <br />
          <span className="font-normal italic">brutal</span>
        </p>
      </div>
    </div>
  );
}

/**
 * El acento "glitch" que asoma a la izquierda de la foto, a media altura: una
 * segunda foto (el tablero de un carro con luces de neón, nodo 671:11587,
 * 607 x 495 en x=2) sobre la barra negra. Va DETRÁS de la foto principal (que
 * es opaca y la tapa; en el documento va antes que ella), así que solo se ve la
 * tira de la izquierda (de x=2 a x=130) que la foto principal no cubre. Antes
 * llevaba `-z-10` y quedaba debajo del fondo de la sección: no se veía.
 *
 * Es puramente decorativo (`aria-hidden`) y solo en desktop. Las rayas cian que
 * lo cruzan son otra pieza (`GlitchStripes`): en Figma van por ENCIMA de la
 * foto principal.
 */
function GlitchAccent() {
  return (
    <div
      aria-hidden
      className="absolute top-[671px] left-[2px] hidden h-[495px] w-[607px] overflow-hidden xl:block"
    >
      <Image
        src="/assets/home/transparencia/dashboard-neon.webp"
        alt=""
        fill
        sizes="607px"
        className="object-cover"
      />
    </div>
  );
}

/**
 * Las rayas cian (Figma 671:11600, "Lines": 23 rayas de 3 px cada 9, en 194 x
 * 201) que cruzan el acento neón y se meten 64 px sobre la foto principal. Van
 * después de ella en el documento para quedar encima.
 */
function GlitchStripes() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[629px] left-0 hidden h-[201px] w-[194px] xl:block"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, var(--color-blue-neon) 0, var(--color-blue-neon) 3px, transparent 3px, transparent 9px)",
      }}
    />
  );
}

/**
 * "Razones para comprar y vender con wcar": reemplaza a la calculadora de
 * cuotas del diseño anterior (Figma Home 2.0, nodos 671:11541 a 671:11545).
 * Eyebrow "Nosotros" (raya horizontal de 48 + texto, no `SectionEyebrowComponent`:
 * ahí la raya es vertical), título 36 con la segunda mitad en cursiva, un
 * párrafo y los dos botones "COMPRA TU CARRO" / "VENDE TU CARRO" que antes
 * vivían en el hero.
 *
 * Mobile (Figma 701:55041): raya del eyebrow cian y a 16 del texto, botones
 * apilados a 24 con el texto y el ícono `arrow_circle` pegados a la izquierda
 * (32 de relleno, 8 entre ellos). El ícono solo va en mobile
 * (`iconClassName="md:hidden"`, y desde `md` todo el bloque toma los estilos de
 * desktop): el desktop que se maquetó antes no lo lleva.
 * TODO: confirmar con diseño si el de desktop también lo lleva.
 * Desktop (no se tocó): la raya sigue en `gray-light` a 12 del texto, aunque el
 * nodo 671:11544 del Figma de desktop la trae cian (`#00fefe`) a 16.
 */
function ReasonsToTradeComponent() {
  return (
    <div>
      <div className="reveal flex items-center gap-4 xl:gap-3">
        <span aria-hidden className="h-px w-12 bg-blue-neon xl:bg-gray-light" />
        <span className="text-small font-bold whitespace-nowrap text-gray-light">
          Nosotros
        </span>
      </div>

      <h3 className="reveal mt-4 text-subheadline-1 font-bold text-white md:mt-6 xl:text-[36px] xl:leading-[44px]">
        Razones para comprar{" "}
        <span className="font-normal italic">y vender con wcar</span>
      </h3>

      <p className="reveal mt-16 max-w-[279px] text-body leading-6 font-medium text-gray-light md:mt-6 md:max-w-[483px] md:opacity-90">
        Somos la plataforma tecnológica más transparente y de mayor crecimiento
        en Colombia para comprar un auto usado online, financiarlo y asegurarlo
        en un par de clics.
      </p>

      <div className="reveal mt-16 flex flex-col items-start gap-6 md:mt-8 md:flex-row md:flex-wrap md:items-stretch md:gap-4">
        <ButtonComponent
          href={ROUTES.buyCar}
          icon={arrowCircle}
          iconClassName="md:hidden"
          className="w-[235px] justify-start! md:justify-center!"
        >
          COMPRA TU CARRO
        </ButtonComponent>
        <ButtonComponent
          href={ROUTES.sellCar}
          variant="tertiary"
          icon={arrowCircle}
          iconClassName="md:hidden"
          className="justify-start! md:justify-center!"
        >
          VENDE TU CARRO
        </ButtonComponent>
      </div>
    </div>
  );
}

/**
 * "Transparencia brutal": la foto del carro retro naranja a la izquierda (que
 * sigue detrás del panel de abajo), a la derecha el título y las seis
 * cualidades, y debajo "Razones para comprar y vender con wcar"
 * (`ReasonsToTradeComponent`), sobre un panel oscuro.
 *
 * Figma (Home 2.0, nodo 671:11438): la foto (671:11589, 483 x 1309 en x=130,
 * y=100 bajo el borde de la sección) cruza las dos sub-secciones; aquí se
 * resuelve con un contenedor `relative` que envuelve las dos y la foto
 * `absolute top-[100px] bottom-0`, así estira sola sin necesitar la altura
 * exacta del diseño. El fondo gris claro (671:11533) es el de esta sección
 * entera; el panel de abajo es oscuro y sangra hasta el borde derecho de la
 * ventana (671:11535, 827 de ancho desde x=613). El contenido de la derecha (el
 * título de arriba y el panel de abajo) arranca en x=732: 613 donde acaba la
 * foto, + 119 de aire.
 *
 * Todo lo que en Figma toca el borde de la ventana sangra hasta ELLA, no hasta
 * el borde del lienzo de 1440 (guía §4.2): a 1900 px la barra negra, su rayado,
 * y a la derecha los cuadros cian y amarillo, el zigzag y el rayado del panel
 * siguen pegados al borde. Se posicionan con `calc(50% - 50vw)` desde el
 * contenedor del lienzo.
 *
 * Decoración:
 * - Barra negra lateral (671:11586): 304 de ancho, con el rayado de siempre en
 *   su esquina superior, y cruza las dos sub-secciones como la foto. La foto
 *   tapa lo que sobra de sus 304 salvo la franja de 100 px de arriba, donde se
 *   ve hasta el rectángulo amarillo. Sangra a la izquierda hasta la ventana.
 * - Sobre la foto, en esa franja de 100 px: el rectángulo `label-yellow`
 *   (671:11546, 202 x 101 en x=304) y el zigzag naranja de dos paralelogramos
 *   (671:11550, 212 x 207 en x=507, volteado; el mismo SVG que el de Destacados),
 *   que la foto tapa donde se cruzan.
 * - El acento "glitch" a media altura (`GlitchAccent`) y sus rayas cian
 *   (`GlitchStripes`, por encima de la foto).
 * - La cuadrícula de puntos (671:11549/671:11551, "Dots 8px": tesela de 8 x 8 con
 *   un punto de 2 x 2, en 54 x 251, al 15 %; en el diseño hay dos instancias
 *   idénticas superpuestas), en el borde derecho junto a "Financiación en unos
 *   clicks".
 * - Un cuadro cian y uno `label-yellow` (671:11547/671:11548) y el zigzag de
 *   siempre (671:11537), en la costura entre la sección clara y el panel
 *   oscuro: van pegados al borde de la ventana (no al del lienzo) para no
 *   depender de la altura real del panel (que ya no es fija: el párrafo puede
 *   ocupar más o menos).
 * - El rayado en la esquina inferior derecha del panel oscuro (671:11536): se
 *   ancla a la esquina de la sección (`bottom-0`), porque tiene que seguirla si
 *   el panel crece.
 *
 * Cualidades: dos columnas de tres (671:11556 a 671:11585), con
 * `FeatureCardComponent`. Título de la izquierda: "Compras online con atención
 * personalizada." (671:11553), 36 bold con "personalizada." en cursiva naranja.
 *
 * Mobile (Figma "mobile 398", 701:54961; medidas de esa página): tres bloques
 * apilados y a todo el ancho, en este orden.
 * 1. Gris (701:55025): título de 36/44 centrado a 44 px del borde de arriba,
 *    las cualidades en un carrusel de dos páginas de tres (`TransparencyFeaturesComponent`)
 *    y, en la esquina inferior derecha, un cuadro cian de 54 sobre uno amarillo
 *    de 102 x 54 (701:55072, 701:55071) pegados al borde de la ventana.
 * 2. Panel oscuro `#1e1e1e` (701:55043; el de desktop es negro): 96 px de
 *    relleno arriba, eyebrow con raya cian, título, párrafo de 279 de ancho y
 *    los dos botones apilados, 120 px abajo. Zigzag blanco y amarillo arriba a
 *    la derecha (701:55054) y rayado al 50 % abajo a la derecha (102 x 106).
 * 3. La foto cuadrada (`TransparencyPhotoMobile`, 701:55029), debajo del panel.
 * Sin el acento "glitch", la barra negra ni el resto de la decoración de desktop.
 *
 * Tablet (`md` a `xl`, 768 a 1279; sin diseño, adaptado del desktop): la misma
 * composición que en desktop con medidas propias. La foto vuelve a ser la columna
 * alta de la izquierda (300 de ancho a 64 del borde; 380 a 96 desde `lg`, 1024)
 * y a su derecha el título, las seis cualidades (una columna; dos, como en desktop, desde `xl`) y el
 * panel oscuro (negro como en desktop, con sus estilos de escritorio), todo alineado
 * a 36 px (40 en `lg`) de la foto. Conserva la barra negra lateral y el rectángulo
 * amarillo de arriba; no lleva el zigzag naranja, el acento "glitch" ni los puntos,
 * que chocarían con el texto. Las cualidades ya no son carrusel ni van centradas, y
 * el título dice "Compras" como el de desktop. Todo lo de tablet va con `md:` y se
 * restaura con `xl:` (los valores de 1440 no cambiaron). Por debajo de 768 se
 * queda la composición mobile; su foto cuadrada no pasa de 560 de ancho.
 *
 * COPY: el diseño mobile dice "Compra online con atención personalizada." y el
 * de desktop "Compras online…" (con «s»). Cada tamaño reproduce el suyo.
 * TODO: confirmar con diseño cuál es el correcto.
 */
export default function TransparencyComponent() {
  return (
    <section
      aria-labelledby="transparency-title"
      className="overflow-x-clip bg-gray-light"
    >
      <div className="relative mx-auto xl:max-w-[1440px]">
        {/* Barra negra lateral: cruza las dos sub-secciones, como la foto. Mide
            304 (la foto tapa lo que sobra, menos la franja de arriba) y sangra a
            la izquierda hasta el borde de la ventana. */}
        <div
          aria-hidden
          className="absolute inset-y-0 left-[calc(50%-50vw)] hidden w-[calc(304px+50vw-50%)] bg-dark-gray md:block"
        >
          <DiagonalLinesComponent
            variant="white"
            className="absolute top-0 left-0 h-[150px] w-[60px] opacity-60"
          />
        </div>

        {/* En la franja de 100 px sobre la foto: el rectángulo amarillo y los
            paralelogramos naranjas (que la foto, más abajo en el documento, tapa
            donde se cruzan). */}
        <span
          aria-hidden
          className="absolute top-0 left-[304px] hidden h-[101px] w-[202px] bg-label-yellow md:block"
        />
        <Image
          src={zigzagNaranja}
          alt=""
          aria-hidden
          className="absolute top-0 left-[507px] hidden h-[207px] w-[212px] max-w-none -scale-x-100 xl:block"
        />

        <GlitchAccent />

        {/* Puntos junto a "Financiación en unos clicks": 5 px pasados del borde del lienzo. */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-[142px] right-[calc(50%-50vw-5px)] hidden h-[251px] w-[54px] opacity-15 xl:block"
          style={{
            backgroundImage: "url('/assets/home/decor/puntos.png')",
            backgroundSize: "8px 8px",
          }}
        />

        {/* Título y cualidades. En mobile el carrusel sangra a todo el ancho
            (cada página trae su margen), por eso el relleno lateral va en el título. */}
        <div className="relative pt-11 pb-[65px] md:pt-[124px] md:pr-8 md:pb-16 md:pl-[400px] lg:pr-10 lg:pl-[516px] xl:pr-0 xl:pl-[732px]">
          <h2
            id="transparency-title"
            className="reveal px-8 text-center text-subheadline-1 font-bold text-dark-gray md:px-0 md:text-left xl:text-[36px] xl:leading-[44px]"
          >
            Compra<span className="hidden md:inline">s</span> online con
            atención{" "}
            <span className="font-normal text-orange italic">
              personalizada.
            </span>
          </h2>

          <div className="reveal mt-6 md:mt-14">
            <TransparencyFeaturesComponent features={TRANSPARENCY_FEATURES} />
          </div>

          <span
            aria-hidden
            className="absolute right-0 bottom-[54px] size-[54px] bg-blue-neon xl:hidden"
          />
          <span
            aria-hidden
            className="absolute right-0 bottom-0 h-[54px] w-[102px] bg-label-yellow xl:hidden"
          />
        </div>

        {/* Panel "Razones para comprar y vender con wcar": oscuro, sangra hasta el borde derecho. */}
        <div className="relative md:ml-[364px] lg:ml-[476px] xl:ml-[613px]">
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 hidden bg-black xl:right-[calc(50%-50vw)] xl:block"
          />

          <div className="relative bg-dark-gray px-8 pt-24 pb-[120px] md:bg-black md:pt-16 md:pb-16 md:pl-9 lg:pl-10 xl:bg-transparent xl:px-0 xl:pl-[119px]">
            <ReasonsToTradeComponent />

            {/* Zigzag arriba a la derecha (solo mobile: desde `md` el título llega hasta ahí y
                lo pisaba) y rayado abajo a la derecha (hasta `lg`: desde 1024 se montaba sobre los botones).
                `ZigZagComponent` trae `relative` propio: el `absolute` va en el `<div>`. */}
            <div className="absolute top-[19px] right-8 md:hidden">
              <ZigZagComponent tone="light" />
            </div>
            <DiagonalLinesComponent
              variant="white"
              className="absolute right-0 bottom-0 h-[106px] w-[102px] opacity-50 lg:hidden"
            />
          </div>
        </div>

        {/* Foto en mobile: debajo del panel oscuro. */}
        <TransparencyPhotoMobile />

        {/* Cuadro cian + amarillo, zigzag y rayado de la esquina: pegados al
            borde de la VENTANA (`calc(50% - 50vw)` desde el contenedor del
            lienzo), como el panel oscuro que sangra hasta ahí. Van DESPUÉS del
            panel en el documento a propósito: el fondo negro del panel es
            `absolute` igual que ellos, y sin z-index (los dos en `auto`) pinta
            encima el que va después en el documento; si fueran antes, el negro
            los taparía. */}
        <span
          aria-hidden
          className="absolute top-[801px] right-[calc(50%-50vw)] hidden h-[54px] w-[54px] bg-blue-neon xl:block"
        />
        <span
          aria-hidden
          className="absolute top-[855px] right-[calc(50%-50vw)] hidden h-[54px] w-[124px] bg-label-yellow xl:block"
        />
        {/* ZigZagComponent ya trae `relative` propio: el `absolute` va en un
            `<div>` envolvente (guía §8, "Todo se corre ~112px al poner un
            ZigZagComponent"), no en su `className`. */}
        <div className="absolute top-[984px] right-[calc(50%-50vw+88px)] hidden xl:block">
          <ZigZagComponent />
        </div>
        <DiagonalLinesComponent
          variant="white"
          className="absolute right-[calc(50%-50vw)] bottom-0 hidden h-[124px] w-[124px] opacity-50 xl:block"
        />

        {/* Foto en desktop: estira sola al alto de las dos sub-secciones de
            arriba, menos los 100 px de la franja con el amarillo y los
            paralelogramos. */}
        <TransparencyPhoto className="reveal reveal-fade absolute top-[100px] bottom-0 left-16 hidden w-[300px] md:block lg:left-24 lg:w-[380px] xl:left-[130px] xl:w-[483px]" />

        {/* Las rayas cian del acento "glitch" van por encima de la foto. */}
        <GlitchStripes />
      </div>
    </section>
  );
}
