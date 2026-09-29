import Image from "next/image";

import logoSantander from "@/modules/shared/assets/hero/logo-santander.png";
import logoWcarWhite from "@/modules/shared/assets/hero/logo-wcar-white.svg";
import heroWatermark from "@/modules/shared/assets/hero/watermark.svg";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";

import NearestHeadquartersButtonComponent from "./NearestHeadquartersButtonComponent";

/**
 * Primera sección de la vista Nuestras Sedes: el banner con el lockup
 * wcar | Santander y, debajo, la presentación "Encuentra el concesionario de
 * wcar más cerca de ti". Son una sola sección porque comparten la barra negra
 * lateral, la forma naranja del borde derecho y el rayado: cruzan del banner a
 * la presentación.
 *
 * Fuente: captura del desktop 1440 (no hay acceso al MCP de Figma en esta
 * sesión ni diseño mobile), así que TODAS las medidas salen de medir la
 * captura (escala 0.7119, con un error de ±1px de diseño) y las de las fotos
 * de registrar cada una contra su archivo por correlación. Lo medido:
 * - Lienzo de 1440 x 835 (banner 302 + presentación 533). La captura termina
 *   en y=835, así que la barra y el rayado se cierran ahí.
 *   TODO: confirmar con diseño dónde acaba la sección (¿la barra sigue?).
 * - Barra negra: x=0..303, del pie del banner (y=302) al final. En el banner no
 *   hay barra opaca sino una sombra del mismo color (ver abajo).
 * - Foto del banner: 1158x366 en x=282, y=-7 (la barra tapa su borde izquierdo
 *   y el banner recorta lo que sobra). Es `object-cover` en una caja de 302 de
 *   alto con `object-position` y=10.9%, que da esas mismas medidas a 1440. La
 *   sombra de la izquierda va en CSS (`#1e1e1e` sólido hasta x=238 y línea
 *   recta a transparente en x=767, horizontal; medida sobre el cielo).
 * - Marca de agua y lockup: los mismos del hero de Sobre Nosotros (149x48 |
 *   239x42, separados 29px), pero a top=97 y la marca de agua a top=16.
 * - Rayado: y=241..302 desde el borde izquierdo del contenedor hacia la
 *   derecha, por debajo de la forma naranja, en la diagonal "\\" y al ~35%.
 * - Forma naranja: 124 de ancho (1316..1440) y 510 de alto; su borde inclinado
 *   va de (1440,0) a (1316,298). Sangra hacia la derecha en pantallas anchas.
 * - Foto de la presentación: 382x410 en x=124, y=302 (`object-cover` alineada
 *   a la derecha: registrada a escala 0.615, o sea alto completo).
 * - Texto: columna de 608 en x=608 (justificado). Eyebrow con la raya en
 *   y=347; título de 36/44 (la segunda línea en cursiva Medium); párrafo de
 *   14/24 (a 16px no cabe en 5 renglones: se midió el ancho natural de la
 *   primera línea, 570 a 14px y 652 a 16px, contra los 608 de la columna);
 *   botón de 280 de ancho.
 * - Líneas amarillas de abajo a la derecha: dos horizontales (y=605 y y=751),
 *   una diagonal que las une y otra paralela, todas de 4px en `yellow`.
 *
 * Mobile: no hay diseño, se adaptó con el criterio del resto de la vista:
 * banner de 393x193 con el lockup a la izquierda, sin barra, marca de agua,
 * forma ni rayado; el texto arriba y la foto debajo.
 * TODO: pedir el diseño mobile.
 *
 * Colores: la raya del eyebrow, el título en cursiva y la forma se ven en la
 * captura IGUALES al naranja del logo (#FF8000). Desde que el token `orange`
 * vale #FF8000 (variables de diseño) todo eso, y el botón, usan el token.
 *
 * Fotos: son las mismas que ya estaban en "Nuestra huella" (Sobre Nosotros),
 * copiadas a `public/assets/nuestras-sedes/`. La del banner mide 1301x411 y se
 * ve a ~1158, la de la presentación 1000x667 y se ve a 382x410: alcanzan a 1x,
 * quedan blandas a 2x. TODO: pedir a diseño el export a 2x de las dos.
 *
 * Textos tal cual del diseño (con `TODO: confirmar con diseño`): "colob"
 * (¿Colombia?), "mas" sin tilde, "wcar" en minúscula y el voseo mezclado con
 * tuteo ("merecés", "descubrí" junto a "Conoce").
 */
export default function HeadquartersHeroComponent() {
  return (
    <section aria-labelledby="sedes-hero-title" className="relative overflow-x-clip">
      {/* El lienzo de 1440 centrado: los px del diseño valen aquí y los fondos
          sangran hasta el borde de la ventana. Sin `relative` en los
          `container-wcar` de dentro (ver guía §4.2). */}
      <div className="relative mx-auto xl:max-w-[1440px]">
        {/* ---------- Banner ---------- */}
        <div className="relative h-[193px] xl:h-[302px]">
          {/* Foto. En desktop arranca en x=282 y sangra a la derecha hasta el
              borde de la ventana; a 1440 mide 1158 y, más ancho, `object-cover`
              la agranda en vez de estirarla. A su izquierda no hay foto: ahí la
              sombra de abajo cae sobre el fondo blanco de la página. */}
          <div className="absolute inset-0 xl:right-[calc(50%-50vw)] xl:left-[282px]">
            <Image
              src="/assets/nuestras-sedes/hero/fachada-wcar-pits.webp"
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 1280px) calc(50vw + 438px), 100vw"
              className="object-cover object-[45%_50%] xl:object-[left_10.9%]"
              preload
            />
            {/* Mobile: oscurece la foto (más a la izquierda) para que se lea el
                lockup, que cae sobre el rótulo de la fachada. Es una
                estimación, no hay diseño mobile. */}
            <div aria-hidden className="absolute inset-0 bg-linear-to-r from-black/75 via-black/55 to-black/25 xl:hidden" />
          </div>

          {/* Sombra oscura de la izquierda (desktop). No es la barra negra: en
              el banner la barra NO es opaca, la foto se ve a través de una
              sombra del color de la barra que es sólida hasta x=238 y se
              desvanece en línea recta hasta x=767 (alfa 0.88 en x=300, 0.60
              en x=450, medido contra la foto). Por eso no hay costura donde
              la barra acabaría (x=303). En x=238..282, donde aún no hay foto,
              la sombra deja ver el blanco de la página (brillo 33 a 43 en la
              captura, lo que da una sombra sobre blanco y no sobre negro). La
              parte sólida sangra a la izquierda. */}
          <div
            aria-hidden
            className="absolute inset-y-0 z-10 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(238px+50vw-50%)]"
          />
          <div
            aria-hidden
            className="absolute inset-y-0 left-[238px] z-10 hidden w-[529px] bg-[linear-gradient(90deg,#1e1e1e,rgba(30,30,30,0))] xl:block"
          />

          {/* Marca de agua "W wcar": misma que la del hero de Sobre Nosotros
              (ya trae su 40% de opacidad), a x=51, y=16. */}
          <Image
            src={heroWatermark}
            alt=""
            aria-hidden
            className="absolute top-[16px] left-[51px] z-20 hidden h-[206.42px] w-[637px] max-w-none xl:block"
          />

          {/* Lockup wcar | Santander. En mobile va a 2/3 del tamaño y centrado
              en vertical; en desktop a top=97. */}
          <div className="absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 xl:top-[97px] xl:translate-y-0">
            <div className="container-wcar flex items-center gap-4 xl:gap-[29px]">
              <Image src={logoWcarWhite} alt="WCAR" className="h-8 w-[99.4px] xl:h-12 xl:w-[149.13px]" />
              <span aria-hidden className="h-8 w-[2px] bg-white/60 xl:h-12" />
              <Image src={logoSantander} alt="Santander" className="h-7 w-[159px] xl:h-[42px] xl:w-[239px]" />
            </div>
          </div>
        </div>

        {/* ---------- Presentación ---------- */}
        <div className="relative xl:h-[533px]">
          <div className="container-wcar flex flex-col gap-10 py-12 xl:flex-row xl:gap-[102px] xl:py-0">
            {/* La foto va por encima de la barra negra (z-20 > z-10), que pasa
                por detrás de ella. En mobile va después del texto. */}
            <div className="reveal reveal-left relative order-2 aspect-[4/3] w-full max-w-[560px] xl:z-20 xl:order-1 xl:aspect-auto xl:h-[410px] xl:max-w-none xl:w-[382px] xl:shrink-0">
              <Image
                src="/assets/nuestras-sedes/intro/showroom-vehiculos.webp"
                alt="Showroom de WCAR con vehículos usados"
                fill
                sizes="(min-width: 1280px) 382px, 100vw"
                className="object-cover object-right"
              />
            </div>

            <div className="order-1 flex flex-col xl:order-2 xl:w-[608px] xl:pt-[45px]">
              {/* Eyebrow propio y no `SectionEyebrowComponent`: aquí la raya
                  mide 76 (no 115) y es del naranja del logo.
                  TODO: confirmar con diseño si es el mismo patrón. */}
              <div className="reveal flex flex-col gap-2 xl:gap-4">
                <span aria-hidden className="h-1 w-[76px] bg-orange" />
                {/* TODO: confirmar con diseño: "colob" (¿Colombia?). */}
                <span className="text-small font-bold text-gray">wcar en toda colob</span>
              </div>

              {/* TODO: confirmar con diseño: "mas" sin tilde y "wcar" en
                  minúscula. */}
              <h1
                id="sedes-hero-title"
                className="reveal mt-3 text-[28px] leading-9 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11"
              >
                Encuentra el concesionario
                {" "}
                <span className="block font-medium text-orange italic">de wcar mas cerca de ti</span>
              </h1>

              {/* TODO: confirmar con diseño el voseo ("merecés", "descubrí")
                  mezclado con tuteo ("Conoce"). */}
              <p className="reveal mt-5 text-small leading-6 font-medium text-gray-dark xl:text-justify">
                En WCAR no solo vendemos carros usados: también vendemos tranquilidad. Por eso, tenemos varias sedes
                para que siempre tengas un concesionario cerca de mí donde comprar, vender o mantener tu carro con toda
                la confianza que te merecés. Aquí no hay cuentos: hay datos, calidad y atención brutalmente
                transparente. Conoce nuestras sedes y descubrí por qué somos la opción número uno en carros usados en
                Bogotá y Sabana.
              </p>

              {/* El botón "Google Maps" lleva a la sede más cercana a quien lo
                  pulsa (geolocalización + modal): ver
                  NearestHeadquartersButtonComponent. Mide 280 de ancho, con el
                  pin a la IZQUIERDA y sin mayúsculas, como en el diseño. */}
              <NearestHeadquartersButtonComponent className="reveal mt-10 xl:mt-[42px]" />
            </div>
          </div>
        </div>

        {/* ---------- Decoración de desktop (todo por posición absoluta) ---------- */}

        {/* Barra negra de 303: sangra a la izquierda y va desde el pie del
            banner hasta el final de la sección (en el banner la sustituye la
            sombra de arriba). La foto de la presentación va por encima. */}
        <div
          aria-hidden
          className="absolute top-[302px] bottom-0 z-10 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(303px+50vw-50%)]"
        />

        {/* Rayado sobre la parte baja del banner. Arranca en el borde
            izquierdo del contenedor (`50% - 596px`) y llega al borde derecho
            del lienzo, por debajo de la forma naranja. Aquí las rayas van en
            "\" (el tile viene en "/", de ahí el espejo) y a ~35% de opacidad
            (medido: la media de brillo sobre la barra sube 36% de lo que sube
            el tile blanco). */}
        <DiagonalLinesComponent className="absolute top-[241px] right-0 left-[calc(50%-596px)] z-20 hidden h-[61px] -scale-x-100 opacity-35 xl:block" />

        {/* Forma naranja del borde derecho: un polígono de 124x510 y, a su
            derecha, un rectángulo que sangra hasta la ventana en pantallas
            anchas (la forma nace en el borde del diseño, no flota). */}
        <div
          aria-hidden
          className="absolute top-0 right-0 z-30 hidden h-[510px] w-[124px] bg-orange [clip-path:polygon(100%_0,0_58.4%,0_100%,100%_100%)] xl:block"
        />
        <div aria-hidden className="absolute top-0 left-full z-30 hidden h-[510px] w-[50vw] bg-orange xl:block" />

        {/* Líneas amarillas de abajo a la derecha. Van en px del diseño desde
            el borde derecho del lienzo, y las horizontales y la segunda
            diagonal se estiran más allá para sangrar (la sección recorta en x).
            La segunda diagonal termina en y=0 y en y=835 para no salirse de la
            sección; en pantallas muy anchas quedaría por debajo de la forma
            naranja (z-30). */}
        <svg
          aria-hidden
          viewBox="0 0 1440 835"
          fill="none"
          className="pointer-events-none absolute top-0 right-0 z-10 hidden h-[835px] w-[1440px] max-w-none overflow-visible stroke-yellow xl:block"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4000 605.3H1383.3L1245.5 751.2H4000" />
          <path d="M2098.9 0L1309.8 835" />
        </svg>
      </div>
    </section>
  );
}
