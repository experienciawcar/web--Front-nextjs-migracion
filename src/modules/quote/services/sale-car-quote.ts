import { apiUrl } from "@/modules/shared/services/api";

import type { QuoteFormValues } from "../types/quote-form";

/**
 * Body de `POST /sale-cars/create/` para el formulario corto (placa + km, luego
 * contacto). Ver `docs/backend/cotizar-formulario-corto.md`: el endpoint actual
 * exige marca, versión, año, ciudad, color, fecha y hora, así que este body
 * NO lo acepta hasta que backend lo cambie. `email` solo viaja si se escribió.
 */
function toBody({ car, contact }: QuoteFormValues) {
  return {
    plate: car.plate,
    mileage: Number(car.kilometers),
    name: contact.fullName.trim(),
    phone: contact.phone.replace(/\s/g, ""),
    ...(contact.email.trim() && { email: contact.email.trim() }),
  };
}

export type CreateSaleCarQuoteResult = { ok: true } | { ok: false; message: string };

/**
 * Crea la cotización de venta real y espera la respuesta antes de mostrar nada.
 *
 * ⚠️ No probar contra el backend real durante desarrollo: crea un registro
 * de verdad. Probar solo con un servidor falso local.
 */
export async function createSaleCarQuote(values: QuoteFormValues): Promise<CreateSaleCarQuoteResult> {
  try {
    const response = await fetch(apiUrl("/sale-cars/create/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBody(values)),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      return { ok: false, message: detail?.detail ?? "No se pudo enviar la cotización. Intenta de nuevo." };
    }

    return { ok: true };
  } catch (error) {
    console.error("No se pudo crear la cotización:", error);
    return { ok: false, message: "No se pudo enviar la cotización. Revisa tu conexión e intenta de nuevo." };
  }
}
