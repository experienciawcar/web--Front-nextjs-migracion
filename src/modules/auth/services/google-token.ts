import { GOOGLE_CLIENT_ID } from "../constants/auth";
import { AuthError } from "../types/auth";

type TokenInfo = {
  aud?: string;
  iss?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  exp?: string;
  error_description?: string;
};

/**
 * Verifica el `credential` (JWT) que entrega Google Identity Services, en el
 * servidor. El endpoint `tokeninfo` de Google comprueba la firma y la vigencia;
 * aquí se comprueba además que el token fue emitido PARA esta app (`aud`) y que
 * el correo está verificado. Sin esto, cualquiera podría declarar el correo de
 * otra persona (el sitio anterior hacía eso: confiaba en el `email` del cliente).
 */
export async function verifyGoogleCredential(credential: string): Promise<{ email: string; name: string }> {
  const invalid = new AuthError("No pudimos verificar tu cuenta de Google.", 401);
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw invalid;

  const info = (await response.json()) as TokenInfo;
  const issuerOk = info.iss === "accounts.google.com" || info.iss === "https://accounts.google.com";
  const verified = info.email_verified === true || info.email_verified === "true";
  if (info.aud !== GOOGLE_CLIENT_ID || !issuerOk || !verified || !info.email) throw invalid;

  return { email: info.email.toLowerCase(), name: (info.name ?? "").trim() };
}
