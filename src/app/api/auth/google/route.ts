import { loginWithGoogle } from "@/modules/auth/services/auth-backend";
import { verifyGoogleCredential } from "@/modules/auth/services/google-token";
import { errorResponse, readJson } from "@/modules/auth/services/request";
import { createSession } from "@/modules/auth/services/session";
import { AuthError } from "@/modules/auth/types/auth";

/** `POST /api/auth/google { credential }`: verifica el JWT de Google en el servidor y abre la sesión. */
export async function POST(request: Request) {
  try {
    const body = await readJson<{ credential: string }>(request);
    if (typeof body.credential !== "string" || !body.credential) throw new AuthError("Solicitud no válida.");

    const profile = await verifyGoogleCredential(body.credential);
    const { token, user } = await loginWithGoogle(profile);
    await createSession(token, user);
    return Response.json({ user: { name: user.name } });
  } catch (error) {
    return errorResponse(error);
  }
}
