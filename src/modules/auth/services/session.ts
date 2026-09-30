import { cookies } from "next/headers";

import { SESSION_HINT_COOKIE, TOKEN_COOKIE, USER_COOKIE } from "../constants/auth";
import type { SessionHint, User } from "../types/auth";

/** Duración de la sesión si el token no trae `exp`. */
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;
const MAX_AGE_CAP = 60 * 60 * 24 * 30;

/** Segundos que le quedan al JWT (su `exp`), acotado; sin `exp` legible, una semana. */
function maxAgeOf(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    if (typeof payload.exp === "number") {
      return Math.min(Math.max(payload.exp - Math.floor(Date.now() / 1000), 60), MAX_AGE_CAP);
    }
  } catch {
    // no es un JWT legible: se usa la duración por defecto
  }
  return DEFAULT_MAX_AGE;
}

const base = () => ({
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
});

/**
 * Guarda la sesión en cookies. El token y el usuario son HttpOnly: un XSS no
 * puede leerlos (en el sitio anterior vivían en localStorage). Solo el nombre
 * va en una cookie legible (`wcar_session`) para que el navbar pinte "Hola,
 * Ana" sin pedir nada al servidor; no sirve para autenticar nada.
 */
export async function createSession(token: string, user: User): Promise<void> {
  const store = await cookies();
  const maxAge = maxAgeOf(token);
  store.set(TOKEN_COOKIE, token, { ...base(), httpOnly: true, maxAge });
  store.set(USER_COOKIE, JSON.stringify(user), { ...base(), httpOnly: true, maxAge });
  writeHint(store, user, maxAge);
}

/** Actualiza el usuario guardado (p. ej. tras editar el nombre) sin tocar el token. */
export async function updateSessionUser(user: User): Promise<void> {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;
  if (!token) return;
  const maxAge = maxAgeOf(token);
  store.set(USER_COOKIE, JSON.stringify(user), { ...base(), httpOnly: true, maxAge });
  writeHint(store, user, maxAge);
}

function writeHint(store: Awaited<ReturnType<typeof cookies>>, user: User, maxAge: number) {
  const hint: SessionHint = { name: user.name || user.email.split("@")[0] };
  store.set(SESSION_HINT_COOKIE, encodeURIComponent(JSON.stringify(hint)), { ...base(), httpOnly: false, maxAge });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  for (const name of [TOKEN_COOKIE, USER_COOKIE, SESSION_HINT_COOKIE]) store.delete(name);
}

export async function getSessionToken(): Promise<string | null> {
  return (await cookies()).get(TOKEN_COOKIE)?.value ?? null;
}

/** El usuario de la sesión, o `null`. No valida el token contra el backend: no hay `GET /me`. */
export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  if (!store.get(TOKEN_COOKIE)?.value) return null;
  try {
    const user = JSON.parse(store.get(USER_COOKIE)?.value ?? "") as User;
    return typeof user.email === "string" ? user : null;
  } catch {
    return null;
  }
}
