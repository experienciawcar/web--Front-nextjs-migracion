/** El resumen de Gemini ya listo para pintar: un párrafo y las viñetas. */
export type VehicleAiSummary = {
  intro: string;
  bullets: string[];
  /** Hay peritaje para ver (PDF propio, Automás o Colserauto): el resumen muestra "Ver peritaje". */
  hasExpertise: boolean;
};

/** Lo que responde `POST /api/resumen-ia/{id}`. */
export type VehicleAiSummaryResult =
  | { ok: true; summary: VehicleAiSummary }
  | { ok: false; message: string };

/** Respuesta cruda de `models/{modelo}:generateContent` de Google AI Studio (solo lo que se usa). */
export type GeminiGenerateContentDto = {
  candidates?: {
    content?: { parts?: { text?: string; thought?: boolean }[] };
    finishReason?: string;
  }[];
  error?: { code?: number; status?: string; message?: string };
};
