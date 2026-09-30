import { sendOtp } from "@/modules/auth/services/auth-backend";
import { errorResponse, parseEmail, readJson } from "@/modules/auth/services/request";

/** `POST /api/auth/otp/send { email }`: pide el código por correo. Nunca devuelve el código. */
export async function POST(request: Request) {
  try {
    const body = await readJson<{ email: string }>(request);
    await sendOtp(parseEmail(body.email));
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
