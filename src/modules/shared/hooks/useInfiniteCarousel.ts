import { useCallback, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

/** Cuánto se espera, tras el último evento de scroll, para dar el desplazamiento por terminado. */
const SETTLE_MS = 120;

/**
 * Con menos tarjetas que esto una sola copia a cada lado no alcanza para llenar
 * la ventana (a 1900 px caben ~6): se ponen dos.
 */
const MIN_ITEMS_FOR_ONE_SIDE = 8;

const subscribeNothing = () => () => {};

type Metrics = {
  /** Elementos de la pista, copias incluidas. */
  total: number;
  /** `offsetLeft` del primero: incluye el relleno lateral de la pista. */
  base: number;
  /** Lo que avanza el scroll de un elemento al siguiente: su ancho más la separación. */
  step: number;
  /** `scroll-padding-left` de la pista: el snap alinea cada elemento a esa distancia del borde. */
  pad: number;
};

function measure(node: HTMLElement): Metrics | null {
  // `:scope > ul > li`: los `<li>` de las tarjetas, no los que las tarjetas
  // lleven dentro. Las listas van con `display: contents`, así que para el
  // layout los `<li>` son hijos directos de la pista.
  const items = node.querySelectorAll<HTMLElement>(":scope > ul > li");
  if (items.length < 2) return null;

  const base = items[0].offsetLeft;
  return {
    total: items.length,
    base,
    step: items[1].offsetLeft - base,
    pad: parseFloat(getComputedStyle(node).scrollPaddingLeft) || 0,
  };
}

const leftOf = (m: Metrics, index: number) => m.base + index * m.step - m.pad;
const indexAt = (m: Metrics, left: number) => Math.round((left + m.pad - m.base) / m.step);
const mod = (n: number, size: number) => ((n % size) + size) % size;

/**
 * Carrusel INFINITO de scroll horizontal con `scroll-snap`: al llegar al final
 * de las tarjetas se sigue con la primera, y al revés.
 *
 * Cómo: la pista lleva tres copias de la lista (o cinco, si son pocas), la del
 * centro es la real y las demás son clones. Se arranca en la real; cuando el
 * scroll se asienta (`SETTLE_MS` sin eventos) y quedó en una copia vecina, se
 * salta a la misma tarjeta de la real, sin animación: como las copias son
 * idénticas y el salto es de un número exacto de pasos, no se nota.
 *
 * Los clones solo existen en el cliente, tras hidratar (`useSyncExternalStore`
 * con `getServerSnapshot` en `false`): el HTML del servidor trae una sola
 * lista, sin tarjetas repetidas para el buscador ni para quien no ejecute JS.
 * Los clones se pintan `aria-hidden` y con el teclado desactivado (los marca
 * `data-clon` el componente; el hook les quita el foco), pero siguen siendo
 * clicables: con el carrusel en reposo casi siempre asoman tarjetas de la
 * copia vecina y no pueden ser letra muerta.
 *
 * Una "posición" es una tarjeta (`positions === count`, no cuenta las copias).
 * Las flechas nunca se deshabilitan: no hay principio ni fin.
 *
 * Devuelve `[ref, carousel]` como `useCarousel` (el ref va en la pista, que
 * debe ser `position: relative` para que `offsetLeft` cuente desde ella).
 */
export function useInfiniteCarousel<T extends HTMLElement>(count: number) {
  const nodeRef = useRef<T | null>(null);
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const side = count >= MIN_ITEMS_FOR_ONE_SIDE ? 1 : 2;
  const looping = mounted && count > 1;
  const [position, setPosition] = useState(0);

  /** Lo que los listeners necesitan leer sin volver a engancharse. */
  const config = useRef({ count, side, looping });
  /** Tarjeta (índice entre todas las copias) a la que va una animación en curso. */
  const target = useRef<number | null>(null);

  useLayoutEffect(() => {
    config.current = { count, side, looping };
  });

  const attach = useCallback((node: T | null) => {
    nodeRef.current = node;
    if (!node) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    const settle = () => {
      target.current = null;
      const { count, side, looping } = config.current;
      if (!looping) return;

      const m = measure(node);
      if (!m) return;
      const shift = Math.floor((indexAt(m, node.scrollLeft) - side * count) / count) * count;
      if (shift !== 0) node.scrollLeft -= shift * m.step;
    };

    const onScroll = () => {
      const m = measure(node);
      if (m) setPosition(mod(indexAt(m, node.scrollLeft), config.current.count));

      clearTimeout(timer);
      timer = setTimeout(settle, SETTLE_MS);
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      node.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Al pasar a modo bucle aparecen las copias: se pone la pista sobre la real,
  // antes de pintar (con `useLayoutEffect` no hay parpadeo) y se les quita el
  // foco de teclado a los clones.
  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node || !looping) return;

    const m = measure(node);
    if (m) node.scrollLeft = leftOf(m, side * count);

    node
      .querySelectorAll<HTMLElement>("[data-clon] :is(a, button, input, select, textarea, [tabindex])")
      .forEach((el) => el.setAttribute("tabindex", "-1"));
  }, [looping, side, count]);

  const goTo = useCallback((index: number) => {
    const node = nodeRef.current;
    const m = node && measure(node);
    if (!node || !m) return;

    const clamped = Math.max(0, Math.min(m.total - 1, index));
    target.current = clamped;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollTo({ left: leftOf(m, clamped), behavior: reducedMotion ? "auto" : "smooth" });
  }, []);

  /** Índice de la tarjeta a la que está yendo (o en la que está) la pista. */
  const current = useCallback(() => {
    const node = nodeRef.current;
    const m = node && measure(node);
    if (!node || !m) return 0;
    return target.current ?? indexAt(m, node.scrollLeft);
  }, []);

  const scrollToPosition = useCallback(
    (index: number) => {
      const from = current();
      const { count, side, looping } = config.current;
      // Entre las copias de esa tarjeta, la más cercana: se llega por el camino corto.
      let best = index;
      for (let copy = 0; copy < (looping ? 2 * side + 1 : 1); copy++) {
        const candidate = index + copy * count;
        if (Math.abs(candidate - from) < Math.abs(best - from)) best = candidate;
      }
      goTo(best);
    },
    [current, goTo],
  );

  const carousel = {
    position,
    positions: count,
    side,
    looping,
    scrollToPosition,
    prev: () => goTo(current() - 1),
    next: () => goTo(current() + 1),
  };

  return [attach, carousel] as const;
}
