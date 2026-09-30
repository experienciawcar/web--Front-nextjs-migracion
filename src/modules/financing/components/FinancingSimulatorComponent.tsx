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
 * Teléfono (< 1280, marco "financiación - 394"): sin rectángulo amarillo. El gris
 * arranca en y=1321 y el banner (329 x 296) en 1116, o sea 205 px POR ENCIMA
 * (sobre el blanco de los pasos, que le dejan el sitio con su `pb`); el título
 * queda a 42 del banner, y el formulario (32), el resultado (32) y los 60 de cierre
 * van en una columna de 329 con 32 a cada lado.
 *
 * TODO: erratas del diseño en el párrafo ("cuanto" sin tilde) y en la nota del
 * resultado ("de neto uso interactivo"): se dejan tal cual, pendientes de diseño.
 */
export default function FinancingSimulatorComponent() {
  return (
    <section aria-labelledby="simulador-title" className="relative bg-gray-light">
      <div className="relative mx-auto flow-root px-8 pb-[60px] xl:h-[672px] xl:max-w-[1440px] xl:px-0 xl:pb-0">
        {/* El banner cuelga 40 px del gris hacia arriba y queda por encima de
            los pasos (la sección va después en el DOM). */}
        <FinancingBannerComponent className="mx-auto -mt-[205px] max-w-[329px] xl:absolute xl:top-[-40px] xl:left-[327px] xl:mx-0 xl:mt-0 xl:max-w-[785px]" />

        <div className="mt-[42px] xl:absolute xl:top-[88px] xl:left-[225px] xl:mt-0">
          <LoanSimulatorComponent>
            <span aria-hidden className="block h-1 w-[75px] bg-blue-neon" />
            <h2
              id="simulador-title"
              className="mt-6 text-subheadline-1 leading-11 font-bold text-dark-gray"
            >
              Calcula tu <span className="font-normal italic">préstamo</span>
            </h2>
            <p className="mt-[22px] text-body font-medium text-gray-dark xl:mt-4">
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
