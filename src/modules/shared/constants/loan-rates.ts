/**
 * Tasa que usa el simulador de cuota (`services/loan-calculator.ts`).
 *
 * 1,98 % mensual: con ella el ejemplo del diseño ($89.345.990 de valor,
 * $15.000.000 de cuota inicial, 24 meses) da $3.921.855 al peso (el cálculo
 * exacto es 3.921.854,4). Además es el tope del rango de tasas que el FAQ del
 * sitio anterior dice aplicar ("entre el 0,89 hasta el 1,98 % nominal mes
 * vencido"), o sea que la cuota estimada no queda por debajo de la real. Ver
 * `docs/planes/financiacion/referencia-sitio-anterior.md`.
 *
 * TODO: confirmar con negocio la tasa (¿fija o configurable por aseguradora o
 * por perfil?) y si el seguro suma a la cuota. Mientras tanto el seguro no suma,
 * como en el sitio anterior (allí `calculateInsurance` nunca se terminó).
 */
export const MONTHLY_INTEREST_RATE = 0.0198;

/**
 * Plazo y cuota inicial con los que se estima la cuota "desde $X/mes" de la tarjeta y de la ficha
 * del vehículo. TODO: confirmar con negocio (ver el comentario de `services/vehicles.ts`).
 */
export const LOAN_TERM_MONTHS = 60;
export const DOWN_PAYMENT_RATIO = 0.3;
