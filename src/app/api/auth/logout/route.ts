import { assertSameOrigin, errorResponse } from "@/modules/auth/services/request";
import { destroySession } from "@/modules/auth/services/session";

/**
 * `POST /api/auth/logout`: borra las cookies. El backend no tiene endpoint de
 * cierre, así que su token sigue válido hasta expirar (ver
 * docs/CUENTA_DE_USUARIO_Y_LOGIN.md §4.4); lo que cambia es que el navegador ya no lo tiene.
 */
export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await destroySession();
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
