import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import patch from "../assets/que-hace/parche-fachada.svg";

/**
 * Sección "¿Qué hace wcar taller?": la tarjeta blanca que solapa el pie del
 * hero, con la fachada del taller a la izquierda y la presentación a la
 * derecha.
 *
 * Fuente: captura del desktop 1440 (`docs/planes/taller/1-hero-y-que-hace.png`,
 * calibrada como en el hero: -2,4 + 0,640 × px de diseño) y, para la foto y su
 * caja, el Figma (nodo 188:8089, grupo 190:3229). El mobile viene de Figma (ver más abajo). Medidas (px
 * de diseño, ±1,5 salvo lo que diga "Figma"):
 * - Tarjeta: la del contenedor (x=124..1316), de y=352 a 775 (423 de alto: es el
 *   alto de la foto; Figma, la captura había dado 355 y 421). Solapa 157 px al
 *   hero (que mide 509) y por abajo la foto sobresale sobre la barra negra de
 *   "Servicios Postventa", que arranca en y=635: por eso esta sección va por
 *   encima (`z-20`) de esa barra (`z-10`).
 * - Foto (Figma): caja de 554 x 423 en la esquina superior izquierda de la
 *   tarjeta. La foto es otra que la de `nuestras-sedes/sedes/taller-morato.webp`
 *   (que se había copiado aquí por parecerse): es una toma de la misma fachada
 *   sin cables ni cielo, de 2418 x 1728, a `object-cover` con la posición
 *   77,9 % 50 % (Figma: imageTransform x 0,936 y desplazado 0,0499, es decir, la
 *   foto a 592 px de ancho y corrida 29,5 px a la izquierda; verificado contra el
 *   export de Figma, diferencia media 3/255). Se sirve a 1200 px (2× de 592).
 * - Parche (Figma, "Rectangle 4277"): la foto trae en la esquina inferior
 *   derecha la marca de agua visible del generador de imágenes con que se hizo
 *   (una estrella de cuatro puntas gris sobre la puerta oscura) y el diseño la
 *   tapa con un parche borroso de 34 x 34 (42 x 42 con el desenfoque) en (484,345)
 *   de la caja de la foto: `assets/que-hace/parche-fachada.svg`, en porcentajes
 *   de la caja para que siga a la foto en mobile.
 * - Texto: columna de 480 a 87 px de la foto (x=766). Raya de 115 x 4 en y=411,
 *   título de 22/30 (`text-heading-1`), párrafo de 16/24 (a 14 no llena los seis
 *   renglones: el primero mide 477 en la captura y 475,6 a 16 px), botón `primary`
 *   de 305 x 48. El ancho de 480 sale de que la primera línea (477) cabe y la
 *   quinta con la palabra siguiente (485) no.
 *
 * Mobile (Figma, marco 1:9787, 393 de ancho): la tarjeta blanca (329 de ancho, x=32)
 * arranca 108 px antes del final del hero (que mide 583) y solo es el respaldo
 * blanco del texto sobre la foto; el diseño NO trae la foto de la fachada, así
 * que aquí no se muestra. Todo el bloque va centrado salvo el párrafo: antetítulo
 * "wcar taller" de 14 con su raya de 117 x 4 (36 de alto entre las dos, a 8 px del
 * título); título de 36/44 en dos renglones ("¿Que hace" / "wcar Taller?", esto
 * último en cursiva naranja, sin espacio antes del "?" y con "T" mayúscula, a
 * diferencia de desktop); párrafo de 16/24 a 32 px del título y el botón de 305 x 48
 * a 64 px del párrafo, centrado. La tarjeta arranca 36 px sobre el antetítulo.
 *
 * Colores (medidos de la captura, recordando que sus hex no son los del diseño):
 * - Título: `dark-gray` al 90 % como los títulos de `FeatureCardComponent` (en la
 *   captura sale 47,47,47, igual que la cuenta: 30 * 0,9 sobre blanco, x 0,93).
 * - Párrafo: `gray-dark` (mínimo de la captura 100,106,132 ≈ el token). Las partes en
 *   negrita salen más oscuras (90,97,124): ~#5D6480.
 * - "wcar" y la raya: el token `orange` (#FF8000). El "wcar" del párrafo se ve
 *   255,113,42 en la captura (el corrimiento de color de siempre) y la raya
 *   255,99,40, algo más rojiza: se dejó el mismo token.
 * TODO: confirmar con diseño el color de la raya y el de las negritas (~#5D6480,
 *   más oscuras que el gris del párrafo).
 *
 * Textos tal cual del diseño (con `TODO: confirmar con diseño`): "¿Que" sin
 * tilde, el espacio antes del "?" y "TECNICO" sin tilde.
 * TODO: destino de "Solicitar servicio técnico" (hoy `ROUTES.contact`).
 * TODO: confirmar con diseño/marketing que la foto de la fachada es la definitiva
 * (es una imagen generada, con la marca de agua tapada por el parche de arriba).
 */
export default function WorkshopWhatWeDoComponent() {
  return (
    <section aria-labelledby="que-hace-title" className="relative z-20 -mt-[108px] xl:-mt-[157px]">
      <div className="container-wcar">
        <div className="flex flex-col bg-white pt-9 pb-16 xl:h-[423px] xl:flex-row xl:gap-[87px] xl:py-0">
          {/* Foto. En mobile va después del texto. */}
          <div className="reveal reveal-left relative order-1 hidden overflow-hidden xl:block xl:h-[423px] xl:w-[554px] xl:shrink-0">
            <Image
              src="/assets/taller/que-hace/fachada-taller-wcar.webp"
              alt="Fachada del taller de WCAR: “Taller de reacondicionamiento automotriz”"
              fill
              sizes="(min-width: 1280px) 592px, 100vw"
              className="object-cover object-[77.9%_50%]"
            />
            {/* Tapa la marca de agua de la foto (ver JSDoc). */}
            <Image
              src={patch}
              alt=""
              aria-hidden
              className="absolute top-[81.56%] left-[87.36%] h-auto w-[7.58%] max-w-none"
            />
          </div>

          <div className="order-2 flex flex-col xl:w-[480px] xl:pt-14">
            <span aria-hidden className="reveal hidden h-1 w-[115px] bg-orange xl:block" />
            <div className="reveal flex flex-col items-center gap-2.5 xl:hidden">
              <span aria-hidden className="block h-1 w-[117px] bg-orange" />
              <span className="text-small font-bold text-gray">wcar taller</span>
            </div>

            {/* TODO: confirmar con diseño: "¿Que" sin tilde y el espacio antes
                del "?". */}
            <h2
              id="que-hace-title"
              className="reveal mt-2 text-center text-subheadline-1 font-bold text-dark-gray opacity-90 xl:mt-[30px] xl:text-left xl:text-heading-1"
            >
              ¿Que hace{" "}
              <span className="xl:hidden">
                <br />
                <span className="font-normal text-orange italic">wcar Taller?</span>
              </span>
              <span className="hidden font-medium italic xl:inline">wcar taller ?</span>
            </h2>

            <p className="reveal mt-8 text-body font-medium text-gray-dark xl:mt-[30px]">
              En <strong className="font-bold text-orange">wcar</strong>, ofrecemos un servicio de calidad
              superior para tu vehículo. Nuestro taller en Bogotá está equipado con{" "}
              <strong className="font-bold text-[#5d6480]">tecnología de punta</strong> y cuenta con un equipo de
              expertos dedicados a brindarte la mejor atención posible. Creemos en la{" "}
              <strong className="font-bold text-[#5d6480]">transparencia brutal</strong> y nos comunicamos contigo de
              manera directa y honesta, asegurando que sepas exactamente qué necesita tu auto y por qué.
            </p>

            {/* TODO: confirmar con diseño: "TECNICO" sin tilde. El texto va en
                minúscula porque el botón lo pasa a mayúsculas. */}
            <ButtonComponent
              href={ROUTES.contact}
              variant="primary"
              icon={arrowCircle}
              className="reveal mt-16 self-center xl:mt-10 xl:self-start"
            >
              Solicitar servicio tecnico
            </ButtonComponent>
          </div>
        </div>
      </div>
    </section>
  );
}
