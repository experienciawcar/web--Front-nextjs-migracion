import { useEffect, useState } from "react";

/**
 * Devuelve `value` con un retraso: cambia recién cuando `value` deja de
 * cambiar por `delayMs`. Lo usan el buscador de texto (1000ms) y los rangos
 * de precio/kilometraje (600ms) para no disparar una búsqueda por cada tecla
 * o cada pixel arrastrado del slider — mismo criterio que la SPA anterior
 * (ver `docs/planes/compra-tu-carro/referencia-sitio-anterior.md` §7).
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
