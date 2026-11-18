import { cookies } from "next/headers";

import { parseEmail, readJson } from "@/modules/auth/services/request";
import { OTP_COOKIE, OTP_TTL_SECONDS, sendEmailCode, separationErrorResponse } from "@/modules/separation/services/separation-server";

/** `POST /api/separar/otp { email }`: manda el código por correo. El código no vuelve al navegador. */
export async function POST(request: Request) {
  try {
    const body = await readJson<{ email: string }>(request);
    const value = await sendEmailCode(parseEmail(body.email));
    (await cookies()).set(OTP_COOKIE, value, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/separar",
      maxAge: OTP_TTL_SECONDS,
    });
    return Response.json({ ok: true });
  } catch (error) {
    return separationErrorResponse(error);
  }
}
