import { apiUrl } from "@/modules/shared/services/api";

export type HeroSellQuote = {
  year: number;
  brandId: string;
  model: string;
  mileage: number;
  name: string;
  email: string;
  phone: string;
};

export type HeroSellQuoteResult = { ok: true } | { ok: false; message: string };

/**
 * Cotización rápida del home (POST /sale-cars/create/) con solo lo que pide el
 * diseño. No manda ciudad, color ni cita (los que sí pide /cotizar): si el backend
 * los exige, responderá 400 y se mostrará su mensaje.
 * ⚠️ Crea un registro real: probar solo con un servidor falso.
 */
export async function createHeroSellQuote(q: HeroSellQuote): Promise<HeroSellQuoteResult> {
  try {
    const response = await fetch(apiUrl("/sale-cars/create/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: q.year,
        brand: Number(q.brandId),
        reference: q.model,
        mileage: q.mileage,
        name: q.name,
        email: q.email,
        phone: q.phone,
      }),
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
