/** Plazos en meses del simulador (Figma, "Plazo en Meses*"). */
export const LOAN_TERMS = [12, 24, 36, 48, 60, 72, 84] as const;

/**
 * Aseguradoras del selector "Seguro". En el diseño solo aparece "Allianz" y no hay
 * endpoint. TODO: la lista real (y si el seguro debe sumar a la cuota; hoy no).
 */
export const INSURERS = ["Allianz"] as const;

/**
 * Valores con los que arranca el simulador: son los del diseño, para que la
 * primera pintura coincida con él ($ 3.921.855 de cuota).
 * TODO: confirmar con diseño si en producción arrancan vacíos.
 */
export const DEFAULT_LOAN = {
  vehicleValue: 89_345_990,
  downPayment: 15_000_000,
  months: 24,
  insurer: INSURERS[0],
};
