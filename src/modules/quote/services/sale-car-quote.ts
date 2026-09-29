import { apiUrl } from "@/modules/shared/services/api";

import type { QuoteFormValues } from "../types/quote-form";

/**
 * Body de `POST /sale-cars/create/`, confirmado contra registros reales de
 * `GET /sale-cars/` (no solo contra la documentación del sitio anterior):
 * `brand`, `city`, `departament`, `color`, `hour_avaliable`, `date_avaliable`
 * son ids numéricos; `version` es el texto elegido; no se manda `model`
 * (siempre `null` en los registros reales, sin campo en la UI) ni `price`
 * (lo calcula el backend). `departament` y `hour_avaliable`/`date_avaliable`
 * son erratas reales del backend, no de transcripción: se respetan tal cual.
 */
type SaleCarQuoteBody = {
  year: number;
  brand: number;
  version: string;
  reference: string;
  city: number;
  departament: number;
  mileage: number;
  color: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  hour_avaliable: number;
  date_avaliable: number;
};

function toBody(values: QuoteFormValues): SaleCarQuoteBody {
  return {
    year: Number(values.car.year),
    brand: Number(values.car.brandId),
    version: values.car.version,
    reference: values.car.reference,
    city: Number(values.car.cityId),
    departament: Number(values.car.departmentId),
    mileage: Number(values.car.kilometers),
    color: Number(values.car.colorId),
    name: values.contact.name,
    lastName: values.contact.lastname,
    email: values.contact.email,
    phone: values.contact.phone,
    company: values.contact.companyName,
    hour_avaliable: Number(values.book.hourId),
    date_avaliable: Number(values.book.dateId),
  };
}

export type CreateSaleCarQuoteResult = { ok: true } | { ok: false; message: string };

/**
 * Crea la cotización de venta real. A diferencia del sitio anterior (ver
 * `docs/planes/cotizar.md`, §3.3 y §5 del documento de referencia), esta
 * llamada se espera ANTES de mostrar cualquier resultado: no hay navegación
 * optimista ni un segundo intento en otra pantalla.
 *
 * ⚠️ No probar contra el backend real durante desarrollo: crea un registro
 * de verdad (ver la nota del plan). Probar solo con un servidor falso local.
 */
export async function createSaleCarQuote(values: QuoteFormValues): Promise<CreateSaleCarQuoteResult> {
  const url = apiUrl("/sale-cars/create/");

  try {
    const response = await fetch(url, {
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
