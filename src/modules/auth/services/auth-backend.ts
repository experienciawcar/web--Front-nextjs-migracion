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

/** Mensaje de error del backend (`error`, `message` o `detail`) o el de respaldo. */
function backendMessage(data: unknown, fallback: string): string {
  const d = (data ?? {}) as { error?: unknown; message?: unknown; detail?: unknown };
  const msg = [d.error, d.message, d.detail].find((v) => typeof v === "string" && v);
  return (msg as string | undefined) ?? fallback;
}

/** `POST /login/ { email, password }`. */
export async function loginWithPassword(email: string, password: string): Promise<{ token: string; user: User }> {
  const { status, data } = await post<LoginResponseDto>("/login/", { email, password });
  if (status >= 500) throw new AuthError("El servicio no está disponible. Inténtalo en unos minutos.", 502);
  if (status >= 400 || !data?.token) throw new AuthError(backendMessage(data, "Correo o contraseña incorrectos."), 401);
  return { token: data.token, user: toUser(data.user, email) };
}

/** `POST /register-customer/`; quien llama inicia sesión después con `loginWithPassword`. */
export async function registerCustomer(input: { name: string; email: string; phone: string; password: string }): Promise<void> {
  const { status, data } = await post("/register-customer/", input);
  if (status >= 500) throw new AuthError("El servicio no está disponible. Inténtalo en unos minutos.", 502);
  if (status >= 400) throw new AuthError(backendMessage(data, "No pudimos crear la cuenta."), 400);
}

/** `POST /login-google/ { credential }`: el backend verifica el ID token con Google y crea la cuenta si no existe. */
export async function loginWithGoogle(credential: string): Promise<{ token: string; user: User }> {
  const { status, data } = await post<LoginResponseDto>("/login-google/", { credential });
  if (status >= 500) throw new AuthError("El servicio no está disponible. Inténtalo en unos minutos.", 502);
  if (status >= 400 || !data?.token) throw new AuthError("No pudimos iniciar sesión con Google.", 401);
  return { token: data.token, user: toUser(data.user) };
}

/** `PATCH /user/update/`. Un 401 significa token vencido: quien llama cierra la sesión. */
export async function updateProfile(token: string, data: { name: string; email: string }): Promise<void> {
  const { status } = await post("/user/update/", data, token, "PATCH");
  if (status === 401) throw new AuthError("Tu sesión venció. Inicia sesión de nuevo.", 401);
  if (status >= 400) throw new AuthError("No pudimos guardar los cambios.", status >= 500 ? 502 : 400);
}
