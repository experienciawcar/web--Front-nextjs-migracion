/**
 * Tasa que usa el simulador de cuota (`services/loan-calculator.ts`): 1,9 % mensual, la misma de
 * `calculadora-credito-vehicular.html`. Antes era 1,98 % (el tope del FAQ del sitio anterior y lo que
 * hacía coincidir el ejemplo del diseño de Financiación, $3.921.855); con 1,9 % ese ejemplo da otra cuota.
 *
 * TODO: confirmar con negocio la tasa (¿fija o configurable por aseguradora o por perfil?) y si el
 * seguro suma a la cuota. Mientras tanto el seguro no suma.
 */
export const MONTHLY_INTEREST_RATE = 0.019;

/**
 * Plazo y cuota inicial con los que se estima la cuota "desde $X/mes" de la tarjeta y de la ficha
 * del vehículo. TODO: confirmar con negocio (ver el comentario de `services/vehicles.ts`).
 */
export const LOAN_TERM_MONTHS = 60;
export const DOWN_PAYMENT_RATIO = 0.2;
