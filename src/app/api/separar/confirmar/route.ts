import { cookies } from "next/headers";

import { parseEmail, readJson } from "@/modules/auth/services/request";
import {
  confirmSeparation,
  OTP_COOKIE,
  separationErrorResponse,
  SeparationError,
  str,
} from "@/modules/separation/services/separation-server";

/** `POST /api/separar/confirmar`: valida el código del correo en el servidor y confirma la separación. */
export async function POST(request: Request) {
  try {
    const b = await readJson<Record<string, unknown>>(request);
    const input = {
      reviewId: str(b.reviewId, 20),
      name: str(b.name, 50),
      lastName: str(b.lastName, 50),
      phone: str(b.phone, 20),
      email: parseEmail(b.email),
      code: str(b.code, 6),
      dateId: str(b.dateId, 20),
      hourId: str(b.hourId, 20),
      transactionId: str(b.transactionId, 100) || undefined,
      sessionId: str(b.sessionId, 100) || undefined,
    };
    if (!/^\d+$/.test(input.reviewId) || !/^\d+$/.test(input.dateId) || !/^\d+$/.test(input.hourId) || !input.name || !input.phone) {
      throw new SeparationError("Faltan datos de la cita.");
    }
    const store = await cookies();
    await confirmSeparation(input, store.get(OTP_COOKIE)?.value);
    store.delete({ name: OTP_COOKIE, path: "/api/separar" });
    return Response.json({ ok: true });
  } catch (error) {
    return separationErrorResponse(error);
  }
}
