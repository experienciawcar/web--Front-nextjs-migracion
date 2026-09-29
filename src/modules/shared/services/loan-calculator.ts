import { MONTHLY_INTEREST_RATE } from "../constants/loan-rates";

/** Tope de dígitos que se aceptan en un campo de dinero (hasta $99.999.999.999). */
export const MAX_MONEY_DIGITS = 11;

/**
 * Cuota mensual fija de un crédito de amortización francesa:
 * `cuota = P · r / (1 − (1 + r)^−n)`, con `P = valor − cuota inicial`, `r` la tasa
 * mensual y `n` los meses. Es la misma fórmula del simulador del sitio anterior
 * (wcar.co) con la tasa de `constants/loan-rates.ts`.
 *
 * Se redondea hacia ARRIBA al peso, no al más cercano: con el ejemplo del diseño
 * ($89.345.990, $15.000.000, 24 meses) el valor exacto es 3.921.854,09 y el diseño
 * muestra $3.921.855; `Math.round` daría $3.921.854. Además, redondear hacia arriba
 * es lo prudente para una cuota estimada (nunca queda por debajo de la real).
 *
 * Casos límite: si no queda nada por financiar (cuota inicial mayor o igual que
 * el valor, o un campo vacío) o el plazo no es válido, la cuota es 0. Con una tasa
 * de 0 la cuota es `P / n`. El seguro no suma (ver el TODO de `loan-rates.ts`).
 */
export function calculateMonthlyPayment(
  vehicleValue: number,
  downPayment: number,
  months: number,
  monthlyRate: number = MONTHLY_INTEREST_RATE,
): number {
  const financed = vehicleValue - downPayment;
  if (!Number.isFinite(financed) || financed <= 0 || !Number.isInteger(months) || months <= 0) return 0;

  const payment =
    monthlyRate === 0 ? financed / months : (financed * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  return Number.isFinite(payment) ? Math.ceil(payment) : 0;
}

/** Los dígitos de un texto, sin más de `MAX_MONEY_DIGITS` y como número ("$89.345.990" → 89345990). */
export function parseMoney(text: string): number {
  const digits = text.replace(/\D/g, "").slice(0, MAX_MONEY_DIGITS);
  return digits === "" ? 0 : Number(digits);
}

/** Pesos colombianos con punto de miles y sin decimales (89345990 → "89.345.990"). */
export function formatThousands(amount: number): string {
  return String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
