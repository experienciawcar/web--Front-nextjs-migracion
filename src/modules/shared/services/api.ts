/**
 * URL completa de un endpoint del backend. La base sale de
 * NEXT_PUBLIC_API_BASE_URL (en .env.local, ya incluye el `/api`), y `path`
 * arranca con `/` y conserva la barra final: el backend es Django y sin ella
 * redirige.
 *
 * Si la variable falta lanza en vez de degradar: es un error de configuración,
 * no de red, y no debe quedar escondido tras una sección vacía.
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) {
    throw new Error("Falta la variable de entorno NEXT_PUBLIC_API_BASE_URL (ver .env.local).");
  }
  return `${base.replace(/\/$/, "")}${path}`;
}
