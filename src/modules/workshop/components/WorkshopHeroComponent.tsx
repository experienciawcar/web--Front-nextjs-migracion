import Image from "next/image";

import iconExternal from "@/modules/shared/assets/icons/external-link.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import triangleMobile from "../assets/hero/triangulo-movil.svg";
import watermark from "../assets/hero/watermark-isotipo.svg";

/**
 * Hero de la vista Taller: banner negro con la foto del taller a la derecha, el
 * corte diagonal, el triángulo naranja y la pestaña cian "Contacta a un
 * asesor". La tarjeta blanca "¿Qué hace wcar taller?" lo solapa por abajo (ver
 * `WhatWeDoComponent`): por eso el banner mide 509 y la tarjeta arranca en 352.
 *
 * Fuente: captura del desktop 1440 (`docs/planes/taller/1-hero-y-que-hace.png`)
 * y, para la foto y el alto del banner, el Figma "Wcar Website - 2026" (nodo
 * 188:8089, marco "Frame 586" 188:11272). El mobile viene de Figma (ver más abajo). Calibrada con la
 * tarjeta blanca = contenedor (124…1316 ⇒ x 77…840): px de captura = -2,4 + 0,640
 * × px de diseño. Las medidas de abajo salen de la captura, con ±1,5 px de error,
 * salvo lo que diga "Figma":
 * - Banner: 1440 x 509 (Figma; la captura había dado 511). Negro puro (en la
 *   captura es 0,0,0, no el `dark-gray` de la barra lateral, que se ve 28,28,28).
 * - Corte diagonal: recta X = 543 + 0,764·Y (Figma: de (543,3) a (932,509)). El
 *   triángulo naranja comparte su borde izquierdo: (543,0), (848,0) y punta en
 *   (675,173); su borde derecho baja a 45°.
 * - Marca de agua: el isotipo "W wcar" (el de `shared/assets/icons`) a 394 x 437
 *   en (41,36), en blanco al 10 % (en la captura es 25,25,25 sobre negro). No
 *   es la de `shared/assets/hero/watermark.svg`, que trae también la palabra.
 * - Antetítulo (Figma): raya naranja de 48 x 3 (la captura daba 2) centrada en el
 *   texto (y=93 del banner) y, 16 a su derecha, el texto de 14 px bold
 *   (`text-small`; ancho de tinta 320 contra 321 de la captura).
 * - `<h1>` (Figma, "Frame 586" 188:11272): Urbanist Bold de 50 px con interlineado
 *   de 60 (1,2) y 0,5 px de tracking, "Taller" en cursiva REGULAR y "wcar" en bold
 *   naranja; empieza en x=146, 22 px a la derecha del antetítulo, y la primera
 *   línea en y=151 del banner (el bloque de 198 de alto va centrado en y=211).
 *   Con la captura yo había leído 52 px semibold, y para que la segunda línea
 *   cuadrara (3 % más angosta) puse un tracking de -0,02em y 4 px extra entre
 *   las palabras: era el tamaño mal leído, con 50 px las dos líneas salen bien.
 * - Pestaña cian: es un `ButtonComponent` `cyan` girado 90°, sin más: su forma
 *   (esquinas en abajo a la izquierda y arriba a la derecha) queda en arriba a
 *   la izquierda y abajo a la derecha, como en la captura. Va pegada al borde
 *   de la VENTANA (por eso cuelga de la sección y no del lienzo), desde y=131,
 *   en el color del token `blue`. Mide 48 x 275 y en la captura 46 x 270
 *   (dentro del error): se dejó el tamaño `big` del botón.
 * - Rayado abajo a la derecha: y=451..507 (Figma: 272 x 56 desde x=1180, tapado
 *   por la tarjeta hasta x=1316) hasta la ventana, en la diagonal "\" (el tile
 *   viene en "/"), al 50 % (la captura había dado 60 %).
 * - Foto (Figma, nodo 188:11275): caja de 900 x 509 en x=540 que sangra a la
 *   ventana. En Figma es un relleno recortado con una transformación afín: la
 *   foto original (1600 x 1066) está ESPEJADA, inclinada ~2,4° y estirada un 7 %
 *   más en un eje que en el otro, y lleva ajustes de imagen (contraste -57 %,
 *   luces +81 %, sombras +44 %, saturación +25 %...) que CSS no puede hacer. Por
 *   eso `taller-vehiculos-en-elevadores.webp` (1800 x 1018 = 2× de la caja) es la
 *   foto ya recortada, espejada y con el ajuste de color horneado, sin las capas
 *   de diseño, que van en CSS: (1) negro al 16 % sobre toda la foto, que se
 *   vuelve `#0D1317` sólido hacia el corte diagonal (de x=63 a x=290 de la
 *   caja); (2) degradado a negro de 116 px en la base, de x=602 a la ventana. La
 *   inclinación deja fuera de la foto original una cuña de ~130 px a la
 *   izquierda (y una franja abajo) que en desktop tapa la forma negra; se rellenó
 *   reflejando el borde para que en mobile, donde no hay forma negra, no salga
 *   un triángulo vacío. Se generó con `.claude/skills/nueva-vista/scripts/figma_imagen.py`
 *   (comando en el Registro de la tarea 8 de `docs/planes/taller.md`; el original,
 *   fuera del repo, en `../originales/taller/`).
 *
 * Mobile (Figma, marco "Vende tu carro -mobile 397", nodo 1:9787, 393 de ancho;
 * las cifras son relativas al inicio del hero, es decir, la y del marco menos 96
 * del navbar). Se aplica bajo `xl` y crece en ancho (la foto y el negro sangran;
 * lo demás va a la izquierda o a la derecha, como en el marco):
 * - Bloque negro de 270 de alto con el antetítulo (raya de 48 x 3 en x=50 alineada
 *   con el PRIMER renglón, texto de 14/18 en x=114 y 220 de ancho, en dos
 *   renglones) y el `<h1>` de 28 px bold con 0,28 de tracking en x=54, y=129, dos
 *   renglones de 34: "Taller y Servicio" / "Postventa en" (cursiva regular)
 *   "wcar" (naranja). El copy es OTRO que el de desktop ("Cuida tu carro Taller
 *   wcar"): el h1 lleva los dos, cada uno visible solo en su tamaño.
 *   TODO: confirmar con diseño cuál de los dos textos es el definitivo.
 * - Marca de agua "W" de 250 x 277 en (35,26) al 10 %, y un rayado fino (tile de
 *   6,5) de 40 x 93 en la esquina superior izquierda.
 * - Foto de 407 de alto desde y=176 (94 px quedan bajo el bloque negro): el
 *   export de Figma a 3× del nodo 193:7652 (la foto viene recortada y volteada
 *   con una transformación afín, no sale de `object-cover` de la original),
 *   recortada desde su primera fila con imagen y reducida a 2×:
 *   `taller-vehiculos-movil.webp`. Encima, degradado de transparente a negro de
 *   436 a 583 y un rayado de 119 x 48 abajo a la derecha.
 * - Triángulo naranja de 139,5 x 244,5 pegado a la derecha en y=148, con punta a
 *   la izquierda (el SVG de Figma, volteado) y desvanecido.
 * - Pestaña "Contacta a un asesor": la misma de desktop, en y=47 (48 x 271).
 * El hero mide 583; la tarjeta blanca de `WorkshopWhatWeDoComponent` lo solapa.
 *
 * Colores: la raya, "wcar" y el triángulo son el token `orange` (#FF8000). En la
 * captura se ven 255,113,42 por el corrimiento de color de la captura y no por
 * ser otro naranja (así se ve cualquier #FF8000, p. ej. el del logo). Hasta el
 * 2026-09-26 el token valía #EC671B y aquí se pintaban con el hex suelto.
 * TODO: confirmar con diseño si la pestaña "Contacta a un asesor" queda fija a
 * la pantalla o solo en el hero, y a dónde lleva (hoy `ROUTES.contact`).
 * Foto: ver arriba. En pantallas de más de 1440 la caja crece hasta el borde de
 * la ventana y `object-cover` la amplía (hasta ~26 % a 1900), recortando el
 * cielo raso (`object-bottom`), no los carros.
 */
export default function WorkshopHeroComponent() {
  return (
    <section aria-labelledby="taller-hero-title" className="relative isolate overflow-x-clip xl:bg-transparent">
      {/* El lienzo de 1440 centrado: los px del diseño valen aquí y los fondos
          sangran hasta el borde de la ventana (guía §4.2). */}
      <div className="relative mx-auto h-[583px] xl:h-[509px] xl:max-w-[1440px]">
        {/* ---------- Mobile: foto, negro y adornos ---------- */}
        <div className="absolute inset-x-0 top-[176px] h-[407px] xl:hidden">
          <Image
            src="/assets/taller/hero/taller-vehiculos-movil.webp"
            alt="Nave del taller de WCAR con vehículos en los elevadores, paredes naranjas y un Ford con el capó abierto en primer plano"
            fill
            sizes="100vw"
            className="object-cover object-[50%_70%]"
          />
        </div>
        <div aria-hidden className="absolute inset-x-0 top-[436px] z-10 h-[147px] bg-linear-to-b from-transparent to-black xl:hidden" />
        <div aria-hidden className="absolute inset-x-0 top-0 z-10 h-[270px] bg-black xl:hidden" />
        <DiagonalLinesComponent
          tile={6.5}
          className="absolute top-0 left-0 z-10 h-[93px] w-[40px] -scale-x-100 opacity-50 xl:hidden"
        />
        <DiagonalLinesComponent className="absolute top-[535px] right-0 z-10 h-[48px] w-[119px] -scale-x-100 opacity-50 xl:hidden" />
        <Image
          src={triangleMobile}
          alt=""
          aria-hidden
          className="absolute top-[148px] right-0 z-10 h-[244.5px] w-[139.5px] max-w-none -scale-x-100 xl:hidden"
        />

        {/* Foto de desktop: la caja de 900 x 509 del diseño (x=540), que sangra a
            la derecha; la forma negra la tapa a la izquierda. Las capas de diseño
            van en CSS (ver JSDoc). */}
        <div className="absolute top-0 right-[calc(50%-50vw)] left-[540px] z-0 hidden h-[509px] overflow-hidden xl:block">
          <Image
            src="/assets/taller/hero/taller-vehiculos-en-elevadores.webp"
            alt="Nave del taller de WCAR con vehículos en los elevadores, paredes naranjas y un Ford con el capó abierto en primer plano"
            fill
            preload
            sizes="900px"
            className="object-cover object-bottom"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,rgb(13_19_23)_63px,rgb(0_0_0/0.16)_290px)]"
          />
          <div
            aria-hidden
            className="absolute right-0 bottom-0 left-[62px] h-[116px] bg-[linear-gradient(184.56deg,transparent_27.29%,black_127.51%)]"
          />
        </div>

        {/* ---------- Decoración de desktop ---------- */}
        {/* Negro: un rectángulo que sangra a la izquierda hasta x=543 y, a su
            derecha, la cuña del corte diagonal. */}
        <div
          aria-hidden
          className="absolute inset-y-0 z-10 hidden bg-black xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(543px+50vw-50%)]"
        />
        <div
          aria-hidden
          className="absolute top-0 left-[543px] z-10 hidden h-full w-[391px] bg-black [clip-path:polygon(0_0,0_100%,100%_100%)] xl:block"
        />
        <div
          aria-hidden
          className="absolute top-0 left-[543px] z-10 hidden h-[173px] w-[305px] bg-orange [clip-path:polygon(0_0,100%_0,43.3%_100%)] xl:block"
        />

        <Image
          src={watermark}
          alt=""
          aria-hidden
          className="absolute top-[26px] left-[35px] z-10 h-[277px] w-[250px] max-w-none xl:top-[36px] xl:left-[41px] xl:h-[437px] xl:w-[394px]"
        />

        {/* Rayado sobre la foto, a la derecha de la tarjeta blanca. */}
        <DiagonalLinesComponent className="absolute top-[451px] right-[calc(50%-50vw)] left-[1316px] z-10 hidden h-[56px] -scale-x-100 opacity-50 xl:block" />

        {/* ---------- Texto ---------- */}
        <div className="relative z-20 max-xl:pt-[50px] max-xl:pl-[50px] xl:container-wcar xl:pt-[83px]">
          <div className="flex items-start gap-4 xl:h-[22px] xl:items-center">
            <span aria-hidden className="mt-[6.5px] h-[3px] w-12 shrink-0 bg-orange xl:mt-0" />
            <p className="w-[220px] max-w-[calc(100vw-170px)] text-small/[18px] font-bold text-white xl:w-auto xl:max-w-none xl:text-small">
              Lo revisamos a fondo. Lo reparamos con excelencia
            </p>
          </div>

          <h1
            id="taller-hero-title"
            className="mt-[43px] ml-1 text-[28px] leading-[34px] max-[359px]:text-[22px] max-[359px]:leading-7 font-bold tracking-[0.28px] text-white xl:mt-[46px] xl:ml-[22px] xl:text-[50px] xl:leading-[60px] xl:tracking-[0.5px]"
          >
            {/* Mobile y desktop traen un copy distinto en el diseño (ver JSDoc). */}
            <span className="xl:hidden">
              <span className="block">Taller y Servicio</span>{" "}
              <span className="block">
                <span className="font-normal italic">Postventa en</span> <span className="text-orange">wcar</span>
              </span>
            </span>
            {" "}
            <span className="hidden xl:inline">
              <span className="block">Cuida tu carro</span>{" "}
              <span className="block">
                <span className="font-normal italic">Taller</span> <span className="text-orange">wcar</span>
              </span>
            </span>
          </h1>
        </div>
      </div>

      {/* Pestaña "Contacta a un asesor": un botón girado 90° con su esquina
          pivote pegada al borde de la ventana. Al girar, la caja crece hacia la
          izquierda (su alto) y hacia abajo (su ancho). */}
      <div className="absolute top-[47px] right-0 z-30 h-0 w-0 xl:top-[131px]">
        <div className="absolute top-0 left-0 w-max origin-top-left rotate-90">
          <ButtonComponent href={ROUTES.contact} variant="cyan" icon={iconExternal}>
            CONTACTA A UN ASESOR
          </ButtonComponent>
        </div>
      </div>
    </section>
  );
}
