import { OTP_LENGTH } from "@/modules/auth/constants/auth";
import { verifyOtp } from "@/modules/auth/services/auth-backend";
import { errorResponse, parseEmail, readJson } from "@/modules/auth/services/request";
import { createSession } from "@/modules/auth/services/session";
import { AuthError } from "@/modules/auth/types/auth";

/** `POST /api/auth/otp/verify { email, code }`: valida el código y abre la sesión (cookies HttpOnly). */
export async function POST(request: Request) {
  try {
    const body = await readJson<{ email: string; code: string }>(request);
    const email = parseEmail(body.email);
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) throw new AuthError(`El código tiene ${OTP_LENGTH} dígitos.`);

    const { token, user } = await verifyOtp(email, code);
    await createSession(token, user);
    return Response.json({ user: { name: user.name } });
  } catch (error) {
    return errorResponse(error);
  }
}
