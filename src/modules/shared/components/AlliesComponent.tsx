import Image from "next/image";

import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";

import { getAllies } from "../services/allies";

/** Logos por fila, en desktop y en mobile. */
const COLUMNAS = 4;

/**
 * Dónde arranca la fila incompleta del final para que quede centrada. La
 * cuadrícula tiene el doble de columnas (8) y cada logo ocupa 2: así una fila
 * con 1, 2 o 3 logos se puede centrar empezando en la columna 4, 3 o 2, cosa
 * que con 4 columnas de un solo hueco no se puede (medio logo no existe).
 */
const INICIO_FILA_INCOMPLETA: Record<number, string> = {
  1: "col-start-4",
  2: "col-start-3",
  3: "col-start-2",
};

/**
 * Sección "Nuestros Aliados": una tabla con los logos de las empresas aliadas
 * (GET /api/partners/), en el orden que entrega el backend.
 *
 * Compartida entre Sobre Nosotros y el Inicio: los dos diseños repiten el
 * mismo título y la misma idea (tabla de logos); el de Inicio varía el alto de
 * cada fila según el logo (671:14244 y siguientes), que aquí no se reproduce
 * fila por fila porque los datos son los mismos 26 aliados en los dos sitios.
 * Si algún día los dos diseños divergen de verdad, hay que volver a separarlos.
 *

 * El diseño de desktop tiene las filas armadas a mano, con cada logo a su
 * tamaño; con datos del backend no se puede. Aquí es una cuadrícula de 4
 * columnas iguales, con una línea entre filas, y cada logo en una caja
 * cuadrada (108px en desktop y 64px en mobile) porque el backend los entrega
 * como PNG de 150x150 con el logo centrado. `object-contain` los deja a su
 * proporción. Los anchos se acercan al diseño (los logos de 150px de ancho
 * quedan a 108px, los altos como el de Banco de Bogotá, más chicos), pero
 * ninguno se ve tan grande como el Google del mockup (177px): la fuente no da
 * para eso sin pixelarse.
 *
 * El mockup de desktop todavía muestra aliados que el backend no tiene
 * (Allianz, Davivienda) y le faltan otros que sí (Endeavor, Chevyplan, Liberty,
 * Corferias); el de mobile sí coincide con los 26 del backend. Manda el
 * backend.
 * TODO: confirmar con diseño.
 *
 * Adornos, solo en desktop: unas rayas grises que arrancan en x=633 y llegan
 * al borde de la ventana por detrás de la tabla, y el zigzag a la derecha. En
 * mobile queda una franja de rayas asomando por encima de la tabla. Van en un
 * lienzo de 1440 centrado y los fondos sangran hasta el borde (ver la página).
 *
 * El diseño tiene el texto "Conoce las empresas que han confiado en nosotros"
 * debajo de la raya, como antetítulo, en desktop, y debajo del título, como
 * subtítulo, en mobile. Es un solo párrafo que `order` mueve de sitio.
 *
 * Medidas sacadas de capturas del diseño, sin acceso a Figma.
 *
 * Si no hay aliados, la sección no se pinta.
 */
export default async function AlliesComponent() {
  const allies = await getAllies();

  if (allies.length === 0) return null;

  const enFilaIncompleta = allies.length % COLUMNAS;
  // La última fila (completa o no) no lleva línea abajo: ya la cierra el borde de la tabla.
  const primeraDeUltimaFila = allies.length - (enFilaIncompleta || COLUMNAS);

  return (
    <section aria-labelledby="allies-title" className="relative overflow-x-clip">
      <div className="relative mx-auto xl:max-w-[1440px]">
        <DiagonalLinesComponent
          variant="gray"
          className="pointer-events-none absolute top-0 right-[calc(50%-50vw)] left-[633px] hidden h-[721px] opacity-50 xl:block"
        />
        <ZigZagComponent className="hidden xl:absolute xl:top-[538px] xl:left-[1358px] xl:block" />

        <div className="container-wcar relative py-16 xl:pt-[13px] xl:pb-[120px]">
          <div className="reveal flex flex-col items-center text-center xl:items-start xl:text-left">
            <span aria-hidden className="order-1 h-[4px] w-[77px] bg-orange xl:w-[115px]" />
            <h2
              id="allies-title"
              className="order-2 mt-6 text-subheadline-1 font-bold text-dark-gray xl:order-3 xl:mt-3"
            >
              Nuestros Aliados
            </h2>
            <p className="order-3 mt-3 text-body font-medium text-gray xl:order-2 xl:mt-4 xl:text-small xl:font-bold xl:whitespace-nowrap">
              Conoce las empresas que han confiado en nosotros
            </p>
          </div>

          {/* En mobile las rayas asoman 35px por encima de la tabla y 16px por
              los lados; la tabla, con fondo blanco, tapa el resto. */}
          <div className="reveal relative mt-[88px] xl:mt-[54px]">
            <DiagonalLinesComponent
              variant="gray"
              className="pointer-events-none absolute -inset-x-4 -top-[35px] h-[58px] opacity-50 xl:hidden"
            />

            <ul className="relative grid grid-cols-8 border border-gray/30 bg-white">
              {allies.map((ally, index) => (
                <li
                  key={ally.id}
                  className={`col-span-2 flex h-[76px] items-center justify-center xl:h-[112px] ${
                    index < primeraDeUltimaFila ? "border-b border-gray/30" : ""
                  } ${
                    enFilaIncompleta > 0 && index === primeraDeUltimaFila
                      ? INICIO_FILA_INCOMPLETA[enFilaIncompleta]
                      : ""
                  }`}
                >
                  {/* 108px y no 112: la celda mide 112 con su línea de 1px abajo, y
                      varios logos traen el borde inferior en blanco opaco, que con
                      112px tapaba la línea entre filas. */}
                  <Image
                    src={ally.logoUrl}
                    alt={ally.name}
                    width={108}
                    height={108}
                    sizes="(min-width: 1280px) 108px, 64px"
                    className="size-16 object-contain xl:size-[108px]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
