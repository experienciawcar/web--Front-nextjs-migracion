import { FINANCING_STEPS } from "../constants/steps";

import FinancingStepsCarouselComponent from "./FinancingStepsCarouselComponent";

/**
 * Pasos del proceso de financiación: la fila de cinco tarjetas (icono, "1.
 * Simulación" y una descripción) con sus flechas y su barra de progreso, sobre
 * fondo blanco, justo debajo del hero y sin título encima.
 *
 * Fuente: Figma "Wcar Website - 2026", nodo "items carrousel" 193:8216 en
 * (124,717) de 1490 x 174 (ver `FinancingStepsCarouselComponent` para las
 * medidas de dentro). La sección va de y=637 (donde acaba el hero) a y=971
 * (donde arranca el gris del banner y el simulador): 80 de aire arriba y 80
 * abajo del carrusel.
 *
 * Contenido fijo (`constants/steps.ts`): no hay endpoint. Es un servidor y solo
 * el carrusel es cliente.
 */
export default function FinancingStepsComponent() {
  return (
    <section aria-label="Proceso de financiación" className="relative overflow-x-clip">
      <div className="mx-auto xl:max-w-[1440px]">
        <div className="container-wcar pt-[30px] pb-[230px] xl:py-20">
          <FinancingStepsCarouselComponent steps={FINANCING_STEPS} />
        </div>
      </div>
    </section>
  );
}
