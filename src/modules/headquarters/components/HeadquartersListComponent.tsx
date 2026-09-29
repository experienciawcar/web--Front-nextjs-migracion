import { HEADQUARTERS } from "../constants/headquarters";

import HeadquartersCardComponent from "./HeadquartersCardComponent";
import WarrantyCardComponent from "./WarrantyCardComponent";

/**
 * Segunda sección de Nuestras Sedes: la cuadrícula de tarjetas de sedes (8) más
 * la tarjeta "Garantía 6 meses". El botón VER de cada tarjeta abre el modal de
 * la sede (`HeadquartersModalProvider`, que envuelve toda la página en `page.tsx`).
 *
 * Fuente: captura del desktop 1440 (sin Figma ni diseño mobile), a escala 0.322
 * (una captura pequeña: las medidas tienen ±2px de diseño y el texto se leyó
 * ampliándola). Lo medido:
 * - Fondo `light-gray` desde el pie de la primera sección.
 * - 3 columnas en el contenedor de 1192: tarjetas de 381.33 y 24 de aire, en
 *   filas de 622 con 24 de aire; la primera fila arranca a 34 del borde de
 *   la sección.
 * - Abajo a la derecha: un cuadrado cian de 54 y un bloque amarillo
 *   (`label-yellow`) de 96 de alto que llega desde x=1241 hasta el borde de la
 *   ventana. En el diseño el amarillo tapaba la esquina de la tarjeta de
 *   garantía; se pidió que quede POR DEBAJO: las tarjetas van en `z-10` y las
 *   piezas de color en `z-0`, asomando por detrás de su esquina inferior
 *   derecha. Van ancladas al pie de la sección (no al inicio), así que si una
 *   fila crece siguen pegadas a la última fila.
 * - Abajo hay 80 de aire (`xl:pb-20`) para separar la sección del footer, que
 *   tiene el mismo fondo. Las piezas de color miden ese aire con `5rem`: si se
 *   cambia el padding, cambiarlo también en sus `bottom`.
 * - El arranque de la barra negra que aparecía abajo a la izquierda se quitó
 *   (se pidió eliminarlo).
 *
 * Mobile: no hay diseño. Una columna (dos desde `md`), sin las piezas de
 * color, con el aire de las demás secciones. TODO: pedir el mobile.
 */
export default function HeadquartersListComponent() {
  return (
    <section aria-labelledby="sedes-lista-title" className="relative overflow-x-clip bg-gray-light">
      {/* El lienzo de 1440 centrado; las piezas de color sangran hasta la
          ventana (ver guía §4.2). */}
      <div className="relative mx-auto xl:max-w-[1440px]">
        <h2 id="sedes-lista-title" className="sr-only">
          Nuestras sedes
        </h2>

        <div className="container-wcar pt-12 pb-16 xl:pt-[34px] xl:pb-20">
          <ul className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {HEADQUARTERS.map((headquarters) => (
              <HeadquartersCardComponent key={headquarters.id} headquarters={headquarters} />
            ))}
            <WarrantyCardComponent />
          </ul>
        </div>

        <div
          aria-hidden
          className="absolute bottom-[calc(5rem+71px)] z-0 hidden size-[54px] bg-blue-neon xl:right-[calc(50%-50vw)] xl:block"
        />
        <div
          aria-hidden
          className="absolute bottom-[calc(5rem-28px)] left-[1241px] z-0 hidden h-24 bg-label-yellow xl:right-[calc(50%-50vw)] xl:block"
        />
      </div>
    </section>
  );
}
