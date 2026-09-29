/**
 * Adorno de dos paralelogramos de contorno amarillo apilados: cada uno mide 106
 * de base y 102 de alto con la inclinación a 45° (el lado derecho baja hacia la
 * izquierda), y el segundo empieza donde acaba el primero, de modo que las dos
 * bases del medio forman una sola línea. Aparece en "Servicios Postventa" y en
 * "Nuestro taller".
 *
 * Medido de la captura de "Servicios Postventa": la caja completa es de 208 x
 * 204 y el trazo de ~3 px, en el amarillo del sistema (`yellow`; en la captura
 * se ve 255,171,81). Es decoración: `aria-hidden` y sin interacción.
 */
export default function ParallelogramsComponent({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 208 204"
      fill="none"
      className={`pointer-events-none h-[204px] w-[208px] max-w-none overflow-visible stroke-yellow ${className}`}
      strokeWidth={3}
      strokeLinejoin="round"
    >
      <path d="M102.7 0H208.1L104 101.9H0.3L102.7 0Z" />
      <path d="M102.7 101.9H208.1L104 203.9H0.3L102.7 101.9Z" />
    </svg>
  );
}
