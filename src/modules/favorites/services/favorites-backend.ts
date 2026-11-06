import { apiUrl } from "@/modules/shared/services/api";
import type { VehicleDto } from "@/modules/shared/types/vehicle";
import { AuthError } from "@/modules/auth/types/auth";

/**
 * Favoritos en el backend (docs/FAVORITOS.md §1). Solo corre en el servidor: el token es HttpOnly.
 * Un 401 es token vencido; quien llama cierra la sesión.
 */
async function call(path: string, token: string, init: RequestInit = {}): Promise<Response> {
  const response = await fetch(apiUrl(path), {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (response.status === 401) throw new AuthError("Tu sesión venció. Inicia sesión de nuevo.", 401);
  if (!response.ok) throw new AuthError("No pudimos actualizar tus favoritos.", response.status >= 500 ? 502 : 400);
  return response;
}

/** Vehículos favoritos, el último guardado primero. Acepta un array o un paginado `{ results }`. */
export async function listFavorites(token: string): Promise<VehicleDto[]> {
  const data: unknown = await (await call("/favorites/", token)).json().catch(() => []);
  const list = Array.isArray(data) ? data : (data as { results?: unknown })?.results;
  return Array.isArray(list) ? (list as VehicleDto[]) : [];
}

export const addFavorite = (token: string, carId: number) =>
  call("/favorites/", token, { method: "POST", body: JSON.stringify({ car_id: String(carId) }) });

export const removeFavorite = (token: string, carId: number) =>
  call(`/favorites/${carId}/`, token, { method: "DELETE" });
