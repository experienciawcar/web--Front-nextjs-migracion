import FinancingBannerComponent from "./FinancingBannerComponent";
import LoanSimulatorComponent from "./LoanSimulatorComponent";

/**
 * Banner "Financiación hasta del 100%" y simulador de cuota, sobre el fondo gris
 * claro que arranca justo debajo de los pasos.
 *
 * Figma (nodo 193:8183, marco de 1440): el gris (`gray-light`, "Rectangle 1") va de
 * y=971 a y=1643 (672 de alto) y a todo el ancho; el banner de 785 x 80 arranca en
 * y=931, o sea 40 px POR ENCIMA del gris (sobre el blanco de los pasos), y termina
 * en 1011; el bloque del simulador (990 de ancho, centrado en x=225) arranca en
 * y=1059, 48 por debajo del banner y 88 del borde del gris. A la derecha: raya
 * cian de 75 x 4 en (833,1059), título "Calcula tu *préstamo*" (Bold 36/44, en
 * cursiva regular la segunda palabra) en (833,1087) y un párrafo de 16/24 `gray-dark`
 * de 382 de ancho en (833,1147); la tarjeta con la cuota, 32 más abajo (y=1251).
 * Abajo a la izquierda, un rectángulo `label-yellow` de 124 x 54 (en (0,1589)) que
 * sangra a la izquierda y apoya sobre la barra negra de la sección siguiente (que
 * arranca en y=1643).
 *
 * Es servidor: el título y el párrafo son estáticos y entran por `children` al
 * componente cliente del simulador (`LoanSimulatorComponent`), que es el único
 * que necesita JavaScript.
 *
 * Mobile (no hay diseño): sin rectángulo amarillo; el banner arriba, luego el título
 * y el párrafo, el formulario y el resultado en una columna.
 *
 * TODO: erratas del diseño en el párrafo ("cuanto" sin tilde) y en la nota del
 * resultado ("de neto uso interactivo"): se dejan tal cual, pendientes de diseño.
 */
export default function FinancingSimulatorComponent() {
  return (
    <section aria-labelledby="simulador-title" className="relative bg-gray-light">
      <div className="relative mx-auto px-4 py-12 xl:h-[672px] xl:max-w-[1440px] xl:px-0 xl:py-0">
        {/* El banner cuelga 40 px del gris hacia arriba y queda por encima de
            los pasos (la sección va después en el DOM). */}
        <FinancingBannerComponent className="mx-auto max-w-[785px] xl:absolute xl:top-[-40px] xl:left-[327px] xl:mx-0" />

        <div className="mt-10 xl:absolute xl:top-[88px] xl:left-[225px] xl:mt-0">
          <LoanSimulatorComponent>
            <span aria-hidden className="block h-1 w-[75px] bg-blue-neon" />
            <h2
              id="simulador-title"
              className="mt-6 text-subheadline-1 leading-11 font-bold text-dark-gray"
            >
              Calcula tu <span className="font-normal italic">préstamo</span>
            </h2>
            <p className="mt-4 text-body font-medium text-gray-dark">
              Nada como saber desde el primer momento cuanto debes pagar mensual. Conoce el valor de tu cuota con estos
              datos, de manera fácil y sencilla.
            </p>
          </LoanSimulatorComponent>
        </div>

        {/* Rectángulo amarillo de la esquina inferior izquierda: sangra a la ventana. */}
        <span
          aria-hidden
          className="absolute bottom-0 hidden h-[54px] bg-label-yellow xl:left-[calc(50%-50vw)] xl:block xl:w-[calc(124px+50vw-50%)]"
        />
      </div>
    </section>
  );
}
