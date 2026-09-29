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
 * caja, el Figma (nodo 188:8089, grupo 190:3229). Sin diseño mobile. Medidas (px
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
 * Mobile: no hay diseño. Se adaptó con el criterio de la guía §4.3: una columna,
 * el texto primero y la foto debajo, sobre blanco a todo el ancho.
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
    <section aria-labelledby="que-hace-title" className="relative z-20 bg-white xl:-mt-[157px] xl:bg-transparent">
      <div className="container-wcar">
        <div className="flex flex-col gap-10 py-12 xl:h-[423px] xl:flex-row xl:gap-[87px] xl:bg-white xl:py-0">
          {/* Foto. En mobile va después del texto. */}
          <div className="reveal reveal-left relative order-2 aspect-[4/3] w-full overflow-hidden xl:order-1 xl:aspect-auto xl:h-[423px] xl:w-[554px] xl:shrink-0">
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

          <div className="order-1 flex flex-col xl:order-2 xl:w-[480px] xl:pt-14">
            <span aria-hidden className="reveal block h-1 w-[115px] bg-orange" />

            {/* TODO: confirmar con diseño: "¿Que" sin tilde y el espacio antes
                del "?". */}
            <h2
              id="que-hace-title"
              className="reveal mt-[30px] text-heading-1 font-bold text-dark-gray opacity-90"
            >
              ¿Que hace <span className="font-medium italic">wcar taller ?</span>
            </h2>

            <p className="reveal mt-[30px] text-body font-medium text-gray-dark">
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
              className="reveal mt-10 self-start"
            >
              Solicitar servicio tecnico
            </ButtonComponent>
          </div>
        </div>
      </div>
    </section>
  );
}
