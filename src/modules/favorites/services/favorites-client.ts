import { SESSION_EVENT, SESSION_HINT_COOKIE } from "@/modules/auth/constants/auth";

/**
 * Estado de favoritos en el navegador: los ids del usuario, compartidos por todos los corazones de
 * la página. Se cargan una vez (si hay sesión) y se actualizan de forma optimista. Para
 * `useSyncExternalStore` el snapshot es un texto, así compara por valor.
 */
const listeners = new Set<() => void>();
let ids: number[] = [];
let loading = false;
let loaded = false;
let cached = "[]";

function set(next: number[]) {
  ids = next;
  cached = JSON.stringify(next);
  listeners.forEach((l) => l());
}

const hasSession = () => document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_HINT_COOKIE}=`));

async function load() {
  if (loaded || loading || !hasSession()) return;
  loading = true;
  try {
    const response = await fetch("/api/favorites");
    if (response.ok) {
      set(((await response.json()) as { ids: number[] }).ids);
      loaded = true;
    }
  } catch {
    // sin red: los corazones quedan vacíos y se reintenta al siguiente montaje
  } finally {
    loading = false;
  }
}

export function subscribeFavorites(listener: () => void) {
  listeners.add(listener);
  void load();
  return () => listeners.delete(listener);
}

export const favoritesSnapshot = () => cached;
export const favoritesServerSnapshot = () => "[]";

/** Forzar recarga al iniciar o cerrar sesión (la cookie cambió). */
export function resetFavorites() {
  loaded = false;
  set([]);
  void load();
}

/** Marca o desmarca con update optimista; si el backend falla, revierte. Devuelve `false` si falló. */
export async function setFavorite(carId: number, like: boolean): Promise<boolean> {
  const before = ids;
  set(like ? [carId, ...ids.filter((id) => id !== carId)] : ids.filter((id) => id !== carId));
  try {
    const response = await fetch(like ? "/api/favorites" : `/api/favorites/${carId}`, {
      method: like ? "POST" : "DELETE",
      headers: { "Content-Type": "application/json" },
      body: like ? JSON.stringify({ carId }) : undefined,
    });
    if (!response.ok) throw new Error(String(response.status));
    return true;
  } catch {
    set(before);
    return false;
  }
}

export const isLoggedIn = hasSession;

// Al iniciar o cerrar sesión (el navbar usa el mismo evento) se vacía y se recarga la lista.
if (typeof window !== "undefined") window.addEventListener(SESSION_EVENT, resetFavorites);
