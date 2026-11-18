/** Monto mínimo para separar un vehículo, en pesos (confirmado por negocio). */
export const MIN_SEPARATION_AMOUNT = 2_000_000;

export const SEPARATION_ACTION = "separar-wompi";

export const THANK_YOU_PATH = "/thankyou";

/** Ruta de retorno del pago y de la cita; `reviewId` es el id del review, no el del carro. */
export const appointmentPath = (reviewId: string | number) => `/carro/cita/${SEPARATION_ACTION}/${reviewId}`;

export type Gateway = "wompi" | "epayco";
