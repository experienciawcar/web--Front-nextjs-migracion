import Image from "next/image";

import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import AppLinkComponent from "@/modules/shared/components/AppLinkComponent";

import { INTRO_FEATURES, INTRO_FEATURES_HREF } from "../constants/intro-features";

/** Sin barra de scroll: se desliza con el dedo. */
const SIN_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

/**
 * Las tres tarjetas bajo la tarjeta de búsqueda del hero: título partido (con
 * la segunda mitad en cursiva naranja), una descripción y un enlace "Ver
 * vehículos →" en naranja. Sin ícono: a diferencia de `FeatureCardComponent`,
 * el diseño de estas no trae uno.
 *
 * Desktop (Figma Home 2.0, "Frame 641"): tres tarjetas de 382 de ancho con 25 en
 * medio, 200 de alto, fondo blanco con borde/sombra sutil.
 *
 * Mobile y tablet, hasta `xl` (Figma "mobile 398", "Frame 645", nodos
 * 701:55771 y siguientes): un carrusel horizontal con `scroll-snap` de tarjetas de
 * 243 x 146 con 24 en medio, donde la siguiente asoma por la derecha (sin flechas
 * ni rayas: el diseño no las trae). La primera arranca a 16 del borde de la
 * ventana y la fila sangra hasta el otro borde. Por dentro: título de 16/30
 * (26 de margen izquierdo, 17 de arriba), descripción de 12/16 en 180 de ancho a
 * 6 del título y, abajo a la derecha, "Ver vehículos" en 12 bold con el ícono de
 * 23 px (a 24 del borde derecho, 12 de aire entre el texto y el ícono). Sin borde y con la sombra `0 7 14` al 40 %. A
 * partir de ~800 px caben las tres tarjetas enteras y entonces quedan CENTRADAS:
 * margen automático a la izquierda de la primera y a la derecha de la última
 * (`first:ml-auto last:mr-auto`), que reparte el espacio que sobra y vale 0 cuando
 * no sobra (mobile), así el carrusel sigue empezando en la primera tarjeta; con
 * `justify-center` la primera quedaría fuera de alcance al desbordar. El relleno de abajo (24) y el
 * de arriba (8) son para que el `overflow` del carrusel no recorte la sombra; se
 * compensan con márgenes negativos. Sin `gap` entre el bloque de texto y el enlace
 * en mobile: si la descripción ocupa tres renglones (la de en medio) el enlace
 * sube a y=100 como en Figma, no se corre hacia abajo.
 *
 * COPY: la tercera tarjeta dice "Peritaje gratis online" en el diseño mobile y
 * "Peritaje gratis disponible online" en el de desktop; con "disponible" el título
 * se parte en dos renglones y no cabe en 146 de alto (`titleItalicDesktopOnly`).
 * TODO: confirmar con diseño cuál es el correcto.
 */
export default function IntroFeaturesComponent() {
  return (
    <ul
      className={`reveal -mx-8 -mt-2 -mb-6 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-4 px-4 pt-2 pb-6 xl:mx-0 xl:mt-0 xl:mb-0 xl:grid xl:snap-none xl:grid-cols-3 xl:gap-[25px] xl:overflow-visible xl:p-0 ${SIN_SCROLLBAR}`}
    >
      {INTRO_FEATURES.map((feature) => (
        <li
          key={feature.id}
          className="flex h-[146px] w-[243px] shrink-0 snap-start flex-col first:ml-auto last:mr-auto xl:first:ml-0 xl:last:mr-0 rounded-lg bg-white pt-[17px] pr-6 pb-4 pl-[26px] shadow-[0_7px_14px_rgba(211,218,226,0.4)] xl:h-auto xl:w-auto xl:shrink xl:gap-4 xl:border xl:border-gray/15 xl:p-8 xl:shadow-[0_7px_14px_rgba(211,218,226,0.25)]"
        >
          <div>
            <h3 className="text-[16px] leading-[30px] font-bold text-dark-gray opacity-90 xl:text-heading-1 xl:leading-[30px]">
              {feature.title}
              <span className="font-medium text-orange italic">
                {feature.titleItalicDesktopOnly && (
                  <span className="hidden xl:inline">{feature.titleItalicDesktopOnly}</span>
                )}
                {feature.titleItalic}
              </span>
            </h3>
            <p className="mt-1.5 max-w-[180px] text-[12px] leading-4 font-medium text-gray-dark opacity-80 xl:mt-2 xl:max-w-none xl:text-body xl:leading-6">
              {feature.description}
            </p>
          </div>

          <AppLinkComponent
            href={INTRO_FEATURES_HREF}
            className="mt-auto flex items-center gap-3 self-end text-[12px] leading-[30px] font-bold text-orange xl:gap-2 xl:text-small xl:leading-[22px]"
          >
            Ver vehículos
            <Image src={arrowCircle} alt="" aria-hidden className="size-[23px] xl:size-[18px]" />
          </AppLinkComponent>
        </li>
      ))}
    </ul>
  );
}
