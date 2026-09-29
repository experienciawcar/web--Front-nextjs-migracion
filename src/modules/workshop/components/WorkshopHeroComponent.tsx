import Image from "next/image";

import iconExternal from "@/modules/shared/assets/icons/external-link.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import watermark from "../assets/hero/watermark-isotipo.svg";

/**
 * Hero de la vista Taller: banner negro con la foto del taller a la derecha, el
 * corte diagonal, el triángulo naranja y la pestaña cian "Contacta a un
 * asesor". La tarjeta blanca "¿Qué hace wcar taller?" lo solapa por abajo (ver
 * `WhatWeDoComponent`): por eso el banner mide 509 y la tarjeta arranca en 352.
 *
 * Fuente: captura del desktop 1440 (`docs/planes/taller/1-hero-y-que-hace.png`)
 * y, para la foto y el alto del banner, el Figma "Wcar Website - 2026" (nodo
 * 188:8089, marco "Frame 586" 188:11272). No hay diseño mobile. Calibrada con la
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
 * Mobile: no hay diseño. Se adaptó con el criterio de la guía §4.3: sin corte
 * diagonal, triángulo, marca de agua, rayado ni pestaña; el texto arriba y la
 * foto debajo.
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
    <section aria-labelledby="taller-hero-title" className="relative isolate overflow-x-clip bg-black xl:bg-transparent">
      {/* El lienzo de 1440 centrado: los px del diseño valen aquí y los fondos
          sangran hasta el borde de la ventana (guía §4.2). */}
      <div className="relative mx-auto flex flex-col xl:block xl:h-[509px] xl:max-w-[1440px]">
        {/* Foto. En mobile va debajo del texto; en desktop es la caja de 900 x 509
            del diseño (x=540) y sangra a la derecha; la forma negra la tapa a la
            izquierda. Las capas de diseño van en CSS (ver JSDoc). */}
        <div className="relative order-2 aspect-[393/230] w-full overflow-hidden xl:absolute xl:top-0 xl:right-[calc(50%-50vw)] xl:left-[540px] xl:aspect-auto xl:h-[509px] xl:w-auto">
          <Image
            src="/assets/taller/hero/taller-vehiculos-en-elevadores.webp"
            alt="Nave del taller de WCAR con vehículos en los elevadores, paredes naranjas y un Ford con el capó abierto en primer plano"
            fill
            preload
            sizes="(min-width: 1280px) 900px, 100vw"
            className="object-cover object-bottom"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-black/16 xl:bg-transparent xl:bg-[linear-gradient(to_right,rgb(13_19_23)_63px,rgb(0_0_0/0.16)_290px)]"
          />
          <div
            aria-hidden
            className="absolute right-0 bottom-0 left-[62px] hidden h-[116px] bg-[linear-gradient(184.56deg,transparent_27.29%,black_127.51%)] xl:block"
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
          className="absolute top-[36px] left-[41px] z-10 hidden h-[437px] w-[394px] max-w-none xl:block"
        />

        {/* Rayado sobre la foto, a la derecha de la tarjeta blanca. */}
        <DiagonalLinesComponent className="absolute top-[451px] right-[calc(50%-50vw)] left-[1316px] z-10 hidden h-[56px] -scale-x-100 opacity-50 xl:block" />

        {/* ---------- Texto ---------- */}
        <div className="relative z-20 order-1 container-wcar pt-12 pb-10 xl:pt-[83px] xl:pb-0">
          <div className="flex items-center gap-4 xl:h-[22px]">
            <span aria-hidden className="h-[3px] w-12 shrink-0 bg-orange" />
            <p className="text-small font-bold text-white">Lo revisamos a fondo. Lo reparamos con excelencia</p>
          </div>

          <h1
            id="taller-hero-title"
            className="mt-6 text-[34px] leading-10 font-bold tracking-[0.5px] text-white xl:mt-[46px] xl:ml-[22px] xl:text-[50px] xl:leading-[60px]"
          >
            <span className="block">Cuida tu carro</span>
            {" "}
            <span className="block">
              <span className="font-normal italic">Taller</span> <span className="text-orange">wcar</span>
            </span>
          </h1>
        </div>
      </div>

      {/* Pestaña "Contacta a un asesor": un botón girado 90° con su esquina
          pivote pegada al borde de la ventana. Al girar, la caja crece hacia la
          izquierda (su alto) y hacia abajo (su ancho). */}
      <div className="absolute top-[131px] right-0 z-30 hidden h-0 w-0 xl:block">
        <div className="absolute top-0 left-0 w-max origin-top-left rotate-90">
          <ButtonComponent href={ROUTES.contact} variant="cyan" icon={iconExternal}>
            CONTACTA A UN ASESOR
          </ButtonComponent>
        </div>
      </div>
    </section>
  );
}
