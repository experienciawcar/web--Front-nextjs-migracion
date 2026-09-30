import Image from "next/image";

import isotipoWcar from "@/modules/shared/assets/icons/isotipo-wcar.svg";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";

/**
 * TODO: el párrafo del fundador sigue siendo lorem ipsum en Figma, no es copy
 * real. Además trae una "м" cirílica colada en "Potentiмnibh". Se reproduce
 * tal cual para no inventar contenido, pero hay que reemplazarlo.
 *
 * El salto de línea antes de "Elit" es un salto duro del diseño: ahí cabía la
 * palabra, así que no es un corte natural. El MCP de Figma lo devuelve como un
 * espacio, se detectó comparando los cortes de línea contra el render.
 */
const BIOGRAFIA = `Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla.
Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.`;

/** Cargo + nombre, iguales en los dos breakpoints salvo por la alineación. */
function Identidad({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <Image src={isotipoWcar} alt="" aria-hidden className="h-[26.63px] w-6" />
        {/* Separador: gris 200 al 30%. */}
        <span aria-hidden className="h-8 w-[2px] bg-gray/30" />
        <span className="text-small font-bold whitespace-nowrap text-gray-dark">
          Ceo de la empresa
        </span>
      </div>

      <p className="mt-6 text-subheadline-1 xl:mt-8">
        <span className="block font-bold text-dark-gray">Walther Carvajal</span>
        <span className="block italic text-orange">Fundador de wcar</span>
      </p>
    </div>
  );
}

/**
 * La foto con su banda inferior: rayas diagonales grises al 50% cruzando el
 * ancho y un cuadrado naranja pegado al borde derecho. La banda mide 124px en
 * desktop y 71px en mobile.
 */
function FotoFundador() {
  return (
    <div className="reveal reveal-left relative aspect-[568/593] w-full shrink-0 xl:h-[593px] xl:w-[568px]">
      <Image
        src="/assets/about-us/fundador/walther.jpg"
        alt="Walther Carvajal, fundador de WCAR"
        fill
        sizes="(min-width: 1280px) 568px, 100vw"
        className="object-cover"
      />
      <DiagonalLinesComponent
        variant="gray"
        className="absolute inset-x-0 bottom-0 h-[71px] opacity-50 xl:h-[124px]"
      />
      <span
        aria-hidden
        className="absolute right-0 bottom-0 size-[71px] bg-orange xl:size-[124px]"
      />
    </div>
  );
}

/**
 * Sección del fundador.
 *
 * Desktop (nodos 26:7665, 27:7670 y siguientes): la foto se monta sobre el
 * panel gris, que arranca 124px más abajo y sangra hasta el borde derecho de
 * la pantalla. El texto va a la derecha, y quedan dos adornos sueltos: el
 * zigzag arriba y un cuadro de rayas en la esquina inferior derecha.
 *
 * Esta es la última sección que cruza la barra negra lateral: la barra termina
 * en y=3023, o sea a 469px del inicio de esta sección, no al final.
 *
 * Mobile: todo en una columna sobre un panel gris a ancho completo, con el
 * cargo y el nombre centrados y el zigzag abajo a la derecha.
 */
export default function FounderComponent() {
  return (
    <section aria-label="Walther Carvajal, fundador de WCAR" className="relative">
      <div className="container-wcar relative">
        {/* Panel gris. En mobile ocupa todo el ancho; en desktop arranca en el
            margen del contenedor y sangra hasta el borde derecho.
            `right-[calc(50%-50vw)]` es justo la distancia del centro del
            contenedor al borde de la ventana. */}
        <div
          aria-hidden
          className="absolute inset-y-0 right-[calc(50%-50vw)] left-[calc(50%-50vw)] bg-gray-light xl:top-[124px] xl:left-8"
        />

        <div className="relative flex flex-col pt-[35px] pb-0 xl:flex-row xl:pt-0">
          <FotoFundador />

          <Identidad className="reveal mt-6 text-center xl:mt-0 xl:ml-[99px] xl:pt-[171px] xl:text-left" />

          {/* El bloque de identidad y el párrafo van separados porque en
              desktop comparten columna y en mobile no: el párrafo va alineado
              a la izquierda aunque el nombre esté centrado. */}
          <p className="reveal mt-12 whitespace-pre-wrap text-body font-medium text-gray-dark xl:absolute xl:top-[355px] xl:left-[667px] xl:mt-0 xl:w-[431px]">
            {BIOGRAFIA}
          </p>

          {/* Adornos. En desktop van a la derecha del panel; en mobile solo el
              zigzag, abajo a la derecha. */}
          {/* x=1304 en el diseño, o sea 1180 desde el margen del contenedor. */}
          <ZigZagComponent className="mt-4 self-end xl:absolute xl:top-[185px] xl:left-[1180px] xl:mt-0" />
          <DiagonalLinesComponent
            variant="gray"
            className="hidden xl:absolute xl:top-[469px] xl:left-[1192px] xl:block xl:size-[124px]"
          />
        </div>
      </div>
    </section>
  );
}
