/**
 * Íconos genéricos que necesitan cambiar de color según el estado (el corazón
 * de favoritos, la lupa del buscador) y por eso van como SVG en línea, con
 * `stroke="currentColor"`, en vez de `next/image` (que renderiza un `<img>` y
 * no deja controlar su color por CSS).
 */

export function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="7.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20.5 20.5 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/** Corazón de "favoritos" de la tarjeta de vehículo: solo el contorno, sin rellenar (aún no hay estado guardado). */
export function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 20.2 5.5 13.9c-2-2-2-5.2 0-7.1 1.9-2 5.1-2 7 0l-.5.5.5-.5c1.9-2 5.1-2 7 0 2 1.9 2 5.1 0 7.1L12 20.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
