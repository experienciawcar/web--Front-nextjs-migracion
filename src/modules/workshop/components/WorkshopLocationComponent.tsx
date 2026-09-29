import Image from "next/image";

import clockIcon from "@/modules/shared/assets/icons/clock-orange.svg";
import pinIcon from "@/modules/shared/assets/icons/pin-orange.svg";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";

import { getWorkshopMapUrl, WORKSHOP_LOCATION } from "../constants/workshop-location";

/**
 * Sección "¿Dónde nos ubicamos?": el bloque blanco bajo el panel oscuro de
 * "Servicios adicionales", a la derecha de la columna naranja, con la dirección,
 * el horario y el mapa.
 *
 * Fuente: parte inferior de la captura 4 (`docs/planes/taller/4-adicionales-y-ubicacion.png`,
 * x de captura = 0,640 × X). Sin Figma ni diseño mobile. Medidas (px de diseño,
 * ±1,5), con y=0 en el borde superior de esta sección (y=2590 de la página, donde
 * acaba el panel oscuro), que mide 497: la columna naranja de la sección anterior
 * acaba en y=1100 de la página, o sea aquí en 497 (Figma; la captura daba 499), y el mapa acaba ahí mismo:
 * - Contenido desde x=559: eyebrow (`SectionEyebrowComponent`, 10 px hasta el
 *   texto) con la raya en y=64 (Figma; la captura daba 66), título de 36/44 (369 de ancho), párrafo de 16/24
 *   con las líneas base en 224 y 247 y, debajo, los dos datos.
 * - Párrafo: dos renglones con un salto en "Orci," a mano (solo en desktop): hay
 *   sitio de sobra (la columna admite 636) para que "dictumst" cupiera en el primero.
 * - Datos (16 px): pin naranja en x=562, dirección en x=592 (4 px de separación
 *   con el pin, que es estrecho; 8 con el reloj); reloj en x=933 y horario en x=969. Los iconos son los de las sedes (`pin-orange`, `clock-orange`,
 *   copiados a `shared/assets/icons`), a 29 px: en la captura el pin mide 17 x 23
 *   y el reloj 23 x 23, o sea 1,2 y 1,25 veces los 24 px del original.
 * - Mapa: 656 x 146 (Figma; la captura daba 659) en (559,353), esquinas de 8. Un `<iframe>` de Google Maps con
 *   la dirección, sin API key (ver `getWorkshopMapUrl`).
 * - Adorno arriba a la derecha (Figma; entre paréntesis lo que dio la captura):
 *   rayado gris al 50 % de 305 x 100 en (1036,78) [(1038,81) y 302], un
 *   rectángulo `label-yellow` de 126 x 53 en (1215,125) [(1217,128), 125 x 52] y,
 *   pegado a él, el cuadrado negro de 100 x 100 en x=1341 [1342] que sangra a la
 *   ventana.
 *
 * Mobile: no hay diseño. Se adaptó (guía §4.3): una columna, sin adornos, con los
 * dos datos apilados y el mapa a todo el ancho.
 *
 * Textos tal cual del diseño (con `TODO: confirmar con diseño`): "Donde" sin
 * tilde, "Sabado" sin tilde y el párrafo, que es lorem ipsum de relleno (con
 * "craspor ttitore  ismod": la captura trae un espacio doble).
 */
export default function WorkshopLocationComponent() {
  const { address, hours } = WORKSHOP_LOCATION;

  return (
    <section aria-labelledby="ubicacion-title" className="relative overflow-x-clip xl:h-[497px]">
      <div className="relative mx-auto xl:h-[497px] xl:max-w-[1440px]">
        {/* ---------- Adorno de desktop ---------- */}
        <DiagonalLinesComponent
          variant="gray"
          className="absolute top-[78px] left-[1036px] hidden h-[100px] w-[305px] opacity-50 xl:block"
        />
        <div aria-hidden className="absolute top-[125px] left-[1215px] hidden h-[53px] w-[126px] bg-label-yellow xl:block" />
        <div
          aria-hidden
          className="absolute top-[78px] left-[1341px] hidden h-[100px] bg-dark-gray xl:right-[calc(50%-50vw)] xl:block"
        />

        {/* ---------- Contenido ---------- */}
        <div className="container-wcar pt-16 pb-16 xl:pt-[64px] xl:pb-0">
          <div className="xl:ml-[435px]">
            <SectionEyebrowComponent className="reveal xl:gap-2.5!">Taller wcar</SectionEyebrowComponent>

            {/* TODO: confirmar con diseño: "Donde" sin tilde. */}
            <h2 id="ubicacion-title" className="reveal mt-[11px] text-subheadline-1 font-bold text-dark-gray">
              ¿Donde nos ubicamos?
            </h2>

            {/* TODO: confirmar con diseño: es lorem ipsum de relleno. */}
            <p className="reveal mt-[50px] text-body font-medium text-gray-dark">
              Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci,{" "}
              <br className="hidden xl:inline" />
              dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore ismod nulla.
            </p>

            <div className="reveal mt-8 flex flex-col gap-4 text-body font-medium text-gray-dark xl:mt-[29px] xl:flex-row xl:items-center xl:gap-[93px]">
              <p className="flex items-center gap-2 xl:-ml-0.5 xl:gap-1">
                <Image src={pinIcon} alt="" aria-hidden className="size-[29px] shrink-0" />
                {address}
              </p>
              {/* TODO: confirmar con diseño: "Sabado" sin tilde. */}
              <p className="flex items-center gap-2">
                <Image src={clockIcon} alt="" aria-hidden className="size-[29px] shrink-0" />
                {hours}
              </p>
            </div>

            <iframe
              title="Mapa: ubicación del taller de WCAR"
              src={getWorkshopMapUrl(WORKSHOP_LOCATION)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="reveal mt-8 h-[240px] w-full rounded-lg border-0 xl:mt-[40px] xl:h-[146px] xl:w-[656px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
