import { errorResponse, readJson } from "@/modules/auth/services/request";
import { destroySession, getSessionToken } from "@/modules/auth/services/session";
import { AuthError } from "@/modules/auth/types/auth";
import { addFavorite, listFavorites } from "@/modules/favorites/services/favorites-backend";

async function withToken<T>(run: (token: string) => Promise<T>): Promise<T> {
  const token = await getSessionToken();
  if (!token) throw new AuthError("Inicia sesión para continuar.", 401);
  try {
    return await run(token);
  } catch (error) {
    if (error instanceof AuthError && error.status === 401) await destroySession();
    throw error;
  }
}

/** `GET /api/favorites` → `{ ids }` de los vehículos favoritos del usuario. */
export async function GET() {
  try {
    const list = await withToken(listFavorites);
    return Response.json({ ids: list.map((v) => v.id) });
  } catch (error) {
    return errorResponse(error);
  }
}

/** `POST /api/favorites { carId }` */
export async function POST(request: Request) {
  try {
    const { carId } = await readJson<{ carId: number }>(request);
    if (!Number.isInteger(carId)) throw new AuthError("Vehículo no válido.");
    await withToken((token) => addFavorite(token, carId as number));
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
