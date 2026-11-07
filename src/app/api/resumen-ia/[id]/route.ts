import { AiSummaryError, getVehicleAiSummary } from "@/modules/vehicle-detail/services/ai-summary";
import type { VehicleAiSummaryResult } from "@/modules/vehicle-detail/types/ai-summary";

/** Tope por IP (por instancia): evita que alguien recorra ids gastando la cuota de Gemini. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (hits.size > 2000) hits.clear();
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  hits.set(ip, [...recent, now]);
  return false;
}

function fail(message: string, status: number) {
  return Response.json({ ok: false, message } satisfies VehicleAiSummaryResult, { status });
}

/**
 * `POST /api/resumen-ia/{id}`: el resumen de Gemini de la ficha de un vehículo (ver
 * `getVehicleAiSummary`). Es POST porque genera contenido y no debe quedar en cachés intermedias.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const raw = (await params).id;
  if (!/^\d+$/.test(raw)) return fail("Vehículo no válido.", 400);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip))
    return fail("Has pedido muchos resúmenes seguidos. Intenta de nuevo en unos minutos.", 429);

  try {
    const summary = await getVehicleAiSummary(Number(raw));
    if (!summary) return fail("No encontramos este vehículo.", 404);
    return Response.json({ ok: true, summary } satisfies VehicleAiSummaryResult, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof AiSummaryError) return fail(error.message, 503);
    console.error("No se pudo generar el resumen con Gemini:", error);
    return fail("No pudimos generar el resumen. Intenta de nuevo más tarde.", 502);
  }
}
