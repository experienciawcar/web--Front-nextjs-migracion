import { SESSION_EVENT } from "../constants/auth";

/**
 * Llamadas del navegador a los route handlers de `app/api/auth`. Devuelven
 * `{ error }` con un mensaje listo para mostrar, nunca lanzan.
 */
type Result = { ok: true } | { ok: false; error: string };

async function call(path: string, method: "POST" | "PATCH", body?: unknown): Promise<Result> {
  try {
    const response = await fetch(`/api/auth${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
    if (response.ok) return { ok: true };
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, error: data?.error ?? "Algo salió mal. Inténtalo de nuevo." };
  } catch {
    return { ok: false, error: "No hay conexión. Revisa tu internet e inténtalo de nuevo." };
  }
}

/** Avisa al navbar de que la cookie de sesión cambió. */
export function notifySessionChange(): void {
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export const sendOtpCode = (email: string) => call("/otp/send", "POST", { email });
export const verifyOtpCode = (email: string, code: string) => call("/otp/verify", "POST", { email, code });
export const signInWithGoogleCredential = (credential: string) => call("/google", "POST", { credential });
export const signOut = () => call("/logout", "POST");
export const updateName = (name: string) => call("/profile", "PATCH", { name });

/** Solo rutas internas: evita que `?next=` mande al usuario a otro sitio tras iniciar sesión. */
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
