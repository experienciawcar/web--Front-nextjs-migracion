import FinancingProductCardComponent from "@/modules/financing/components/FinancingProductCardComponent";
import { FINANCING_PRODUCTS } from "@/modules/financing/constants/products";

/**
 * "Financia tu Vehículo": el título con su subtítulo y las dos tarjetas de producto (Credirápido y
 * Credifácil) sobre un panel gris claro, con la barra oscura de la sección anterior asomando a la
 * izquierda y un rayado turquesa cruzando su borde. Reutiliza las tarjetas de la vista de
 * Financiación (`FinancingProductCardComponent`, mismos textos y medidas de 482 x 489).
 *
 * Figma 89:4207, px del lienzo de 1440 con y=2705 en el borde superior de la sección (754 de
 * alto): panel `gray-light` desde x=125 que sangra a la derecha; raya naranja de 77 x 4 en
 * (294, 60), título de 36/44 debajo y el subtítulo de 18/44 en 882 de ancho; tarjetas en x=287 y
 * x=796, y=200; la barra `dark-gray` de la sección de características sigue por detrás hasta
 * y=634 (se ve solo a la izquierda de x=125); el rayado turquesa de 200 x 200 va en (60, 485),
 * horizontal (líneas de ~3 px cada 8, estimado de la captura), por encima de la barra y del panel.
 *
 * El id `financiacion` es el ancla del banner Credirápido de "Detalles del Vehículo".
 *
 * TODO: los botones de las tarjetas ("FINANCIAR SEPARACIÓN", "SOLICITAR") llevan a Contacto,
 * como en la vista de Financiación. El sitio anterior abría en pestaña nueva un documento de
 * ZapSign (el mismo para todos los vehículos) desde "Credifácil"; no se copió (ver
 * `docs/DETALLE_VEHICULO.md` §5.1). El subtítulo es la copia con erratas de siempre.
 * Mobile: tarjetas apiladas sin adornos (el diseño mobile 89:5155 las trae a 367 de ancho).
 */
export default function VehicleFinancingComponent() {
  return (
    <section
      id="financiacion"
      aria-labelledby="financia-title"
      className="relative overflow-x-clip xl:h-[754px]"
    >
      <div className="relative mx-auto xl:h-full xl:max-w-[1440px]">
        <div
          aria-hidden
          className="absolute inset-y-0 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:h-[634px] xl:w-[calc(428px+50vw-50%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gray-light xl:right-[calc(50%-50vw)] xl:left-[125px]"
        />
        <div
          aria-hidden
          className="absolute top-[485px] left-[60px] hidden size-[200px] xl:block"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--color-blue-neon) 0 3px, transparent 3px 8px)",
          }}
        />

        <div className="reveal relative px-8 pt-16 xl:absolute xl:top-[60px] xl:left-[294px] xl:p-0">
          <span aria-hidden className="block h-1 w-[77px] bg-orange" />
          <h2
            id="financia-title"
            className="mt-4 text-[28px] leading-9 font-bold text-dark-gray xl:text-subheadline-1 xl:leading-11"
          >
            Financia tu{" "}
            <span className="font-normal text-orange italic">Vehículo</span>
          </h2>
          <p className="mt-2 text-body font-medium whitespace-pre-wrap text-gray-dark xl:mt-0 xl:w-[882px] xl:text-[18px] xl:leading-11">
            Financia tu garantía y cubre la reparación o sustitución{"  "}de
            piezas de tu vehículo Con nuestra garantía
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-8 px-8 pt-10 pb-16 xl:contents">
          <div className="reveal w-full max-w-[482px] xl:absolute xl:top-[200px] xl:left-[287px] xl:max-w-none xl:w-[482px]">
            <FinancingProductCardComponent product={FINANCING_PRODUCTS[0]} />
          </div>
          <div className="reveal w-full max-w-[482px] xl:absolute xl:top-[200px] xl:left-[796px] xl:max-w-none xl:w-[482px]">
            <FinancingProductCardComponent product={FINANCING_PRODUCTS[1]} />
          </div>
        </div>
      </div>
    </section>
  );
}
