import arrowCircle from "@/modules/shared/assets/icons/arrow-circle.svg";
import ButtonComponent from "@/modules/shared/components/ButtonComponent";
import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";
import { ROUTES } from "@/modules/shared/constants/routes";

import { WARRANTY_FEATURES } from "../constants/warranty";

import FinancingWarrantyCarouselComponent from "./FinancingWarrantyCarouselComponent";

/**
 * Sección "Financia tu garantía": la barra negra lateral con "Compra tu vehículo
 * con nuestra ayuda" y, a su derecha, el título, las tres tarjetas y el botón
 * "Adquiere tu garantía".
 *
 * Fuente: Figma "Wcar Website - 2026", nodo 193:8183. Medidas en px del lienzo de
 * 1440, con y=0 en el borde superior de la sección (y=1643 de la página, donde
 * acaba el gris del simulador):
 * - Sección de 608 (hasta y=2251, donde arranca el panel oscuro de "Cambia tu
 *   vehículo"): el fondo es el blanco de la página.
 * - Barra negra (`dark-gray`, "Rectangle black" 195:11638): x=0..303, sangra a la
 *   izquierda y **mide 1255**: cuelga de esta sección y baja hasta y=2898, por
 *   debajo del panel naranja de la sección siguiente (que la pisa) y por
 *   detrás del gris de "Financia tu Vehículo" (que arranca en x=128). Por eso
 *   es `z-10` y ese gris tiene que pintar por encima (ver su componente).
 * - Rayado blanco en la esquina superior izquierda de la barra ("Lines 24px" 204:4818,
 *   aunque el tile es el de 13 px): 60 x 319 en (0,0), al 50 %.
 * - Etiqueta en la barra: raya cian de 77 x 4 en (128,160) y, 24 debajo, el texto
 *   de 28/34 Bold blanco en una caja de 161: "Compra" / "tu vehículo" y, en
 *   cursiva regular, "con nuestra ayuda" (que parte solo por el ancho: "con
 *   nuestra" / "ayuda"). No es `SideLabelComponent`: allí el texto es de 36/44.
 * - Rayado gris de arriba a la derecha ("Lines 13px" 204:5103): (833,0) hasta la
 *   ventana, 100 de alto, al 50 %.
 * - Contenido desde x=431: eyebrow (`SectionEyebrowComponent`, raya de 115) en y=69,
 *   título de 36/44 en una caja de 688 (16 debajo del eyebrow: "Financia tu garantía
 *   y cubre la reparación" en `dark-gray` y, en `orange` cursiva regular, "o
 *   sustitución  de piezas de tu vehículo", con el doble espacio del diseño), tres
 *   `FeatureCardComponent` de 268 (icono de 32 + 24 + texto de 212; el marco
 *   arranca en x=431 con las tarjetas 24 dentro y 24 entre ellas) 64 debajo del
 *   título, y el botón `primary` con la flecha en círculo en (783,500), 57 debajo
 *   de las tarjetas. El botón mide 265 en Figma y aquí unos px más: el
 *   `ButtonComponent` trae el borde transparente de 2 px y el texto avanza más.
 *
 * Teléfono (< 1280, "financiación - 394", y=2572..3290): sin barra, rayados ni
 * etiqueta lateral (el marco mobile no la trae). Todo centrado y con 64 de aire
 * arriba y abajo: eyebrow con raya de 115 y 24 de separación, título de 32/36 en
 * cuatro renglones (el "o" va en negro; solo "sustitución…" es naranja), las
 * tarjetas en carrusel 64 debajo con sus tres rayas (ver
 * `FinancingWarrantyCarouselComponent`) y el botón 52 más abajo.
 *
 * TODO: destino del botón "Adquiere tu garantía" (hoy `ROUTES.contact`; en el
 * sitio anterior era un `<button>` sin enlace). El texto del botón en Figma no lleva
 * tilde ("GARANTIA"): se deja igual, pendiente de diseño.
 */
export default function FinancingWarrantyComponent() {
  return (
    <section aria-labelledby="garantia-title" className="relative overflow-x-clip xl:h-[608px]">
      {/* El lienzo de 1440 centrado; los fondos sangran (guía §4.2). */}
      <div className="relative mx-auto xl:max-w-[1440px]">
        {/* ---------- Decoración de desktop ---------- */}
        <div
          aria-hidden
          className="absolute top-0 z-10 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:h-[1255px] xl:w-[calc(303px+50vw-50%)]"
        />
        <DiagonalLinesComponent className="absolute top-0 left-0 z-10 hidden h-[319px] w-[60px] opacity-50 xl:block" />
        <DiagonalLinesComponent
          variant="gray"
          className="absolute top-0 left-[833px] hidden h-[100px] opacity-50 xl:right-[calc(50%-50vw)] xl:block"
        />

        {/* Etiqueta de la barra (solo desktop). */}
        <div className="absolute z-20 hidden xl:top-[160px] xl:left-[128px] xl:block xl:w-[161px]">
          <span aria-hidden className="block h-1 w-[77px] bg-blue-neon" />
          <p className="mt-6 text-[28px] leading-[34px] font-bold text-white">
            Compra
            <br />
            tu vehículo <span className="font-normal italic">con nuestra ayuda</span>
          </p>
        </div>

        {/* ---------- Contenido ---------- */}
        <div className="container-wcar py-16 xl:pt-[69px] xl:pb-0">
          <div className="xl:ml-[307px]">
            <SectionEyebrowComponent className="mx-auto items-center gap-6! xl:mx-0 xl:items-stretch xl:gap-4!">
              Servicios Ofrecidos por wcar
            </SectionEyebrowComponent>

            <h2
              id="garantia-title"
              className="mt-6 text-center text-[32px] leading-9 font-bold whitespace-pre-wrap text-dark-gray xl:mt-4 xl:w-[688px] xl:text-left xl:text-subheadline-1 xl:leading-11"
            >
              Financia tu garantía y cubre la reparación{" "}
              <span className="xl:font-normal xl:text-orange xl:italic">o </span>
              <span className="font-normal text-orange italic">sustitución{"  "}de piezas de tu vehículo</span>
            </h2>

            <FinancingWarrantyCarouselComponent features={WARRANTY_FEATURES} />

            <div className="mt-[52px] flex justify-center xl:mt-[57px] xl:ml-[352px] xl:block">
              {/* TODO: destino del botón y tilde de "GARANTIA" (ver el JSDoc). */}
              <ButtonComponent href={ROUTES.contact} icon={arrowCircle}>
                ADQUIERE TU GARANTIA
              </ButtonComponent>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
