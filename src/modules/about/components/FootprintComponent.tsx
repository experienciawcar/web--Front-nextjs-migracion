import Image from "next/image";

import iconLike from "@/modules/shared/assets/icons/like.svg";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";

import logoWcarPanel from "../assets/huella/logo-wcar-panel.svg";

const RUTA_FOTOS = "/assets/about-us/huella";

/** `sizes` de las fotos según cuántas columnas ocupan en desktop (286px cada una). */
const SIZES_UNA_COLUMNA = "(min-width: 1280px) 286px, 50vw";
const SIZES_DOS_COLUMNAS = "(min-width: 1280px) 588px, 100vw";

/**
 * Las fotos, con su lugar en la cuadrícula.
 *
 * Desktop: cuadrícula de 4 columnas de 286px y 5 filas de 187px, con 16px en
 * medio (1192px en total, el ancho del contenedor). La columna 1 es el panel
 * naranja; las fotos se reparten el resto.
 *
 * Mobile: el diseño no trae esta vista, así que se armó con el criterio del
 * resto de la página: dos columnas, con las fotos anchas y la grupal a todo el
 * ancho y las demás por parejas. `order` fija el orden de mobile; en desktop
 * mandan las posiciones de la cuadrícula.
 *
 * `opacidad` es la del degradado negro de la parte de abajo de cada foto, tal
 * cual la tenía Figma: 1 en la mayoría y 0.8 en la sala, la tienda y el foro.
 */
const FOTOS = [
  {
    id: "showroom",
    file: "showroom-vehiculos",
    alt: "Vitrina de vehículos usados en una de las sedes de WCAR",
    sizes: SIZES_UNA_COLUMNA,
    opacidad: 1,
    className: "order-1 aspect-[3/2] xl:col-start-2 xl:row-start-1",
  },
  {
    id: "fachada-calle",
    file: "fachada-sede-calle",
    alt: "Fachada de una sede de WCAR sobre la calle",
    sizes: SIZES_UNA_COLUMNA,
    opacidad: 1,
    className: "order-2 aspect-[3/2] xl:col-start-3 xl:row-start-1",
  },
  {
    id: "entrega",
    file: "entrega-vehiculo-familia",
    alt: "Una familia recibe su vehículo, cubierto con la tela naranja de WCAR",
    sizes: SIZES_UNA_COLUMNA,
    opacidad: 1,
    className: "order-6 aspect-[3/2] xl:col-start-4 xl:row-start-1",
  },
  {
    id: "lounge",
    file: "sala-espera-lounge",
    alt: "Sala de espera de WCAR con sofás y una mesa de centro",
    sizes: SIZES_UNA_COLUMNA,
    opacidad: 0.8,
    className: "order-4 aspect-[3/4] xl:col-start-2 xl:row-span-2 xl:row-start-2",
  },
  {
    id: "fachada-pits",
    file: "fachada-wcar-pits",
    alt: "Fachada de la sede con los letreros de WCAR y WCAR Pits",
    sizes: SIZES_DOS_COLUMNAS,
    opacidad: 1,
    className:
      "order-3 col-span-2 aspect-[592/187] xl:col-span-2 xl:col-start-3 xl:row-start-2",
  },
  {
    id: "evento",
    file: "evento-foro-industria",
    alt: "Un conferencista habla ante el público en un foro de la industria automotriz",
    sizes: SIZES_UNA_COLUMNA,
    opacidad: 0.8,
    className: "order-7 aspect-[3/2] xl:col-start-3 xl:row-start-3",
  },
  {
    id: "equipo",
    file: "equipo-wcar-grupal",
    alt: "El equipo de WCAR reunido, con sus chaquetas naranjas",
    sizes: SIZES_DOS_COLUMNAS,
    opacidad: 1,
    className:
      "order-9 col-span-2 aspect-[580/391] xl:col-span-2 xl:col-start-2 xl:row-span-2 xl:row-start-4",
  },
  {
    id: "tienda",
    file: "tienda-merchandising",
    alt: "Vitrina de la tienda de WCAR con chaquetas, gorras y ropa de la marca",
    sizes: SIZES_UNA_COLUMNA,
    opacidad: 0.8,
    className: "order-5 aspect-[3/4] xl:col-start-4 xl:row-span-2 xl:row-start-4",
  },
];

/**
 * Panel naranja de la columna 1 (la "franja"): el logo, el lema y, al pie, la
 * foto del Renault 4.
 *
 * El diseño lo exporta como un solo SVG de 1 MB con todo dentro. Aquí va
 * repartido: el fondo (naranja `#FF8000`, la foto espejada y el degradado que
 * la funde con el naranja) es `franja-marca-renault-4.webp`; el logo es un SVG
 * propio (isotipo blanco y "wcar" negro: no es el del hero, que lleva el
 * isotipo naranja); y el lema es texto de verdad, de 32px con 38px de
 * interlineado, que es lo que miden sus curvas en el diseño.
 *
 * Desktop: la imagen llena todo el panel (284x1002 en el diseño, 286x999 en la
 * cuadrícula: `object-cover` absorbe la diferencia) y el logo y el lema van
 * encima, a 57px del borde de arriba.
 *
 * Mobile: el diseño no trae esta vista. El panel queda en dos bloques, el
 * logo y el lema arriba y la foto debajo, alta como para que el auto entre
 * entero, y con el borde de arriba difuminado para no dejar una costura contra
 * el naranja plano.
 *
 * "Mas" va sin tilde en Figma.
 * TODO: confirmar con diseño, parece un error de ortografía.
 */
function PanelMarca() {
  return (
    <div className="relative order-0 col-span-2 flex flex-col overflow-hidden bg-[#ff8000] xl:col-span-1 xl:col-start-1 xl:row-span-5 xl:row-start-1">
      <div className="relative z-10 flex flex-col items-center px-6 pt-[57px]">
        <Image src={logoWcarPanel} alt="WCAR" className="h-12 w-auto" />
        <p className="mt-9 text-center text-[32px] leading-[38px] font-bold text-white">
          <span className="block">Mas que solo</span>
          <span className="block">una marca</span>
        </p>
      </div>

      <div className="relative mt-4 h-[600px] w-full [mask-image:linear-gradient(to_bottom,transparent,black_60px)] xl:absolute xl:inset-0 xl:mt-0 xl:h-auto xl:[mask-image:none]">
        <Image
          src={`${RUTA_FOTOS}/franja-marca-renault-4.webp`}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1280px) 286px, 100vw"
          className="object-cover object-bottom"
        />
      </div>
    </div>
  );
}

/**
 * "Haciendo rodar a toda colombia": corazón, título en dos tonos y párrafo.
 *
 * "automotris" y "Mas" van así en Figma.
 * TODO: confirmar con diseño, parecen errores de ortografía.
 */
function TextoColombia() {
  return (
    <div className="order-8 col-span-2 flex items-center py-4 xl:col-span-1 xl:col-start-4 xl:row-start-3 xl:py-0 xl:pl-2">
      <div className="flex items-start gap-3">
        {/* El corazón mide 26,67x23,73: con `size-8` se estiraba a cuadrado. */}
        <Image src={iconLike} alt="" aria-hidden className="mt-[3px] h-auto w-[26.67px] shrink-0" />
        <div>
          <h3 className="text-heading-1 font-bold text-dark-gray">
            <span className="block">Haciendo rodar a</span>
            <span className="block text-orange italic">toda colombia</span>
          </h3>
          {/* 194px porque con ese ancho el párrafo parte donde el diseño
              ("...convertirnos" / "...LATAM" / "de la industria..."): el
              renglón más largo mide 186px y el que más cerca queda de colarse
              una palabra más, 201px. */}
          <p className="mt-2 max-w-[194px] text-body font-medium text-gray-1">
            Mas cerca de convertirnos en el referente en LATAM de la industria automotris
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Sección "Nuestra huella": el panel de marca y un mosaico de fotos de las
 * sedes, el equipo y los eventos.
 *
 * Desktop: la barra negra lateral y el panel naranja se montan, con la barra
 * por debajo (el panel cubre su borde derecho: la barra llega a x=303 y el
 * panel arranca en x=124). La barra mide 303x1136, arranca 20px debajo del
 * inicio de la sección y termina 130px antes del final del panel. Arriba a la
 * derecha van unas rayas grises y un cuadrado negro que sangra hasta el borde
 * de la ventana. Todo va en un lienzo de 1440 centrado y los fondos sangran
 * hasta el borde (ver la página).
 *
 * TODO: faltan las formas naranjas de contorno de arriba a la derecha (dos
 * paralelogramos que pisan las rayas). Van en SVG: cuando llegue, va en
 * `../assets/huella/` y se coloca hacia x=1187..1396, y=150..287 del lienzo.
 *
 * El antetítulo es el lorem de siempre.
 * TODO: falta el copy real.
 *
 * Medidas sacadas de una captura del diseño, sin acceso a Figma.
 */
export default function FootprintComponent() {
  return (
    <section aria-labelledby="footprint-title" className="relative overflow-x-clip">
      <div className="relative mx-auto xl:max-w-[1440px]">
        <div
          aria-hidden
          className="absolute top-5 hidden h-[1136px] bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(303px+50vw-50%)]"
        >
          <DiagonalLinesComponent className="absolute top-0 left-0 h-[62px] w-[185px]" />
        </div>
        <DiagonalLinesComponent
          variant="gray"
          className="absolute top-[109px] left-[834px] hidden h-[102px] w-[501px] opacity-50 xl:block"
        />
        <span
          aria-hidden
          className="absolute top-[109px] hidden h-[102px] bg-dark-gray xl:right-[calc(50%-50vw)] xl:left-[1335px] xl:block"
        />

        <div className="container-wcar relative py-16 xl:pt-[107px] xl:pb-[43px]">
          {/* El encabezado arranca en la columna 2 (302px = una columna más su
              separación), a plomo con la primera foto. */}
          <div className="flex flex-col gap-6 xl:ml-[302px] xl:gap-3">
            <SectionEyebrowComponent>Nibh quisque suscipit fermentum</SectionEyebrowComponent>
            <h2 id="footprint-title" className="text-subheadline-1 font-bold text-dark-gray">
              Nuestra huella
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 xl:mt-[82px] xl:auto-rows-[187px] xl:grid-cols-4 xl:gap-4">
            <PanelMarca />

            {FOTOS.map((foto) => (
              <div
                key={foto.id}
                className={`relative overflow-hidden xl:order-none xl:aspect-auto ${foto.className}`}
              >
                <Image
                  src={`${RUTA_FOTOS}/${foto.file}.webp`}
                  alt={foto.alt}
                  fill
                  sizes={foto.sizes}
                  className="object-cover"
                />
                {/* Degradado negro de la parte de abajo: es una capa del diseño
                    y no va horneada en la foto. Mide el 23,4% del alto en todas
                    (44px de 188, 91,5px de 391). */}
                <span
                  aria-hidden
                  style={{ opacity: foto.opacidad }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[23.4%] bg-linear-to-t from-black to-transparent"
                />
              </div>
            ))}

            <TextoColombia />
          </div>
        </div>
      </div>
    </section>
  );
}
