import { loginWithPassword } from "@/modules/auth/services/auth-backend";
import { errorResponse, parseEmail, readJson } from "@/modules/auth/services/request";
import { createSession } from "@/modules/auth/services/session";
import { AuthError } from "@/modules/auth/types/auth";

/** `POST /api/auth/login { email, password }`: abre la sesión (cookies HttpOnly). */
export async function POST(request: Request) {
  try {
    const body = await readJson<{ email: string; password: string }>(request);
    const email = parseEmail(body.email);
    if (typeof body.password !== "string" || !body.password) throw new AuthError("Escribe tu contraseña.");

    const { token, user } = await loginWithPassword(email, body.password);
    await createSession(token, user);
    return Response.json({ user: { name: user.name } });
  } catch (error) {
    return errorResponse(error);
  }
}
