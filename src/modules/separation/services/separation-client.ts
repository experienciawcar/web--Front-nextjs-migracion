import { apiUrl } from "@/modules/shared/services/api";

import type { Gateway } from "../constants/separation";

/** Llamadas del navegador. Devuelven `{ error }` con un mensaje listo para mostrar; no lanzan. */
type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

const GENERIC = "Algo salió mal. Inténtalo de nuevo.";

async function post<T>(path: string, body: unknown): Promise<Result<T>> {
  try {
    const response = await fetch(`/api/separar${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json().catch(() => null)) as ({ error?: string } & T) | null;
    if (response.ok && data) return { ok: true, ...data };
    return { ok: false, error: data?.error ?? GENERIC };
  } catch {
    return { ok: false, error: "No hay conexión. Revisa tu internet e inténtalo de nuevo." };
  }
}

export type PaymentStart = { gateway: "wompi"; checkoutUrl: string } | { gateway: "epayco"; sessionId: string; reviewId: string };

export const startPayment = (input: { car: number; amount: number; gateway: Gateway; vehicleName: string }) =>
  post<PaymentStart>("/pago", input);

export const sendEmailCode = (email: string) => post<object>("/otp", { email });

export const confirmSeparation = (input: Record<string, string | undefined>) => post<object>("/confirmar", input);

/** `GET /v2/epayco/check-payment/:sessionId`: ¿el pago de ePayco quedó aprobado? */
export async function isEpaycoPaid(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch(apiUrl(`/v2/epayco/check-payment/${encodeURIComponent(sessionId)}`));
    const data = (await response.json()) as { isSuccess?: boolean };
    return response.ok && data.isSuccess === true;
  } catch {
    return false;
  }
}

export type AppointmentDay = { id: number; date: string };
export type AppointmentHour = { id: number; hour_from: string; hour_to: string };

async function list<T>(path: string): Promise<T[]> {
  try {
    const response = await fetch(apiUrl(path));
    const data: unknown = await response.json();
    return response.ok && Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

/** `GET /date-avaliable-review/`: días con cita disponible. */
export const getDays = () => list<AppointmentDay>("/date-avaliable-review/");

/** `GET /date-avaliable-review/:dateId/`: franjas del día. */
export const getHours = (dateId: number) => list<AppointmentHour>(`/date-avaliable-review/${dateId}/`);
