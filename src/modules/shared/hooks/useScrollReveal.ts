import { useEffect } from "react";

/** Lo que aparece al hacer scroll lleva esta clase (los estilos están en globals.css). */
const SELECTOR = ".reveal";

/** Dispara un poco antes del borde de abajo, no con el primer píxel a la vista. */
const ROOT_MARGIN = "0px 0px -8% 0px";

/** Lo que entra a la vez se escalona: 90 ms de diferencia entre uno y otro, hasta 5 pasos. */
const STAGGER_MS = 90;
const MAX_STAGGER_STEPS = 5;

/** Cada cuánto se reintentan los elementos que React aún no hidrató, y hasta cuándo (luego se revelan igual). */
const HYDRATION_RETRY_MS = 50;
const HYDRATION_GIVE_UP_MS = 3000;

/**
 * React marca con una clave interna (`__reactFiber$…`) los nodos que ya hidrató.
 * Tocar el atributo `data-revealed` de uno que aún no lo está (una sección en
 * streaming, un límite de Suspense que hidrata después) provoca el aviso
 * "A tree hydrated but some attributes of the server rendered HTML didn't match".
 */
function isHydrated(element: HTMLElement): boolean {
  return Object.keys(element).some((key) => key.startsWith("__reactFiber$"));
}

/** El elemento y todos los de dentro que llevan la clase (un nodo que no es elemento no lleva ninguno). */
function findTargets(node: Node): HTMLElement[] {
  if (!(node instanceof HTMLElement)) return [];
  const inside = Array.from(node.querySelectorAll<HTMLElement>(SELECTOR));
  return node.matches(SELECTOR) ? [node, ...inside] : inside;
}

/**
 * Hace que los elementos con la clase `reveal` aparezcan (fundido y ascenso, ver
 * globals.css) la primera vez que entran en pantalla al hacer scroll.
 *
 * Se llama UNA vez, desde `ScrollRevealComponent` en el layout, no en cada
 * página: así las secciones siguen siendo Server Components y solo llevan una
 * clase. Ningún elemento tiene que avisar de nada al hook, que además:
 *
 * - Vigila el DOM (`MutationObserver`), así que también anima lo que aparece
 *   después de montar: la página nueva de una navegación del cliente, una
 *   pestaña que remonta sus tarjetas, contenido que llega por streaming.
 * - Deja como están los que ya se ven al cargar (o al llegar a la página) y los
 *   que quedan por encima de la pantalla en ese momento: "lo que ves al llegar
 *   ya está ahí, lo de más abajo entra al bajar". Sin esto se verían aparecer
 *   solos, con un parpadeo, y el contenido de arriba tardaría en salir hasta
 *   que el JavaScript hidrate. Lo que se pasa de largo con un salto después
 *   (fin de página, ancla) sigue oculto hasta que se sube y entra en pantalla:
 *   `IntersectionObserver` solo avisa de lo que cruza la pantalla, y se anima
 *   la primera vez que se ve.
 * - Solo oculta cuando ya tiene el control: pone `data-reveal-ready` en <html>
 *   DESPUÉS de marcar los que ya se ven, y los estilos ocultan solo con esa
 *   marca. Sin JavaScript, sin `IntersectionObserver` o si algo falla antes,
 *   la página se ve completa y normal.
 * - Escalona lo que entra en el mismo cuadro (una fila de tarjetas, el título y
 *   su párrafo), en orden del documento, y no lo que entra por separado.
 * - Es de una sola vez: lo ya revelado no se vuelve a ocultar al subir. El
 *   estado va en `data-revealed` y no en una clase para que React no lo pise
 *   si el componente se vuelve a pintar con otro `className`.
 *
 * Con "reducir movimiento" (y al imprimir) los estilos no ocultan nada.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const reveal = (element: HTMLElement) => {
      element.dataset.revealed = "";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        let step = 0;
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;

          const element = target as HTMLElement;
          const delay = Math.min(step++, MAX_STAGGER_STEPS) * STAGGER_MS;
          element.style.setProperty("--reveal-delay", `${delay}ms`);
          reveal(element);
          observer.unobserve(element);
        }
      },
      { rootMargin: ROOT_MARGIN },
    );

    const startedAt = Date.now();
    let retry: ReturnType<typeof setTimeout> | undefined;
    const waiting = new Set<HTMLElement>();

    const register = (elements: HTMLElement[]) => {
      let pending = elements.filter((element) => element.dataset.revealed === undefined);
      // Lo que React no ha hidratado espera (salvo que tarde demasiado: ahí se revela igual).
      if (Date.now() - startedAt < HYDRATION_GIVE_UP_MS) {
        const unhydrated = pending.filter((element) => !isHydrated(element));
        if (unhydrated.length) {
          unhydrated.forEach((element) => waiting.add(element));
          pending = pending.filter((element) => isHydrated(element));
          clearTimeout(retry);
          retry = setTimeout(() => {
            const batch = [...waiting].filter((element) => element.isConnected);
            waiting.clear();
            register(batch);
          }, HYDRATION_RETRY_MS);
        }
      }
      // Las lecturas juntas: el navegador calcula el layout una sola vez.
      const tops = pending.map((element) => element.getBoundingClientRect().top);
      pending.forEach((element, index) => {
        // Ya a la vista, o por encima (también un elemento sin caja): no se oculta.
        if (tops[index] < window.innerHeight) reveal(element);
        else observer.observe(element);
      });
    };

    const mutations = new MutationObserver((records) => {
      const added: HTMLElement[] = [];
      for (const record of records) {
        record.removedNodes.forEach((node) => findTargets(node).forEach((el) => observer.unobserve(el)));
        record.addedNodes.forEach((node) => added.push(...findTargets(node)));
      }
      register(added);
    });

    register(Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)));
    document.documentElement.dataset.revealReady = "";
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(retry);
      observer.disconnect();
      mutations.disconnect();
      delete document.documentElement.dataset.revealReady;
    };
  }, []);
}
