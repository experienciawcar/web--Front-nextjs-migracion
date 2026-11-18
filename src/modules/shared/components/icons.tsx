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
export function HeartIcon({
  className = "",
  fit = false,
}: {
  className?: string;
  /** Recorta el margen del dibujo para que el corazón llene la caja (ficha del vehículo, 24 x 24). */
  fit?: boolean;
}) {
  return (
    <svg viewBox={fit ? "2.8 3.4 19.4 19.4" : "0 0 24 24"} fill="none" className={className} aria-hidden>
      <path
        d="M12 20.2 5.5 13.9c-2-2-2-5.2 0-7.1 1.9-2 5.1-2 7 0l-.5.5.5-.5c1.9-2 5.1-2 7 0 2 1.9 2 5.1 0 7.1L12 20.2Z"
        stroke="currentColor"
        strokeWidth={fit ? 1.7 : 1.6}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Control deslizante ("filtros") del botón Filtrar en mobile. */
export function FiltersIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M3 7h5M14 7h7M3 17h9M18 17h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="11" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="17" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Logo de WhatsApp (burbuja con teléfono), en `currentColor`. */
export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2 22l5-1.6A9.9 9.9 0 1 0 12.04 2Zm0 18.1c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .9 1-2.9-.2-.3a8.1 8.1 0 1 1 6.6 3.6Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.600 6.600 0 0 1-3.300-2.900c-.2-.4.2-.4.700-1.300.1-.2 0-.3 0-.5l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.300-.2.300-.9.900-.9 2.200s.9 2.500 1 2.700c.1.200 1.800 2.800 4.400 3.900 1.600.7 2.300.7 3.100.6.500-.1 1.500-.6 1.700-1.200.2-.6.2-1.100.2-1.200-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
