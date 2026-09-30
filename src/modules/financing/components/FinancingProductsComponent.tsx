import ZigZagComponent from "@/modules/shared/components/ZigZagComponent";

import { FINANCING_PRODUCTS } from "../constants/products";

import FinancingProductCardComponent from "./FinancingProductCardComponent";

/**
 * Sección "Financia tu Vehículo": el título con su subtítulo y las dos tarjetas
 * de producto (Credirápido y Credifácil), sobre el panel gris claro.
 *
 * Fuente: Figma "Wcar Website - 2026", nodo 193:8183. Medidas en px del lienzo de
 * 1440, con y=0 en el borde superior de la sección (y=2695 de la página, donde
 * acaban el panel naranja y el oscuro de "Cambia tu vehículo"):
 * - Panel `gray-light` ("Rectangle black" 195:10908, 1311 x 905 en (128,2571)): x=128
 *   hasta la ventana y hasta y=3476, o sea la sección mide 781; por arriba sigue
 *   126 px por detrás de los paneles de la sección anterior (no se ve). Pinta por
 *   ENCIMA de la barra negra de la garantía (que baja hasta y=2898 y aquí solo
 *   asoma a la izquierda, x<128): por eso la sección es `z-20`.
 * - Título (marco 204:5617, x=235, y=63): raya naranja de 77 x 4, 16 debajo el título
 *   de 36/44 ("Vehículo" en `orange` cursiva regular) y, pegado, el subtítulo de
 *   18/44 Medium `gray-dark` en una caja de 882, con el doble espacio y el "Con" en
 *   mayúscula del diseño ("…o sustitución  de piezas de tu vehículo Con nuestra
 *   garantía"; es copia del sitio anterior).
 * - Tarjetas de 482 x 489 en (228,203) y (737,203): ver `FinancingProductCardComponent`.
 * - Adorno de arriba a la derecha: rayado gris de 229 x 124 en (1087,43) (tile de 13
 *   mostrado a 17 px, al 50 %; es un gris más oscuro que el compartido:
 *   `rayado-gris.png`) y, pegado a su derecha, un cuadrado `dark-gray` de 124 x 124
 *   que sangra a la ventana.
 * - Zigzag (`ZigZagComponent`, 36 x 112) abajo a la derecha, en x=1315 y y=579 (la
 *   `y` de Figma, 3387, es la del borde inferior), **girado 180°**: en el diseño
 *   las puntas miran a la derecha y la línea negra arranca por arriba, al revés que
 *   en el zigzag de Taller (medido: espejado solo daba 886 px de diferencia entre
 *   máscaras, girado 246).
 *
 * Teléfono (< 1280, "financiación - 394", gris de y=4144 a 5376): sin adornos. Título
 * centrado en una caja de 277 (64 de aire arriba; raya de 77, título de 36/44 en dos
 * renglones y el subtítulo de 14/17 en `gray`), y 63 debajo las dos tarjetas de 367
 * (13 de margen), separadas por 67 y con 76 de cierre.
 *
 * TODO: el subtítulo es una copia sin retocar del de "Garantía" del sitio anterior
 * (erratas incluidas): confirmar con diseño el texto.
 */
export default function FinancingProductsComponent() {
  return (
    <section aria-labelledby="productos-title" className="relative z-20 overflow-x-clip xl:h-[781px]">
      <div className="relative mx-auto xl:h-full xl:max-w-[1440px]">
        {/* Panel gris: en desktop arranca en x=128 y sangra a la derecha. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gray-light xl:right-[calc(50%-50vw)] xl:left-[128px]"
        />

        {/* ---------- Adornos de desktop ---------- */}
        <div
          aria-hidden
          className="absolute top-[43px] left-[1087px] hidden h-[124px] w-[229px] bg-[url('/assets/financiacion/productos/rayado-gris.png')] bg-size-[17px_17px] opacity-50 xl:block"
        />
        <div
          aria-hidden
          className="absolute top-[43px] left-[1316px] hidden h-[124px] bg-dark-gray xl:right-[calc(50%-50vw)] xl:block"
        />
        {/* ZigZagComponent trae `relative` propio: va dentro de un `absolute`. */}
        <div className="absolute top-[579px] left-[1315px] hidden w-9 rotate-180 xl:block">
          <ZigZagComponent />
        </div>

        {/* ---------- Título ---------- */}
        <div className="relative mx-auto max-w-[277px] pt-16 text-center xl:absolute xl:top-[63px] xl:left-[235px] xl:mx-0 xl:max-w-none xl:p-0 xl:text-left">
          <span aria-hidden className="mx-auto block h-1 w-[77px] bg-orange xl:mx-0" />
          <h2
            id="productos-title"
            className="mt-4 text-subheadline-1 leading-11 font-bold text-dark-gray"
          >
            Financia tu <span className="font-normal text-orange italic">Vehículo</span>
          </h2>
          <p className="mt-4 text-[14px] leading-[17px] font-medium whitespace-pre-wrap text-gray xl:mt-0 xl:w-[882px] xl:text-[18px] xl:leading-11 xl:text-gray-dark">
            Financia tu garantía y cubre la reparación o sustitución{"  "}de piezas de tu vehículo Con nuestra garantía
          </p>
        </div>

        {/* ---------- Tarjetas ---------- */}
        <div className="relative flex flex-col items-center gap-[67px] px-[13px] pt-[63px] pb-[76px] xl:contents">
          <div className="w-full max-w-[482px] xl:absolute xl:top-[203px] xl:left-[228px] xl:max-w-none xl:w-[482px]">
            <FinancingProductCardComponent product={FINANCING_PRODUCTS[0]} />
          </div>
          <div className="w-full max-w-[482px] xl:absolute xl:top-[203px] xl:left-[737px] xl:max-w-none xl:w-[482px]">
            <FinancingProductCardComponent product={FINANCING_PRODUCTS[1]} />
          </div>
        </div>
      </div>
    </section>
  );
}
