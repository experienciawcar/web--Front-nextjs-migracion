import { assertSameOrigin, errorResponse } from "@/modules/auth/services/request";
import { destroySession, getSessionToken } from "@/modules/auth/services/session";
import { AuthError } from "@/modules/auth/types/auth";
import { removeFavorite } from "@/modules/favorites/services/favorites-backend";

/** `DELETE /api/favorites/<id>` */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    const id = Number((await params).id);
    if (!Number.isInteger(id)) throw new AuthError("Vehículo no válido.");
    const token = await getSessionToken();
    if (!token) throw new AuthError("Inicia sesión para continuar.", 401);
    try {
      await removeFavorite(token, id);
    } catch (error) {
      if (error instanceof AuthError && error.status === 401) await destroySession();
      throw error;
    }
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
