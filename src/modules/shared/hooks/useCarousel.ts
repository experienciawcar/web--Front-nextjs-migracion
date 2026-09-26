import { useCallback, useRef, useState } from "react";

type Metrics = {
  /** Lo que avanza el scroll para pasar al siguiente elemento: su ancho más la separación. */
  step: number;
  /** Recorrido total del scroll. */
  max: number;
};

function measure(node: HTMLElement): Metrics | null {
  const first = node.firstElementChild;
  if (!(first instanceof HTMLElement)) return null;
  const gap = parseFloat(getComputedStyle(node).columnGap) || 0;
  return { step: first.offsetWidth + gap, max: node.scrollWidth - node.clientWidth };
}

/**
 * Carrusel de scroll horizontal con `scroll-snap`: el navegador hace el
 * desplazamiento y este hook solo lo lee para pintar los controles (flechas y
 * rayas) y lo mueve cuando se pulsan.
 *
 * Una "posición" es un paso de scroll: la 0 es el inicio y la última es el final
 * del recorrido. Cuántas hay depende de cuánto scroll deja el contenedor: con
 * 10 tarjetas y 4 a la vista hay 7, salvo que se le deje espacio al final para
 * que la última llegue al borde izquierdo, en cuyo caso hay 10. Si todo cabe sin
 * scroll hay una sola.
 *
 * Devuelve `[ref, carousel]`: el ref se pone en el contenedor con scroll y
 * `carousel` trae el estado y las acciones para los controles. Van separados a
 * propósito: si el ref fuera una propiedad del mismo objeto, la regla
 * `react-hooks/refs` marcaría como "ref leído en el render" cada lectura de
 * `position` o `positions`.
 *
 * El ref es uno con limpieza y no un efecto porque así se vuelve a medir solo
 * cuando el elemento se remonta (por ejemplo al cambiar de pestaña con `key`),
 * y porque las mediciones llegan por eventos, no en el render.
 */
export function useCarousel<T extends HTMLElement>() {
  const nodeRef = useRef<T | null>(null);
  const [state, setState] = useState({ position: 0, positions: 1 });

  const attach = useCallback((node: T | null) => {
    nodeRef.current = node;
    if (!node) return;

    const update = () => {
      const metrics = measure(node);
      if (!metrics) return;
      const { step, max } = metrics;

      const positions = max > 1 ? Math.ceil(max / step - 0.01) + 1 : 1;
      const position =
        node.scrollLeft >= max - 1
          ? positions - 1
          : Math.min(positions - 1, Math.round(node.scrollLeft / step));

      setState((prev) =>
        prev.position === position && prev.positions === positions ? prev : { position, positions },
      );
    };

    node.addEventListener("scroll", update, { passive: true });
    // Al empezar a observar dispara una primera medición.
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => {
      node.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scrollToPosition = useCallback((position: number) => {
    const node = nodeRef.current;
    const metrics = node && measure(node);
    if (!node || !metrics) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({
      left: Math.min(position * metrics.step, metrics.max),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, []);

  const { position, positions } = state;

  const carousel = {
    position,
    positions,
    canPrev: position > 0,
    canNext: position < positions - 1,
    scrollToPosition,
    prev: () => scrollToPosition(position - 1),
    next: () => scrollToPosition(position + 1),
  };

  return [attach, carousel] as const;
}
