import { loginWithPassword, registerCustomer } from "@/modules/auth/services/auth-backend";
import { errorResponse, parseEmail, readJson } from "@/modules/auth/services/request";
import { createSession } from "@/modules/auth/services/session";
import { AuthError } from "@/modules/auth/types/auth";

/** `POST /api/auth/register { name, email, phone, password }`: crea la cuenta e inicia sesión. */
export async function POST(request: Request) {
  try {
    const body = await readJson<{ name: string; email: string; phone: string; password: string }>(request);
    const email = parseEmail(body.email);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!name || name.length > 100) throw new AuthError("Escribe tu nombre.");
    if (!/^[\d\s+()-]{7,20}$/.test(phone)) throw new AuthError("Escribe un teléfono válido.");
    if (password.length < 8) throw new AuthError("La contraseña debe tener mínimo 8 caracteres.");

    await registerCustomer({ name, email, phone, password });
    const { token, user } = await loginWithPassword(email, password);
    await createSession(token, user);
    return Response.json({ user: { name: user.name } });
  } catch (error) {
    return errorResponse(error);
  }
}
