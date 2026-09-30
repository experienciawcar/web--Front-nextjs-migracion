import { AuthError } from "../types/auth";

/**
 * Defensa CSRF de los route handlers de auth. La cookie es `SameSite=Lax` (no
 * viaja en un POST de otro sitio); además se exige JSON y que el `Origin`, si
 * viene, sea el mismo host.
 */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) throw new AuthError("Solicitud no permitida.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) throw new AuthError("Solicitud no válida.", 415);
}

export async function readJson<T extends Record<string, unknown>>(request: Request): Promise<Partial<T>> {
  assertSameOrigin(request);
  try {
    return (await request.json()) as Partial<T>;
  } catch {
    throw new AuthError("Solicitud no válida.");
  }
}

/** Respuesta de error con el mensaje de un `AuthError`; cualquier otro error se registra y se oculta. */
export function errorResponse(error: unknown): Response {
  if (error instanceof AuthError) return Response.json({ error: error.message }, { status: error.status });
  console.error("Error inesperado en auth:", error);
  return Response.json({ error: "Algo salió mal. Inténtalo de nuevo." }, { status: 500 });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function parseEmail(value: unknown): string {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) throw new AuthError("Escribe un correo válido.");
  return email;
}
