/**
 * Valor a pagar para separar un vehículo, en pesos.
 * TODO(negocio): fórmula provisoria (precio / 12); reemplazar cuando negocio entregue la real.
 */
export function calculateReservationAmount(vehiclePrice: number): number {
  return Math.round(vehiclePrice / 12);
}
