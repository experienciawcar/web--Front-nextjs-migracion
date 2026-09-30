import { apiUrl } from "@/modules/shared/services/api";

export type ExpertiseLead = {
  name: string;
  phone: string;
  email: string;
  vehicleId: number;
};

export type LeadStepResult = { ok: true } | { ok: false; message: string };

/** Celular colombiano: `57XXXXXXXXXX` (12 dígitos) o `3XXXXXXXXX` (10) → `+57…`; `null` si no cumple. */
export function toColombianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (/^57\d{10}$/.test(digits)) return `+${digits}`;
  if (/^3\d{9}$/.test(digits)) return `+57${digits}`;
  return null;
}

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** `POST /send-otp-to-phone-twilio/`: manda el código de 6 dígitos por SMS. */
export async function sendPhoneCode(phone: string): Promise<LeadStepResult> {
  try {
    const response = await post("/send-otp-to-phone-twilio/", {
      phone_number: phone,
    });
    const data: { code?: unknown; error?: string } = await response.json();
    if (response.ok && data.code) return { ok: true };
    return {
      ok: false,
      message: data.error || "No pudimos enviar el código. Intenta de nuevo.",
    };
  } catch {
    return {
      ok: false,
      message: "No pudimos enviar el código. Intenta de nuevo.",
    };
  }
}

/** `POST /verify-otp-of-phone/`: confirma el código que llegó por SMS. */
export async function verifyPhoneCode(
  phone: string,
  code: string,
): Promise<LeadStepResult> {
  try {
    const response = await post("/verify-otp-of-phone/", { phone, code });
    const data: { success?: boolean } = await response.json();
    if (response.ok && data.success) return { ok: true };
    return {
      ok: false,
      message: "Código incorrecto. Revísalo e intenta de nuevo.",
    };
  } catch {
    return {
      ok: false,
      message: "No pudimos verificar el código. Intenta de nuevo.",
    };
  }
}

/** `POST /data-user-colections/create/`: registra a quien pidió el peritaje (el lead). */
export async function saveExpertiseLead(
  lead: ExpertiseLead & { phone: string },
): Promise<LeadStepResult> {
  try {
    const response = await post("/data-user-colections/create/", {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      terms: true,
      car: lead.vehicleId,
    });
    if (response.ok) return { ok: true };
    return {
      ok: false,
      message: "No pudimos guardar tus datos. Intenta de nuevo.",
    };
  } catch {
    return {
      ok: false,
      message: "No pudimos guardar tus datos. Intenta de nuevo.",
    };
  }
}
