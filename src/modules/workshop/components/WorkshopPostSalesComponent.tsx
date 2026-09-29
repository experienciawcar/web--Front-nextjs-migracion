import DiagonalLinesComponent from "@/modules/shared/components/DiagonalLinesComponent";
import FeatureCardComponent from "@/modules/shared/components/FeatureCardComponent";
import SectionEyebrowComponent from "@/modules/shared/components/SectionEyebrowComponent";
import SideLabelComponent from "@/modules/shared/components/SideLabelComponent";

import iconBuilding from "../assets/postventa/icon-edificio.svg";
import iconTools from "../assets/postventa/icon-herramientas.svg";
import ParallelogramsComponent from "./ParallelogramsComponent";

/**
 * Sección "Servicios Postventa": la barra negra lateral con "Taller / wcar" y,
 * a su derecha, el título con dos tarjetas de servicio.
 *
 * Fuente: captura del desktop 1440 (`docs/planes/taller/2-servicios-postventa.png`,
 * calibrada con la barra negra de 303: px de captura = 3 + 0,641 × px de
 * diseño). Sin Figma ni diseño mobile. Medidas (px de diseño, ±1,5), con y=0
 * en el borde superior de la sección, que es donde arranca la barra:
 * - La sección arranca en y=635 de la página, 140 px por encima del final de
 *   la tarjeta "¿Qué hace?" (su foto sobresale sobre la barra: `z-20` contra
 *   `z-10`). Mide 663: ahí empieza el panel gris de "Garantías y seguros".
 * - Barra negra (`dark-gray`, 28,28,28 en la captura): x=0..303, sangra a la
 *   izquierda, y no acaba aquí: baja hasta y=919 (1554 de la página; Figma, la
 *   captura daba 920), ya dentro de la sección siguiente, por debajo de su foto.
 * - Rayado en la esquina superior izquierda de la barra: x=0..60, y=5..265 (Figma;
 *   la captura daba 58 x 260 en y=8), rayas blancas en "/" al 50 %. Todos los
 *   "Lines 13px" de Figma van con opacidad 0,5 (leída con `use_figma`); las
 *   pruebas contra el export dieron 0,5 también para este (la captura había dado
 *   40 %) y para el resto de rayados de la vista.
 * - `SideLabelComponent` con la raya cian en x=124, y=422 (Figma: 1185 de la página, 422 de aquí); el texto en blanco
 *   (36/44, ink de 125 a 214).
 * - Contenido: empieza en x=358. Eyebrow (`SectionEyebrowComponent`: 14 bold, 181
 *   de ancho en la captura y en el render) con la raya en y=271 (Figma; la captura daba 274) y 10 px hasta
 *   el texto, en vez de los 16 del componente (las líneas base de la captura
 *   dan 10; se pisa con `xl:gap-2.5!`), título de 36/44
 *   bold (ink 311 contra 310 de la captura) con la línea base en y≈353, y las
 *   tarjetas en y=422 (Figma; 426 en la captura), la primera con el icono en x=370 y la segunda en x=833.
 *   Son `FeatureCardComponent` (título 22/30, descripción de 16 px): las
 *   columnas de texto miden 278 y 293, deducidas de dónde parte cada renglón
 *   (la de la primera: "cualquier problema mecánico, eléctrico" cabe, pero
 *   "estamos" no cabe tras "una reparación menor o mayor,"). Ojo: la
 *   descripción de la primera va con interlineado de 22 (las líneas base de la
 *   captura están a 22,3) y la de la segunda con 24.
 * - Adorno de arriba a la derecha: rectángulo rayado en gris (al 50 %) x=835..1340
 *   por y=246..346 (Figma; la captura daba 248) y, pegado a su derecha, un cuadrado negro de 100 x 100 que sangra
 *   a la ventana; encima, los dos paralelogramos amarillos en (1190,292).
 *
 * Mobile: no hay diseño. Se adaptó (guía §4.3): sin barra, rayado ni adornos;
 * la etiqueta baja a título normal con raya naranja y las tarjetas se apilan.
 *
 * Iconos: los de Figma ("mdi:tools" y "famicons:business", 32 x 32, naranja),
 * exportados con el fondo de página que Figma les incrusta ya quitado.
 */
export default function WorkshopPostSalesComponent() {
  return (
    <section
      aria-labelledby="postventa-title"
      className="relative overflow-x-clip xl:-mt-[140px] xl:h-[663px]"
    >
      {/* El lienzo de 1440 centrado; los fondos sangran (guía §4.2). */}
      <div className="relative mx-auto xl:max-w-[1440px]">
        {/* ---------- Decoración de desktop ---------- */}
        <div
          aria-hidden
          className="absolute top-0 z-10 hidden bg-dark-gray xl:left-[calc(50%-50vw)] xl:block xl:h-[919px] xl:w-[calc(303px+50vw-50%)]"
        />
        <DiagonalLinesComponent className="absolute top-[5px] left-0 z-10 hidden h-[260px] w-[60px] opacity-50 xl:block" />

        <DiagonalLinesComponent
          variant="gray"
          className="absolute top-[246px] left-[835px] hidden h-[100px] w-[505px] opacity-50 xl:block"
        />
        <div
          aria-hidden
          className="absolute top-[246px] left-[1340px] hidden h-[100px] bg-dark-gray xl:right-[calc(50%-50vw)] xl:block"
        />
        <ParallelogramsComponent className="absolute top-[292px] left-[1190px] hidden xl:block" />

        {/* ---------- Contenido ---------- */}
        <div className="container-wcar flex flex-col gap-10 py-16 xl:flex-row xl:gap-0 xl:pt-[271px] xl:pb-0">
          <div className="xl:relative xl:z-20 xl:w-[234px] xl:shrink-0 xl:pt-[151px]">
            <SideLabelComponent regular="Taller" second="wcar" className="reveal reveal-left" />
          </div>

          <div className="flex-1">
            <SectionEyebrowComponent className="reveal xl:gap-2.5!">Servicios Ofrecidos por wcar</SectionEyebrowComponent>

            <h2 id="postventa-title" className="reveal mt-[11px] text-subheadline-1 font-bold text-dark-gray">
              Servicios Postventa
            </h2>

            <div className="mt-10 flex flex-col gap-10 xl:mt-[60px] xl:ml-3 xl:flex-row xl:gap-[129px]">
              <FeatureCardComponent
                icon={iconTools}
                title="Mantenimiento preventivo"
                description="Ofrecemos soluciones completas para cualquier problema mecánico, eléctrico o de carrocería. Ya sea que necesites una reparación menor o mayor, estamos preparados para ayudarte."
                descriptionClassName="leading-[22px]"
                className="reveal xl:w-[334px]"
              />
              <FeatureCardComponent
                icon={iconBuilding}
                title="Talleres Especializados por"
                titleItalic="Marca y Modelo"
                description="Contamos con talleres especializados para diferentes marcas y modelos, lo que nos permite ofrecer un servicio personalizado y preciso para tu vehículo."
                className="reveal xl:w-[349px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
