import type { VehicleAiSummaryResult } from "../types/ai-summary";

/** Desde el navegador: pide el resumen de Gemini a `POST /api/resumen-ia/{id}`. */
export async function requestVehicleAiSummary(
  vehicleId: number,
  signal?: AbortSignal,
): Promise<VehicleAiSummaryResult> {
  try {
    const response = await fetch(`/api/resumen-ia/${vehicleId}`, { method: "POST", signal });
    const data = (await response.json()) as VehicleAiSummaryResult;
    if (data && typeof data.ok === "boolean") return data;
  } catch (error) {
    if (signal?.aborted) throw error;
  }
  return { ok: false, message: "No pudimos generar el resumen. Revisa tu conexión e intenta de nuevo." };
}
