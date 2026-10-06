import type { HeroSlide } from "./HeroCarouselComponent";
import HeroCarouselComponent from "./HeroCarouselComponent";
import HeroHomeJeepComponent from "./HeroHomeJeepComponent";
import HeroSlideColserautoComponent from "./HeroSlideColserautoComponent";
import HeroSlideColserautoMobileComponent from "./HeroSlideColserautoMobileComponent";
import HeroSlideHomeComponent from "./HeroSlideHomeComponent";
import HeroSlideHomeMobileComponent from "./HeroSlideHomeMobileComponent";
import HeroSlideMarceloComponent from "./HeroSlideMarceloComponent";
import HeroSlideMarceloMobileComponent from "./HeroSlideMarceloMobileComponent";
import HeroSlideSantanderComponent from "./HeroSlideSantanderComponent";
import HeroSlideSantanderMobileComponent from "./HeroSlideSantanderMobileComponent";

/**
 * Los slides del banner, en el orden en que rotan. El primero es el hero de
 * siempre (el único con el `<h1>` de la página: los demás llevan `<h2>`).
 *
 * Para cambiar cuánto dura cada slide: `HERO_SLIDE_SECONDS` en
 * `constants/hero-carousel.ts`. Para añadir uno: un componente `HeroSlide…` (el
 * lienzo de 1440 con su arte y su texto, como los que hay) y una entrada aquí.
 * - `background`: el fondo de borde a borde de la ventana (en mobile, el del propio
 *   slide, que lo cubre entero). En desktop es el gris
 *   de la página, que se ve bajo el arte (los slides negros llegan hasta `HERO_BAND_END`, no
 *   hasta los 740 del hero; los bordes de los lados los pone cada slide); en
 *   mobile, el fondo de todo el slide.
 * - `tabTitle` / `tabSubtitle`: el rótulo del slide en la barra de abajo.
 * - `tone`: qué hay detrás de esa barra (`light`: gris; `dark`: negro), para que
 *   se lea. Va justo bajo el arte, donde los slides negros ya tienen su banda.
 */
const SLIDES: HeroSlide[] = [
  {
    id: "vehiculo-seguro",
    label: "El vehículo más seguro de Colombia",
    tabTitle: "wcar transparencia",
    tabSubtitle: "y tecnología",
    background: "bg-gray-light",
    tone: "light",
    mobileTone: "light",
    content: (
      <>
        <HeroSlideHomeComponent />
        <HeroSlideHomeMobileComponent />
      </>
    ),
    foreground: <HeroHomeJeepComponent />,
  },
  {
    id: "santander",
    label: "Financia hasta el 100% con Santander",
    tabTitle: "Santander",
    tabSubtitle: "Financiando tu vehículo",
    // Gris azulado en mobile (el fondo de arriba de su foto). En desktop el arte trae su propia banda negra
    // (hasta `HERO_BAND_END`) y bajo ella se ve el gris de la página, como en el primer slide.
    background: "bg-[#353b42] md:bg-gray-light",
    tone: "dark",
    mobileTone: "dark",
    content: (
      <>
        <HeroSlideSantanderComponent />
        <HeroSlideSantanderMobileComponent />
      </>
    ),
  },
  {
    id: "marcelo-cezan",
    label: "Marcelo Cezán se une a nuestro equipo",
    tabTitle: "Marcelo Cezán se une",
    tabSubtitle: "a nuestro equipo en wcar",
    background: "bg-[#353b42] md:bg-gray-light",
    tone: "light",
    mobileTone: "dark",
    content: (
      <>
        <HeroSlideMarceloComponent />
        <HeroSlideMarceloMobileComponent />
      </>
    ),
  },
  {
    id: "colserauto",
    label: "Los mejores en registro, documentación y peritaje",
    tabTitle: "Colserauto",
    tabSubtitle: "N°1 en peritajes de vehículos",
    // Negro en mobile; en desktop, como el de Santander: la banda negra va en el arte.
    background: "bg-black md:bg-gray-light",
    tone: "dark",
    mobileTone: "dark",
    content: (
      <>
        <HeroSlideColserautoComponent />
        <HeroSlideColserautoMobileComponent />
      </>
    ),
  },
];

/**
 * Banner del inicio: un carousel que rota los slides de `SLIDES`
 * (`HeroCarouselComponent`). Los slides son de Figma: el primero, el hero del
 * rediseño "Home - 2.0" (nodo 671:11456); los otros tres, los banners del home
 * anterior (nodos 1:1339, 117:3615 y 1:1977). De esos Figmas solo se tomó cada
 * banner.
 */
export default function HeroComponent() {
  return <HeroCarouselComponent slides={SLIDES} />;
}
