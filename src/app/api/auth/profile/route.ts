import { updateProfile } from "@/modules/auth/services/auth-backend";
import { errorResponse, readJson } from "@/modules/auth/services/request";
import { destroySession, getSessionToken, getSessionUser, updateSessionUser } from "@/modules/auth/services/session";
import { AuthError } from "@/modules/auth/types/auth";

/** `PATCH /api/auth/profile { name }`: cambia el nombre. El correo es la identidad (OTP) y no se edita. */
export async function PATCH(request: Request) {
  try {
    const body = await readJson<{ name: string }>(request);
    const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
    if (name.length < 2 || name.length > 80) throw new AuthError("Escribe tu nombre (entre 2 y 80 letras).");

    const [token, user] = await Promise.all([getSessionToken(), getSessionUser()]);
    if (!token || !user) throw new AuthError("Inicia sesión para continuar.", 401);

    try {
      await updateProfile(token, { name, email: user.email });
    } catch (error) {
      if (error instanceof AuthError && error.status === 401) await destroySession();
      throw error;
    }
    const updated = { ...user, name };
    await updateSessionUser(updated);
    return Response.json({ user: { name } });
  } catch (error) {
    return errorResponse(error);
  }
}
