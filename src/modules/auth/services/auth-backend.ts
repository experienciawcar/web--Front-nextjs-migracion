import { apiUrl } from "@/modules/shared/services/api";

import { AuthError, type LoginResponseDto, type User, type UserDto } from "../types/auth";

/**
 * Llamadas al backend de auth. Solo corren en el servidor (los route handlers de
 * `app/api/auth`): el navegador nunca ve el token del backend ni el código OTP.
 */

function toUser(dto: UserDto | undefined, fallbackEmail = ""): User {
  return {
    id: String(dto?.id ?? ""),
    name: (dto?.name ?? "").trim(),
    email: (dto?.email ?? fallbackEmail).trim(),
    phone: (dto?.phone ?? "").trim(),
  };
}

async function post<T>(path: string, body: unknown, token?: string, method = "POST"): Promise<{ status: number; data: T | null }> {
  const response = await fetch(apiUrl(path), {
    method,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as T | null;
  return { status: response.status, data };
}

/**
 * Pide el código por correo. El backend devuelve el código en el cuerpo de la
 * respuesta; aquí se descarta a propósito: el OTP jamás debe llegar al navegador.
 */
export async function sendOtp(email: string): Promise<void> {
  const { status, data } = await post<{ error?: string }>("/send-otp-code/", { email, login: true });
  if (status >= 400) {
    console.error("send-otp-code respondió", status);
    throw new AuthError("No pudimos enviar el código. Revisa el correo e inténtalo de nuevo.", status >= 500 ? 502 : 400);
  }
  if (data?.error) throw new AuthError("No pudimos enviar el código. Revisa el correo e inténtalo de nuevo.");
}

/** Valida el código y devuelve el token y el usuario. */
export async function verifyOtp(email: string, code: string): Promise<{ token: string; user: User }> {
  const { status, data } = await post<LoginResponseDto>("/verificate-otp-code-login/", { email, code });
  // El backend responde 500 (no 401) con un código que no corresponde: para el usuario es lo mismo.
  if (status >= 400 || !data?.token) throw new AuthError("El código es incorrecto o ya venció. Revísalo o pide uno nuevo.", 401);
  return { token: data.token, user: toUser(data.user, email) };
}

/**
 * Inicia sesión con un correo que Google ya verificó (ver `google-token.ts`).
 * Si la cuenta no existe la crea primero: el backend actual no tiene un
 * endpoint de "iniciar o crear" y `/login-google/` responde 401 a un correo nuevo.
 *
 * TODO(backend): `/register/` exige teléfono y contraseña. Se manda una contraseña
 * aleatoria por cuenta (nadie la usa: el acceso es por OTP o Google) y el
 * teléfono de relleno que ya usaba el sitio anterior. Cuando exista
 * `POST /auth/google { credential }` (ver docs/CUENTA_DE_USUARIO_Y_LOGIN.md §10.2)
 * esto se reemplaza por una sola llamada con el credential.
 */
export async function loginWithGoogle(profile: { email: string; name: string }): Promise<{ token: string; user: User }> {
  let result = await post<LoginResponseDto>("/login-google/", { email: profile.email });
  if (result.status === 401 || result.status === 404) {
    await post("/register/", {
      name: profile.name || profile.email.split("@")[0],
      email: profile.email,
      phone: "12345678",
      password: `${crypto.randomUUID()}-Aa1!`,
      role: "client",
    });
    result = await post<LoginResponseDto>("/login-google/", { email: profile.email });
  }
  if (result.status >= 500) throw new AuthError("El servicio no está disponible. Inténtalo en unos minutos.", 502);
  if (result.status >= 400 || !result.data?.token) throw new AuthError("No pudimos iniciar sesión con Google.", 401);
  return { token: result.data.token, user: toUser(result.data.user, profile.email) };
}

/** `PATCH /user/update/`. Un 401 significa token vencido: quien llama cierra la sesión. */
export async function updateProfile(token: string, data: { name: string; email: string }): Promise<void> {
  const { status } = await post("/user/update/", data, token, "PATCH");
  if (status === 401) throw new AuthError("Tu sesión venció. Inicia sesión de nuevo.", 401);
  if (status >= 400) throw new AuthError("No pudimos guardar los cambios.", status >= 500 ? 502 : 400);
}
