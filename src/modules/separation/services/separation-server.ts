import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { apiUrl } from "@/modules/shared/services/api";
import { SITE_URL } from "@/modules/shared/utils/seo";

import { appointmentPath, type Gateway, MIN_SEPARATION_AMOUNT } from "../constants/separation";

/**
 * Lado servidor de "Separar vehículo". Aquí viven los secretos (firma de Wompi y firma del OTP) y
 * el código OTP, que nunca llegan al navegador (en el sitio anterior sí: `docs/flujo-separar-vehiculo.md` §9).
 */

export class SeparationError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

async function backend<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    throw new SeparationError("No pudimos conectar con el servidor. Inténtalo de nuevo.", 502);
  }
  const data = (await response.json().catch(() => null)) as T | null;
  if (!response.ok || !data) {
    console.error(`${path} respondió`, response.status);
    throw new SeparationError("No pudimos completar la solicitud. Inténtalo de nuevo.", response.status >= 500 ? 502 : 400);
  }
  return data;
}

function secret(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name} (ver .env.local).`);
  return value;
}

/** Crea el review y devuelve su id. El backend escribe la clave mal: `reivew`. */
async function createReview(car: number, amount: number): Promise<string> {
  const data = await backend<{ reivew?: { id?: number }; review?: { id?: number } }>("/scheduling-review/create/", {
    car: String(car),
    wompi: true,
    totalToPay: amount.toFixed(2),
  });
  const id = (data.reivew ?? data.review)?.id;
  if (!id) throw new SeparationError("No pudimos crear la separación. Inténtalo de nuevo.", 502);
  return String(id);
}

export type PaymentStart =
  | { gateway: "wompi"; checkoutUrl: string }
  | { gateway: "epayco"; sessionId: string; reviewId: string };

export async function startPayment(input: { car: number; amount: number; gateway: Gateway; vehicleName: string }): Promise<PaymentStart> {
  const { car, amount, gateway } = input;
  if (!Number.isInteger(car) || car <= 0) throw new SeparationError("Vehículo no válido.");
  // shortcut: el tope (precio del vehículo) solo se valida en el formulario; que el backend lo exija.
  if (!Number.isInteger(amount) || amount < MIN_SEPARATION_AMOUNT) throw new SeparationError("El monto mínimo para separar es $2.000.000.");

  const reviewId = await createReview(car, amount);
  const returnUrl = `${SITE_URL}${appointmentPath(reviewId)}`;

  if (gateway === "wompi") {
    const cents = amount * 100;
    const reference = `${reviewId}${Math.floor(Math.random() * 1_000_000)}`;
    const signature = createHash("sha256").update(`${reference}${cents}COP${secret("WOMPI_INTEGRITY_SECRET")}`).digest("hex");
    const params = new URLSearchParams({
      "public-key": secret("NEXT_PUBLIC_WOMPI_PUBLIC_KEY"),
      currency: "COP",
      "amount-in-cents": String(cents),
      reference,
      "signature:integrity": signature,
      "redirect-url": `${returnUrl}?method=wompi&wompi=method`,
    });
    return { gateway, checkoutUrl: `https://checkout.wompi.co/p/?${params}` };
  }

  const session = await backend<{ success?: boolean; data?: { sessionId?: string } }>("/v2/epayco/create-session", {
    amount,
    description: `Compra de vehículo ${input.vehicleName.slice(0, 100)}`,
    urlResponse: `${returnUrl}?method=wompi&wompi=method`,
  });
  const sessionId = session.data?.sessionId;
  if (!session.success || !sessionId) throw new SeparationError("No pudimos iniciar el pago con ePayco.", 502);
  return { gateway, sessionId, reviewId };
}

/* ---- OTP del correo: el código se queda en el servidor, en una cookie firmada ---- */

export const OTP_COOKIE = "wcar_sep_otp";
export const OTP_TTL_SECONDS = 10 * 60;

const sign = (email: string, code: string, exp: number) =>
  createHmac("sha256", secret("SEPARATION_SECRET")).update(`${email}:${code}:${exp}`).digest("base64url");

/** Pide el código por correo y devuelve el valor de la cookie que lo ata a ese correo. */
export async function sendEmailCode(email: string): Promise<string> {
  const data = await backend<{ code?: string | number }>("/send-otp-code-verifacated/", { email, login: false });
  if (!data.code) throw new SeparationError("No pudimos enviar el código. Revisa el correo.", 502);
  const exp = Math.floor(Date.now() / 1000) + OTP_TTL_SECONDS;
  return `${exp}.${sign(email, String(data.code), exp)}`;
}

function assertCode(cookie: string | undefined, email: string, code: string): void {
  const [expText, mac = ""] = (cookie ?? "").split(".");
  const exp = Number(expText);
  const valid = Number.isFinite(exp) && exp > Date.now() / 1000 && /^\d{6}$/.test(code);
  const expected = valid ? sign(email, code, exp) : "";
  const ok = valid && mac.length === expected.length && timingSafeEqual(Buffer.from(mac), Buffer.from(expected));
  // shortcut: sin límite de intentos por cookie (1e6 combinaciones); poner uno en el backend o con rate-limit.
  if (!ok) throw new SeparationError("El código es incorrecto o ya venció. Revísalo o pide uno nuevo.", 401);
}

export type ConfirmInput = {
  reviewId: string;
  name: string;
  lastName: string;
  phone: string;
  email: string;
  code: string;
  dateId: string;
  hourId: string;
  /** Referencia del pago, si la pasarela la dejó en la URL de retorno. */
  transactionId?: string;
  sessionId?: string;
};

export async function confirmSeparation(input: ConfirmInput, otpCookie: string | undefined): Promise<void> {
  assertCode(otpCookie, input.email, input.code);
  await backend(`/confirm-review/${encodeURIComponent(input.reviewId)}/`, {
    name: input.name,
    lastName: input.lastName,
    phone: input.phone,
    email: input.email,
    wompi: true,
    date_avaliable: input.dateId,
    hour_avaliable: input.hourId,
    // TODO(backend): confirmar los nombres; `confirm-review` hoy no recibe referencia del pago.
    ...(input.transactionId ? { wompi_transaction_id: input.transactionId } : {}),
    ...(input.sessionId ? { session_id: input.sessionId } : {}),
  });
}

/** Respuesta de error de los route handlers; los errores ajenos se registran y se ocultan. */
export function separationErrorResponse(error: unknown): Response {
  const known = error instanceof SeparationError ? error : null;
  if (!known && (error as { status?: number })?.status === undefined) console.error("Error inesperado en separar:", error);
  const status = known?.status ?? (error as { status?: number })?.status ?? 500;
  const message = known?.message ?? (status < 500 ? (error as Error).message : "Algo salió mal. Inténtalo de nuevo.");
  return Response.json({ error: message }, { status });
}

export const str = (value: unknown, max = 200) => (typeof value === "string" ? value.trim().slice(0, max) : "");
