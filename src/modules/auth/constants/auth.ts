/** Cookies de la sesión. El token y el usuario son HttpOnly; `SESSION_HINT_COOKIE` no (ver `session.ts`). */
export const TOKEN_COOKIE = "wcar_token";
export const USER_COOKIE = "wcar_user";
export const SESSION_HINT_COOKIE = "wcar_session";

/** Evento que avisa al navbar de que la sesión cambió sin recargar la página. */
export const SESSION_EVENT = "wcar:session";

/** Largo del código que manda el backend por correo. */
export const OTP_LENGTH = 6;

/** Segundos antes de poder pedir otro código. */
export const OTP_RESEND_SECONDS = 30;

/**
 * Client ID de OAuth de Google (público por diseño: va en el navegador). Es el
 * mismo proyecto de Google Cloud del sitio anterior, así que los orígenes
 * autorizados ya cubren wcar.co. Se puede sobrescribir con
 * NEXT_PUBLIC_GOOGLE_CLIENT_ID.
 */
export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  "163733969300-ptdldtlv8ee8tkrs074ptpuiuvephf9p.apps.googleusercontent.com";
