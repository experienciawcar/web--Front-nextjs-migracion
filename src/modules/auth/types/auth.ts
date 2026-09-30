/** Usuario como lo manda el backend en `{ token, user }` (campos usados). */
export type UserDto = {
  id?: number | string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
};

/** Respuesta de `/verificate-otp-code-login/` y `/login-google/`. */
export type LoginResponseDto = {
  token?: string;
  user?: UserDto;
};

/** Lo que necesitan las vistas: sin nulos y sin el token. */
export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

/** Lo único que lee el navegador de la sesión (cookie `wcar_session`, no HttpOnly). */
export type SessionHint = { name: string };

/** Error de una operación de auth con un mensaje que se puede mostrar tal cual. */
export class AuthError extends Error {
  constructor(
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
  }
}
