/**
 * Segundos que se ve cada slide del banner del inicio antes de pasar al
 * siguiente (`HeroCarouselComponent`). Cámbialo aquí; el resto se ajusta solo.
 *
 * El contador se reinicia cada vez que alguien elige un slide con las rayas, y
 * se detiene mientras el mouse está sobre el banner o el foco está dentro de él
 * y para quienes tienen activado "reducir movimiento" en su sistema (ahí no hay
 * cambio automático: solo con las rayas).
 */
export const HERO_SLIDE_SECONDS = 10;

/** Duración del fundido entre dos slides, en milisegundos. */
export const HERO_FADE_MS = 700;

/**
 * Altura (px de diseño, desde el borde de arriba del banner) donde acaba la
 * franja de color que asoma a la derecha de la tarjeta de búsqueda: el naranja
 * del primer slide y la banda negra de Santander y Colserauto. Todos los slides
 * acaban en la MISMA altura y, debajo, se ve el gris de la página.
 *
 * Sale de la tarjeta: empieza en y=490 (`HeroSearchSectionComponent`, `-mt-[250px]`
 * sobre un banner de 740) y mide ~231, o sea acaba en ~721; como en Figma, el
 * color que asoma a su derecha se corta ~48 px antes (673). Si cambian el alto de
 * la tarjeta o cuánto se monta, mover este número (lo usan todos los slides).
 */
export const HERO_BAND_END = 673;

/**
 * Altura donde arranca la barra con los rótulos de los slides (`HeroCarouselComponent`):
 * 19 px bajo el arte (que acaba en y=381 en los slides de Figma).
 */
export const HERO_TABS_TOP = 400;

/**
 * Margen izquierdo del lienzo de 1440 de cada slide: la mitad del espacio sobrante,
 * REDONDEADA hacia abajo a un píxel entero. Con `mx-auto` el lienzo cae en medio
 * píxel cuando el ancho de la ventana es impar (1901, o 1903 con una barra de scroll
 * de 17), y el arte (imágenes y SVG, que el navegador ajusta a píxeles) y los bordes
 * que lo prolongan (`clip-path`, fondos) se dibujan con 1 px de diferencia: se ve un
 * escalón en el empalme de las diagonales. Con el margen entero, todo cae igual.
 * Un navegador sin `round()` ignora la declaración y queda el `mx-auto`.
 */
export const HERO_CANVAS_MARGIN =
  "max(0px, round(down, calc((100% - 1440px) / 2), 1px))";

/**
 * Alto del banner en mobile (px de diseño, sobre un ancho de 393). Todos los slides
 * miden lo mismo para que la página no salte al rotar: en Figma el primero mide 481
 * y los otros tres 811, así que se tomó un alto intermedio (los tres con foto se ven
 * completos y el primero, que es más bajo, queda con gris debajo). La tarjeta de
 * búsqueda se monta 64 px sobre este banner (`HeroSearchSectionComponent`).
 */
export const HERO_MOBILE_HEIGHT = 620;
