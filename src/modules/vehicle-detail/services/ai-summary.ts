import type {
  GeminiGenerateContentDto,
  VehicleAiSummary,
} from "../types/ai-summary";
import type { ExpertiseResult } from "../types/expertise";
import type { VehicleDetail, VehicleFeature } from "../types/vehicle-detail";

import { getExpertise } from "./expertise";
import { getVehicleDetail } from "./vehicle-detail";

/**
 * Resumen de un vehículo con Gemini (Google AI Studio). Solo corre en el servidor: la key
 * (`GEMINI_API_KEY`, la misma de wcar-tech-compras) nunca llega al navegador. Lo usa
 * `POST /api/resumen-ia/{id}`.
 *
 * A Gemini solo le llega lo que ya muestra la ficha más el peritaje ya enmascarado
 * (`toExpertiseReport`/`toColserautoReport`): nunca la placa completa, chasis ni motor.
 */

const GOOGLE_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

/**
 * Modelos a intentar en orden. Los ids fijos tipo `gemini-2.5-flash` ya dan 404 con esta key
 * ("no longer available to new users"); los alias `-latest` apuntan al vigente.
 */
function modelChain(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest";
  return [...new Set([primary, "gemini-flash-latest", "gemini-flash-lite-latest"])];
}

/** Un vehículo cambia poco: el resumen se reutiliza 6 h por id (Fluid Compute reutiliza la instancia). */
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_MAX = 300;
const cache = new Map<number, { summary: VehicleAiSummary; expires: number }>();
/** Si dos personas lo piden a la vez, una sola llamada a Gemini. */
const inFlight = new Map<number, Promise<VehicleAiSummary | null>>();

const REQUEST_TIMEOUT_MS = 45_000;

/** Error con un mensaje que se puede mostrar tal cual. */
export class AiSummaryError extends Error {}

const SYSTEM_PROMPT = `Eres el asistente de WCAR, una plataforma colombiana de compra y venta de vehículos usados.
Escribe en español de Colombia, en segunda persona ("tú"), con un tono cercano y claro, sin exagerar.
Te paso los datos de UN vehículo publicado en WCAR, en JSON. Haz un resumen que ayude al comprador a decidir.

Reglas:
- Usa SOLO los datos del JSON. No inventes potencia, airbags, consumo ni ningún dato que no esté.
- El vehículo es USADO. Nunca digas que es nuevo.
- Precios en pesos colombianos tal como vienen ("$ 59.900.000").
- "intro": 1 o 2 frases (máx. 45 palabras) con lo más destacado.
- "bullets": de 4 a 6 viñetas cortas (máx. 25 palabras cada una), sin viñeta ni guion al inicio, sin Markdown. Cubre:
  precio y estado general; equipamiento o seguridad que destaque; el resultado del peritaje si viene
  (novedades encontradas, o que salió sin novedades), y las reclamaciones; ubicación;
  y los beneficios de WCAR que apliquen según los datos (garantía, garantía de felicidad, peritaje, financiación).
- Si el peritaje tiene novedades, menciónalas con honestidad pero sin alarmar.`;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    intro: { type: "string" },
    bullets: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
  },
  required: ["intro", "bullets"],
};

function features(list: VehicleFeature[]): Record<string, string> | undefined {
  if (list.length === 0) return undefined;
  return Object.fromEntries(list.map((feature) => [feature.label, feature.value]));
}

/** Lo útil del peritaje, ya sin datos sensibles. */
function expertiseContext(result: ExpertiseResult, vehicle: VehicleDetail) {
  if (result.kind === "report") {
    const { report } = result;
    return {
      fuente: "Automás",
      fecha: report.date,
      asegurable: { yes: "Sí", no: "No", unknown: "Sin dato" }[report.insurable],
      diagnostico: report.categories.map((c) => `${c.label}: ${c.summary} (${c.detail})`),
      totalNovedades: report.totalNovelties,
      novedades: report.novelties.map((group) => ({
        categoria: group.title,
        piezas: group.items.map((item) => `${item.part}: ${item.state}`),
      })),
      servicio: report.service,
      observaciones: report.observations || undefined,
    };
  }
  if (result.kind === "colserauto") {
    const { report } = result;
    return {
      fuente: "Colserauto",
      fecha: report.date,
      asegurable: report.insurable ? "Sí" : "No",
      puntajeGeneral: report.score,
      resultadosPorSistema: report.results.map((r) => `${r.system}: ${r.percent ?? "s/d"}%`),
      reclamaciones: report.claims.map((c) => `${c.label}: ${c.value}`),
    };
  }
  // PDF propio o imagen: Gemini no lo lee, solo se sabe que existe.
  if (result.kind === "image" || vehicle.expertise?.kind === "pdf")
    return { disponible: "Sí, se puede ver completo en la ficha" };
  return undefined;
}

function buildContext(vehicle: VehicleDetail, expertise: ExpertiseResult) {
  return {
    vehiculo: vehicle.name,
    marca: vehicle.brand ?? undefined,
    carroceria: vehicle.bodyType,
    modelo: vehicle.year ?? undefined,
    kilometraje: vehicle.mileage ?? undefined,
    transmision: vehicle.transmission,
    motor: vehicle.engine ?? undefined,
    combustible: vehicle.fuel ?? undefined,
    ubicacion: `WCAR ${vehicle.city}`,
    precio: vehicle.price,
    precioAnterior: vehicle.previousPrice ?? undefined,
    estado: vehicle.tag?.name,
    garantia: vehicle.warranty?.title,
    garantiaDeFelicidad: vehicle.happinessWarranty
      ? "Si no estás satisfecho lo puedes cambiar: 7 días o 300 km"
      : undefined,
    financiacion: "WCAR ofrece financiación para este vehículo",
    reclamaciones: {
      reportadas: vehicle.claims.reported,
      tipos: vehicle.claims.types.length > 0 ? vehicle.claims.types : undefined,
      monto: vehicle.claims.amount ?? undefined,
    },
    historial: features(vehicle.history),
    caracteristicas: features(vehicle.characteristics),
    seguridad: features(vehicle.safety),
    accesorios: features(vehicle.equipment),
    comentarios: vehicle.comments ?? undefined,
    peritaje: expertiseContext(expertise, vehicle),
  };
}

/** Quita viñetas o Markdown que a veces cuela el modelo aunque se le pida que no. */
function cleanLine(text: string): string {
  return text.replace(/^\s*(?:[-*•·]|\d+[.)])\s+/, "").replace(/\*\*/g, "").trim();
}

function parseSummary(dto: GeminiGenerateContentDto): Omit<VehicleAiSummary, "hasExpertise"> | null {
  const text = dto.candidates?.[0]?.content?.parts
    ?.filter((part) => !part.thought)
    .map((part) => part.text ?? "")
    .join("");
  if (!text) return null;
  try {
    const raw = JSON.parse(text) as Partial<VehicleAiSummary>;
    const intro = typeof raw.intro === "string" ? cleanLine(raw.intro) : "";
    const bullets = Array.isArray(raw.bullets)
      ? raw.bullets.filter((b): b is string => typeof b === "string").map(cleanLine).filter(Boolean)
      : [];
    return intro || bullets.length > 0 ? { intro, bullets: bullets.slice(0, 6) } : null;
  } catch {
    return null;
  }
}

/** Una llamada a `generateContent`. `null` = probar el siguiente modelo; lanza si no vale la pena. */
async function callGemini(
  model: string,
  apiKey: string,
  context: unknown,
): Promise<Omit<VehicleAiSummary, "hasExpertise"> | null> {
  let response: Response;
  try {
    response = await fetch(`${GOOGLE_BASE_URL}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify(context) }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseJsonSchema: RESPONSE_SCHEMA,
          thinkingConfig: { thinkingLevel: "low" },
        },
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch (error) {
    console.error(`Gemini (${model}) no respondió:`, error);
    return null;
  }

  // 404 (modelo retirado), 429 (cuota) y 5xx: otro modelo puede responder.
  if (response.status === 404 || response.status === 429 || response.status >= 500) {
    console.error(`Gemini (${model}) respondió ${response.status}`);
    return null;
  }
  const dto: GeminiGenerateContentDto = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`Gemini (${model}) respondió ${response.status}:`, dto.error?.message);
    throw new AiSummaryError("No pudimos generar el resumen. Intenta de nuevo más tarde.");
  }
  return parseSummary(dto);
}

async function generate(id: number): Promise<VehicleAiSummary | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new AiSummaryError("El resumen con Gemini no está disponible en este momento.");

  const [vehicle, expertise] = await Promise.all([
    getVehicleDetail(id),
    getExpertise(id).catch((): ExpertiseResult => ({ kind: "none" })),
  ]);
  if (!vehicle) return null;

  const context = buildContext(vehicle, expertise);
  const hasExpertise = expertise.kind !== "none" || vehicle.expertise?.kind === "pdf";
  for (const model of modelChain()) {
    const summary = await callGemini(model, apiKey, context);
    if (summary) return { ...summary, hasExpertise };
  }
  throw new AiSummaryError("Gemini está muy ocupado en este momento. Intenta de nuevo en un minuto.");
}

/**
 * El resumen de un vehículo: de la caché si es reciente, si no se le pide a Gemini. `null` si el
 * vehículo no existe. Lanza `AiSummaryError` con un mensaje para mostrar si Gemini falla.
 */
export async function getVehicleAiSummary(id: number): Promise<VehicleAiSummary | null> {
  const now = Date.now();
  const cached = cache.get(id);
  if (cached && cached.expires > now) return cached.summary;

  const pending = inFlight.get(id);
  if (pending) return pending;

  const promise = generate(id)
    .then((summary) => {
      if (summary) {
        if (cache.size >= CACHE_MAX) {
          for (const [key, entry] of cache) if (entry.expires <= now) cache.delete(key);
          if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
        }
        cache.set(id, { summary, expires: now + CACHE_TTL_MS });
      }
      return summary;
    })
    .finally(() => inFlight.delete(id));
  inFlight.set(id, promise);
  return promise;
}
